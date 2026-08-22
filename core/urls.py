"""
URL configuration for projeto05.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse, JsonResponse
from django.views.static import serve
from pathlib import Path

def spa_index_view(request):
    dist_index = Path(settings.BASE_DIR) / 'frontend' / 'dist' / 'index.html'
    if dist_index.exists():
        with open(dist_index, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    return JsonResponse({
        "status": "online",
        "app": "Portal de Curiosidades do Hulk & Universo Marvel (Django + React)",
        "message": "Backend ativo. Para carregar o frontend, execute 'npm run dev' na pasta frontend ou 'npm run build'.",
        "endpoints": {
            "auth_login": "/api/auth/login/",
            "auth_logout": "/api/auth/logout/",
            "auth_me": "/api/auth/me/",
            "curiosities_list": "/api/curiosities/",
            "curiosities_detail": "/api/curiosities/<id>/",
            "seed_database": "/api/curiosities/seed/",
            "media_status": "/api/media-status/",
            "media_files": "/media/<filename>",
            "admin_panel": "/admin/"
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('curiosities.urls')),
    # Explicit media serving
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

# Static assets serving for frontend dist assets
dist_assets = Path(settings.BASE_DIR) / 'frontend' / 'dist' / 'assets'
if dist_assets.exists():
    urlpatterns += [
        re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': dist_assets}),
    ]

urlpatterns += [
    # SPA catch-all fallback
    re_path(r'^(?!api|admin|media|static|assets).*$', spa_index_view, name='spa_index'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
