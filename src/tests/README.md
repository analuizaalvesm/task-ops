# Estrutura de Testes

Este diretório contém todos os testes do projeto organizados de forma clara e profissional.

## 📁 Estrutura

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
└── integration/              # Testes de integração
    ├── users.integration.test.ts
    ├── tasks.integration.test.ts
    └── reports.integration.test.ts
```

## 🧪 Tipos de Testes

### Testes Unitários (`unit/`)

Testam funções e classes individuais de forma isolada:

- **services/**: Testa a lógica de negócio dos serviços
- **utils/**: Testa funções utilitárias (validação, formatação, helpers)

### Testes de Integração (`integration/`)

Testam o fluxo completo da API com SuperTest:

- Requisições HTTP reais
- Validação de respostas
- Teste de fluxos completos (CRUD)

## 🚀 Como Executar

```bash
# Todos os testes
npm test

# Com cobertura
npm run test:coverage

# Apenas testes unitários
npm test -- unit/

# Apenas testes de integração
npm test -- integration/

# Arquivo específico
npm test -- UserService.test.ts
```

## 📊 Cobertura Atual

- **Total**: ~74%
- **Services**: 81%
- **Utils**: 98%
- **Controllers**: 58%
- **Routes**: 89%

## 📝 Convenções

1. Arquivos de teste devem ter extensão `.test.ts`
2. Testes de integração devem ter sufixo `.integration.test.ts`
3. Um arquivo de teste por módulo/serviço
4. Use `describe` para agrupar testes relacionados
5. Use nomes descritivos para os testes (`should...`, `when...`)
