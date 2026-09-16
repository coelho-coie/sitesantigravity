"""
WSGI config for lumina_core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# Garante que o diretório raiz do projeto esteja no sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lumina_core.settings')

application = get_wsgi_application()
app = application

# Auto-inicialização e migração para Vercel Serverless
IS_VERCEL = os.getenv('VERCEL') == '1' or 'VERCEL' in os.environ
if IS_VERCEL:
    db_ready_flag = Path('/tmp/.db_ready')
    if not db_ready_flag.exists():
        try:
            from django.core.management import call_command
            call_command('migrate', interactive=False)
            try:
                import seed_data
                seed_data.run_seed()
            except Exception as seed_err:
                print(f"[Vercel Init] Erro/Aviso em seed_data: {seed_err}")
            db_ready_flag.write_text('ready', encoding='utf-8')
        except Exception as err:
            print(f"[Vercel Init] Erro em auto-migração: {err}")
