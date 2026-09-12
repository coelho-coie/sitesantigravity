# Regras Universais do Projeto Lumina

1. **Arquitetura Modular**: Manter models, views, forms e urls limpos e desacoplados na aplicação `core`.
2. **Design & Estética**: Seguir à risca os tokens do Design System Dark Luxury Neo-Glassmorphism definidos em `docs/stitch/STITCH_PROMPT.md`.
3. **Respeito ao Git**: O agente NUNCA executa comandos que modifiquem o histórico do Git (`git commit`, `git push`, `git pull`, `git merge`). Apenas o usuário realiza commits e pushs.
4. **Sem Abreviações**: Nunca truncar código com `// rest of code here`. Sempre fornecer arquivos e rotinas completas.
5. **Verificação Real**: Antes de declarar conclusão, executar testes automatizados e validar o status das rotinas.
