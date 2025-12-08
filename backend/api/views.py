from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import parsers
from .models import DevicePreset, SavedBook
from .serializers import DevicePresetSerializer, SavedBookSerializer
import tempfile, json, requests, numpy as np
from django.conf import settings
import base64
import cohere
import pytesseract
from PIL import Image
import traceback

# Initialize Cohere client
co = cohere.Client(settings.COHERE_API_KEY)  # add COHERE_API_KEY to settings

# Presets
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

# Saved Books
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


# Initialize Cohere client
co = cohere.Client(settings.COHERE_API_KEY)

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

            # Encode image as base64
            image_bytes = image_file.read()
            encoded_image = base64.b64encode(image_bytes).decode()

            # Step 1: Detect books (stubbed example)
            # Replace this with your actual image-to-book model or API
            detected_books = [
                {"title": "Sample Book", "author": "Sample Author"}
            ]

            if not detected_books:
                return Response({"books": []})

            # Step 2: Prepare preference text
            pref_text = " ".join(
                preferences.get("favorite_genres", []) +
                preferences.get("reading_intent", []) +
                preferences.get("reading_preferences", []) +
                preferences.get("avoid_types", [])
            )

            # Step 3: Generate preference embedding using Cohere
            try:
                emb_resp = co.embed(model="embed-english-v2.0", texts=[pref_text])
                pref_embedding = emb_resp.embeddings[0]
            except Exception as e:
                print("Cohere embedding failed:", e)
                pref_embedding = None

            recommendations = []

            # Step 4: Fetch metadata and compute similarity
            for book in detected_books:
                title = book.get("title")
                author = book.get("author") or ""

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

                # Compute similarity using Cohere embeddings
                if pref_embedding:
                    try:
                        book_emb_resp = co.embed(model="embed-english-v2.0", texts=[book_text])
                        book_embedding = book_emb_resp.embeddings[0]
                        sim = np.dot(pref_embedding, book_embedding) / (
                            np.linalg.norm(pref_embedding) * np.linalg.norm(book_embedding)
                        )
                    except Exception:
                        sim = 0
                else:
                    sim = 0

                recommendations.append({
                    "title": info.get("title", title),
                    "author": ", ".join(info.get("authors", [author])),
                    "image": info.get("imageLinks", {}).get("thumbnail", "https://placehold.co/97x150"),
                    "score": sim
                })

            # Sort and return top 10
            recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)
            return Response({"books": recommendations[:10]})

        except Exception as e:
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)

# Simple scan result view using OCR
class ScanResultView(APIView):
    def post(self, request):
        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"error": "No image provided"}, status=400)

        image = Image.open(image_file)
        text = pytesseract.image_to_string(image)
        titles = [line.strip() for line in text.split("\n") if line.strip()]
        return Response({"titles": titles})

# Recommendations endpoint using Cohere embeddings
class RecommendationsView(APIView):
    def post(self, request):
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
            pref_embedding = co.embed(model="small", texts=[pref_text]).embeddings[0]
        except Exception as e:
            print("Embedding error:", e)
            pref_embedding = None

        recommendations = []
        for book in detected_books:
            title = book.get("title")
            author = book.get("author")
            if not title:
                continue

            google_resp = requests.get(
                "https://www.googleapis.com/books/v1/volumes",
                params={"q": f"intitle:{title}+inauthor:{author}", "maxResults": 1}
            ).json()

            if "items" not in google_resp:
                continue

            info = google_resp["items"][0]["volumeInfo"]
            book_text = f"{info.get('title')} {' '.join(info.get('authors', []))} {' '.join(info.get('categories', []))}"

            if pref_embedding:
                try:
                    book_embedding = co.embed(model="small", texts=[book_text]).embeddings[0]
                    sim = np.dot(pref_embedding, book_embedding) / (np.linalg.norm(pref_embedding) * np.linalg.norm(book_embedding))
                except:
                    sim = 0
            else:
                sim = 0

            recommendations.append({
                "title": info.get("title", title),
                "author": ", ".join(info.get("authors", [author])),
                "image": info.get("imageLinks", {}).get("thumbnail", "https://placehold.co/97x150"),
                "score": sim
            })

        recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)
        return Response({"books": recommendations[:10]})