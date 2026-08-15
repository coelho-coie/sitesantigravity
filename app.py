"""Módulo principal da aplicação Castelos & Ruínas (Flask Web Application).

Este módulo implementa o servidor web em Flask com autenticação baseada em
sessão, gerenciamento de expedições e restauração de fortalezas/ruínas,
painel analítico (Dashboard), registro do guardião (Perfil) e páginas
institucionais, seguindo as diretrizes PEP8 e PEP257.
"""

from functools import wraps
import logging
import os
from typing import Any, Callable, Dict, List, Optional

from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash

# ---------------------------------------------------------------------------
# Configuração de Logs Estruturados (Workflow Debug)
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] in %(module)s: %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Inicialização e Configuração do Aplicativo Flask
# ---------------------------------------------------------------------------
app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get(
    "SECRET_KEY", "castelos-e-ruinas-chave-secreta-2026"
)

# ---------------------------------------------------------------------------
# Base de Dados em Memória Simulada (Guardiões e Expedições/Missões)
# ---------------------------------------------------------------------------
USERS_DB: Dict[str, Dict[str, Any]] = {
    "admin": {
        "id": 1,
        "username": "admin",
        "name": "Lorde Comandante Eldor",
        "email": "comandante@castelos.reino.br",
        "password_hash": generate_password_hash("admin123"),
        "role": "Grão-Mestre das Fortalezas",
        "created_at": "Era de Bronze / 2026",
    },
    "dev_vitor": {
        "id": 2,
        "username": "dev_vitor",
        "name": "Vitor, Mestre Arquiteto",
        "email": "vitor.arquiteto@castelos.reino.br",
        "password_hash": generate_password_hash("senha123"),
        "role": "Engenheiro de Muralhas & Torres",
        "created_at": "Era de Pedra / 2026",
    },
    "qa_maria": {
        "id": 3,
        "username": "qa_maria",
        "name": "Maria, Guardiã das Ruínas",
        "email": "maria.guardia@castelos.reino.br",
        "password_hash": generate_password_hash("teste123"),
        "role": "Especialista em Catacumbas & Relíquias",
        "created_at": "Era de Pedra / 2026",
    },
}

TASKS_DB: List[Dict[str, Any]] = [
    {
        "id": 1,
        "titulo": "Restauração da Torre Norte do Castelo de Pedra-Alta",
        "descricao": (
            "Consolidar as fundações de pedra esculpida e reforçar a cúpula "
            "do observatório contra tempestades e invasões."
        ),
        "status": "Concluída",
        "prioridade": "Alta",
        "responsavel": "Vitor, Mestre Arquiteto",
        "local": "Castelo de Pedra-Alta",
        "prazo": "2026-08-15",
    },
    {
        "id": 2,
        "titulo": "Mapeamento das Catacumbas nas Ruínas de Eldoria",
        "descricao": (
            "Explorar os túneis subterrâneos esquecidos e catalogar os glifos "
            "antigos gravados nas paredes do santuário ancestral."
        ),
        "status": "Em Andamento",
        "prioridade": "Alta",
        "responsavel": "Maria, Guardiã das Ruínas",
        "local": "Ruínas de Eldoria",
        "prazo": "2026-08-18",
    },
    {
        "id": 3,
        "titulo": "Reforço das Muralhas da Fortaleza do Vale Sombrio",
        "descricao": (
            "Reparar as brechas no parapeito oeste e posicionar novos "
            "baluartes defensivos nas colinas do vale."
        ),
        "status": "Em Andamento",
        "prioridade": "Média",
        "responsavel": "Lorde Comandante Eldor",
        "local": "Fortaleza do Vale Sombrio",
        "prazo": "2026-08-20",
    },
    {
        "id": 4,
        "titulo": "Decifração dos Pergaminhos Antigos do Templo Perdido",
        "descricao": (
            "Analisar e traduzir os manuscritos arcanos resgatados da câmara "
            "selada no interior das ruínas do planalto."
        ),
        "status": "Pendente",
        "prioridade": "Média",
        "responsavel": "Maria, Guardiã das Ruínas",
        "local": "Ruínas do Templo Perdido",
        "prazo": "2026-08-25",
    },
    {
        "id": 5,
        "titulo": "Inspeção da Ponte Levadiça do Castelo Real das Brumas",
        "descricao": (
            "Substituir as correntes de ferro forjado e calibrar o mecanismo "
            "de contrapeso do portão principal da cidadela."
        ),
        "status": "Pendente",
        "prioridade": "Baixa",
        "responsavel": "Vitor, Mestre Arquiteto",
        "local": "Castelo Real das Brumas",
        "prazo": "2026-08-30",
    },
]

# ---------------------------------------------------------------------------
# Decorador de Controle de Acesso (Login Obrigatório)
# ---------------------------------------------------------------------------
def login_required(f: Callable[..., Any]) -> Callable[..., Any]:
    """Exige que o guardião esteja autenticado para acessar a rota protegida.

    Args:
        f (Callable): Função de visão da rota a ser protegida.

    Returns:
        Callable: Função decorada que valida a autenticação na sessão.
    """
    @wraps(f)
    def decorated_function(*args: Any, **kwargs: Any) -> Any:
        if "user" not in session:
            flash(
                "Acesso restrito aos portões do castelo. Por favor, apresente suas credenciais.",
                "warning",
            )
            logger.warning(
                "Tentativa de acesso não autorizado à rota protegida: %s",
                request.path,
            )
            return redirect(url_for("login", next=request.url))
        return f(*args, **kwargs)

    return decorated_function


# ---------------------------------------------------------------------------
# Funções Auxiliares de Métricas das Fortalezas e Ruínas
# ---------------------------------------------------------------------------
def calcular_metricas() -> Dict[str, Any]:
    """Calcula métricas consolidadas das expedições e missões em castelos.

    Returns:
        dict: Dicionário contendo total, contagem por status e taxa de restauração.
    """
    total = len(TASKS_DB)
    pendentes = sum(1 for t in TASKS_DB if t["status"] == "Pendente")
    andamento = sum(1 for t in TASKS_DB if t["status"] == "Em Andamento")
    concluidas = sum(1 for t in TASKS_DB if t["status"] == "Concluída")
    alta = sum(1 for t in TASKS_DB if t["prioridade"] == "Alta")
    media = sum(1 for t in TASKS_DB if t["prioridade"] == "Média")
    baixa = sum(1 for t in TASKS_DB if t["prioridade"] == "Baixa")

    taxa = round((concluidas / total * 100), 1) if total > 0 else 0.0

    return {
        "total": total,
        "pendentes": pendentes,
        "andamento": andamento,
        "concluidas": concluidas,
        "prioridade_alta": alta,
        "prioridade_media": media,
        "prioridade_baixa": baixa,
        "taxa_conclusao": taxa,
    }


# ---------------------------------------------------------------------------
# Rotas de Autenticação (Portão do Castelo)
# ---------------------------------------------------------------------------
@app.route("/login", methods=["GET", "POST"])
def login() -> Any:
    """Renderiza o portão de autenticação e valida credenciais do guardião.

    Returns:
        Response: Template renderizado ou redirecionamento após autenticação.
    """
    if request.method == "POST":
        username = request.form.get("username", "").strip().lower()
        password = request.form.get("password", "").strip()

        if not username or not password:
            flash("Informe seu título de usuário e chave de acesso.", "error")
            return render_template("login.html")

        user_data = USERS_DB.get(username)

        if user_data and check_password_hash(
            user_data["password_hash"], password
        ):
            session["user"] = {
                "id": user_data["id"],
                "username": user_data["username"],
                "name": user_data["name"],
                "email": user_data["email"],
                "role": user_data["role"],
                "created_at": user_data["created_at"],
            }
            logger.info("Acesso concedido ao guardião: %s", username)
            flash(
                f"Os portões se abrem! Bem-vindo(a), {user_data['name']}.",
                "success",
            )
            next_page = request.args.get("next")
            return redirect(next_page or url_for("dashboard"))

        logger.warning("Falha de autenticação no portão para: %s", username)
        flash("Credenciais inválidas. O sentinela barrou seu acesso.", "error")

    return render_template("login.html")


@app.route("/cadastro", methods=["GET", "POST"])
def cadastro() -> Any:
    """Renderiza o registro de novos guardiões e processa a criação da conta.

    Returns:
        Response: Template HTML do formulário de cadastro ou redirecionamento.
    """
    if "user" in session:
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        username = request.form.get("username", "").strip().lower()
        email = request.form.get("email", "").strip().lower()
        role = request.form.get("role", "Guardião Iniciante").strip()
        password = request.form.get("password", "").strip()
        confirm_password = request.form.get("confirm_password", "").strip()

        if not name or not username or not email or not password or not confirm_password:
            flash("Todos os campos do pergaminho de registro são obrigatórios.", "error")
            return render_template(
                "cadastro.html",
                name=name,
                username=username,
                email=email,
                role=role,
            )

        if len(username) < 3:
            flash("O identificador de usuário deve possuir ao menos 3 caracteres.", "error")
            return render_template(
                "cadastro.html",
                name=name,
                username=username,
                email=email,
                role=role,
            )

        if len(password) < 6:
            flash("A chave secreta deve conter ao menos 6 caracteres para garantir a proteção da fortaleza.", "error")
            return render_template(
                "cadastro.html",
                name=name,
                username=username,
                email=email,
                role=role,
            )

        if password != confirm_password:
            flash("As chaves de acesso informadas não coincidem.", "error")
            return render_template(
                "cadastro.html",
                name=name,
                username=username,
                email=email,
                role=role,
            )

        if username in USERS_DB:
            flash("Este identificador já pertence a outro guardião do reino. Escolha outro título.", "error")
            return render_template(
                "cadastro.html",
                name=name,
                email=email,
                role=role,
            )

        if any(u.get("email", "").lower() == email for u in USERS_DB.values()):
            flash("Este correio real já está registrado nos anais do castelo.", "error")
            return render_template(
                "cadastro.html",
                name=name,
                username=username,
                role=role,
            )

        novo_id = max([u["id"] for u in USERS_DB.values()], default=0) + 1
        USERS_DB[username] = {
            "id": novo_id,
            "username": username,
            "name": name,
            "email": email,
            "password_hash": generate_password_hash(password),
            "role": role or "Guardião da Cidadela",
            "created_at": "Era Atual / 2026",
        }

        logger.info("Novo guardião registrado nos anais: %s (%s)", username, name)
        flash(f"Registro nobiliárquico selado com sucesso! Bem-vindo(a), {name}. Apresente sua chave para entrar.", "success")
        return redirect(url_for("login"))

    return render_template("cadastro.html")


@app.route("/logout")
def logout() -> Any:
    """Encerra a sessão do guardião e fecha os portões da cidadela.

    Returns:
        Response: Redirecionamento para o login.
    """
    user = session.pop("user", None)
    if user:
        logger.info("Guardião deixou a fortaleza: %s", user.get("username"))
    flash("Você deixou a fortaleza em segurança.", "info")
    return redirect(url_for("login"))


# ---------------------------------------------------------------------------
# Página 1: Home (Visão do Reino, Castelos e Ruínas)
# ---------------------------------------------------------------------------
@app.route("/")
def home() -> Any:
    """Renderiza a página principal do Reino de Castelos & Ruínas.

    Returns:
        Response: Template HTML da página inicial medieval.
    """
    return render_template("home.html")


# ---------------------------------------------------------------------------
# Página 2: Dashboard (Salão Estratégico do Castelo)
# ---------------------------------------------------------------------------
@app.route("/dashboard")
@login_required
def dashboard() -> Any:
    """Renderiza o salão estratégico com métricas das expedições do reino.

    Returns:
        Response: Template HTML do painel de controle de fortalezas.
    """
    stats = calcular_metricas()
    ultimas_tarefas = sorted(TASKS_DB, key=lambda x: x["id"], reverse=True)[:5]
    return render_template(
        "dashboard.html",
        stats=stats,
        ultimas_tarefas=ultimas_tarefas,
    )


# ---------------------------------------------------------------------------
# Página 3: Tarefas (Quadro de Missões nas Fortalezas e Ruínas)
# ---------------------------------------------------------------------------
@app.route("/tarefas", methods=["GET"])
@login_required
def tarefas() -> Any:
    """Exibe o quadro de missões de expedição e restauração com filtros.

    Query Params:
        status (str, opcional): Filtra pelo status da missão.
        prioridade (str, opcional): Filtra pela urgência da missão.
        busca (str, opcional): Busca por palavras-chave em títulos/descrições.

    Returns:
        Response: Template HTML da página de missões e tarefas.
    """
    filtro_status = request.args.get("status", "").strip()
    filtro_prioridade = request.args.get("prioridade", "").strip()
    filtro_busca = request.args.get("busca", "").strip().lower()

    tarefas_filtradas = TASKS_DB

    if filtro_status:
        tarefas_filtradas = [
            t for t in tarefas_filtradas if t["status"] == filtro_status
        ]

    if filtro_prioridade:
        tarefas_filtradas = [
            t for t in tarefas_filtradas if t["prioridade"] == filtro_prioridade
        ]

    if filtro_busca:
        tarefas_filtradas = [
            t for t in tarefas_filtradas
            if filtro_busca in t["titulo"].lower()
            or filtro_busca in t["descricao"].lower()
            or filtro_busca in t.get("local", "").lower()
        ]

    return render_template(
        "tarefas.html",
        tarefas=tarefas_filtradas,
        filtro_status=filtro_status,
        filtro_prioridade=filtro_prioridade,
        filtro_busca=filtro_busca,
    )


@app.route("/tarefas/nova", methods=["POST"])
@login_required
def nova_tarefa() -> Any:
    """Registra uma nova missão de restauração ou expedição em ruínas.

    Returns:
        Response: Redirecionamento para o quadro de missões.
    """
    titulo = request.form.get("titulo", "").strip()
    descricao = request.form.get("descricao", "").strip()
    prioridade = request.form.get("prioridade", "Média")
    local = request.form.get("local", "").strip() or "Fortaleza Principal"
    prazo = request.form.get("prazo", "").strip()
    responsavel = request.form.get(
        "responsavel", session["user"]["name"]
    ).strip()

    if not titulo:
        flash("O pergaminho de missão exige um título válido.", "error")
        return redirect(url_for("tarefas"))

    novo_id = max([t["id"] for t in TASKS_DB], default=0) + 1
    nova = {
        "id": novo_id,
        "titulo": titulo,
        "descricao": descricao or "Sem detalhes adicionais registrados no pergaminho.",
        "status": "Pendente",
        "prioridade": prioridade,
        "responsavel": responsavel,
        "local": local,
        "prazo": prazo or "A definir",
    }
    TASKS_DB.append(nova)
    logger.info(
        "Nova missão registrada [ID %d] por %s: %s (%s)",
        novo_id,
        session["user"]["username"],
        titulo,
        local,
    )
    flash(f"Missão '{titulo}' selada com sucesso no pergaminho!", "success")
    return redirect(url_for("tarefas"))


@app.route("/tarefas/<int:task_id>/status", methods=["POST"])
@login_required
def atualizar_status_tarefa(task_id: int) -> Any:
    """Atualiza o estado de expedição de uma missão em ruínas ou castelos.

    Args:
        task_id (int): Identificador numérico da missão.

    Returns:
        Response: Redirecionamento para o quadro de missões.
    """
    novo_status = request.form.get("novo_status", "").strip()
    status_validos = ["Pendente", "Em Andamento", "Concluída"]

    if novo_status not in status_validos:
        flash("Status de expedição inválido.", "error")
        return redirect(url_for("tarefas"))

    for task in TASKS_DB:
        if task["id"] == task_id:
            antigo = task["status"]
            task["status"] = novo_status
            logger.info(
                "Missão %d alterada de '%s' para '%s' por %s",
                task_id,
                antigo,
                novo_status,
                session["user"]["username"],
            )
            flash(
                f"Estado da missão '{task['titulo']}' atualizado para {novo_status}!",
                "success",
            )
            break
    else:
        flash("Missão não encontrada nos anais do castelo.", "error")

    return redirect(url_for("tarefas"))


@app.route("/tarefas/<int:task_id>/excluir", methods=["POST"])
@login_required
def excluir_tarefa(task_id: int) -> Any:
    """Remove uma missão arquivada do quadro de expedições.

    Args:
        task_id (int): Identificador numérico da missão.

    Returns:
        Response: Redirecionamento para o quadro de missões.
    """
    global TASKS_DB
    inicial = len(TASKS_DB)
    TASKS_DB = [t for t in TASKS_DB if t["id"] != task_id]

    if len(TASKS_DB) < inicial:
        logger.info(
            "Missão %d revogada por %s",
            task_id,
            session["user"]["username"],
        )
        flash("Missão revogada e arquivada.", "info")
    else:
        flash("Missão não localizada.", "error")

    return redirect(url_for("tarefas"))


# ---------------------------------------------------------------------------
# Página 4: Perfil (Registro do Guardião e Insígnias)
# ---------------------------------------------------------------------------
@app.route("/perfil")
@login_required
def perfil() -> Any:
    """Renderiza o registro nobiliárquico e dados do guardião conectado.

    Returns:
        Response: Template HTML do perfil do guardião.
    """
    user_name = session["user"]["name"]
    minhas_tarefas = [t for t in TASKS_DB if t["responsavel"] == user_name]
    user_stats = {
        "total": len(minhas_tarefas),
        "concluidas": sum(
            1 for t in minhas_tarefas if t["status"] == "Concluída"
        ),
        "pendentes": sum(
            1 for t in minhas_tarefas if t["status"] != "Concluída"
        ),
    }
    return render_template("perfil.html", user_stats=user_stats)


@app.route("/perfil/atualizar", methods=["POST"])
@login_required
def atualizar_perfil() -> Any:
    """Atualiza o título e as credenciais cadastrais do guardião.

    Returns:
        Response: Redirecionamento para a página de perfil.
    """
    nome = request.form.get("nome", "").strip()
    email = request.form.get("email", "").strip()
    cargo = request.form.get("cargo", "").strip()

    if not nome or not email or not cargo:
        flash("Todos os campos do registro do guardião são obrigatórios.", "error")
        return redirect(url_for("perfil"))

    username = session["user"]["username"]
    if username in USERS_DB:
        USERS_DB[username]["name"] = nome
        USERS_DB[username]["email"] = email
        USERS_DB[username]["role"] = cargo

    session["user"]["name"] = nome
    session["user"]["email"] = email
    session["user"]["role"] = cargo

    logger.info("Registro do guardião %s atualizado nos arquivos reais.", username)
    flash("Registro nobiliárquico atualizado com sucesso!", "success")
    return redirect(url_for("perfil"))


# ---------------------------------------------------------------------------
# Página 5: Sobre (Crônicas do Reino, Arquitetura e Ruínas)
# ---------------------------------------------------------------------------
@app.route("/sobre")
def sobre() -> Any:
    """Renderiza a página com crônicas e detalhes da arquitetura de software.

    Returns:
        Response: Template HTML da página Sobre.
    """
    return render_template("sobre.html")


# ---------------------------------------------------------------------------
# Manipuladores de Erros Globais (HTTP 404 e 500)
# ---------------------------------------------------------------------------
@app.errorhandler(404)
def page_not_found(error: Any) -> Any:
    """Manipulador amigável para erro HTTP 404 (Ruínas Perdidas na Bruma).

    Args:
        error (Any): Objeto de exceção capturado pelo Flask.

    Returns:
        tuple: Template renderizado e código HTTP 404.
    """
    return render_template("404.html"), 404


@app.errorhandler(500)
def internal_server_error(error: Any) -> Any:
    """Manipulador amigável para erro HTTP 500 (Desmoronamento Interno).

    Args:
        error (Any): Objeto de exceção capturado pelo Flask.

    Returns:
        tuple: Template renderizado e código HTTP 500.
    """
    logger.critical("Colapso interno não tratado no servidor: %s", error)
    return render_template("404.html"), 500


# ---------------------------------------------------------------------------
# Ponto de Entrada da Aplicação
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    logger.info("Guardiões a postos! Iniciando Castelos & Ruínas na porta 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)
