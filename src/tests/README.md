# Estrutura de Testes

Este diretório contém todos os testes do projeto organizados em 3 níveis.

## Estrutura

```
tests/
├── unit/                      # Testes unitários
│   ├── services/             # Testes de serviços
│   │   ├── UserService.test.ts
│   │   ├── TaskService.test.ts
│   │   └── ReportService.test.ts
│   └── utils/                # Testes de utilitários
│       ├── validators.test.ts
│       ├── formatters.test.ts
│       └── helpers.test.ts
├── integration/              # Testes de integração
│   ├── users.integration.test.ts
│   ├── tasks.integration.test.ts
│   └── reports.integration.test.ts
└── e2e/                      # Testes E2E (End-to-End)
    ├── complete-flow.spec.ts
    └── error-handling.spec.ts
```

## Tipos de Testes

### Testes Unitários (unit/)

Testam funções e classes individuais de forma isolada:

- **services/**: Testa a lógica de negócio dos serviços
- **utils/**: Testa funções utilitárias (validação, formatação, helpers)
- **Framework**: Jest
- **Velocidade**: Muito rápido (~2s)

### Testes de Integração (integration/)

Testam o fluxo completo da API com SuperTest:

- Requisições HTTP reais
- Validação de respostas
- Teste de fluxos completos (CRUD)
- **Framework**: Jest + SuperTest
- **Velocidade**: Rápido (~3s)

### Testes E2E (e2e/)

Testam fluxos completos de uso da aplicação com Playwright:

- Simulação de cenários reais de usuários
- Integração entre todos os módulos
- Validação de fluxos complexos
- **Framework**: Playwright
- **Velocidade**: Mais lento (~8s)

#### Suítes de Teste E2E

**1. complete-flow.spec.ts** - Fluxo Completo (16 cenários)

Simula um cenário real de uso da aplicação:

```
Criar Usuário → Listar Usuários → Buscar por ID
    ↓
Criar Tarefa → Listar Tarefas → Atualizar Status
    ↓
Obter Estatísticas → Gerar Relatório → Validar Dados
    ↓
Cleanup: Deletar Relatório → Tarefa → Usuário
```

Cobertura:

- Criação de usuário
- Listagem e busca
- Criação e atualização de tarefas
- Estatísticas de tarefas
- Geração de relatórios
- Limpeza de dados

**2. error-handling.spec.ts** - Validações e Erros (8 cenários)

Testa o tratamento de erros e validações:

- Validação de email inválido
- Campos obrigatórios ausentes
- Recursos não encontrados (404)
- Health check da API

## Como Executar

### Testes Unitários e de Integração (Jest)

```bash
# Todos os testes Jest
npm test

# Com cobertura
npm run test:coverage

# Apenas testes unitários
npm test -- unit/

# Apenas testes de integração
npm test -- integration/

# Arquivo específico
npm test -- UserService.test.ts

# Modo watch (re-executa ao salvar)
npm run test:watch
```

### Testes E2E (Playwright)

```bash
# Todos os testes E2E
npm run test:e2e

# Com interface visual
npm run test:e2e:ui

# Com navegador visível
npm run test:e2e:headed

# Ver relatório HTML
npm run test:e2e:report

# Teste específico
npx playwright test complete-flow
npx playwright test error-handling
```

## Estrutura dos Testes E2E

Cada teste E2E segue a estrutura:

```typescript
test("Cenário X: Descrição do teste", async ({ request }) => {
  // 1. Fazer requisição HTTP
  const response = await request.post(`${baseURL}/endpoint`, {
    data: {
      /* payload */
    },
  });

  // 2. Validar status HTTP
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(201);

  // 3. Validar corpo da resposta
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.data).toHaveProperty("id");
});
```

## Configuração Playwright

O arquivo `playwright.config.ts` contém:

- **Servidor de Desenvolvimento**: Inicia automaticamente `npm run dev`
- **Base URL**: `http://localhost:3000`
- **Workers**: 1 (testes sequenciais para manter estado)
- **Retries**: 2 tentativas em ambiente CI
- **Reporter**: HTML com relatório visual

## Debug de Testes E2E

```bash
# Pausar antes de cada teste
npx playwright test --debug

# Ver trace detalhado
npx playwright test --trace on

# Logs do servidor aparecem durante a execução
```
