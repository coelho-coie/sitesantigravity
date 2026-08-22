from django.contrib import admin
from .models import Curiosity

@admin.register(Curiosity)
class CuriosityAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'date_or_era', 'comic_issue', 'image_filename', 'order', 'author', 'created_at')
    list_filter = ('category', 'date_or_era', 'created_at')
    search_fields = ('title', 'subtitle', 'content', 'comic_issue')
    ordering = ('order', '-created_at')
