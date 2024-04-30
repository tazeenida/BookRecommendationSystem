from django.db import connection
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .serializers import BookRecSerializer
from .models import BookRec
from django.http import JsonResponse
from rest_framework.decorators import action
from uuid import uuid4
import json

class BookRecView(viewsets.ViewSet):
    def list(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM bookrec_bookrec")
            rows = cursor.fetchall()

        result = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]

        return JsonResponse(result, safe=False)

    @action(detail=False, methods=['post'])
    def add(self, request):
        book_id = request.data.get('book_id', uuid4())
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
                "INSERT INTO bookrec_bookrec (book_id, title, year, pages, description, genres, average_rating, ratings_count, authors) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                [book_id, title, year, pages, description, genres, average_rating, ratings_count, authors]
            )

        return JsonResponse({'message': 'Book added successfully'}, status=201)

    @action(detail=False, methods=['delete'])
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
        query = "SELECT * FROM bookrec_bookrec WHERE 1=1"
        params = []

        average_rating_min = request.query_params.get("average_rating_min")
        average_rating_max = request.query_params.get("average_rating_max")

        if average_rating_min:
            query += " AND average_rating >= %s"
            params.append(average_rating_min)

        if average_rating_max:
            query += " AND average_rating <= %s"
            params.append(average_rating_max)

        fields = {
        'book_id': 'book_id',
        'title': 'title',
        'year': 'year',
        'pages': 'pages',
        'description': 'description',
        'genres': 'genres',
        'ratings_count': 'ratings_count',
        'authors': 'authors',
            }

            # Loop through and add filters
        for field, column in fields.items():
            value = request.query_params.get(field)
            if value:
                query += f" AND {column} LIKE %s"
                params.append(f"%{value}%")

        with connection.cursor() as cursor:
            cursor.execute(query, params)
            rows = cursor.fetchall()

            result = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]

        return JsonResponse(result, safe=False)
        
    def update(self, request, pk=None):
        data = json.loads(request.body)
        book_id = data.get("book_id")  # Ensure this is the correct identifier

        if not book_id:
            return JsonResponse({"error": "Book ID is required for update."}, status=400)

        # Update only fields that are provided and not empty
        update_fields = []
        update_values = []

        # Add fields to update if they're present in the request data and not empty
        fields_to_check = {
            "title": "title",
            "authors": "authors",
            "year": "year",
            "pages": "pages",
            "description": "description",
            "genres": "genres",
            "average_rating": "average_rating",
            "ratings_count": "ratings_count",
        }

        for key, column in fields_to_check.items():
            value = data.get(key)
            if value:  # Only add to update if the value is not None or empty
                update_fields.append(f"{column} = %s")
                update_values.append(value)

        if not update_fields:
            return JsonResponse({"message": "No valid fields provided for update."}, status=200)

        # Add book_id to the end of update_values
        update_values.append(book_id)

        # Construct the UPDATE query with only the fields to update
        update_query = "UPDATE bookrec_bookrec SET " + ", ".join(update_fields) + " WHERE book_id = %s"

        # Execute the query
        with connection.cursor() as cursor:
            cursor.execute(update_query, update_values)

        return JsonResponse({"status": "success", "updated_fields": update_fields})
