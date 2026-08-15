"""Ponto de entrada WSGI para o deploy serverless no Vercel."""
import os
import sys

# Adiciona o diretório raiz ao path para importação dos módulos da aplicação
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from app import app

# Exporta a instância Flask para consumo do runtime Python no Vercel
app = app
