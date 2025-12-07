from rest_framework import serialzers
from .models import DevicePreset, SavedBook

class DevicePresetSerializer(serialzers.ModelSerializer):
    class Meta:
        model = DevicePreset
        fields = '__all__'
        
class SavedBookSerializer(serialzers.ModelSerializer):
    class Meta:
        model = SavedBook
        fields = '__all__'
        
