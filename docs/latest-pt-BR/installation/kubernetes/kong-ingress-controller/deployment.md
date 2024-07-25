# Implantando o Controlador de Ingresso Kong com Serviços Integrados Wallarm

Para garantir a segurança das APIs gerenciadas pelo Kong API Gateway, você pode implantar o controlador de ingresso Kong com serviços integrados Wallarm em um cluster Kubernetes. A solução envolve a funcionalidade padrão do Kong API Gateway com uma camada de mitigação de tráfego malicioso em tempo real.

A solução é implantada a partir do [Gráfico Wallarm Helm](https://github.com/wallarm/kong-charts).

Os **recursos-chave** do Controlador de Ingresso Kong com serviços integrados Wallarm são:

* Detecção e mitigação de ataques em tempo real [detecção de ataques e mitigação][ataque-detection-docs]
* [Detecção de vulnerabilidades][vulnerability-detection-docs]
* [Descoberta de inventário de API][api-discovery-docs]
* Os serviços Wallarm são integrados nativamente em ambas as edições Open-Source e  [Kong API Gateway](https://docs.konghq.com/gateway/latest/)
* Esta solução é baseada no [Controlador de Ingresso Kong oficial para Kong API Gateway](https://docs.konghq.com/kubernetes-ingress-controller/latest/) que oferece suporte total aos recursos do Kong API Gateway
* Suporte para Kong API Gateway 3.1.x (para ambas as edições Open-Source e )
* Ajuste fino da camada Wallarm por meio da interface do usuário do Wallarm Console e em uma base por Ingress por meio de anotações

    !!! aviso "Suporte à anotação"
        A anotação de ingresso é suportada somente pela solução baseada no controlador de Ingress Kong Open-Source. [A lista de anotações suportadas é limitada](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* Fornece uma entidade dedicada para o módulo de pós-análise que é o backend de análise de dados local para a solução que consome a maior parte da CPU

## Casos de Uso

Entre todas as opções de implantação Wallarm suportadas [Opções de implantação Wallarm][deployment-platform-docs], esta solução é a recomendada para os seguintes **casos de uso**:

* Não há um controlador de ingresso e camada de segurança encaminhando o tráfego para os recursos de Ingress gerenciados pelo Kong.
* Você está usando o controlador de Ingress Kong oficial Open-Source ou  e está procurando uma solução de segurança compatível com sua pilha de tecnologia.

    Você pode substituir perfeitamente o Controlador de Ingress Kong implantado pelo que estas instruções descrevem apenas movendo sua configuração para uma nova implantação.

## Arquitetura da Solução

A solução tem a seguinte arquitetura:

![Arquitetura da Solução][kong-ing-controller-scheme]

A solução é baseada no Controlador de Ingress Kong oficial, sua arquitetura é descrita na [documentação oficial do Kong](https://docs.konghq.com/kubernetes-ingress-controller/latest/concepts/design/).

O Controlador de Ingresso Kong com serviços integrados Wallarm é organizado pelos seguintes objetos de Implantação:

* **Controlador de Ingress** (`wallarm-ingress-kong`) que injeta o Kong API Gateway e os recursos Wallarm no cluster K8s configurando-o com base nos valores do gráfico Helm e conectando os componentes do nó à Nuvem Wallarm.
* **Módulo de pós-análise** (`wallarm-ingress-kong-wallarm-tarantool`) é o backend de análise de dados local para a solução. O módulo usa o armazenamento em memória Tarantool e o conjunto de alguns contêineres auxiliares (como o collectd, serviços de exportação de ataque).

## Limitações do Controlador de Ingresso Kong 

A solução descrita para o controlador de ingresso Kong  permite o ajuste fino da camada Wallarm somente por meio do Wallarm Console UI.

No entanto, alguns recursos da plataforma Wallarm requerem a alteração dos arquivos de configuração que não são suportados na implementação atual da solução . Isso torna os seguintes recursos Wallarm indisponíveis:

* [Recurso de multilocação][multitenancy-overview]
* [Configuração de aplicativo][applications-docs]
* [Configuração personalizada de página e código de bloqueio][custom-blocking-page-docs] - não suportado por ambos os controladores de Ingress Kong  e Open-Source com serviços Wallarm

Quanto ao controlador de Ingress Kong Open-Source com serviços Wallarm, ele suporta a multilocação e a configuração do aplicativo em uma base por Ingress por meio de [anotações](customization.md#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).

## Requisitos

--8<-- "../include-pt-BR/waf/installation/kong-ingress-controller-reqs.md"

## Implantação

Para implantar o Controlador de Ingress Kong com serviços integrados Wallarm:

1. Crie o nó Wallarm.
2. Implante o gráfico Wallarm Helm com o Controlador de Ingress Kong e os serviços Wallarm.
3. Habilite a análise de tráfego para o seu Ingress.
4. Teste o Controlador de Ingress Kong com serviços integrados Wallarm.

### Passo 1: Crie o nó Wallarm

1. Abra o Wallarm Console → **Nodes** pelo link abaixo:

    * https://us1.my.wallarm.com/nodes para a Nuvem US
    * https://my.wallarm.com/nodes para a Nuvem EU
2. Crie um nó de filtragem com o tipo **Nó Wallarm** e copie o token gerado.
    
    ![Criação de um nó Wallarm][create-wallarm-node-img]

### Passo 2: Implante o gráfico Wallarm Helm

1. Adicione o [repositório do gráfico Wallarm](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
2. Crie o arquivo `values.yaml` com a [configuração da solução](customization.md).

    Exemplo do arquivo com a configuração mínima para executar o Controlador de Ingresso Kong **Open-Source** com serviços integrados Wallarm:

    === "Nuvem US"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: wallarm/kong-kubernetes-ingress-controller
        ```
    === "Nuvem EU"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: wallarm/kong-kubernetes-ingress-controller
        ```  
        
    Exemplo do arquivo com a configuração mínima para executar o Controlador de Ingress Kong **** com serviços integrados Wallarm:

    === "Nuvem US"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"
          apiHost: us1.api.wallarm.com

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG--LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        :
          enabled: true

        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```
    === "Nuvem EU"
        ```yaml
        wallarm:
          token: "<NODE_TOKEN>"

        image:
          repository: wallarm/kong-ee-preview
          license_secret: "<KONG--LICENSE>"
          vitals:
            enabled: false
          portal:
            enabled: false
          rbac:
            enabled: false

        :
          enabled: true
        
        ingressController:
          enabled: true
          installCRDs: false
          image:
            repository: kong/kubernetes-ingress-controller
        ```   
    
    * `<NODE_TOKEN>` é o token do nó Wallarm que você copiou da interface do usuário do Wallarm Console

        --8<-- "../include-pt-BR/waf/installation/info-about-using-one-token-for-several-nodes.md"
    
    * `<KONG--LICENSE>` é a [Licença Kong ](https://github.com/Kong/charts/blob/master/charts/kong/README.md#kong--license)
3. Implante o gráfico Wallarm Helm:

    ``` bash
    helm install --version 4.6.3 <RELEASE_NAME> wallarm/kong -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` é o nome para o lançamento do Helm do gráfico do Controlador de Ingresso Kong
    * `<KUBERNETES_NAMESPACE>` é o novo espaço para nome para implantar o lançamento do Helm com o gráfico do Controlador de Ingress Kong
    * `<PATH_TO_VALUES>` é o caminho para o arquivo `values.yaml`

### Passo 3: Habilite a análise de tráfego para o seu Ingress

Se a solução implantada é baseada no Controlador de Ingress Kong Open-source, habilite a análise de tráfego para o seu Ingress definindo o modo Wallarm para `monitoramento`:

```bash
kubectl annotate ingress <KONG_INGRESS_NAME> -n <KONG_INGRESS_NAMESPACE> wallarm.com/wallarm-mode=monitoring
```

Onde `<KONG_INGRESS_NAME>` é o nome do recurso de Ingress K8s que roteia as chamadas de API para os microsserviços que você deseja proteger.

Quanto ao Controlador de Ingress Kong , a análise de tráfego no modo de monitoramento é habilitada globalmente para todos os recursos de ingresso por padrão.

### Passo 4: Teste o Controlador de Ingress Kong com serviços integrados Wallarm

Para testar se o Controlador de Ingress Kong com serviços integrados Wallarm opera corretamente:

1. Obtenha os detalhes do pod Wallarm para verificar se eles foram iniciados com sucesso:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    Cada pod deve exibir o seguinte: **READY: N/N** e **STATUS: Running**, por exemplo:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
2. Envie os ataques de teste [Path Traversal][ptrav-attack-docs] ao Serviço do Controlador de Ingresso Kong:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Como a camada Wallarm opera no [modo de filtragem][available-filtration-modes-docs] **monitoring**, o nó Wallarm não bloqueará o ataque, mas o registrará.

    Para verificar que o ataque foi registrado, acesse Wallarm Console → **Events**:

    ![Ataques na interface][attacks-in-ui-image]

## Personalização

Os pods Wallarm foram injetados com base no [valores.yaml padrão](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml) e na configuração personalizada que você especificou no 2º passo de implantação.

Você pode personalizar ainda mais o comportamento do Kong API Gateway e Wallarm e aproveitar ao máximo o Wallarm para sua empresa.

Basta prosseguir para o [guia de personalização da solução do Controlador de Ingress Kong](customization.md).
