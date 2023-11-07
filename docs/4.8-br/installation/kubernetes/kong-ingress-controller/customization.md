# Personalizando o Kong Ingress Controller com Serviços Integrados Wallarm

Este artigo orienta você na personalização segura e eficaz do [Kong Ingress Controller com serviços integrados Wallarm][kong-ing-controller-customization-docs].

## Área de Configuração

Kong Ingress Controller com serviços Wallarm integrados baseia-se nos componentes padrão do Kubernetes, portanto, a configuração da solução é em grande parte semelhante à configuração da pilha Kubernetes.

Você pode configurar a solução da seguinte forma:

* Globalmente através `values.yaml` - permite configurar a implantação geral, Kong API Gateway e algumas configurações básicas do Wallarm. Essas configurações se aplicam a todos os recursos de Ingress que os proxies de solução direcionam o tráfego.
* Através das anotações do Ingress - permite ajustar as configurações do Wallarm em uma base por Ingress.

    !!! warning "Suporte para Anotação"
        A anotação Ingress é suportada apenas pela solução baseada no controlador de Ingress de fonte aberta Kong. [A lista de anotações suportadas é limitada](#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* Através da Interface do Usuário do Console Wallarm - permite ajustar as configurações do Wallarm.

## Configuração do Gateway API Kong

A configuração do Kong Ingress Controller para o Gateway API Kong é definida pelos [valores padrão do gráfico Helm](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml). Essa configuração pode ser substituída pelo arquivo `values.yaml` fornecido pelo usuário durante a instalação do `helm` ou `helm upgrade`.

Para personalizar os valores padrão do gráfico Helm, consulte as [instruções oficiais sobre a configuração do Kong e do Controlador de Ingress](https://github.com/Kong/charts/tree/main/charts/kong#configuration).

## Configuração da Camada Wallarm

Você pode configurar a camada Wallarm da solução da seguinte forma:

* Defina a configuração básica através de `values.yaml`: conexão com o Wallarm Cloud, alocação de recursos, fallbacks.
* Ajuste fino da análise de tráfego por base Ingress através de anotações (apenas para a edição de código aberto): modo de filtragem de tráfego, gerenciamento de aplicativos, configuração de multilocação, etc.
* Ajuste fino da análise de tráfego através da Interface do Usuário do Console Wallarm: modo de filtragem de tráfego, notificações sobre eventos de segurança, gerenciamento da fonte da solicitação, mascarar dados sensíveis, permitir certos tipos de ataque, etc.

### Configuração Básica Através `values.yaml`

O arquivo `values.yaml` padrão fornece a seguinte configuração do Wallarm:

```yaml
wallarm:
  image:
    tag: "<WALLARM_NODE_IMAGE_TAG>"
  enabled: true
  apiHost: api.wallarm.com
  apiPort: 443
  apiSSL: true
  token: ""
  fallback: "on"
  tarantool:
    kind: Deployment
    service:
      annotations: {}
    replicaCount: 1
    arena: "0.2"
    livenessProbe:
      failureThreshold: 3
      initialDelaySeconds: 10
      periodSeconds: 10
      successThreshold: 1
      timeoutSeconds: 1
    resources: {}
    podAnnotations:
      sidecar.istio.io/inject: false
  heartbeat:
    resources: {}
  wallarm-appstructure:
    resources: {}
  wallarm-antibot:
    resources: {}
  metrics:
    port: 18080
    enabled: false

    service:
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/path: /wallarm-metrics
        prometheus.io/port: "18080"

      # clusterIP: ""

      ## -- Lista de endereços IP nos quais o serviço stats-exporter está disponível
      ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
      ##
      externalIPs: []

      # loadBalancerIP: ""
      loadBalancerSourceRanges: []
      servicePort: 18080
      type: ClusterIP
      #externalTrafficPolicy: ""
      #nodePort: ""
  addnode:
    resources: {}
  cron:
    jobs:
      exportEnvironment:
        schedule: "0 */1 * * *"
        timeout: 10m
      exportAttacks:
        schedule: "* * * * *"
        timeout: 3h
      exportCounters:
        schedule: "* * * * *"
        timeout: 11m
      bruteDetect:
        schedule: "* * * * *"
        timeout: 6m
      syncIpLists:
        schedule: "* * * * *"
        timeout: 3h
      exportMetrics:
        schedule: "* * * * *"
        timeout: 3h
      syncIpListsSource:
        schedule: "*/5 * * * *"
        timeout: 3h
      syncMarkers:
        schedule: "* * * * *"
        timeout: 1h
    resources: {}
  exportenv:
    resources: {}
  synccloud:
    wallarm_syncnode_interval_sec: 120
    resources: {}
  collectd:
    resources: {}
```

Os principais parâmetros que você pode precisar alterar são:

| Parâmetro | Descrição | Valor Padrão |
| --- | --- | --- |
| `wallarm.enabled` | Permite habilitar ou desabilitar a camada Wallarm. | `true` |
| `wallarm.apiHost` | Servidor API Wallarm:<ul><li>`us1.api.wallarm.com` para a Nuvem dos EUA</li><li>`api.wallarm.com` para a Nuvem da UE</li></ul> | `api.wallarm.com` |
| `wallarm.token` | Token do nó Wallarm. **Obrigatório**. | Vazio |
| `wallarm.fallback` | Se deve executar os serviços do Gateway API Kong se a inicialização do serviço Wallarm falhar. | `on`
| `wallarm.tarantool.replicaCount` | O número de pods em execução para o módulo de pós-análise Wallarm que é o backend de análise de dados local para a solução. | `1`
| `wallarm.tarantool.arena` | Especifica a quantidade de memória alocada para o módulo de pós-análise Wallarm. Recomenda-se configurar um valor suficiente para armazenar dados de solicitação nos últimos 5-15 minutos. | `0.2`
| `wallarm.metrics.enabled` | Esse alternador alterna coleta de informações e métricas. Se [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) estiver instalado no cluster Kubernetes, nenhuma configuração adicional é necessária. | `false`

Outros parâmetros vêm com valores padrão e raramente precisam ser alterados.

### Ajuste fino da análise de tráfego via anotações Ingress (apenas para a edição de código aberto)

Abaixo está a lista de anotações suportadas no controlador de Ingress de código aberto Kong com serviços integrados Wallarm.

!!! info "Prioridades das configurações globais e por Ingress"
    As anotações por Ingress têm precedência sobre os valores do gráfico Helm.

| Anotação | Descrição | 
|----------- |------------ |
| `wallarm.com/wallarm-mode` | [Modo de filtragem de tráfego][wallarm-mode-docs]: `off` (padrão), `monitoring`, `safe_blocking`, ou `block`. |
| `wallarm.com/wallarm-application` | [ID da aplicação Wallarm][applications-docs]. O valor pode ser um número inteiro positivo, exceto para `0`. |
| `wallarm.com/wallarm-parse-response` | Se deve analisar as respostas da aplicação para ataques: `true` (padrão) ou `false`. A análise da resposta é necessária para a detecção de vulnerabilidades durante a [detecção passiva][passive-vuln-detection-docs] e a [verificação de ameaça ativa][active-threat-ver-docs]. |
| `wallarm.com/wallarm-parse-websocket` | Wallarm possui suporte total para WebSockets. Por padrão, as mensagens do WebSockets não são analisadas para ataques. Para forçar o recurso, ative o plano de assinatura da API Security [subscription plan][subscription-docs] e use esta anotação: `true` or `false` (padrão). |
| `wallarm.com/wallarm-unpack-response` | Se deve decomprimir dados compactados retornados na resposta do aplicativo: `true` (padrão) ou `false`. |
| `wallarm.com/wallarm-partner-client-uuid` | Identificador único do locatário para o nó Wallarm [multi-inquilino][multitenancy-overview]. O valor deve ser uma string no formato UUID, como `123e4567-e89b-12d3-a456-426614174000`.<br><br>Saiba como:<ul><li>[Obter o UUID do locatário durante a criação do locatário][get-tenant-via-api-docs]</li><li>[Obter a lista de UUIDs de locatários existentes][get-tenant-uuids-docs]</li></ul> |

### Ajuste fino da análise de tráfego via Interface de Usuário do Console Wallarm

A Interface de Usuário do Console Wallarm permite que você ajuste a análise de tráfego realizada pela camada Wallarm da seguinte forma:

* Configurar o modo de filtragem de tráfego

    Uma vez que a [solução é implantada](deployment.md), ela começa a filtrar todas as solicitações de entrada no modo [monitoramento][available-filtration-modes].

    A Interface de Usuário do Console Wallarm permite que você altere o modo:

    * [Globalmente para todas as solicitações de entrada][general-settings-ui-docs]
    * Em uma base por Ingress usando a [regra][wallarm-mode-rule-docs]

    !!! info "Prioridades das configurações por Ingress e as especificadas na Interface de Usuário do Console Wallarm"
        Se o modo para a solução baseada em Kong de Código Aberto for especificado através da anotação `wallarm-mode` e na Interface de Usuário do Console Wallarm, este último terá precedência sobre a anotação.
* Configurar [notificações sobre eventos de segurança][integrations-docs]
* [Gerenciar o acesso a APIs pelas fontes da solicitação][ip-lists-docs]
* [Personalizar regras de filtragem de tráfego][rules-docs]