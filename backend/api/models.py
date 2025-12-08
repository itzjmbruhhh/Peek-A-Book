from django.db import models

# Create your models here.
class DevicePreset(models.Model):
    # Preset naming and creation details
    device_id = models.CharField(max_length=100)
    name = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Preset configs
    favorite_genres = models.JSONField(default=list, blank=True)
    reading_interests = models.JSONField(default=list, blank=True)
    reading_experience =  models.JSONField(default=list, blank=True)
    avoid_types =  models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return f"{self.device_id} - {self.name or 'Unamed Preset'}"
    