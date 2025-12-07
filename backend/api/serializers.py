from rest_framework import serializers
from .models import DevicePreset, SavedBook

class DevicePresetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevicePreset
        fields = '__all__'
        
class SavedBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedBook
        fields = '__all__'
        
