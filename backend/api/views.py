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

                Task: Recommend 5–10 books the user is likely to enjoy. 
                For each book, include the following fields in a JSON array:
                - "title" (string)
                - "author" (string)
                - "description" (short description)
                - "reason_it_fits" (why this book matches the user's preferences)
                - "image" (URL of the book cover)

                Instructions for "image":
                - Try to find the cover image from Google Books metadata or Open Library API.
                - If you cannot find a real cover, use a placeholder URL like "https://placehold.co/97x150".

                Return **valid JSON only**, do not include any text outside the JSON.
                """


            # ---------------------------
            # Step 3: Call Cohere chat
            # ---------------------------
            try:
                llm_response = co.chat(
                    model="command-a-reasoning-08-2025",  # supported model
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