[node-token-types]:                      ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[nginx-ing-create-node-img]:             ../images/user-guides/nodes/create-wallarm-node-name-specified.png

# Encadeando o Wallarm e outros Ingress Controllers no mesmo cluster Kubernetes

Estas instruções fornecem os passos para implantar o Ingress Controller Wallarm no seu cluster K8s e encadeá-lo com outros Controllers que já estão rodando no seu ambiente.

## O problema abordado pela solução

Wallarm oferece seu software de nó em diferentes formatos, incluindo [Ingress Controller construído em cima do Community Ingress NGINX Controller](installation-kubernetes-en.md).

Se você já usa um Ingress controller, pode ser desafiador substituir o Ingress controller existente pelo Controller Wallarm (por exemplo, se estiver usando o AWS ALB Ingress Controller). Nesse caso, você pode explorar a [solução Wallarm Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md), mas se ela também não se adequar à sua infraestrutura, é possível encadear vários Ingress Controllers.

O encadeamento do Ingress Controller permite que você utilize um controller existente para obter solicitações de usuários finais para um cluster, e implante um Ingress Controller Wallarm adicional para fornecer a proteção de aplicação necessária.

## Requisitos

* Versão da plataforma Kubernetes 1.24-1.27
* Gerenciador de pacotes [Helm](https://helm.sh/)
* Acesso à conta com a função **Administrador** e autenticação de dois fatores desativada no Wallarm Console para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem da UE](https://my.wallarm.com/)
* Acesso a `https://us1.api.wallarm.com` para trabalhar com a Wallarm Cloud dos EUA ou a `https://api.wallarm.com` para trabalhar com a Wallarm Cloud da UE
* Acesso a `https://charts.wallarm.com` para adicionar os gráficos Helm da Wallarm. Certifique-se de que o acesso não é bloqueado por um firewall
* Acesso aos repositórios Wallarm no Docker Hub `https://hub.docker.com/r/wallarm`. Garanta que o acesso não é bloqueado por um firewall
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
* Cluster do Kubernetes implantado rodando um Ingress controller

## Implantando o Wallarm Ingress controller e o encadeando com um Ingress Controller adicional

Para implantar o Wallarm Ingress controller e encadeá-lo com Controllers adicionais:

1. Implante o gráfico Helm do Controller Wallarm oficial usando um valor de classe Ingress diferente do Controller Ingress existente.
1. Crie o objeto Ingress específico do Wallarm com:

    * A mesma `ingressClass` que foi especificada no `values.yaml` do gráfico Helm do Wallarm Ingress.
    * As regras de roteamento de solicitações do Ingress controller configuradas da mesma maneira que o Controller Ingress existente.

    !!! info "O Wallarm Ingress controller não será exposto fora do cluster"
        Note que o Wallarm Ingress controller usa `ClusterIP` para seu serviço, o que significa que ele não será exposto fora do cluster.
1. Reconfigure o Controller Ingress existente para encaminhar pedidos de entrada para o novo Wallarm Ingress Controller em vez dos serviços de aplicação.
1. Teste a operação do Wallarm Ingress Controller.

### Passo 1: Implantar o Wallarm Ingress Controller

1. Gere um token de nó de filtragem do [tipo apropriado][node-token-types]:

    === "Token de API (gráfico Helm 4.6.8 e acima)"
        1. Abra Wallarm Console → **Configurações** → **Tokens de API** na [Nuvem dos EUA](https://us1.my.wallarm.com/settings/api-tokens) ou [Nuvem da UE](https://my.wallarm.com/settings/api-tokens).
        1. Encontre ou crie um token de API com a função de fonte `Deploy`.
        1. Copie esse token.
    === "Token de nó"
        1. Abra Wallarm Console → **Nós** na [Nuvem dos EUA](https://us1.my.wallarm.com/nodes) ou [Nuvem da UE](https://my.wallarm.com/nodes).
        1. Crie um nó de filtragem com o tipo **Wallarm node** e copie o token gerado.
            
            ![Criação de um nó Wallarm][nginx-ing-create-node-img]
1. Adicione o [repositório de gráficos Helm Wallarm](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update
    ```
1. Crie o arquivo `values.yaml` com a seguinte configuração do Wallarm:

    === "Nuvem dos EUA"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            apiHost: us1.api.wallarm.com
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"  
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: ClusterIP
        nameOverride: wallarm-ingress
        ```
    === "Nuvem da UE"
        ```bash
        controller:
          wallarm:
            enabled: true
            token: "<NODE_TOKEN>"
            # nodeGroup: defaultIngressGroup
          config:
            use-forwarded-headers: "true"
          ingressClass: wallarm-ingress
          ingressClassResource:
            name: wallarm-ingress
            controllerValue: "k8s.io/wallarm-ingress"
          service:
            type: "ClusterIP"
        nameOverride: wallarm-ingress
        ```    
    
    * `<NODE_TOKEN>` é o token do nó Wallarm.
    * Ao usar um token de API, especifique um nome de grupo de nó no parâmetro `nodeGroup`. Seu nó será atribuído a este grupo, mostrado na seção **Nós** do Wallarm Console. O nome do grupo padrão é `defaultIngressGroup`.

    Para aprender mais opções de configuração, por favor use o [link](configure-kubernetes-en.md).
1. Instale o gráfico Helm Wallarm Ingress:
    ``` bash
    helm install --version 4.8.2 internal-ingress wallarm/wallarm-ingress -n wallarm-ingress -f values.yaml --create-namespace
    ```

    * `internal-ingress` é o nome da versão Helm
    * `values.yaml` é o arquivo YAML com valores Helm criado no passo anterior
    * `wallarm-ingress` é o namespace onde instalar o gráfico Helm (será criado)
1. Verifique se o Wallarm ingress controller está operando: 

    ```bash
    kubectl get pods -n wallarm-ingress
    ```

    Cada status do pod deve ser **STATUS: Running** ou **READY: N/N**. Por exemplo:

    ```
    NAME                                                             READY   STATUS    RESTARTS   AGE
    internal-ingress-wallarm-ingress-controller-6d659bd79b-952gl      3/3     Running   0          8m7s
    internal-ingress-wallarm-ingress-controller-wallarm-tarant64m44   4/4     Running   0          8m7s
    ```

### Passo 2: Criar objeto Ingress com `ingressClassName` específica do Wallarm

Crie o objeto Ingress com o mesmo nome `ingressClass` configurado em `values.yaml` no passo anterior.

Ingress object deve estar no mesmo namespace onde sua aplicação está implantada, por exemplo:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/wallarm-application: "1"
    nginx.ingress.kubernetes.io/wallarm-mode: monitoring
  name: myapp-internal
  namespace: myapp
spec:
  ingressClassName: wallarm-ingress
  rules:
  - host: www.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp
            port:
              number: 80
```

### Passo 3: Reconfigure o Ingress controller existente para encaminhar solicitações para o Wallarm

Reconfigure o Ingress Controller existente para encaminhar as solicitações de entrada para o novo Wallarm Ingress Controller em vez dos serviços da aplicação como segue:

* Crie o objeto Ingress com o nome `ingressClass` para ser `nginx`. Note que este é o valor padrão, você pode substituí-lo pelo seu próprio valor se ele for diferente. 
* O objeto Ingress deve estar no mesmo namespace que o gráfico Wallarm Ingress, que é `wallarm-ingress` no nosso exemplo.
* O valor de `spec.rules[0].http.paths[0].backend.service.name` deve ser o nome do serviço Wallarm Ingress Controller que é composto pelo nome do release Helm e `.Values.nameOverride`.

    Para obter o nome, você pode usar o seguinte comando:
   
    ```bash
    kubectl get svc -l "app.kubernetes.io/component=controller" -n wallarm-ingress -o=jsonpath='{.items[0].metadata.name}'
    ```

    Em nosso exemplo, o nome é `internal-ingress-wallarm-ingress-controller`.

A configuração resultante do exemplo:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-external
  namespace: wallarm-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: www.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: internal-ingress-wallarm-ingress-controller
                port:
                  number: 80
```

### Passo 4: Teste a operação do Wallarm Ingress Controller

Obtenha o IP público do Load Balancer do Controlador Ingress externo existente, por exemplo, consideraremos que ele é implantado no namespace `ingress-nginx`:
```bash
LB_IP=$(kubectl get svc -l "app.kubernetes.io/component=controller" -n ingress-nginx -o=jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
```

Envie uma solicitação de teste para o endereço do Controlador Ingress existente e verifique se o sistema está funcionando como esperado:

```bash
curl -H "Host: www.example.com" ${LB_IP}/etc/passwd
```