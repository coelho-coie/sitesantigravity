from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.conf import settings
from django.core.management import call_command
from pathlib import Path
import os

from .models import Curiosity
from .serializers import CuriositySerializer, UserSerializer

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()

        if not username or not password:
            return Response(
                {"detail": "Por favor, forneça o nome de usuário e a senha."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if not user.is_active:
                return Response(
                    {"detail": "Esta conta de usuário está desativada."},
                    status=status.HTTP_403_FORBIDDEN
                )
            login(request, user)
            return Response({
                "message": f"Bem-vindo(a), {user.username}! Login realizado com sucesso.",
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "Credenciais inválidas. Verifique o usuário e senha informados."},
                status=status.HTTP_401_UNAUTHORIZED
            )

class LogoutView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logout(request)
        return Response({"message": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)

class CurrentUserView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                "authenticated": True,
                "user": UserSerializer(request.user).data
            })
        return Response({
            "authenticated": False,
            "user": None
        })

class CuriosityListCreateView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        category = request.query_params.get('category', None)
        search = request.query_params.get('search', None)

        queryset = Curiosity.objects.all()
        if category:
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(content__icontains=search)

        serializer = CuriositySerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CuriositySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CuriosityDetailView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_object(self, pk):
        try:
            return Curiosity.objects.get(pk=pk)
        except Curiosity.DoesNotExist:
            return None

    def get(self, request, pk):
        curiosity = self.get_object(pk)
        if not curiosity:
            return Response({"detail": "Curiosidade não encontrada."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CuriositySerializer(curiosity)
        return Response(serializer.data)

    def put(self, request, pk):
        curiosity = self.get_object(pk)
        if not curiosity:
            return Response({"detail": "Curiosidade não encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CuriositySerializer(curiosity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        curiosity = self.get_object(pk)
        if not curiosity:
            return Response({"detail": "Curiosidade não encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
        curiosity.delete()
        return Response({"message": "Curiosidade removida com sucesso."}, status=status.HTTP_200_OK)

class MediaStatusView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        media_dir = Path(settings.MEDIA_ROOT)
        media_files = []
        
        # Check standard 6 slots: ironman_1.jpg to ironman_6.jpg (and variants)
        for i in range(1, 7):
            possible_names = [
                f"ironman_{i}.jpg", f"ironman_{i}.png", f"ironman_{i}.webp",
                f"iron_{i}.jpg", f"iron_{i}.png", f"iron_{i}.webp",
                f"homemdeferro_{i}.jpg", f"hulk_{i}.jpg"
            ]
            
            found = False
            chosen_name = f"ironman_{i}.jpg"
            for name in possible_names:
                file_path = media_dir / name
                if file_path.exists():
                    found = True
                    chosen_name = name
                    break
            
            media_files.append({
                "slot": i,
                "filename": chosen_name,
                "exists": found,
                "url": f"/media/{chosen_name}" if found else None,
                "path": str(media_dir / chosen_name)
            })

        return Response({
            "media_root": str(media_dir),
            "media_url": settings.MEDIA_URL,
            "slots": media_files
        })

class SeedDatabaseView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            call_command('seed_db')
            return Response({
                "message": "Banco de dados populado com sucesso com os usuários (user1, user2, user3) e histórias do Homem de Ferro!"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "detail": f"Erro ao executar seed: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
