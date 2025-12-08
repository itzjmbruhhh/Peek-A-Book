# api/admin.py
from django.contrib import admin
from .models import DevicePreset

admin.site.register(DevicePreset)