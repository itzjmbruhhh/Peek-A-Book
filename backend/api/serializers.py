from rest_framework import serializers
from .models import DevicePreset

class DevicePresetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevicePreset
        fields = '__all__'
        
 
        
