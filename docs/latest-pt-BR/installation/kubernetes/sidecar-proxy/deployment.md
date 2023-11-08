# Implantando o Wallarm Sidecar

Para proteger uma aplicação implantada como um Pod em um cluster Kubernetes, você pode executar o nó Wallarm baseado em NGINX na frente da aplicação como um controlador sidecar. O controlador sidecar Wallarm filtrará o tráfego de entrada para o Pod de aplicação, permitindo apenas solicitações legítimas e mitigando as maliciosas.

As **principais características** da solução Wallarm Sidecar incluem:

* Simplifica a proteção de microserviços discretos e suas réplicas e shards, fornecendo o formato de implantação que é semelhante às aplicações
* Totalmente compatível com qualquer controlador Ingress
* Funciona de forma estável sob cargas altas, geralmente comuns para a abordagem de malha de serviço
* Exige configuração mínima do serviço para proteger seus aplicativos; basta adicionar algumas anotações e rótulos ao pod de aplicação para protegê-lo
* Suporta dois modos de implantação do contêiner Wallarm: para cargas médias com os serviços Wallarm rodando em um único contêiner e para cargas altas com os serviços Wallarm divididos em vários contêineres
* Fornece uma entidade dedicada para o módulo pós-analítico, que é o backend local de análise de dados para a solução Wallarm sidecar, consumindo a maior parte da memória

!!! info "Se você estiver usando a versão anterior da solução Wallarm Sidecar"
    Se você estiver usando a versão anterior da solução Wallarm Sidecar, recomendamos que migre para a nova. Com este lançamento, atualizamos nossa solução Sidecar para aproveitar as novas capacidades do Kubernetes e uma grande quantidade de feedback do cliente. A nova solução não requer alterações significativas no manifesto Kubernetes; para proteger uma aplicação, basta implantar o gráfico e adicionar rótulos e anotações ao pod.

    Para obter ajuda na migração para a solução Wallarm Sidecar v2.0, entre em contato com o [suporte técnico da Wallarm](mailto:support@wallarm.com).

## Casos de uso

Entre todas as [opções de implantação do Wallarm][deployment-platform-docs] suportadas, esta solução é recomendada para os seguintes **casos de uso**:

* Você está procurando a solução de segurança a ser implantada na infraestrutura com o controlador Ingress existente (por exemplo, AWS ALB Ingress Controller) impedindo você de implantar o [Controlador Ingress baseado em Wallarm NGINX][nginx-ing-controller-docs] ou o [Controlador Ingress baseado em Wallarm Kong][kong-ing-controller-docs]
* Ambiente de confiança zero que exige que cada microserviço (incluindo APIs internas) seja protegido pela solução de segurança

## Fluxo de tráfego

Fluxo de tráfego com Wallarm Sidecar:

![Fluxo de tráfego com Wallarm Sidecar][traffic-flow-with-wallarm-sidecar-img]

## Arquitetura da solução

A solução Wallarm Sidecar é organizada pelos seguintes objetos de implantação:

* **Controlador Sidecar** (`wallarm-sidecar-controller`) é o [webhook de admissão mutante](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) que injeta recursos do Wallarm sidecar no Pod, configurando-o com base nos valores do gráfico Helm e anotações do pod e conectando os componentes do nó ao Wallarm Cloud.

    Uma vez que um novo pod com o rótulo `wallarm-sidecar: enabled` no Kubernetes começa, o controlador injeta automaticamente o contêiner adicional filtrando o tráfego de entrada no pod.
* **Módulo pós-analítico** (`wallarm-sidecar-postanalytics`) é o backend local de análise de dados para a solução Wallarm sidecar. O módulo utiliza o armazenamento em memória Tarantool e um conjunto de alguns contêineres auxiliares (como o collectd, serviços de exportação de ataque).

![Objetos de implantação Wallarm][sidecar-deployment-objects-img]

O Wallarm Sidecar tem 2 estágios padrão em seu ciclo de vida:

1. No estágio **inicial**, o controlador injeta recursos do Wallarm sidecar no Pod, configurando-o com base nos valores do gráfico Helm e anotações do pod e conectando os componentes do nó ao Wallarm Cloud.
1. No estágio **de tempo de execução**, a solução analisa e encaminha/repassa solicitações envolvendo o módulo pós-analítico.

## Requisitos

--8<-- "../include-pt-BR/waf/installation/sidecar-proxy-reqs.md"

## Implantação

Para implantar a solução Wallarm Sidecar:

1. Gere um token de nó de filtragem.
1. Implantar o gráfico Helm Wallarm.
1. Anexe o Wallarm Sidecar ao Pod de aplicação.
1. Teste a operação Wallarm Sidecar.

### Passo 1: Gere um token de nó de filtragem

Gere um token de nó de filtragem do [tipo apropriado][node-token-types] para conectar os pods do sidecar à Wallarm Cloud:

=== "Token API"
    1. Abra o Console Wallarm → **Configurações** → **Tokens API** na [Nuvem EUA](https://us1.my.wallarm.com/settings/api-tokens) ou [Nuvem UE](https://my.wallarm.com/settings/api-tokens).
    1. Encontre ou crie um token API com a função de origem `Deploy`.
    1. Copie este token.
=== "Token de nó"
    1. Abra o Console Wallarm → **Nós** na [Nuvem EUA](https://us1.my.wallarm.com/nodes) ou [Nuvem UE](https://my.wallarm.com/nodes).
    1. Crie um nó de filtragem com o tipo **Nó Wallarm** e copie o token gerado.
    
      ![Criação de um nó Wallarm][create-wallarm-node-img]

### Passo 2: Implementar o gráfico Helm Wallarm

1. Adicione o [repositório gráfico Wallarm](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    ```
1. Crie o arquivo `values.yaml` com a [configuração Wallarm Sidecar](customization.md). Exemplo do arquivo com a configuração mínima está abaixo.

    Ao usar um token API, especifique um nome de grupo de nó no parâmetro `nodeGroup`. Seus nós criados para os pods do sidecar serão atribuídos a este grupo, mostrado na seção **Nós** do Console Wallarm. O nome do grupo padrão é `defaultSidecarGroup`. Se necessário, você pode definir os nomes dos grupos de nós de filtragem individualmente para os pods das aplicações que eles protegem, usando a anotação [`sidecar.wallarm.io/wallarm-node-group`](pod-annotations.md#wallarm-node-group).

    === "Nuvem EUA"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              host: "us1.api.wallarm.com"
              # nodeGroup: "defaultSidecarGroup"
        ```
    === "Nuvem UE"
        ```yaml
        config:
          wallarm:
            api:
              token: "<NODE_TOKEN>"
              # nodeGroup: "defaultSidecarGroup"
        ```    
    
     `<NODE_TOKEN>` é o token do nó Wallarm a ser executado no Kubernetes.

    --8<-- "../include-pt-BR/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Implante o gráfico Helm Wallarm:

    ``` bash
    helm install --version 4.8.0 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` é o nome para o lançamento Helm do gráfico Wallarm Sidecar
    * `wallarm-sidecar` é o novo namespace para implantar o lançamento Helm com o gráfico Wallarm Sidecar, é recomendado implantá-lo em um namespace separado
    * `<PATH_TO_VALUES>` é o caminho para o arquivo `values.yaml`

### Passo 3: Anexe o Wallarm Sidecar ao Pod de aplicação

Para que o Wallarm filtre o tráfego da aplicação, adicione o rótulo `wallarm-sidecar: enabled` ao Pod de aplicação correspondente:

```bash
kubectl edit deployment -n <APPLICATION_NAMESPACE> <APP_LABEL_VALUE>
```

```yaml hl_lines="15"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

* Se o rótulo do Pod de aplicação `wallarm-sidecar` estiver definido como `disabled` ou não for especificado explicitamente, o contêiner Wallarm Sidecar não é injetado em um pod e, portanto, o Wallarm não filtra o tráfego.
* Se o rótulo do Pod de aplicação `wallarm-sidecar` estiver definido como `enabled`, o contêiner Wallarm Sidecar é injetado em um pod e, portanto, o Wallarm filtra o tráfego de entrada.

### Passo 4: Teste a operação Wallarm Sidecar

Para testar se o Wallarm Sidecar opera corretamente:

1. Obtenha os detalhes do pod Wallarm para verificar se eles foram iniciados com sucesso:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Cada pod deve exibir o seguinte: **READY: N/N** e **STATUS: Running**, por exemplo:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg       1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Obtenha os detalhes do pod de aplicação para verificar que o controlador Wallarm sidecar foi injetado com sucesso:

    ```bash
    kubectl get pods -n <APPLICATION_NAMESPACE> --selector app=<APP_LABEL_VALUE>
    ```

    A saída deve exibir **READY: 2/2** indicando a bem-sucedida injeção do contêiner sidecar e **STATUS: Running** indicando a bem-sucedida conexão com o Wallarm Cloud:

    ```
    NAME                     READY   STATUS    RESTARTS   AGE
    myapp-5c48c97b66-lzkwf   2/2     Running   0          3h4m
    ```
1. Envie o ataque de teste [Path Traversal][ptrav-attack-docs] para o endereço do cluster da aplicação que o Wallarm está habilitado para filtrar o tráfego:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    Como o proxy Wallarm opera no [modo de filtração][filtration-mode-docs] **monitoramento** por padrão, o nó Wallarm não bloqueará o ataque, mas o registrará.

    Para verificar se o ataque foi registrado, acesse Wallarm Console → **Eventos**:

    ![Ataques na interface][attacks-in-ui-image]

## Personalização

Pods Wallarm foram injetados com base no [`values.yaml` padrão](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) e na configuração personalizada que você especificou no 2º passo de implantação.

Você pode personalizar ainda mais o comportamento do proxy Wallarm em níveis globais e por pod e tirar o máximo proveito da solução Wallarm para sua empresa.

Basta ir para o [guia de personalização da solução proxy Wallarm](customization.md).
