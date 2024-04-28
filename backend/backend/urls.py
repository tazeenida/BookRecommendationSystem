from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from BookRec import views

router = routers.DefaultRouter()
router.register(r'BookRec', views.BookRecView,'BookRec')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/BookRec/add/', views.BookRecView.as_view({'post': 'add'}), name='add-book'),
    path('api/BookRec/delete/', views.BookRecView.as_view({'delete': 'delete'}), name='delete-book'),
]
