from django.contrib import admin
from .models import BookRec

class BookRecAdmin(admin.ModelAdmin):
    list_deisplay = ('book_id', 'title', 'year','pages', 'description', 'genres', 'average_rating',	'ratings_count', 'authors')

# Register your models here.
admin.site.register(BookRec, BookRecAdmin)
