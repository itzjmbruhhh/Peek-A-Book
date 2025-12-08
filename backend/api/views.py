from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import parsers
from .models import DevicePreset, SavedBook
from .serializers import DevicePresetSerializer, SavedBookSerializer
import tempfile, openai, json, requests

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
    
class UploadShelfView(APIView):
    parser_classes = [parsers.MultiPartParser]
    
    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error" : "No image provided"}, status=400)
        
        # Save as a temporary file
        with tempfile.NamedTemporaryFile(delete=True) as temp_file:
            for chunk in image_file.chunks():
                temp_file.write(chunk)
            temp_file.flush()
            
            # Step 1: Send to OpenAI Vision to extract book titles and authors
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": (
                            "Analyze this bookshelf photo. List all visible books "
                            "as a JSON array with 'title' and 'author'. "
                            "Example: [{\"title\": \"Book Title\", \"author\": \"Author\"}]"
                        )
                    }
                ],
                files=[{"name": "bookshelf.jpg", "file": open(temp_file.name, "rb")}]
            )
        
        # Step 2: Try to parse JSON output from OpenAI
        text_output = response.choices[0].message["content"]
        
        try:
            books_detected = json.loads(text_output)
        except Exception:
            # Fallback: return empty array
            books_detected = []
        
        # Step 3: Fetch Metadata from Google Books API
        books_with_metadata = []
        for book in books_detected:
            title = book.get("title")
            author = book.get("author")
            if not title:
                continue
            
            google_resp = requests.get(
                "https://www.googleapis.com/books/v1/volumes",
                params={"q": f"intitle:{title}+inauthor:{author}", "maxResults": 1}
            ).json()
            
            if "items" in google_resp:
                info = google_resp["items"][0]["volumeInfo"]
                books_with_metadata.append({
                    "title": info.get("title", title),
                    "author": ", ".join(info.get("authors", [author])),
                    "image": info.get("imageLinks", {}).get("thumbnail",
                    "https://placehold.co/97x150")
                })
            
        return Response({"books": books_with_metadata})
    
class ScanResultView(APIView):
    def post(self, request):
        # process uploaded image (OCR / Vision)
        # extract book titles
        # EDIT THIS LATER TO HANDLE IT
        titles = ["Book 1", "Book 2"] # Sample
        return Response({"titles" : titles})
    
class RecommendationsView(APIView):
    def post(self, request):
        # Fetch device presets
        presets = DevicePreset.objects.filter(device_id=request.device_id)
        # Fetch saved books, detected books
        # Apply basic or advanced recommendation logic
        # EDIT THIS LATER
        recommendations = [{
            "title" : "Example Book", "author" : "Example Author", "cover_image" : ""
        }]
        return Response({"recommendations" : recommendations})