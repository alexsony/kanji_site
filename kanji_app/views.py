from django.http import JsonResponse
from django.shortcuts import render
import json
import os

def get_words(request):
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.json")

    if not os.path.exists(file_path):
        return JsonResponse({"error": "Data file not found"}, status=500)

    with open(file_path, "r", encoding="utf-8") as file:
        words = json.load(file)

    return JsonResponse(words, safe=False)

# View to render index.html
def get_index(request):
    return render(request, "index.html")
