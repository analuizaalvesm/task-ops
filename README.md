# TaskReport - Configuration Management and Software Evolution

![CI/CD Pipeline](https://github.com/analuizaalvesm/gcs-devops/actions/workflows/ci-cd.yml/badge.svg)
[![Uptime](https://img.shields.io/badge/uptime-monitor-brightgreen)](https://gcs-devops-api.onrender.com/api/health)

**TaskReport** é uma API simples desenvolvida com Node.js, TypeScript e Express, estruturada com foco em uma arquitetura limpa, modular e escalável. O projeto foi desenvolvido no contexto do Trabalho Prático 1 (TP1) da disciplina Gerência de Configuração e Evolução de Software, com o objetivo de aplicar, de forma prática, conceitos fundamentais como Gestão de Configuração, Integração Contínua (CI), Entrega Contínua (CD), empacotamento, testes automatizados e implantação de software.

## Requisitos

- 3 rotas principais da API: `/users`, `/tasks`, `/reports`
- Arquitetura limpa com separação de responsabilidades
- TypeScript para type safety
- Testes unitários com Jest
- Pipeline de CI/CD completo
- Empacotamento com Docker

## Estrutura do Projeto

```
gcs-devops/
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml       # Pipeline GitHub Actions
│   ├── PIPELINE.md         # Documentação do pipeline
│   └── RENDER.md           # Guia de deploy no Render
├── src/
│   ├── controllers/        # Handlers das requisições HTTP
│   ├── services/           # Lógica de negócio
│   ├── routes/             # Definição de rotas
│   ├── models/             # Interfaces e tipos TypeScript
│   ├── utils/              # Funções auxiliares
│   ├── config/             # Configurações (Swagger)
│   ├── tests/              # Testes (unit, integration, e2e)
│   ├── app.ts              # Configuração do Express
│   └── server.ts           # Inicialização do servidor
├── Dockerfile              # Imagem Docker multi-stage
├── .dockerignore           # Arquivos ignorados no build
├── render.yaml             # Configuração de deploy Render
├── playwright.config.ts    # Configuração E2E
├── jest.config.js          # Configuração testes Jest
├── tsconfig.json           # Configuração TypeScript
├── package.json            # Dependências e scripts
└── README.md
```

## Controle de Versão

O projeto utiliza **Git** com estratégia de branching simplificada:

- **Branch principal**: `main` (protegida)
- **Commits**: Seguem padrão conventional commits e validações automáticas
  - `feat:` nova funcionalidade
  - `fix:` correção de bug
  - `docs:` documentação
  - `style:` formatação sem alterar lógica
  - `refactor:` refatoração sem bug/feature
  - `perf:` melhoria de performance
  - `test:` adição/modificação de testes
  - `build:` build/dependências
  - `ci:` arquivos/scripts de CI
  - `chore:` tarefas de manutenção
  - `revert:` revert de commit

### Diretrizes de Commit

Este projeto utiliza commits semânticos (Conventional Commits) e validação automática via Husky + Commitlint.

Formato das mensagens:

```
<type>: <description>

[optional body]

[optional footer]
```

Exemplos:

```bash
feat: Adiciona endpoint para criação de usuários
fix: Corrige validação de email no UserService
docs: Atualiza README com instruções de instalação
test: Adiciona testes unitários para TaskController
refactor: Reorganiza estrutura de pastas dos models
```

Validações automáticas de pré-commit:

- Verificação do formato da mensagem (`commitlint`)
- Execução de testes unitários (`npm run test:unit`)
- `lint-staged` nos arquivos modificados

Arquivos de configuração relevantes:

- `.commitlintrc.json` — regras de commits semânticos
- `.husky/pre-commit` — executa testes e lint-staged
- `.husky/commit-msg` — valida a mensagem de commit
- `package.json` — scripts e lint-staged

**Fluxo de trabalho:**

1. Desenvolva localmente
2. Execute testes: `npm test`
3. Commit e push para `main`
4. Pipeline CI/CD executa automaticamente

## Instalação e Execução

### Pré-requisitos

- Node.js (v20 ou superior)
- npm ou yarn
- Docker (opcional, para containerização)

### Instalação

```bash
# Instalar dependências
npm install
```

### Executar

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Testes
npm test
```

## Documentação da API (Swagger)

A API possui documentação interativa completa usando Swagger/OpenAPI.

### Acessar a documentação:

**Ambiente de Desenvolvimento/Homologação:**

Após iniciar o servidor localmente, acesse:

```
http://localhost:3000/api-docs
```

A interface Swagger permite:

- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente no navegador
- Ver exemplos de request/response
- Verificar schemas e validações

## Endpoints da API

### Base URL

```
http://localhost:3000/api
```

### Users (Usuários)

- `POST /api/users` - Criar novo usuário
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Tasks (Tarefas)

- `POST /api/tasks` - Criar nova tarefa
- `GET /api/tasks` - Listar todas as tarefas (suporta filtros: `?userId=xxx`, `?status=xxx`)
- `GET /api/tasks/:id` - Buscar tarefa por ID
- `GET /api/tasks/statistics` - Obter estatísticas de tarefas
- `GET /api/tasks/overdue` - Listar tarefas atrasadas
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Reports (Relatórios)

- `POST /api/reports` - Gerar novo relatório
- `GET /api/reports` - Listar todos os relatórios (suporta filtro: `?type=xxx`)
- `GET /api/reports/:id` - Buscar relatório por ID
- `GET /api/reports/statistics` - Obter estatísticas de relatórios
- `DELETE /api/reports/:id` - Deletar relatório

## Exemplos de Uso

### Criar um Usuário

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user"
  }'
```

### Criar uma Tarefa

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar nova feature",
    "description": "Desenvolver API de notificações",
    "priority": "high",
    "assignedTo": "user_123",
    "createdBy": "user_456",
    "dueDate": "2025-12-31T23:59:59.000Z"
  }'
```

### Gerar um Relatório

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "type": "weekly",
    "generatedBy": "user_123",
    "startDate": "2025-11-01T00:00:00.000Z",
    "endDate": "2025-11-30T23:59:59.000Z"
  }'
```

## Testes

O projeto possui uma suíte completa de testes automatizados em 3 níveis:

### Testes Unitários (`unit/`)

- **Services**: UserService, TaskService, ReportService (20 testes)
- **Utils**: validators, formatters, helpers (62 testes)
- Testa funções e classes isoladas
- **82 testes** validando funções e classes isoladas
- Cobertura de services, utils, validators e formatters
- Execução rápida (~2s)

### Testes de Integração (`integration/`)

- **API Endpoints**: Users, Tasks, Reports (30 testes)
- Testes de CRUD completos para Users, Tasks e Reports com SuperTest
- Validação de fluxos e respostas HTTP
- **30 testes** validando endpoints da API

### Testes E2E (End-to-End) (`e2e/`)

- **Fluxo Completo**: Criar usuário → tarefa → relatório (16 cenários)
- **Validações e Erros**: Tratamento de erros e validações (8 cenários)
- Simula uso real da aplicação com Playwright
- **24 testes** simulando fluxos reais de uso
- Fluxo completo: Criar usuário → tarefa → relatório → cleanup
- Validação de erros e tratamento de exceções
- Relatórios visuais HTML

### Executar Testes

```bash
# Todos os testes unitários e de integração
npm test

# Com cobertura
npm run test:coverage

# Apenas unitários
npm test -- unit/

# Apenas integração
npm test -- integration/

# Testes E2E (End-to-End)
npm run test:e2e

# E2E com interface visual
npm run test:e2e:ui

# Ver relatório dos testes E2E
npm run test:e2e:report
```

## Tecnologias Utilizadas

**Linguagem & Plataforma**

- Node.js
- TypeScript
- Express.js

**Testes**

- Jest (testes unitários)
- SuperTest (testes de integração)
- Playwright (testes E2E/aceitação)

**Pipeline CI/CD**

- GitHub Actions

**Empacotamento & Deploy**

- Docker
- Render

## Pipeline CI/CD e Deploy

### Automação Completa

O projeto implementa pipeline CI/CD completo com **GitHub Actions**:

**Etapas:**

1. **Commit**: Build + Testes Unitários + Testes de Integração
2. **Acceptance**: Testes E2E com Playwright
3. **Release**: Build Docker + Push Docker Hub + Deploy Render
4. **Validation**: Testes de health check do container

**Triggers:**

- Execução automática a cada push para `main`
- Validação em pull requests

**Artefatos gerados:**

- Código compilado (dist/)
- Relatórios de cobertura
- Relatórios E2E Playwright
- Imagem Docker
- Pacote npm (.tgz)

### Estratégia de Empacotamento

**Docker Multi-Stage Build:**

- **Stage 1 (Builder)**: Instala todas dependências + compila TypeScript
- **Stage 2 (Production)**: Apenas dependências de produção + código compilado
- **Resultado**: Imagem otimizada (~150MB) com Node.js 20 Alpine

**Tags da imagem:**

- `latest`: Versão mais recente da branch main
- `main-<sha>`: Versão específica por commit

### Implantação

**Render (Produção):**

- Deploy automático via webhook após sucesso do pipeline
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check: `/api/health`
- URL: `https://gcs-devops-api.onrender.com`

**Docker Hub:**

- Imagens publicadas automaticamente
- Disponível para pull: `docker pull <usuario>/gcs-devops:latest`

Para ler a documentação completa sobre a configuração da pipeline, deploy e Docker, [clique aqui](.github/PIPELINE.md).

## Licença

Este projeto está licenciado nos termos da Creative Commons.
