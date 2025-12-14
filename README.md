# Criando Microserviços escaláveis 🚀

## Objetivo do projeto

- Um guia prático e conciso sobre conceitos, termos e decisões arquiteturais ao criar microserviços — focado na infraestrutura da aplicação (deploy, comunicação, observabilidade, serviços de mensageria), não apenas em patterns de código.

### Definição de microserviços : Serviços independentemente implantáveis, que funcionam de maneira independente

## Por que microserviços?

- Serviços independentes e implantáveis separadamente.
- Modelagem por domínio de negócio (cada serviço é responsável por um contexto).
- Escalabilidade, isolamento de falhas e escolha tecnológica por serviço.

## Quando usar microserviços ✅❗

- Equipe grande com múltiplos domínios de negócio.
- Necessidade de escalar partes da aplicação de forma independente.
- Requisitos diferentes de infraestrutura ou tecnologia entre módulos.
- Projetos com alto ritmo de deploy e release.

### Exemplos de aplicações que costumam usar microserviços

- E-commerce 🛒 — catálogo, carrinho, pagamentos, recomendações, busca.
- Plataformas de streaming 🎬/🎧 — ingestão, processamento de mídia, autenticação, billing.
- Fintechs 💳 — contas, pagamentos, risco, conciliação, notificações (alta separação de contexto e compliance).
- SaaS multi-tenant ☁️ — gerenciamento de tenants, billing, métricas, integração.
- IoT / Telemetria 📡 — ingestão massiva, processamento em tempo real, armazenamento frio.
- Jogos online / Real-time multiplayer 🎮 — matchmaking, jogo em si, perfil, leaderboard.
- Ad tech / Real-time bidding 📈 — baixa latência, alta concorrência e separação clara de responsabilidades.

## Termos técnicos importantes para se trabalhar com microsserviços(rápido) 🧭

- API Gateway 🛡️: Ponto único de entrada, roteamento, autenticação e rate limiting.
- Message Broker 📬: Mensageria assíncrona (Kafka, RabbitMQ) para integrações desacopladas.
- Service Discovery 🔎: Localizar instâncias de serviço dinamicamente.
- Distributed Tracing 🔗: Rastrear uma requisição através de serviços (traceId).
- Idempotência 🔁: Garantir que operações repetidas não gerem efeitos colaterais.
- Circuit Breaker ⛔: Falhar rápido quando um serviço está degradado.
- Saga Pattern 🧾: Gerenciar transações distribuídas com compensações.
- Observability (logs, métricas, traces) 📊: Necessário para operar em escala.

### Vantagens principais ✅

- Escala e isolamento de falhas.
- Possibilidade de deploy e rollback independentes.
- Escolha tecnológica por serviço.
- Menor blast radius em incidentes.

### Desafios comuns ⚠️

- Complexidade operacional (CI/CD, deploys, monitoring).
- Replicação de dados e sincronização eventual.
- Debugging/distributed tracing.
- Latência por chamadas remotas.
- Gerenciamento de transações distribuídas.

### Padrões e boas práticas rápidas 🛠️

- Comece pequeno: usar Strangler Pattern para migrar monólitos.
- Externalize configuração (Consul, Vault).
- Automatize CI/CD (pipelines por serviço).
- Tenha observability desde o início (tracing, métricas, logs estruturados).
- Use message broker para integrações assíncronas quando possível.
- Implemente timeouts, retries e circuit breakers.
- Defina contratos de API e versionamento.

## Health Checks, Escalonamento Horizontal e Blue-Green Deployment ⬆️🔵🟢

- Um health-check é um endpoint simples que indica se a instância está pronta para receber requisições:

```javascript
app.get("/health", () => {
  return "OK";
});
```

## Boas práticas a serem seguidas em projetos

- Não adote microserviços por moda — é sempre muito importante avaliar o custo operacional vs. benefício.
- Priorize clareza nos domínios: separe por contexto de negócio, não por camada técnica.
- Use testes de contrato (consumer-driven contracts) para reduzir quebra de integrações.
