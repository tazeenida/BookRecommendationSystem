from rest_framework import serializers
from .models import BookRec

class BookRecSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRec
        fields = ('book_id', 'title', 'year','pages', 'description', 'genres', 'average_rating','ratings_count', 'authors')