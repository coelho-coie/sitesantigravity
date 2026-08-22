from django.urls import path
from .views import (
    LoginView,
    LogoutView,
    CurrentUserView,
    CuriosityListCreateView,
    CuriosityDetailView,
    MediaStatusView,
    SeedDatabaseView,
)

urlpatterns = [
    # Auth endpoints
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),

    # Curiosities CRUD endpoints
    path('curiosities/', CuriosityListCreateView.as_view(), name='curiosities_list_create'),
    path('curiosities/<int:pk>/', CuriosityDetailView.as_view(), name='curiosity_detail'),

    # Media & Seed utilities
    path('media-status/', MediaStatusView.as_view(), name='media_status'),
    path('curiosities/seed/', SeedDatabaseView.as_view(), name='curiosities_seed'),
]
