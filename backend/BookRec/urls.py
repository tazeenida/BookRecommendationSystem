from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.BookRecView.as_view({'post': 'add'}), name='add'),
    path('delete/', views.BookRecView.as_view({'delete': 'delete'}), name='delete'),
]
