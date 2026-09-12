<#
.SYNOPSIS
    Workflow CLI para desenvolvimento da plataforma Lumina (Django).
.DESCRIPTION
    Script utilitário para automação de tarefas de desenvolvimento, migrações, testes e dados iniciais.
.EXAMPLE
    .\manage.ps1 run       # Inicia o servidor local na porta 8000
    .\manage.ps1 test      # Executa suíte de testes unitários
    .\manage.ps1 migrate   # Aplica migrações no banco de dados SQLite
    .\manage.ps1 seed      # Popula o banco com criadores e postagens iniciais
#>

param (
    [Parameter(Position = 0)]
    [ValidateSet("run", "test", "migrate", "makemigrations", "seed", "shell", "help")]
    [string]$Command = "help",

    [Parameter(Position = 1)]
    [string]$Port = "8000"
)

$PythonExe = ".\.venv\Scripts\python.exe"

if (-not (Test-Path $PythonExe)) {
    $PythonExe = "python"
}

switch ($Command) {
    "run" {
        Write-Host "Iniciando servidor de desenvolvimento Lumina em http://127.0.0.1:$Port..." -ForegroundColor Cyan
        & $PythonExe manage.py runserver "127.0.0.1:$Port"
    }
    "test" {
        Write-Host "Executando testes automatizados..." -ForegroundColor Green
        & $PythonExe manage.py test core --verbosity=2
    }
    "migrate" {
        Write-Host "Aplicando migrações..." -ForegroundColor Yellow
        & $PythonExe manage.py migrate
    }
    "makemigrations" {
        Write-Host "Gerando novas migrações..." -ForegroundColor Yellow
        & $PythonExe manage.py makemigrations
    }
    "seed" {
        Write-Host "Populando banco com dados de demonstração Lumina..." -ForegroundColor Magenta
        & $PythonExe seed_data.py
    }
    "shell" {
        & $PythonExe manage.py shell
    }
    Default {
        Write-Host "Comandos disponíveis no Workflow Lumina:" -ForegroundColor White
        Write-Host "  .\manage.ps1 run [porta]      - Inicia o servidor (padrão: 8000)" -ForegroundColor Gray
        Write-Host "  .\manage.ps1 test             - Roda os testes unitários" -ForegroundColor Gray
        Write-Host "  .\manage.ps1 migrate          - Aplica migrações no banco" -ForegroundColor Gray
        Write-Host "  .\manage.ps1 makemigrations   - Cria migrações para models" -ForegroundColor Gray
        Write-Host "  .\manage.ps1 seed             - Popula usuários e posts fictícios" -ForegroundColor Gray
        Write-Host "  .\manage.ps1 shell            - Abre o shell interativo do Django" -ForegroundColor Gray
    }
}
