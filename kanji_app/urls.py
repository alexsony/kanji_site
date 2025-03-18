from django.urls import path
from .views import get_words, get_index

urlpatterns = [
    path("", get_index, name="index"),  # New route for index.html
    path("api/words/", get_words, name="get_words"),  # API route
]
