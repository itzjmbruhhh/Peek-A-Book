from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import parsers
from .models import DevicePreset, SavedBook
from .serializers import DevicePresetSerializer, SavedBookSerializer
import tempfile, openai, json, requests
import numpy as np
from django.conf import settings
import base64

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
            return Response({"message" : "Preset Saved", "preset" : serializer.data})
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
            return Response({"message" : "Book Saved", "book" : serializer.data})
        return Response(serializer.errors, status=400)
    
openai.api_key = settings.OPENAI_API_KEY

class UploadShelfView(APIView):
    parser_classes = [parsers.MultiPartParser]

    def post(self, request):
        """
        Expects multipart form-data:
        - image: uploaded bookshelf image
        - preferences: JSON string containing user preferences
        """
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

        # Step 1: Detect books using GPT-4o-mini (multimodal)
        try:
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": (
                            "Analyze this bookshelf image and return a JSON array of all books "
                            "with 'title' and 'author'. Example: "
                            '[{"title": "Book Title", "author": "Author"}]'
                        )
                    },
                    {
                        "role": "user",
                        "name": "bookshelf.jpg",
                        "content": encoded_image
                    }
                ]
            )
            detected_books = json.loads(response.choices[0].message["content"])
        except Exception as e:
            return Response({"error": f"OpenAI request failed: {str(e)}"}, status=500)

        if not detected_books:
            return Response({"books": []})

        # Step 2: Create preference embedding
        pref_text = " ".join(
            preferences.get("favorite_genres", []) +
            preferences.get("reading_intent", []) +
            preferences.get("reading_preferences", []) +
            preferences.get("avoid_types", [])
        )
        try:
            pref_embedding = openai.embeddings.create(
                input=pref_text,
                model="text-embedding-3-large"
            )["data"][0]["embedding"]
        except Exception:
            pref_embedding = None

        # Step 3: Fetch metadata for each book and compute similarity
        recommendations = []
        for book in detected_books:
            title = book.get("title")
            author = book.get("author")
            if not title:
                continue

            # Google Books API
            google_resp = requests.get(
                "https://www.googleapis.com/books/v1/volumes",
                params={"q": f"intitle:{title}+inauthor:{author}", "maxResults": 1}
            ).json()

            if "items" not in google_resp:
                continue

            info = google_resp["items"][0]["volumeInfo"]
            book_text = f"{info.get('title', '')} {' '.join(info.get('authors', []))} {' '.join(info.get('categories', []))}"

            # Similarity score (cosine)
            if pref_embedding:
                try:
                    book_embedding = openai.embeddings.create(
                        input=book_text,
                        model="text-embedding-3-large"
                    )["data"][0]["embedding"]

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

        # Step 4: Sort by similarity score descending
        recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)

        # Step 5: Return top 10
        return Response({"books": recommendations[:10]})


class ScanResultView(APIView):
    def post(self, request):
        # process uploaded image (OCR / Vision)
        # extract book titles
        # EDIT THIS LATER TO HANDLE IT
        titles = ["Book 1", "Book 2"] # Sample
        return Response({"titles" : titles})
    
class RecommendationsView(APIView):
    def post(self, request):
        """
        Expects JSON body:
        {
            "device_id": "<device id>",
            "preferences": {
                "favorite_genres": [...],
                "reading_intent": [...],
                "reading_preferences": [...],
                "avoid_types": [...]
            },
            "detected_books": [
                {"title": "...", "author": "..."}
            ]
        }
        """
        data = request.data
        prefs = data.get("preferences", {})
        detected_books = data.get("detected_books", [])

        # Step 1: Convert preferences into a single string for embedding
        pref_text = " ".join(
            prefs.get("favorite_genres", []) +
            prefs.get("reading_intent", []) +
            prefs.get("reading_preferences", []) +
            prefs.get("avoid_types", [])
        )

        # Step 2: Create embedding for preferences
        try:
            pref_embedding = openai.embeddings.create(
                input=pref_text,
                model="text-embedding-3-large"
            )["data"][0]["embedding"]
        except Exception as e:
            print("Embedding error:", e)
            pref_embedding = None

        recommendations = []

        # Step 3: For each detected book, fetch metadata and calculate similarity
        for book in detected_books:
            title = book.get("title")
            author = book.get("author")
            if not title:
                continue

            # Fetch metadata from Google Books API
            google_resp = requests.get(
                "https://www.googleapis.com/books/v1/volumes",
                params={"q": f"intitle:{title}+inauthor:{author}", "maxResults": 1}
            ).json()

            if "items" not in google_resp:
                continue

            info = google_resp["items"][0]["volumeInfo"]
            book_text = f"{info.get('title')} {' '.join(info.get('authors', []))} {' '.join(info.get('categories', []))}"

            # Optional: compute similarity (simple cosine)
            if pref_embedding:
                try:
                    book_embedding = openai.embeddings.create(
                        input=book_text,
                        model="text-embedding-3-large"
                    )["data"][0]["embedding"]
                    # Cosine similarity
                    sim = np.dot(pref_embedding, book_embedding) / (
                        np.linalg.norm(pref_embedding) * np.linalg.norm(book_embedding)
                    )
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

        # Step 4: Sort by similarity score descending
        recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)

        # Step 5: Return top 10 recommendations (or all if fewer)
        return Response({"books": recommendations[:10]})