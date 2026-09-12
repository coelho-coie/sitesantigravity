"""
Lumina — Vercel Serverless WSGI Entrypoint
Permite a execução do Django como Serverless Function no runtime @vercel/python.
"""
import os
import sys

# Garante que o diretório raiz do projeto esteja no sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lumina_core.settings')

from django.core.wsgi import get_wsgi_application

# Vercel espera uma variável 'app' como callable WSGI
app = get_wsgi_application()
