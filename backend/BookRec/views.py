from django.db import connection
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .serializers import BookRecSerializer
from .models import BookRec
from django.http import JsonResponse


class BookRecView(viewsets.ViewSet):
    def list(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM bookrec_bookrec")
            rows = cursor.fetchall()

        result = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]

        return JsonResponse(result, safe=False)

    @action(detail=False, methods=['post'])
    def add(self, request):
        title = request.data.get('title')
        year = request.data.get('year')
        pages = request.data.get('pages')
        description = request.data.get('description')
        genres = request.data.get('genres')
        average_rating = request.data.get('average_rating')
        ratings_count = request.data.get('ratings_count')
        authors = request.data.get('authors')

        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO bookrec_bookrec (title, year, pages, description, genres, average_rating, ratings_count, authors) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                [title, year, pages, description, genres, average_rating, ratings_count, authors]
            )

        return JsonResponse({'message': 'Book added successfully'}, status=201)

    @action(detail=False, methods=['delete'])  # DELETE request
    def delete(self, request):
        title = request.data.get('title')
        authors = request.data.get('authors')

        if not title or not authors:
            return Response(
                {"error": "Title and authors are required to delete a book."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with connection.cursor() as cursor:
            cursor.execute(
                "DELETE FROM bookrec_bookrec WHERE title = %s AND authors = %s",
                [title, authors],
            )
            
        return JsonResponse({'message': 'Book deleted successfully'}, status=200)

    @action(detail=False, methods=['get'])  # Filtering endpoint
    def filter(self, request):
        # Start building a dynamic SQL query with an always-true condition
        query = "SELECT * FROM bookrec_bookrec WHERE 1=1"
        params = []

        # Define fields to filter
        fields = {
            'title': 'title',
            'year': 'year',
            'pages': 'pages',
            'description': 'description',
            'genres': 'genres',
            'average_rating': 'average_rating',
            'ratings_count': 'ratings_count',
            'authors': 'authors',
        }

        # Add conditions to the query for each field if they have values
        for field, column in fields.items():
            value = request.query_params.get(field)
            if value:
                query += f" AND {column} LIKE %s"
                params.append(f"%{value}%")

        # Execute the dynamic query
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            rows = cursor.fetchall()

        result = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]

        return JsonResponse(result, safe=False)
