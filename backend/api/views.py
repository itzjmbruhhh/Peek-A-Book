from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import parsers
from .models import DevicePreset
from .serializers import DevicePresetSerializer
import json, numpy as np
from django.conf import settings
import traceback
import cohere
import easyocr
from .throttles import ShelfScanThrottle

# Initialize Cohere client
co = cohere.Client(settings.COHERE_API_KEY)

# Initialize EasyOCR reader
ocr_reader = easyocr.Reader(['en'])

# -------------------------
# Presets API
# -------------------------
class PresetListCreateView(APIView):
    def get(self, request):
        presets = DevicePreset.objects.filter(device_id=request.device_id)
        serializer = DevicePresetSerializer(presets, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data
        data['device_id'] = request.device_id
        serializer = DevicePresetSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Preset Saved", "preset": serializer.data})
        return Response(serializer.errors, status=400)


class PresetDetailView(APIView):
    """Handle retrieving and deleting a single preset belonging to the device."""
    def delete(self, request, pk):
        try:
            preset = DevicePreset.objects.get(pk=pk, device_id=request.device_id)
        except DevicePreset.DoesNotExist:
            return Response({"error": "Preset not found"}, status=404)

        preset.delete()
        return Response(status=204)
    
    def put(self, request, pk):
        """Update a preset owned by this device (partial update allowed)."""
        try:
            preset = DevicePreset.objects.get(pk=pk, device_id=request.device_id)
        except DevicePreset.DoesNotExist:
            return Response({"error": "Preset not found"}, status=404)

        serializer = DevicePresetSerializer(preset, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# -------------------------
# Upload Shelf API
# -------------------------
class UploadShelfView(APIView):
    parser_classes = [parsers.MultiPartParser]
    throttle_classes = [ShelfScanThrottle]

    def post(self, request):
        try:
            image_file = request.FILES.get("image")
            prefs_json = request.data.get("preferences")

            if not image_file or not prefs_json:
                return Response({"error": "Missing image or preferences"}, status=400)

            try:
                preferences = json.loads(prefs_json)
            except Exception:
                preferences = {}

            # ---------------------------
            # Step 1: OCR title detection
            # ---------------------------
            image_bytes = image_file.read()
            results = ocr_reader.readtext(image_bytes, detail=0)
            detected_titles = [line.strip() for line in results if line.strip()]

            if not detected_titles:
                return Response({"error": "No text detected from image"}, status=400)

            # ---------------------------
            # Step 2: Build structured prompt for Cohere
            # ---------------------------
            prompt = f"""
            You are a book recommendation assistant.

            Detected books: {detected_titles}

            User preferences:
            - Favorite genres: {preferences.get('favorite_genres', [])}
            - Reading intent: {preferences.get('reading_intent', [])}
            - Reading preferences: {preferences.get('reading_preferences', [])}
            - Avoid types: {preferences.get('avoid_types', [])}

            Task:
            Recommend 5–10 books the user is likely to enjoy based on the detected titles and the user's preferences.

            Recommendation rules:
            1. You must ONLY recommend books that appear in the detected list above.
            2. Do not invent new books.
            3. Do not substitute or suggest alternatives. Only include books from the photo.
            
            For each recommended book, return a JSON object with:
            - "title"
            - "author"
            - "description"
            - "reason_it_fits"
            - "image"

            Image sourcing rules:
            1. If possible, include a real cover image URL using the Open Library Covers API.
            2. Only use REAL ISBN or OLID values. 
            Example formats (you must replace with actual values):
                - https://covers.openlibrary.org/b/isbn/9780143127741.jpg
                - https://covers.openlibrary.org/b/olid/OL26331930M.jpg
            3. Never output placeholders like (ISBN), (OLID), or similar.
            4. If you cannot determine any valid ISBN/OLID for a book, use:
            "https://placehold.co/97x150"

            Your output must be a valid JSON array with no extra text.
            """

            # ---------------------------
            # Step 3: Call Cohere chat
            # ---------------------------
            try:
                llm_response = co.chat(
                    model="command-xlarge-nightly",  # supported model
                    message=prompt
                )

                raw_output = getattr(llm_response, "text", None)

                if not raw_output:
                    raise ValueError("LLM returned no text field")

            except Exception as e:
                print("LLM error:", e)
                return Response({"error": "Failed to generate recommendations from LLM"}, status=500)


            # ---------------------------
            # Step 4: Parse JSON output
            # ---------------------------
            try:
                recommendations = json.loads(raw_output)
                if not isinstance(recommendations, list):
                    recommendations = []
            except Exception:
                recommendations = raw_output  # fallback to raw text if JSON fails

            return Response({"books": recommendations})

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)