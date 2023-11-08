[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Atualizando o controlador de tráfego Kong Ingress com módulos integrados Wallarm

Estas instruções descrevem os passos para atualizar o Controlador de Tráfego Kong baseado em Wallarm 4.x para a nova versão com o nó Wallarm 4.8.

## Requisitos

--8<-- "../include-pt-BR/waf/installation/kong-ingress-controller-reqs.md"

## Passo 1: Atualize o repositório do Wallarm Helm chart

```bash
helm repo update wallarm
```

## Passo 2: Verifique todas as próximas alterações no manifesto K8s

Para evitar mudanças inesperadas no comportamento do controlador de tráfego, verifique todas as próximas alterações no manifesto K8s usando o [Helm Diff Plugin](https://github.com/databus23/helm-diff). Este plugin exibe a diferença entre os manifestos K8s da versão do controlador de tráfego implantada e a nova.

Para instalar e executar o plugin:

1. Instale o plugin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Execute o plugin:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: o nome da versão do Helm com o gráfico do controlador de tráfego
    * `<NAMESPACE>`: o namespace onde o gráfico do Helm com o controlador de tráfego está implantado
    * `<PATH_TO_VALUES>`: o caminho para o arquivo `values.yaml` que define as configurações do controlador de tráfego 4.8 - você pode usar o que foi criado para executar a versão anterior do controlador de tráfego
3. Certifique-se de que nenhuma mudança pode afetar a estabilidade dos serviços em execução e examine cuidadosamente os erros do stdout.

    Se o stdout estiver vazio, certifique-se de que o arquivo `values.yaml` é válido.

## Passo 3: Atualize o controlador de tráfego

Atualize o controlador de tráfego Kong implantado:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: o nome da versão do Helm com o gráfico do controlador de tráfego
* `<NAMESPACE>`: o namespace onde o gráfico do Helm com o controlador de tráfego está implantado
* `<PATH_TO_VALUES>`: o caminho para o arquivo `values.yaml` que define as configurações do controlador de tráfego 4.8 - você pode usar o que foi criado para executar a versão anterior do controlador de tráfego

## Passo 4: Teste o controlador de tráfego atualizado

1. Certifique-se de que a versão do gráfico do Helm foi atualizada:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Onde `<NAMESPACE>` é o namespace onde o gráfico do Helm com o controlador de tráfego está implantado.

    A versão do gráfico deve corresponder a `kong-4.6.3`.
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
1. Envie os ataques de teste [Path Traversal](../attacks-vulns-list.md#path-traversal) para o Serviço do Controlador de Tráfego Kong Ingress:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Verifique se a solução da versão mais recente processa a solicitação maliciosa como fazia na versão anterior.