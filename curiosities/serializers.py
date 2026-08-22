from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Curiosity

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']

class CuriositySerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = Curiosity
        fields = [
            'id',
            'title',
            'subtitle',
            'category',
            'category_display',
            'date_or_era',
            'content',
            'comic_issue',
            'image_filename',
            'image_caption',
            'accent_color',
            'order',
            'author',
            'author_username',
            'media_url',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'author']

    def get_media_url(self, obj):
        if obj.image_filename:
            return f"/media/{obj.image_filename.strip()}"
        return None
