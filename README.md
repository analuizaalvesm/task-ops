# Trabalho Prático 1 - Gerência de Configuração e Evolução de Software

Backend API desenvolvida com **Node.js**, **TypeScript** e **Express**, seguindo uma arquitetura limpa e escalável.

Este projeto foi desenvolvido como parte do Trabalho Prático 1 (TP1) da disciplina Gerência de Configuração e Evolução de Software. O objetivo é aplicar conceitos de Gestão de Configuração, Integração Contínua (CI), Entrega Contínua (CD), Empacotamento, Testes Automatizados e Implantação.

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
├── src/
│   ├── controllers/        # Handlers das requisições HTTP
│   │   ├── UserController.ts
│   │   ├── TaskController.ts
│   │   └── ReportController.ts
│   ├── services/           # Lógica de negócio
│   │   ├── UserService.ts
│   │   ├── TaskService.ts
│   │   └── ReportService.ts
│   ├── routes/             # Definição de rotas
│   │   ├── users.ts
│   │   ├── tasks.ts
│   │   ├── reports.ts
│   │   └── index.ts
│   ├── models/             # Interfaces e tipos TypeScript
│   │   ├── User.ts
│   │   ├── Task.ts
│   │   ├── Report.ts
│   │   └── Common.ts
│   ├── utils/              # Funções auxiliares
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── logger.ts
│   │   └── helpers.ts
│   ├── config/             # Configurações
│   │   └── swagger.ts
│   ├── tests/              # Testes
│   │   ├── unit/          # Testes unitários
│   │   │   ├── services/  # Testes de serviços
│   │   │   │   ├── UserService.test.ts
│   │   │   │   ├── TaskService.test.ts
│   │   │   │   └── ReportService.test.ts
│   │   │   └── utils/     # Testes de utilitários
│   │   │       ├── validators.test.ts
│   │   │       ├── formatters.test.ts
│   │   │       └── helpers.test.ts
│   │   ├── integration/   # Testes de integração
│   │   │   ├── users.integration.test.ts
│   │   │   ├── tasks.integration.test.ts
│   │   │   └── reports.integration.test.ts
│   │   ├── e2e/           # Testes E2E (End-to-End)
│   │   │   ├── complete-flow.spec.ts
│   │   │   ├── error-handling.spec.ts
│   │   │   └── README.md
│   │   └── README.md
│   ├── app.ts              # Configuração do Express
│   └── server.ts           # Inicialização do servidor
├── playwright.config.ts    # Configuração do Playwright
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Instalação e Execução

### Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn

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

Após iniciar o servidor, acesse:

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

### Health Check

```
GET /api/health
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

### Testes de Integração (`integration/`)

- **API Endpoints**: Users, Tasks, Reports (30 testes)
- Testes completos de CRUD com SuperTest
- Validação de fluxos e respostas HTTP

### Testes E2E (End-to-End) (`e2e/`)

- **Fluxo Completo**: Criar usuário → tarefa → relatório (16 cenários)
- **Validações e Erros**: Tratamento de erros e validações (8 cenários)
- Simula uso real da aplicação com Playwright

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
- Render ou Railway (deploy gratuito - a implementar)

## Testes Automatizados

O projeto implementa testes automatizados em **três níveis**, conforme requisitos do trabalho:

### 1. Testes de Unidade (Jest)

- **82 testes** validando funções e classes isoladas
- Cobertura de services, utils, validators e formatters
- Execução rápida (~2s)

### 2. Testes de Integração (SuperTest)

- **30 testes** validando endpoints da API
- Testes de CRUD completos para Users, Tasks e Reports
- Validação de respostas HTTP e persistência

### 3. Testes de Aceitação/E2E (Playwright)

- **24 testes** simulando fluxos reais de uso
- Fluxo completo: Criar usuário → tarefa → relatório → cleanup
- Validação de erros e tratamento de exceções
- Relatórios visuais HTML

## Contagem de Arquivos e Funções

### Estatísticas do Projeto:

- **Total de arquivos**: 20+
- **Total de funções/métodos**: 50+

### Distribuição Detalhada:

- **Controllers** (3 arquivos): 15 métodos

  - UserController: 5 métodos (create, getAll, getById, update, delete)
  - TaskController: 7 métodos (create, getAll, getById, update, delete, getStatistics, getOverdue)
  - ReportController: 5 métodos (generate, getAll, getById, delete, getSummaryStatistics)

- **Services** (3 arquivos): 18 métodos

  - UserService: 6 métodos (createUser, getAllUsers, getUserById, updateUser, deleteUser, getActiveUsersCount)
  - TaskService: 8 métodos (createTask, getAllTasks, getTaskById, updateTask, deleteTask, getTasksByUser, getTasksByStatus, getTaskStatistics)
  - ReportService: 6 métodos (generateReport, getAllReports, getReportById, deleteReport, getReportsByType, getSummaryStatistics)

- **Utils** (4 arquivos): 17+ funções auxiliares

  - validators.ts: 5 funções (isValidEmail, isNotEmpty, isFutureDate, hasMinLength, hasRequiredFields)
  - formatters.ts: 6 funções (formatDate, formatDateReadable, capitalizeFirstLetter, formatPercentage, truncateString, objectToQueryString)
  - logger.ts: 4 métodos (info, warn, error, debug)
  - helpers.ts: 5 funções (generateId, delay, deepClone, safeJsonParse, isEmpty)

- **Routes** (4 arquivos): Organização das rotas da API
- **Models** (4 arquivos): Definição de tipos e interfaces TypeScript
- **Config** (1 arquivo): Configuração do Swagger/OpenAPI
- **Tests** (9 arquivos):
  - 6 arquivos de testes unitários (services + utils)
  - 3 arquivos de testes de integração (API endpoints)

## Licença

CC0 1.0 Universal

## Pipeline CI/CD

Este projeto possui um pipeline completo de CI/CD implementado com GitHub Actions. O pipeline é executado automaticamente em todo push para a branch `main`.

### Etapas do Pipeline

#### 1. Commit (Build e Testes)

- Instala dependências
- Compila TypeScript
- Executa testes unitários
- Executa testes de integração
- Gera relatório de cobertura

#### 2. Acceptance Tests (Testes E2E)

- Instala navegadores Playwright
- Executa testes de aceitação
- Gera relatórios visuais

#### 3. Release (Empacotamento e Deploy)

- Cria pacote npm
- Constrói imagem Docker
- Publica no Docker Hub
- Deploy automático no Render (opcional)

#### 4. Test Container (Opcional)

- Testa a imagem Docker
- Valida health check
- Verifica logs do container

### Configuração do Pipeline

Para configurar o pipeline no seu repositório:

1. Configure os secrets no GitHub:

   - `DOCKER_USERNAME`: seu usuário do Docker Hub
   - `DOCKER_PASSWORD`: seu token do Docker Hub
   - `RENDER_DEPLOY_HOOK`: URL do deploy hook do Render (opcional)

2. Faça push para a branch `main` e o pipeline será executado automaticamente

Para mais detalhes, consulte: [.github/PIPELINE.md](.github/PIPELINE.md)

### Status do Pipeline

![CI/CD](https://github.com/analuizaalvesm/gcs-devops/actions/workflows/ci-cd.yml/badge.svg)

## Docker

### Build Local

```bash
docker build -t gcs-devops .
```

### Executar Container

```bash
docker run -p 3000:3000 gcs-devops
```

### Pull do Docker Hub

```bash
docker pull <seu-usuario>/gcs-devops:latest
```
