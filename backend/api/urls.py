from django.urls import path
from .views import PresetListCreateView, SavedBookListCreateView, UploadShelfView, ScanResultView, RecommendationsView

urlpatterns = [
    path('preferences/', PresetListCreateView.as_view(), name="preferences"),
    path('saved-books/', SavedBookListCreateView.as_view(), name="saved-books"),
    path('upload-shelf/', UploadShelfView.as_view(), name="upload-shelf"),
    path('scan-result/', ScanResultView.as_view(), name="scan-result"),
    path('recommendations/', RecommendationsView.as_view(), name="recommendations"),
]