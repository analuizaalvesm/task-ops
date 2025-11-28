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
- Constrói e publica imagem Docker
- Faz deploy automático no Render (se configurado)

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

Se quiser deploy automático no Render:

```
RENDER_DEPLOY_HOOK: https://api.render.com/deploy/srv-xxxxx?key=xxxxx
```

Para obter o Deploy Hook no Render:

- Acesse seu serviço no Render
- Vá em `Settings` > `Deploy Hook`
- Copie a URL gerada

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
curl http://localhost:3000/health
```

## Otimizações Implementadas

1. **Cache de dependências**: Usa cache do npm para acelerar instalações
2. **Docker Layer Caching**: Usa GitHub Actions cache para layers Docker
3. **Multi-stage build**: Dockerfile otimizado com múltiplos stages
4. **Artefatos compartilhados**: Jobs compartilham artefatos entre si
5. **Execução paralela**: Testes E2E executam em paralelo com outros jobs quando possível
6. **Conditional execution**: Jobs de deploy só executam em pushes para main

## Troubleshooting

### Pipeline falha no job "commit"

- Verifique se todos os testes passam localmente: `npm test`
- Verifique se o build funciona: `npm run build`

### Pipeline falha no job "acceptance-tests"

- Execute os testes E2E localmente: `npm run test:e2e`
- Verifique se o Playwright está instalado corretamente

### Pipeline falha no job "release"

- Verifique se os secrets do Docker Hub estão configurados
- Verifique se o Dockerfile está correto: `docker build -t test .`

### Container não inicia

- Verifique os logs: `docker logs <container-id>`
- Teste localmente: `docker run -p 3000:3000 <imagem>`

## Monitoramento

O pipeline gera badges que podem ser adicionados ao README:

```markdown
![CI/CD](https://github.com/<usuario>/<repo>/actions/workflows/ci-cd.yml/badge.svg)
```

## Próximos Passos

- Adicionar testes de performance
- Implementar deploy em staging antes de produção
- Adicionar notificações (Slack, Discord, Email)
- Implementar rollback automático em caso de falhas
- Adicionar análise de segurança (SAST/DAST)

