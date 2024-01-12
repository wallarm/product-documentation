[link-helm-chart-details]:  https://github.com/wallarm/ingress-chart#configuration
[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# Ajuste fino do Wallarm Ingress Controller baseado em NGINX

Aprenda as opções de ajuste fino disponíveis para o Wallarm Ingress controller para obter o máximo da solução Wallarm.

!!! info "Documentação oficial para NGINX Ingress Controller"
    O ajuste fino do Wallarm Ingress Controller é bastante semelhante ao do NGINX Ingress Controller descrito na [documentação oficial](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/). Ao trabalhar com Wallarm, todas as opções para configurar o NGINX Ingress Controller original estão disponíveis.

## Configurações adicionais para Helm Chart

As configurações são definidas no arquivo [`values.yaml`](https://github.com/wallarm/ingress-chart/blob/master/wallarm-ingress/values.yaml). Por padrão, o arquivo é assim:

``` yaml
controller:
  wallarm:
    enabled: false
    apiHost: api.wallarm.com
    apiPort: 443
    apiSSL: true
    token: ""
    nodeGroup: defaultIngressGroup
    existingSecret:
      enabled: false
      secretKey: token
      secretName: wallarm-api-token
    tarantool:
      kind: Deployment
      service:
        annotations: {}
      replicaCount: 1
      arena: "1.0"
      livenessProbe:
        failureThreshold: 3
        initialDelaySeconds: 10
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      resources: {}
    metrics:
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## Lista de endereços IP onde o serviço stats-exporter está disponível
        ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
    synccloud:
      resources: {}
    collectd:
      resources: {}
```

Para alterar essa configuração, recomendamos o uso da opção `--set` de `helm install` (ao instalar o controlador de Ingress) ou `helm upgrade` (ao atualizar os parâmetros do controlador de Ingress instalado). Por exemplo:

=== "Instalação do controlador de Ingress"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Atualizando parâmetros do controlador Ingress"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

Uma descrição dos principais parâmetros que você pode configurar é fornecida abaixo. Outros parâmetros vêm com valores padrão e raramente precisam ser alterados; suas descrições estão disponíveis neste [link][link-helm-chart-details].

### controller.wallarm.enabled

Permite habilitar ou desabilitar as funções Wallarm.

**Valor padrão**: `false`

### controller.wallarm.apiHost

Ponto de extremidade API Wallarm. Pode ser:

* `us1.api.wallarm.com` para a [nuvem dos EUA](../about-wallarm/overview.md#us-cloud).
* `api.wallarm.com` para a [nuvem da UE](../about-wallarm/overview.md#eu-cloud),

**Valor padrão**: `api.wallarm.com`

### controller.wallarm.token

Um valor de token de nó de filtragem. É necessário para acessar a API de Wallarm.

O token pode ser um desses [tipos][node-token-types]:

* **Token de API (recomendado)** - Ideal se você precisar adicionar/remover dinamicamente grupos de nó para organização de UI ou se quiser controlar o ciclo de vida do token para segurança adicional. Para gerar um token de API:

    Para gerar um token de API:
    
    1. Vá para Wallarm Console → **Configurações** → **Tokens de API** em [Nuvem de EUA](https://us1.my.wallarm.com/settings/api-tokens) ou [Nuvem da UE](https://my.wallarm.com/settings/api-tokens).
    1. Crie um token de API com a função **Deploy**.
    1. Durante a implantação do nó, use o token gerado e especifique o nome do grupo usando o parâmetro `controller.wallarm.nodeGroup`. Você pode adicionar vários nós a um grupo usando diferentes tokens de API.
* **Token de nó** - Adequado quando você já sabe os grupos de nó que serão utilizados.

    Para gerar um token de nó:
    
    1. Vá para Wallarm Console → **Nós** em [Nuvem de EUA](https://us1.my.wallarm.com/nodes) ou [Nuvem da UE](https://my.wallarm.com/nodes).
    1. Crie um nó e nomeie o grupo de nó.
    1. Durante a implantação do nó, use o token do grupo para cada nó que você deseja incluir no grupo.

O parâmetro é ignorado se [`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret).

**Valor padrão**: `não especificado`

### controller.wallarm.nodeGroup

A partir da versão 4.6.8 do Helm chart, isso especifica o nome do grupo de nós de filtragem que você deseja adicionar aos nós recentemente implantados. O agrupamento de nós desta maneira está disponível apenas quando você cria e conecta nós à Cloud usando um token de API com o papel **Deploy** (seu valor é passado no parâmetro `controller.wallarm.token`).

**Valor default**: `defaultIngressGroup`

### controller.wallarm.existingSecret

A partir da versão 4.4.1 do Helm chart, você pode usar este bloco de configuração para buscar um valor de token de nó Wallarm dos segredos do Kubernetes. Isso é útil para ambientes com gerenciamento de segredo separado (por exemplo, você usa um operador de segredos externos).

Para armazenar o token de nó no K8s secrets e puxá-lo para o Helm chart:

1. Crie um segredo Kubernetes com o token de nó Wallarm:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>` é o namespace Kubernetes que você criou para o lançamento do Helm com o controlador Wallarm Ingress.
    * `wallarm-api-token` é o nome do segredo Kubernetes
    * `<WALLARM_NODE_TOKEN>` é o valor do token de nó Wallarm copiado da interface de usuário do Console Wallarm.

    Se estiver usando algum operador de segredos externos, siga a [documentação apropriada para criar um segredo](https://external-secrets.io).
1. Defina a seguinte configuração em `values.yaml`:

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**Valor padrão**: `existingSecret.enabled: false` que aponta para o Helm chart obter o token de nó Wallarm de `controller.wallarm.token`.

### controller.wallarm.tarantool.replicaCount

O número de pods em execução para postanalyics. Postanalytics é utilizado para a detecção de ataque baseada em comportamento.

**Valor padrão**: `1`

### controller.wallarm.tarantool.arena

Especifica a quantidade de memória alocada para o serviço postanalyics. Recomenda-se configurar um valor suficiente para armazenar dados de solicitação dos últimos 5 a 15 minutos.

**Valor padrão**: `0.2`

### controller.wallarm.metrics.enabled

Este interruptor [alterna](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) a coleta de informações e métricas. Se [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) estiver instalado no cluster Kubernetes, nenhuma configuração adicional será necessária.

**Valor padrão**: `false`

## Configurações Globais do Controlador

Implementado via [ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/).

Além dos padrão, os seguintes parâmetros adicionais são suportados:

* `enable-wallarm` - habilita o módulo Wallarm em NGINX
* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Anotações de Ingressos

Essas anotações são usadas para configurar os parâmetros de processamento para instâncias individuais do Ingress.

[Além das padrão](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/), as seguintes anotações adicionais são suportadas:

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode), padrão: off
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-application](configure-parameters-en.md#wallarm_application)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)
* [nginx.ingress.kubernetes.io/wallarm-partner-client-uuid](configure-parameters-en.md#wallarm_partner_client_uuid)

### Aplicando anotação ao recurso Ingress

Para aplicar as configurações ao seu Ingress, por favor use o seguinte comando:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>` é o nome do seu Ingress
* `<YOUR_INGRESS_NAMESPACE>` é o namespace do seu Ingress
* `<ANNOTATION_NAME>` é o nome da anotação da lista acima
* `<VALUE>` é o valor da anotação da lista acima

### Exemplos de anotação

#### Configurando a página de bloqueio e o código de erro

A anotação `nginx.ingress.kubernetes.io/wallarm-block-page` é usada para configurar a página de bloqueio e o código de erro retornado na resposta à solicitação bloqueada pelos seguintes motivos:

* A solicitação contém cargas úteis maliciosas dos seguintes tipos: [ataques de validação de entrada](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [ataques de vpatch](../user-guides/rules/vpatch-rule.md) ou [ataques detectados com base em expressões regulares](../user-guides/rules/regex-rule.md).
* A solicitação contendo cargas úteis maliciosas da lista acima se origina do [endereço IP na lista cinza](../user-guides/ip-lists/graylist.md) e o nó filtra as solicitações no [modo](configure-wallarm-mode.md) seguro de bloqueio.
* A solicitação se origina do [endereço IP na lista de negação](../user-guides/ip-lists/denylist.md).

Por exemplo, para retornar a página padrão de bloqueio do Wallarm e o código de erro 445 na resposta a qualquer solicitação bloqueada:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[Mais detalhes sobre os métodos de configuração da página de bloqueio e do código de erro →](configuration-guides/configure-block-page-and-code.md)

#### Gerenciando o modo libdetection

!!! info "Modo padrão **libdetection**"
    O modo padrão da biblioteca **libdetection** é `on` (habilitado).

Você pode controlar o modo [**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection) usando uma das opções:

* Aplicando a seguinte anotação [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) ao recurso Ingress:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection on/off;"
    ```
* Passe o parâmetro `controller.config.server-snippet` para o Helm chart:

    === "Instalação do controlador de Ingress"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        Existem também [outros parâmetros](#configurações-adicionais-para-helm-chart) necessários para a instalação correta do controlador de Ingress. Por favor, passe-os na opção `--set` também.
    === "Atualizando parâmetros do controlador Ingress"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```