# api/admin.py
from django.contrib import admin
from .models import DevicePreset, SavedBook

admin.site.register(DevicePreset)
admin.site.register(SavedBook)