from rest_framework import serializers
from .models import BookRec
from rest_framework import viewsets
from rest_framework.decorators import action
from uuid import uuid4

class BookRecSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRec
        fields = '__all__'

class BookRecView(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def add(self, request):
        serializer = BookRecSerializer(data=request.data)
        if serializer.is_valid(): 
            serializer.save()  
            return Response({"message": "Book added successfully"}, status=201)
        return Response(serializer.errors, status=400)  # Return validation errors
