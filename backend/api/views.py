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