from django.urls import path
from .views import (
    PresetListCreateView,
    PresetDetailView,
    UploadShelfView,
    
)

urlpatterns = [
    path('preferences/', PresetListCreateView.as_view(), name="preferences"),
    path('preferences/<int:pk>/', PresetDetailView.as_view(), name="preference-detail"),
    path('upload-shelf/', UploadShelfView.as_view(), name="upload-shelf"),
    
]