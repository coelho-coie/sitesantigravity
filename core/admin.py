from django.contrib import admin
from .models import Profile, Post, Tag, Like, Comment, Story


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'is_pro', 'is_curator', 'created_at')
    search_fields = ('user__username', 'location', 'bio')
    list_filter = ('is_pro', 'is_curator')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'title', 'camera_model', 'created_at', 'total_likes', 'total_comments')
    search_fields = ('title', 'caption', 'author__username', 'location_name')
    list_filter = ('camera_model', 'created_at')
    filter_horizontal = ('tags',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    search_fields = ('content', 'user__username')


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'created_at')
