"""Módulo de testes automatizados para a aplicação Castelos & Ruínas.

Valida renderização de templates medievais, autenticação, controle de acesso
e operações de registro de missões em fortalezas.
"""

import unittest
from app import app, USERS_DB, TASKS_DB


class CastelosRuinasTestCase(unittest.TestCase):
    """Casos de teste unitários e de integração para Castelos & Ruínas."""

    def setUp(self):
        """Prepara o cliente de testes da aplicação."""
        app.config["TESTING"] = True
        app.config["WTF_CSRF_ENABLED"] = False
        self.client = app.test_client()

    def test_home_page(self):
        """Verifica se a página inicial responde com status HTTP 200."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Castelos & Ruínas".encode("utf-8"), response.data)

    def test_sobre_page(self):
        """Verifica se a página de crônicas responde com status HTTP 200."""
        response = self.client.get("/sobre")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Crônicas de Castelos & Ruínas".encode("utf-8"), response.data)

    def test_protected_routes_redirect_to_login(self):
        """Verifica se rotas protegidas redirecionam guardião não autenticado."""
        for route in ["/dashboard", "/tarefas", "/perfil"]:
            with self.subTest(route=route):
                response = self.client.get(route, follow_redirects=False)
                self.assertEqual(response.status_code, 302)
                self.assertIn("/login", response.headers["Location"])

    def test_login_successful_and_logout(self):
        """Testa o fluxo de autenticação no portão da fortaleza."""
        response = self.client.post(
            "/login",
            data={"username": "dev_vitor", "password": "senha123"},
            follow_redirects=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("Salão Estratégico".encode("utf-8"), response.data)

        # Logout
        logout_response = self.client.get("/logout", follow_redirects=True)
        self.assertEqual(logout_response.status_code, 200)
        self.assertIn("Portão da Fortaleza".encode("utf-8"), logout_response.data)

    def test_mission_creation_and_status_update(self):
        """Testa o registro de uma nova missão em ruína e sua atualização."""
        # Login como Lorde Comandante
        self.client.post(
            "/login",
            data={"username": "admin", "password": "admin123"},
            follow_redirects=True,
        )

        # Registrar nova missão
        create_resp = self.client.post(
            "/tarefas/nova",
            data={
                "titulo": "Exploração do Santuário Submerso",
                "local": "Ruínas de Atlanteia",
                "descricao": "Drenar a câmara central e resgatar o cetro antigo",
                "prioridade": "Alta",
                "prazo": "2026-09-10",
                "responsavel": "Lorde Comandante Eldor",
            },
            follow_redirects=True,
        )
        self.assertEqual(create_resp.status_code, 200)
        self.assertIn("Exploração do Santuário Submerso".encode("utf-8"), create_resp.data)

        # Obter missão recém-criada
        missao_criada = [
            t for t in TASKS_DB if t["titulo"] == "Exploração do Santuário Submerso"
        ][-1]

        # Atualizar status para Restaurada/Concluída
        status_resp = self.client.post(
            f"/tarefas/{missao_criada['id']}/status",
            data={"novo_status": "Concluída"},
            follow_redirects=True,
        )
        self.assertEqual(status_resp.status_code, 200)
        self.assertEqual(missao_criada["status"], "Concluída")

    def test_cadastro_page_render(self):
        """Verifica se a página de cadastro renderiza com status HTTP 200."""
        response = self.client.get("/cadastro")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Registro de Guardião".encode("utf-8"), response.data)

    def test_cadastro_successful_and_login(self):
        """Testa o cadastro bem-sucedido de um novo guardião e posterior login."""
        # Cadastro de novo usuário
        response = self.client.post(
            "/cadastro",
            data={
                "name": "Sir Lancelot",
                "username": "lancelot_cavaleiro",
                "email": "lancelot@castelos.reino.br",
                "role": "Guardião de Muralhas",
                "password": "senha_forte_123",
                "confirm_password": "senha_forte_123",
            },
            follow_redirects=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("Registro nobiliárquico selado com sucesso".encode("utf-8"), response.data)
        self.assertIn("lancelot_cavaleiro", USERS_DB)

        # Login com as novas credenciais cadastradas
        login_resp = self.client.post(
            "/login",
            data={"username": "lancelot_cavaleiro", "password": "senha_forte_123"},
            follow_redirects=True,
        )
        self.assertEqual(login_resp.status_code, 200)
        self.assertIn("Salão Estratégico".encode("utf-8"), login_resp.data)

    def test_cadastro_password_mismatch(self):
        """Valida que senhas divergentes são rejeitadas no cadastro."""
        response = self.client.post(
            "/cadastro",
            data={
                "name": "Guardião Teste",
                "username": "guardiao_teste",
                "email": "teste@reino.com",
                "role": "Mestre Arquiteto",
                "password": "senha_um_123",
                "confirm_password": "senha_dois_456",
            },
            follow_redirects=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("As chaves de acesso informadas não coincidem".encode("utf-8"), response.data)


if __name__ == "__main__":
    unittest.main()
