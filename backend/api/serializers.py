from rest_framework import serialzers
from .models import DevicePreset

class DevicePresetSerializer(serialzers.ModelSerializer):
    class Meta:
        model = DevicePreset
        fields = '__all__'
        
