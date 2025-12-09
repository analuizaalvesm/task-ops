# Sistema de Pré-Commit e Commits Semânticos

Este projeto implementa um sistema robusto de pré-commit que garante a qualidade do código e padronização dos commits antes que sejam aceitos no repositório.

## 🚀 Funcionalidades Implementadas

### 1. **Validação de Commits Semânticos**
- Formato obrigatório seguindo a especificação [Conventional Commits](https://www.conventionalcommits.org/)
- Validação automática no pré-commit e na pipeline CI/CD
- Rejeição automática de commits que não seguem o padrão

### 2. **Execução Automática de Testes**
- Testes unitários executados automaticamente antes de cada commit
- Se qualquer teste falhar, o commit é rejeitado
- Garante que código defeituoso não seja commitado

### 3. **Lint-Staged**
- Executa verificações apenas nos arquivos modificados (staged)
- Otimiza performance executando testes relacionados apenas aos arquivos alterados
- Feedback rápido para o desenvolvedor

## Formato dos Commits

```
<type>: <description>

[optional body]

[optional footer]
```

### Tipos permitidos:

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações na documentação
- **style**: Alterações que não afetam o significado do código (espaços em branco, formatação, etc.)
- **refactor**: Alteração de código que não corrige um bug nem adiciona uma funcionalidade
- **perf**: Alteração de código que melhora a performance
- **test**: Adição ou correção de testes
- **build**: Alterações que afetam o sistema de build ou dependências externas
- **ci**: Alterações nos arquivos e scripts de CI
- **chore**: Outras alterações que não modificam arquivos src ou test
- **revert**: Reverte um commit anterior

### Exemplos:

```bash
feat: Adiciona endpoint para criação de usuários
fix: Corrige validação de email no UserService
docs: Atualiza README com instruções de instalação
test: Adiciona testes unitários para TaskController
refactor: Reorganiza estrutura de pastas dos models
```

## Validações Automáticas

Antes de cada commit, o sistema executa automaticamente:

1. **Validação do formato do commit** - Verifica se segue o padrão semântico
2. **Testes unitários** - Executa todos os testes unitários
3. **Lint-staged** - Executa verificações nos arquivos modificados

Se qualquer uma dessas validações falhar, o commit será rejeitado.

## 🔧 Configuração Técnica

### Arquivos de Configuração

- **`.commitlintrc.json`**: Regras para validação de commits semânticos
- **`.husky/pre-commit`**: Hook que executa testes e verificações antes do commit
- **`.husky/commit-msg`**: Hook que valida o formato da mensagem de commit
- **`package.json`**: Configuração do lint-staged e scripts

### Fluxo de Commit

1. **Desenvolvedor executa `git commit`**
2. **Hook pré-commit é acionado:**
   - Executa testes unitários (`npm run test:unit`)
   - Executa lint-staged nos arquivos modificados
3. **Hook commit-msg é acionado:**
   - Valida formato da mensagem usando commitlint
4. **Se tudo passar:** Commit é aceito ✅
5. **Se algo falhar:** Commit é rejeitado ❌

### Pipeline CI/CD

A pipeline também valida commits:
- **Job `code-quality`**: Valida formato de commits e qualidade do código
- **Job `commit`**: Executa build e testes completos
- **Dependência**: Jobs subsequentes só executam se validações passarem

## 📋 Comandos Úteis

```bash
# Executar apenas testes unitários
npm run test:unit

# Executar todos os testes (unitários + integração)
npm test

# Executar testes com watch mode
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Executar testes E2E
npm run test:e2e

# Testar validação de commit (sem fazer commit)
echo "feat: exemplo de commit" | npx commitlint

# Executar lint-staged manualmente
npx lint-staged
```

## 🛠️ Solução de Problemas

### Commit rejeitado por formato inválido
```bash
# ❌ Formato inválido
git commit -m "corrige bug"

# ✅ Formato correto
git commit -m "fix: Corrige validação de email no UserService"
```

### Commit rejeitado por testes falhando
1. Execute os testes localmente: `npm run test:unit`
2. Corrija os erros encontrados
3. Execute novamente para confirmar
4. Faça o commit normalmente

### Bypass temporário (emergência)
```bash
# APENAS EM EMERGÊNCIAS - bypassa hooks
git commit -m "fix: Correção urgente" --no-verify
```

**⚠️ Aviso:** O uso de `--no-verify` deve ser excepcional e o commit deve ser corrigido posteriormente.
