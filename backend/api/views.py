from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import parsers
from .models import DevicePreset, SavedBook
from .serializers import DevicePresetSerializer, SavedBookSerializer
import json, requests, numpy as np
from django.conf import settings
import base64, traceback
import cohere
import easyocr
from PIL import Image
from io import BytesIO

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
# Saved Books API
# -------------------------
class SavedBookListCreateView(APIView):
    def get(self, request):
        books = SavedBook.objects.filter(device_id=request.device_id)
        serializer = SavedBookSerializer(books, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = request.data
        data['device_id'] = request.device_id
        serializer = SavedBookSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Book Saved", "book": serializer.data})
        return Response(serializer.errors, status=400)


# -------------------------
# Upload Shelf API
# -------------------------
class UploadShelfView(APIView):
    parser_classes = [parsers.MultiPartParser]

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

            # Detect text from image using EasyOCR
            image_bytes = image_file.read()
            results = ocr_reader.readtext(image_bytes, detail=0)
            detected_titles = [line.strip() for line in results if line.strip()]

            # Step 1: Create preference embedding
            pref_text = " ".join(
                preferences.get("favorite_genres", []) +
                preferences.get("reading_intent", []) +
                preferences.get("reading_preferences", []) +
                preferences.get("avoid_types", [])
            )

            try:
                pref_embedding = co.embed(model="embed-english-v2.0", texts=[pref_text]).embeddings[0]
            except Exception as e:
                print("Cohere embedding failed:", e)
                pref_embedding = None

            recommendations = []

            # Step 2: Fetch book metadata and compute similarity
            for title in detected_titles:
                google_resp = requests.get(
                    "https://www.googleapis.com/books/v1/volumes",
                    params={"q": f"intitle:{title}", "maxResults": 1}
                ).json()

                if "items" not in google_resp:
                    continue

                info = google_resp["items"][0]["volumeInfo"]
                book_text = f"{info.get('title', '')} {' '.join(info.get('authors', []))} {' '.join(info.get('categories', []))}"

                # Compute similarity score
                if pref_embedding:
                    try:
                        book_embedding = co.embed(model="embed-english-v2.0", texts=[book_text]).embeddings[0]
                        sim = np.dot(pref_embedding, book_embedding) / (np.linalg.norm(pref_embedding) * np.linalg.norm(book_embedding))
                    except:
                        sim = 0
                else:
                    sim = 0

                recommendations.append({
                    "title": info.get("title", title),
                    "author": ", ".join(info.get("authors", ["Unknown"])),
                    "image": info.get("imageLinks", {}).get("thumbnail", "https://placehold.co/97x150"),
                    "score": sim
                })

            recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)
            return Response({"books": recommendations[:10]})

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# -------------------------
# Scan Result API
# -------------------------
class ScanResultView(APIView):
    parser_classes = [parsers.MultiPartParser]

    def post(self, request):
        try:
            image_file = request.FILES.get("image")
            if not image_file:
                return Response({"error": "No image provided"}, status=400)

            image_bytes = image_file.read()
            results = ocr_reader.readtext(image_bytes, detail=0)
            titles = [line.strip() for line in results if line.strip()]
            return Response({"titles": titles})
        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)


# -------------------------
# Recommendations API
# -------------------------
class RecommendationsView(APIView):
    def post(self, request):
        try:
            data = request.data
            prefs = data.get("preferences", {})
            detected_books = data.get("detected_books", [])

            pref_text = " ".join(
                prefs.get("favorite_genres", []) +
                prefs.get("reading_intent", []) +
                prefs.get("reading_preferences", []) +
                prefs.get("avoid_types", [])
            )

            try:
                pref_embedding = co.embed(model="embed-english-v2.0", texts=[pref_text]).embeddings[0]
            except Exception as e:
                print("Embedding error:", e)
                pref_embedding = None

            recommendations = []

            for book in detected_books:
                title = book.get("title")
                author = book.get("author", "")

                if not title:
                    continue

                google_resp = requests.get(
                    "https://www.googleapis.com/books/v1/volumes",
                    params={"q": f"intitle:{title}+inauthor:{author}", "maxResults": 1}
                ).json()

                if "items" not in google_resp:
                    continue

                info = google_resp["items"][0]["volumeInfo"]
                book_text = f"{info.get('title', '')} {' '.join(info.get('authors', []))} {' '.join(info.get('categories', []))}"

                sim = 0
                if pref_embedding:
                    try:
                        book_embedding = co.embed(model="embed-english-v2.0", texts=[book_text]).embeddings[0]
                        sim = np.dot(pref_embedding, book_embedding) / (np.linalg.norm(pref_embedding) * np.linalg.norm(book_embedding))
                    except:
                        pass

                recommendations.append({
                    "title": info.get("title", title),
                    "author": ", ".join(info.get("authors", [author])),
                    "image": info.get("imageLinks", {}).get("thumbnail", "https://placehold.co/97x150"),
                    "score": sim
                })

            recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)
            return Response({"books": recommendations[:10]})

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)