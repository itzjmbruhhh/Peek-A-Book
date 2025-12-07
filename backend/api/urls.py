from django.urls import path
from .views import PresetListCreateView, SavedBookListCreateView

urlpatterns = [
    path('preferences/', PresetListCreateView.as_view(), name="Preferences"),
    path('saved-books/', SavedBookListCreateView.as_view(), name="Saved-Books")
]