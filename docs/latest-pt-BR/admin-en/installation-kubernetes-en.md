# Implantando o NGINX Ingress Controller com Serviços Integrados Wallarm

Estas instruções fornecem os passos para implantar o controlador de ingresso Wallarm NGINX-based em seu cluster K8s. A solução envolve a funcionalidade padrão do [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) com serviços integrados Wallarm.

!!! warning
    The Kubernetes community will [retire the Community Ingress NGINX in March 2026](https://blog.nginx.org/blog/the-ingress-nginx-alternative-open-source-nginx-ingress-controller-for-the-long-term). The Wallarm NGINX Ingress Controller based on this project will be supported through the same date. You can continue using it until then, and it will remain fully functional during the support window.

    Wallarm will provide alternative deployment options and migration guidance as they become available. [Details](../updating-migrating/nginx-ingress-retirement.md)

    An [Envoy/Istio-based connector](../installation/connectors/istio.md) is also available today for environments already using Envoy.

A solução tem a seguinte arquitetura:

![Arquitetura da solução][nginx-ing-image]

A solução é implantada a partir do Wallarm Helm chart.

## Casos de uso

Entre todas as [opções de implantação Wallarm suportadas][deployment-platform-docs], esta solução é a recomendada para os seguintes **casos de uso**:

* Não há controlador de ingresso e camada de segurança direcionando tráfego para recursos de ingresso compatíveis com o [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx).
* Você está usando o [Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx) e procura uma solução de segurança compatível com sua pilha de tecnologia.

    Você pode substituir perfeitamente o Controlador de Ingresso NGINX implantado pelo descrito nestas instruções, apenas movendo sua configuração para uma nova implantação.

## Requisitos

--8<-- "../include-pt-BR/waf/installation/requirements-nginx-ingress-controller-latest.md"

!!! info "Veja também"
    * [O que é Ingress?](https://kubernetes.io/docs/concepts/services-networking/ingress/)
    * [Instalação do Helm](https://helm.sh/docs/intro/install/)

## Restrições conhecidas

* A operação sem o módulo postanalytics não é suportada. 
* A redução de escala do módulo postanalytics pode resultar em uma perda parcial dos dados do ataque.

## Instalação

1. [Instale](#step-1-installing-the-wallarm-ingress-controller) o Wallarm Ingress Controller.
2. [Habilite](#step-2-enabling-traffic-analysis-for-your-ingress) a análise de tráfego para seu Ingress.
3. [Verifique](#step-3-checking-the-wallarm-ingress-controller-operation) a operação do Wallarm Ingress Controller.

### Passo 1: Instalando o Wallarm Ingress Controller

Para instalar o Wallarm Ingress Controller:

1. Gere um token de nó de filtração do [tipo apropriado][node-token-types]:

    === "Token API (Helm chart 4.6.8 e acima)"
        1. Abra Wallarm Console → **Settings** → **API tokens** na [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) ou [EU Cloud](https://my.wallarm.com/settings/api-tokens).
        1. Encontre ou crie um token API com o papel de origem `Deploy`.
        1. Copie este token.
    === "Token do nó"
        1. Abra o Console Wallarm → **Nodes** na [US Cloud](https://us1.my.wallarm.com/nodes) ou [EU Cloud](https://my.wallarm.com/nodes).
        1. Crie um nó de filtragem com o tipo **Wallarm node** e copie o token gerado.

            ![Criação de um nó Wallarm][nginx-ing-create-node-img]
1. Crie um espaço de nomes Kubernetes para implantar o Helm chart com o Wallarm Ingress Controller:

    ```bash
    kubectl create namespace <KUBERNETES_NAMESPACE>
    ```
1. Adicione o [repositório do gráfico Wallarm](https://charts.wallarm.com/):
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. Crie o arquivo `values.yaml` com a [configuração Wallarm][configure-nginx-ing-controller-docs]. Exemplo do arquivo com a configuração mínima está abaixo.

    Ao usar um token de API, especifique um nome de grupo de nós no parâmetro `nodeGroup`. Seu nó será atribuído a este grupo, mostrado na seção **Nodes** do Console Wallarm. O nome do grupo padrão é `defaultIngressGroup`.

    === "US Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            apiHost: "us1.api.wallarm.com"
            # nodeGroup: defaultIngressGroup
        ```
    === "EU Cloud"
        ```yaml
        controller:
          wallarm:
            enabled: "true"
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
        ```
    
    Você também pode armazenar o token de nó Wallarm em segredos do Kubernetes e puxá-lo para o Helm chart. [Leia mais][controllerwallarmexistingsecret-docs]
1. Instale os pacotes Wallarm:

    ``` bash
    helm install --version 4.8.2 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` é o nome para a versão Helm do gráfico do controlador de ingresso
    * `<KUBERNETES_NAMESPACE>` é o namespace Kubernetes que você criou para o Helm chart com o Wallarm Ingress Controller
    * `<PATH_TO_VALUES>` é o caminho para o arquivo `values.yaml`

### Passo 2: Habilitando a análise de tráfego para o seu Ingress

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-mode=monitoring
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-application=<APPLICATION>
```
* `<YOUR_INGRESS_NAME>` é o nome do seu Ingress
* `<YOUR_INGRESS_NAMESPACE>` é o namespace do seu Ingress
* `<APPLICATION>` é um número positivo que é único para cada uma de [suas aplicações ou grupos de aplicações][application-docs]. Isso permitirá que você obtenha estatísticas separadas e distinga entre ataques direcionados às aplicações correspondentes

### Passo 3: Verificando a operação do Wallarm Ingress Controller

1. Pegue a lista de pods:
    ```
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Cada pod deve exibir o seguinte: **STATUS: Running** e **READY: N/N**. Por exemplo:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```
2. Envie a solicitação com o teste [Path Traversal][ptrav-attack-docs] ataque para o Ingress Controller Service:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Se o nó de filtragem estiver funcionando no modo `block`, o código `403 Forbidden` será retornado na resposta à solicitação e o ataque será exibido em Wallarm Console → **Events**.

## Configuração

Após a instalação e verificação bem-sucedida do Wallarm Ingress Controller, você pode fazer configurações avançadas para a solução, como:

* [Relatórios corretos do endereço IP público do usuário final][best-practices-for-public-ip]
* [Gerenciamento do bloqueio de endereços IP][ip-lists-docs]
* [Considerações de alta disponibilidade][best-practices-for-high-availability]
* [Monitoramento do Ingress Controller][best-practices-for-ingress-monitoring]

Para encontrar parâmetros usados para configuração avançada e instruções apropriadas, por favor, siga o [link][configure-nginx-ing-controller-docs].
