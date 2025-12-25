# Configuração do GitHub Actions CI/CD

Este projeto utiliza GitHub Actions para automação completa do pipeline de CI/CD.

## Pipeline Stages

### 1. Commit (Build e Testes)

Executado em todos os pushes e pull requests para a branch `main`:

- Instala dependências com `npm ci`
- Compila o TypeScript com `npm run build`
- Executa testes unitários
- Executa testes de integração
- Gera relatório de cobertura
- Faz upload dos artefatos de build e cobertura

### 2. Acceptance Tests (Testes E2E)

Executado após o sucesso da etapa Commit:

- Instala dependências
- Instala navegadores do Playwright
- Executa testes E2E com `npm run test:e2e`
- Faz upload dos relatórios do Playwright

### 3. Release (Empacotamento e Deploy)

Executado apenas em pushes para `main`, após sucesso de todas as etapas anteriores:

- Cria pacote npm (tarball)
- Configura Docker Buildx
- Faz login no Docker Hub
- Constrói e publica imagem Docker com tags:
  - `latest` (branch principal)
  - `main-<sha>` (commit específico)
- **Deploy automático no Render** (se configurado):
  - Envia webhook para trigger de deploy
  - Render faz pull do código atualizado
  - Executa build command: `npm install && npm run build`
  - Inicia aplicação com: `npm start`

### 4. Test Container (Opcional)

Executado após o Release:

- Faz pull da imagem Docker publicada
- Executa o container
- Testa o health check endpoint
- Verifica logs do container

## Configuração de Secrets

Para o pipeline funcionar corretamente, configure os seguintes secrets no GitHub:

### Obrigatórios (Docker Hub)

1. Acesse: `Settings` > `Secrets and variables` > `Actions`
2. Adicione os seguintes secrets:

```
DOCKER_USERNAME: seu_usuario_dockerhub
DOCKER_PASSWORD: seu_token_dockerhub
```

Para criar um token no Docker Hub:

- Acesse: https://hub.docker.com/settings/security
- Clique em "New Access Token"
- Dê um nome descritivo (ex: "github-actions")
- Copie o token gerado

### Opcional (Deploy no Render)

Se quiser deploy automático no Render após sucesso do pipeline:

```
RENDER_DEPLOY_HOOK: https://api.render.com/deploy/srv-xxxxx?key=xxxxx
```

**Como obter o Deploy Hook:**

1. Acesse seu serviço no [Render Dashboard](https://dashboard.render.com)
2. Selecione o serviço `gcs-devops-api`
3. Vá em `Settings` > `Deploy Hook`
4. Clique em "Create Deploy Hook"
5. Copie a URL gerada (formato: `https://api.render.com/deploy/srv-xxxxx?key=xxxxx`)

**Como configurar no GitHub:**

1. Acesse seu repositório no GitHub
2. Vá em `Settings` > `Secrets and variables` > `Actions`
3. Clique em "New repository secret"
4. Nome: `RENDER_DEPLOY_HOOK`
5. Value: Cole a URL do Deploy Hook
6. Clique em "Add secret"

**Importante:**

- O deploy hook é **opcional** - mesmo sem ele, você pode fazer deploy manual no Render
- O Render detecta automaticamente o arquivo `render.yaml` na raiz do projeto
- Após configurar, o deploy acontecerá automaticamente a cada push bem-sucedido para `main`
- O Render faz seu próprio build independente da imagem Docker (usa Node.js diretamente)

## Estrutura dos Jobs

```
commit (Build + Unit + Integration Tests)
    ↓
acceptance-tests (E2E Tests)
    ↓
release (Docker Build + Push + Deploy)
    ↓
test-container (Container Health Check)
```

## Como Usar

### Executar o Pipeline

O pipeline é acionado automaticamente quando você faz push para `main`:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### Visualizar o Pipeline

1. Acesse seu repositório no GitHub
2. Clique na aba "Actions"
3. Selecione o workflow "CI/CD Pipeline"
4. Visualize os logs de cada job

### Download de Artefatos

Após a execução do pipeline, você pode baixar:

- **build-dist**: Código compilado (TypeScript → JavaScript)
- **coverage-report**: Relatório de cobertura de testes
- **playwright-report**: Relatório HTML dos testes E2E
- **npm-package**: Pacote npm (.tgz)

## Imagem Docker

### Pull da Imagem

```bash
docker pull <seu-usuario>/gcs-devops:latest
```

### Executar Localmente

```bash
docker run -p 3000:3000 <seu-usuario>/gcs-devops:latest
```

### Verificar Health

```bash
curl http://localhost:3000/api/health
```

## Deploy no Render

### Fluxo de Deploy Automático

Quando o pipeline é executado com sucesso:

1. **GitHub Actions** executa todos os testes
2. **Docker Hub** recebe a nova imagem publicada
3. **Render** recebe webhook de deploy (se configurado)
4. **Render** faz pull do código do repositório GitHub
5. **Render** executa o build:
   ```bash
   npm install && npm run build
   ```
6. **Render** inicia a aplicação:
   ```bash
   npm start
   ```

### Configuração do Render

O projeto inclui o arquivo `render.yaml` com as seguintes configurações:

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
    healthCheckPath: /api/health
```

### Deploy Manual no Render

Se você não configurou o webhook, pode fazer deploy manual:

1. Acesse o [Render Dashboard](https://dashboard.render.com)
2. Selecione seu serviço
3. Clique em "Manual Deploy" > "Deploy latest commit"

### Verificar Status do Deploy

**Via Dashboard:**

- Acesse `Deploys` para ver histórico
- Acesse `Logs` > `Deploy Logs` para ver o processo de build
- Acesse `Logs` > `Runtime Logs` para ver logs da aplicação

**Via API (após deploy):**

```bash
# Testar se a aplicação está respondendo
curl https://gcs-devops-api.onrender.com/api/health

# Acessar Swagger docs
https://gcs-devops-api.onrender.com/api-docs
```

### Importante sobre o Render Free Tier

- **Hibernação**: Serviços inativos hibernam após 15 minutos
- **Cold Start**: Primeira requisição após hibernação leva 30-60s
- **Build Time**: Limite de 15 minutos para o build
- **RAM**: 512 MB disponíveis

Para mais detalhes, consulte: [.github/RENDER.md](.github/RENDER.md)

## Otimizações Implementadas

1. **Cache de dependências**: Usa cache do npm para acelerar instalações
2. **Docker Layer Caching**: Usa GitHub Actions cache para layers Docker
3. **Multi-stage build**: Dockerfile otimizado com múltiplos stages
4. **Artefatos compartilhados**: Jobs compartilham artefatos entre si
5. **Execução paralela**: Testes E2E executam em paralelo com outros jobs quando possível
6. **Conditional execution**: Jobs de deploy só executam em pushes para main

## Troubleshooting

### Erro no Job de Commit (CI)

- Verifique se todos os testes passam localmente: `npm test`
- Verifique se o build funciona: `npm run build`

### Erro nos Testes de Aceitação (E2E)

- Execute os testes E2E localmente: `npm run test:e2e`
- Verifique se o Playwright está instalado corretamente

### Erro no Job de Release

- Verifique se os secrets do Docker Hub estão configurados
- Verifique se o Dockerfile está correto: `docker build -t test .`
- Se o deploy no Render falhar, verifique os logs no dashboard do Render

### Erro no Deploy no Render

- Verifique se o `RENDER_DEPLOY_HOOK` está configurado corretamente
- Confirme que o webhook está ativo no Render
- Verifique os Deploy Logs no dashboard do Render para erros específicos
- Certifique-se de que `typescript` está nas `dependencies` do `package.json`
- Verifique se o build local funciona: `npm install && npm run build`

### Erro na Inicialização do Container

- Verifique os logs: `docker logs <container-id>`
- Teste localmente: `docker run -p 3000:3000 <imagem>`
