# Valores específicos da Wallarm do Gráfico Helm Sidecar

Este documento descreve os valores específicos do gráfico Helm da Wallarm que você pode alterar durante o [deploy Wallarm Sidecar](deployment.md) ou [atualização][sidecar-upgrade-docs]. Os valores específicos da Wallarm e outros valores do gráfico são para configuração global do gráfico Helm Sidecar.

!!! info "Prioridades das configurações globais e específicas do pod"
    As anotações específicas do pod [têm precedência](customization.md#configuration-area) sobre os valores do gráfico Helm.

A parte específica da Wallarm da [default `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) é a seguinte:

```yaml
config:
  wallarm:
    api:
      token: ""
      host: api.wallarm.com
      port: 443
      useSSL: true
      caVerify: true
      nodeGroup: "defaultSidecarGroup"
      existingSecret:
        enabled: false
        secretKey: token
        secretName: wallarm-api-token
    fallback: "on"
    mode: monitoring
    modeAllowOverride: "on"
    enableLibDetection: "on"
    parseResponse: "on"
    aclExportEnable: "on"
    parseWebsocket: "off"
    unpackResponse: "on"
    ...
postanalytics:
  external:
    enabled: false
    host: ""
    port: 3313
  ...
```

## config.wallarm.api.token

Um valor de token do nó de filtragem. É necessário para acessar a API Wallarm.

O token pode ser um destes [tipos][node-token-types]:

* **Token de API (recomendado)** - Ideal se você precisa adicionar/remover dinamicamente grupos de nós para organização de UI ou se você deseja controlar o ciclo de vida do token para segurança adicional. Para gerar um token de API:

    Para gerar um token de API:
    
    1. Vá para o Console Wallarm → **Configurações** → **Tokens de API** em qualquer um dos [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) ou [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Crie um token de API com a **Deploy** como função de origem.
    1. Durante o deployment do nó, use o token gerado e especifique o nome do grupo usando o parâmetro `config.wallarm.api.nodeGroup`. Você pode adicionar vários nós a um grupo usando diferentes tokens de API.
* **Token do nó** - Adequado quando você já sabe os grupos de nós que serão usados.

    Para gerar um token do nó:
    
    1. Vá para o Console Wallarm → **Nós** em qualquer um dos [US Cloud](https://us1.my.wallarm.com/nodes) ou [EU Cloud](https://my.wallarm.com/nodes).
    1. Crie um nó e nomeie o grupo do nó.
    1. Durante o deployment do nó, use o token do grupo para cada nó que deseja incluir nesse grupo.

O parâmetro é ignorado se [`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret).

## config.wallarm.api.host

Ponto final da API Wallarm. Pode ser:

* `us1.api.wallarm.com` para a [nuvem dos EUA][us-cloud-docs]
* `api.wallarm.com` para a [nuvem da UE][eu-cloud-docs] (padrão)

## config.wallarm.api.nodeGroup

Especifica o nome do grupo de nós de filtragem ao qual você deseja adicionar os nós recém-implantados. O agrupamento de nós desta maneira está disponível apenas quando você cria e conecta nós à nuvem usando um token de API com a função **Deploy** (seu valor é passado no parâmetro `config.wallarm.api.token`).

**Valor padrão**: `defaultSidecarGroup`

[**Anotação do Pod**](pod-annotations.md): `sidecar.wallarm.io/wallarm-node-group`.

## config.wallarm.api.existingSecret

A partir da versão 4.4.4 do gráfico Helm, você pode usar este bloco de configuração para extrair um valor de token do nó Wallarm dos segredos Kubernetes. É útil para ambientes com gerenciamento de segredos separado (por exemplo, você usa um operador de segredos externo).

Para armazenar o token do nó nos segredos K8s e puxá-lo para o gráfico Helm:

1. Crie um segredo Kubernetes com o token do nó Wallarm:

    ```bash
    kubectl -n wallarm-sidecar create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * Se você seguiu as instruções de implantação sem modificações, `wallarm-sidecar` é o namespace Kubernetes criado para o lançamento Helm com o controlador Wallarm Sidecar. Substitua o nome se estiver usando um namespace diferente.
    * `wallarm-api-token` é o nome do segredo Kubernetes.
    * `<WALLARM_NODE_TOKEN>` é o valor do token do nó Wallarm copiado da interface do usuário do Console Wallarm.

    Se estiver usando algum operador de segredos externo, siga a [documentação apropriada para criar um segredo](https://external-secrets.io).
1. Defina a seguinte configuração em `values.yaml`:

    ```yaml
    config:
      wallarm:
        api:
          token: ""
          existingSecret:
            enabled: true
            secretKey: token
            secretName: wallarm-api-token
    ```

**Valor padrão**: `existingSecret.enabled: false` que aponta o gráfico Helm para obter o token do nó Wallarm de `config.wallarm.api.token`.

## config.wallarm.fallback

Com o valor definido como `on` (padrão), os serviços NGINX têm a capacidade de entrar em modo de emergência. Se o proton.db ou o conjunto de regras personalizado não puderem ser baixados da nuvem Wallarm devido à sua indisponibilidade, esta configuração desativa o módulo Wallarm e mantém o NGINX funcionando.

[**Anotação do Pod**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

Modo global de [filtração de tráfego][configure-wallarm-mode-docs]. Valores possíveis:

* `monitoring` (padrão)
* `safe_blocking`
* `block`
* `off`

[**Anotação do Pod**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

Gerencia a [capacidade de substituir os valores `wallarm_mode` por meio de configurações na nuvem][filtration-mode-priorities-docs]. Valores possíveis:

* `on` (padrão)
* `off`
* `strict`

[**Anotação do Pod**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

Se deve validar adicionalmente os ataques de injeção SQL usando a biblioteca [libdetection][libdetection-docs]. Valores possíveis:

* `on` (padrão)
* `off`

[**Anotação do Pod**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

Se deve analisar as respostas do aplicativo para ataques. Valores possíveis:

* `on` (padrão)
* `off`

A análise de resposta é necessária para a detecção de vulnerabilidades durante a [detecção passiva][passive-detection-docs] e a [verificação de ameaças ativas][active-threat-verification-docs].

[**Anotação do Pod**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.aclExportEnable

Habilita `on` / desabilita `off` o envio de estatísticas sobre as solicitações dos IPs [negados][denylist-docs] do nó para a nuvem.

* Com `config.wallarm.aclExportEnable: "on"` (padrão) as estatísticas sobre as solicitações dos IPs negados serão [exibidas][denylist-view-events-docs] na seção **Eventos**.
* Com `config.wallarm.aclExportEnable: "off"` as estatísticas sobre os pedidos dos IPs negados não serão exibidas.

[**Anotação do Pod**](pod-annotations.md): `sidecar.wallarm.io/wallarm-acl-export-enable`.

## config.wallarm.parseWebsocket

Wallarm tem total suporte para WebSockets. Por padrão, as mensagens dos WebSockets não são analisadas para ataques. Para forçar o recurso, ative o plano de assinatura API Security [subscription plan][subscriptions-docs] e use esta configuração.

Valores possíveis:

* `on`
* `off` (padrão)

[**Anotação do Pod**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

Se deve descomprimir dados comprimidos retornados na resposta do aplicativo:

* `on` (padrão)
* `off`

[**Anotação do Pod**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## postanalytics.external.enabled

Determina se deve usar o módulo Wallarm postanalytics (Tarantool) instalado em um host externo ou aquele instalado durante o deploy da solução Sidecar.

Este recurso é suportado a partir do lançamento do Helm 4.6.4.

Valores possíveis:

* `false` (padrão): usa o módulo de pós-análise implantado pela solução Sidecar.
* `true`: se ativado, forneça o endereço externo do módulo de pós-análise nos valores `postanalytics.external.host` e `postanalytics.external.port`.

  Se definido como `true`, a solução Sidecar não executa o módulo de pós-análise, mas espera alcançá-lo no `postanalytics.external.host` e `postanalytics.external.port` especificados.

## postanalytics.external.host

O domínio ou o endereço IP do módulo postanalytics instalado separadamente. Este campo é necessário se `postanalytics.external.enabled` estiver definido como `true`.

Este recurso é suportado a partir do lançamento do Helm 4.6.4.

Exemplos de valores: `tarantool.domain.external` ou `10.10.0.100`.

O host especificado deve ser acessível a partir do cluster Kubernetes onde o gráfico Helm Sidecar é implantado.

## postanalytics.external.port

A porta TCP na qual o módulo Wallarm postanalytics está sendo executado. Por padrão, usa a porta 3313, pois a solução Sidecar implanta o módulo nesta porta.

Se `postanalytics.external.enabled` estiver definido como `true`, especifique a porta em que o módulo está sendo executado no host externo especificado.