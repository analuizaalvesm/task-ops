# Deploy no Render

Este guia explica como fazer o deploy da aplicação no Render.

## Configuração Inicial

### 1. Criar Conta no Render

Acesse [render.com](https://render.com) e crie uma conta gratuita.

### 2. Conectar Repositório GitHub

1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório GitHub `analuizaalvesm/gcs-devops`
4. Clique em "Connect"

### 3. Configurar o Serviço

O Render detectará automaticamente o arquivo `render.yaml` na raiz do projeto com as seguintes configurações:

```yaml
services:
  - type: web
    name: gcs-devops-api
    env: node
    region: oregon
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
    healthCheckPath: /health
```

**Observações importantes:**

- **Build Command**: `npm install && npm run build` - Instala dependências e compila TypeScript
- **Start Command**: `npm start` - Executa `node dist/server.js`
- **Health Check**: `/health` - Endpoint para verificação de saúde

### 4. Variáveis de Ambiente (Opcional)

Se necessário, adicione variáveis de ambiente adicionais:

1. Acesse `Settings` > `Environment`
2. Adicione as variáveis necessárias

### 5. Deploy Manual

Clique em "Create Web Service" e aguarde o deploy inicial.

## Deploy Automático via GitHub Actions

O pipeline CI/CD já está configurado para fazer deploy automático no Render após sucesso de todos os testes.

### Configurar Deploy Hook

1. No Render, acesse seu serviço
2. Vá em `Settings` > `Deploy Hook`
3. Copie a URL gerada (formato: `https://api.render.com/deploy/srv-xxxxx?key=xxxxx`)

### Adicionar Secret no GitHub

1. Acesse seu repositório no GitHub
2. Vá em `Settings` > `Secrets and variables` > `Actions`
3. Clique em "New repository secret"
4. Nome: `RENDER_DEPLOY_HOOK`
5. Value: Cole a URL do Deploy Hook
6. Clique em "Add secret"

### Fluxo de Deploy Automático

Após configurar o secret, o deploy acontecerá automaticamente:

```
Push para main
    ↓
GitHub Actions executa pipeline
    ↓
Testes passam (unit, integration, E2E)
    ↓
Build Docker e push para Docker Hub
    ↓
Trigger deploy no Render via webhook
    ↓
Render faz pull do código, build e deploy
```

## Verificar Deploy

### URL da Aplicação

Após o deploy, sua aplicação estará disponível em:

```
https://gcs-devops-api.onrender.com
```

(O Render fornece um domínio gratuito `.onrender.com`)

### Testar Endpoints

```bash
# Health check
curl https://gcs-devops-api.onrender.com/health

# Swagger docs
https://gcs-devops-api.onrender.com/api-docs

# API endpoints
curl https://gcs-devops-api.onrender.com/api/users
```

## Troubleshooting

### Erro: "Cannot find module"

**Problema**: Render não encontra o arquivo compilado

**Solução**:

- Verifique se `typescript` está nas `dependencies` (não apenas em `devDependencies`)
- Confirme que o `buildCommand` inclui `npm run build`
- Verifique se o `tsconfig.json` tem `"outDir": "./dist"`

### Erro: "Application failed to respond"

**Problema**: Aplicação não responde no health check

**Solução**:

- Verifique se a variável `PORT` está configurada corretamente
- Confirme que o endpoint `/health` está funcionando
- Verifique os logs no Render: `Logs` > `Deploy Logs` ou `Runtime Logs`

### Build Falha

**Problema**: Erro durante o build no Render

**Solução**:

- Execute `npm run build` localmente para verificar erros
- Verifique se todas as dependências estão em `package.json`
- Revise os logs de build no Render

### Aplicação Hiberna (Free Tier)

**Problema**: No plano gratuito, o Render hiberna serviços inativos

**Comportamento**:

- Após 15 minutos de inatividade, o serviço hiberna
- Primeira requisição após hibernação pode levar 30-60s para responder
- Requisições subsequentes são normais

**Solução**:

- Fazer upgrade para plano pago ($7/mês) para evitar hibernação
- Ou aceitar o comportamento do free tier

## Logs

### Visualizar Logs em Tempo Real

No dashboard do Render:

1. Acesse seu serviço
2. Clique em `Logs`
3. Escolha:
   - **Deploy Logs**: Logs do processo de build/deploy
   - **Runtime Logs**: Logs da aplicação em execução

### Logs via CLI

Instalar Render CLI (opcional):

```bash
npm install -g @render/cli

# Login
render login

# Ver logs
render logs -s gcs-devops-api -f
```

## Rollback

Se houver problemas após um deploy:

1. Acesse `Deploys` no dashboard
2. Encontre o deploy anterior estável
3. Clique em "Rollback to this version"

## Monitoramento

O Render fornece métricas básicas gratuitas:

- CPU Usage
- Memory Usage
- Request Count
- Response Time

Acesse em: `Metrics` no dashboard do serviço

## Custos

**Plano Free**:

- 750 horas/mês gratuitas
- Hibernação após inatividade
- 512 MB RAM
- Compartilhado

**Plano Starter ($7/mês)**:

- Sem hibernação
- 512 MB RAM
- Dedicado

## Próximos Passos

- Configurar domínio customizado
- Adicionar monitoramento externo (UptimeRobot, Pingdom)
- Configurar alertas de erro
- Implementar staging environment
