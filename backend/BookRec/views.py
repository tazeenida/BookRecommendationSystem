from django.shortcuts import render
from rest_framework import viewsets
from .serializers import BookRecSerializer
from .models import BookRec
from django.http import HttpResponse
from django.template import loader

# Create your views here.

class BookRecView(viewsets.ModelViewSet):
    serializer_class = BookRecSerializer
    queryset = BookRec.objects.all()