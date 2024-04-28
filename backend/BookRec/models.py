from django.db import models

class BookRec(models.Model):
    book_id = models.TextField(unique=True)
    title = models.TextField(unique=True)
    year = models.IntegerField(default=0)
    pages = models.IntegerField(default=0)
    description = models.TextField(default='None')
    genres = models.TextField(default='None')
    average_rating = models.FloatField(default=0)
    ratings_count = models.IntegerField(default=0)
    authors = models.TextField(default='Jane Doe')

    def __str__(self):
        return self.title
