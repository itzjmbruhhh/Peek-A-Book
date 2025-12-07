from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import DevicePreset, SavedBook
from .serializers import DevicePresetSerializer, SavedBookSerializer
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
    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error" : "No image provided"}, status=400)
        # store locally or upload to S3
        # pass image to OCR / Vision API
        # EDIT THIS LATER TO HANDLE IT
        return Response({"message" : "Image uploaded", "filename" : image_file.name})
    
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