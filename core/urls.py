from django.urls import path
from . import views

urlpatterns = [
    path('', views.feed_view, name='feed'),
    path('explore/', views.explore_view, name='explore'),
    path('post/<int:pk>/', views.post_detail_view, name='post_detail'),
    path('create/', views.create_post_view, name='create_post'),
    path('post/<int:pk>/like/', views.like_toggle_view, name='like_toggle'),
    path('profile/edit/', views.profile_edit_view, name='profile_edit'),
    path('profile/<str:username>/', views.profile_view, name='profile'),
    path('auth/login/', views.user_login_view, name='login'),
    path('auth/register/', views.user_register_view, name='register'),
    path('auth/logout/', views.user_logout_view, name='logout'),
]
