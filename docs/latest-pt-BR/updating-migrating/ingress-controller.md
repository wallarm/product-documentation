[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# Atualizando o controlador NGINX Ingress com módulos Wallarm integrados

Estas instruções descrevem os passos para atualizar o controlador Ingress baseado em Wallarm NGINX que foi implantado, da versão 4.x para a nova versão com o nó Wallarm 4.8.

Para atualizar o nó no fim da vida útil (3.6 ou inferior), por favor, use as [instruções diferentes](older-versions/ingress-controller.md).

!!! warning
    The Kubernetes community will [retire the Community Ingress NGINX in March 2026](https://blog.nginx.org/blog/the-ingress-nginx-alternative-open-source-nginx-ingress-controller-for-the-long-term). The Wallarm NGINX Ingress Controller based on this project will be supported through the same date. You can continue using it until then, and it will remain fully functional during the support window.

    Wallarm will provide alternative deployment options and migration guidance as they become available. [Details](../updating-migrating/nginx-ingress-retirement.md)

    An [Envoy/Istio-based connector](../installation/connectors/istio.md) is also available today for environments already using Envoy.

## Requisitos

--8<-- "../include-pt-BR/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Passo 1: Atualize o repositório do chart Helm Wallarm

```bash
helm repo update wallarm
```

## Passo 2: Verifique todas as mudanças vindo no K8s manifest

Para evitar mudanças inesperadas no comportamento do controlador Ingress, verifique todas as mudanças vindo no K8s manifest usando o [Plugin Helm Diff](https://github.com/databus23/helm-diff). Este plugin mostra as diferenças entre os K8s manifestos da versão do controlador Ingress implantada e a nova.

Para instalar e rodar o plugin:

1. Instale o plugin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Rode o plugin:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: o nome da release do Helm com o gráfico do controlador Ingress
    * `<NAMESPACE>`: o espaço de nomes no qual o controlador Ingress foi implantado
    * `<PATH_TO_VALUES>`: o caminho para o arquivo `values.yaml` que define as configurações do controlador Ingress 4.8 - você pode usar o que foi criado para executar a versão anterior do controlador Ingress
3. Certifique-se de que nenhuma mudança pode afetar a estabilidade dos serviços em execução e examine cuidadosamente os erros do stdout.

    Se stdout estiver vazio, certifique-se de que o arquivo `values.yaml` é válido.

## Passo 3: Atualize o controlador Ingress

Atualize o controlador NGINX Ingress implantado:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.8.2 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: o nome da release do Helm com o gráfico do controlador Ingress
* `<NAMESPACE>`: o espaço de nomes no qual o controlador Ingress foi implantado
* `<PATH_TO_VALUES>`: o caminho para o arquivo `values.yaml` que define as configurações do controlador Ingress 4.8 - você pode usar o que foi criado para executar a versão anterior do controlador Ingress

## Passo 4: Teste o controlador Ingress atualizado

1. Certifique-se de que a versão do gráfico do Helm foi atualizada:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Onde `<NAMESPACE>` é o espaço de nomes no qual o gráfico do Helm com o controlador Ingress foi implantado.

    A versão do gráfico deve corresponder ao `wallarm-ingress-4.8.2`.
1. Obtenha a lista de pods:

    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Cada status do pod deve ser **STATUS: Running** ou **READY: N/N**. Por exemplo:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

1. Envie a requisição com o teste de ataque [Path Traversal](../attacks-vulns-list.md#path-traversal) para o endereço do controlador Ingress Wallarm:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Verifique se a solução da versão mais recente processa a solicitação maliciosa da mesma forma que na versão anterior.

## Passo 5: Atualize a página de bloqueio da Wallarm

Se a página `&/usr/share/nginx/html/wallarm_blocked.html` configurada via anotações Ingress está sendo retornada para solicitações bloqueadas, [ajuste sua configuração](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) para as mudanças lançadas.

Nas novas versões do nó, a página de bloqueio da Wallarm [tem](what-is-new.md#new-blocking-page) a IU atualizada sem logo e sem e-mail de suporte especificado por padrão.
