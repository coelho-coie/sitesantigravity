---
name: skill_formularios
description: >-
  Diretrizes e padrões para estruturação, validação no cliente e servidor, 
  sanitização e processamento seguro de formulários e inputs de usuário.
---

# Skill Formulários: Estruturação, Validação e Processamento

Esta skill estabelece o fluxo de engenharia para criação, validação e tratamento de dados recebidos através de formulários web.

---

## 1. Estruturação Semântica e Acessibilidade

1. **Associação Explícita de Labels**:
   - Todo campo `<input>`, `<textarea>` ou `<select>` deve possuir um `<label>` correspondente com atributo `for="id_do_campo"`.
   - Utilize atributos como `placeholder`, `aria-describedby` e `required` para guiar o usuário.

2. **Organização em Grupos**:
   - Agrupe campos relacionados utilizando tags `<fieldset>` e `<legend>` ou containers modulares com classes semânticas (`.form-group`, `.mb-3`).
   - Forneça textos de ajuda (`.form-text`) e áreas dedicadas para mensagens de validação (`.invalid-feedback`).

---

## 2. Validação em Dupla Camada (Client & Server)

1. **Validação no Cliente (Frontend)**:
   - Use atributos HTML5 nativos: `required`, `type="email"`, `minlength`, `maxlength`, `pattern`.
   - Adicione feedback visual instantâneo para inputs inválidos sem bloquear a experiência do usuário.

2. **Validação no Servidor (Backend)**:
   - **Regra de Ouro**: *Nunca confie nos dados enviados pelo cliente.*
   - Valide presença de campos obrigatórios, tipos de dados, limites de caracteres e regras de negócio no backend (ex: Flask).
   - Sanitize inputs para evitar injeções de script (XSS) e SQL.

---

## 3. Segurança e Tratamento de Respostas

- **Proteção CSRF**: Garanta que formulários com mutação de estado (`POST`, `PUT`, `DELETE`) estejam protegidos contra requisições forjadas.
- **Feedback ao Usuário**:
  - Em caso de erro: reexiba o formulário mantendo os dados válidos já preenchidos e destacando os campos com erro.
  - Em caso de sucesso: exiba mensagens de confirmação (ex: Flask `flash()`) e redirecione via padrão Post/Redirect/Get (PRG) para evitar reenvio acidental ao atualizar a página.
- **Prevenção de Cliques Múltiplos**:
  - Desabilite o botão de submit durante o processamento para evitar envios duplicados.

---

## 4. Checklist de Formulários

- [ ] Todos os inputs possuem labels acessíveis associados.
- [ ] Validações de tamanho e obrigatoriedade implementadas no HTML5.
- [ ] Validação rigorosa implementada no backend com tratamento de exceções.
- [ ] Mensagens de erro claras e amigáveis exibidas ao usuário.
- [ ] Redirecionamento PRG aplicado após submissão bem-sucedida.
