[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Atualizando o Wallarm Sidecar

Estas instruções descrevem os passos para atualizar o Wallarm Sidecar 4.x para a nova versão com o nó Wallarm 4.8.

## Requisitos

--8<-- "../include/waf/installation/sidecar-proxy-reqs.md"

## Passo 1: Atualize o repositório do gráfico Helm do Wallarm

```bash
helm repo update wallarm
```

## Passo 2: Verifique todas as próximas alterações do manifesto K8s

Para evitar um comportamento inesperadamente alterado do Sidecar, verifique todas as próximas alterações do manifesto K8s usando o [Plugin Helm Diff](https://github.com/databus23/helm-diff). Este plugin exibe a diferença entre os manifestos K8s da versão Sidecar implantada e da nova.

Para instalar e rodar o plugin:

1. Instale o plugin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Execute o plugin:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.8.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: o nome do release Helm com o gráfico do Sidecar
    * `<NAMESPACE>`: o namespace para o qual o Sidecar está implantado
    * `<PATH_TO_VALUES>`: o caminho para o arquivo `values.yaml` que define as configurações do Sidecar 4.8 - você pode usar o criado para rodar a versão anterior do Sidecar
3. Certifique-se de que nenhuma alteração pode afetar a estabilidade dos serviços em execução e examine cuidadosamente os erros do stdout.

    Se o stdout estiver vazio, verifique se o arquivo `values.yaml` é válido.

## Passo 3: Atualize a solução Sidecar

Atualize os componentes implantados da solução Sidecar:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.8.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: o nome do release Helm com o gráfico do Sidecar implantado
* `<NAMESPACE>`: o namespace para o qual o Sidecar está implantado
* `<PATH_TO_VALUES>`: o caminho para o arquivo `values.yaml` que define as configurações do Sidecar 4.8 - você pode usar o criado para rodar a versão anterior do Sidecar

## Passo 4: Teste a solução Sidecar atualizada

1. Verifique se a versão do gráfico Helm foi atualizada:

    ```bash
    helm list -n wallarm-sidecar
    ```

    Onde `wallarm-sidecar` é o namespace para o qual o Sidecar está implantado. Você pode alterar este valor se o namespace for diferente.

    A versão do gráfico deve corresponder a `wallarm-sidecar-1.1.5`.
1. Obtenha os detalhes do pod Wallarm para verificar se eles foram iniciados com sucesso:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Cada pod deve exibir o seguinte: **READY: N/N** e **STATUS: Running**, por exemplo:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Envie o ataque de teste [Path Traversal](../attacks-vulns-list.md#path-traversal) para o endereço do cluster de aplicativos:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    O Pod do aplicativo solicitado deve ter o rótulo `wallarm-sidecar: enabled`.

    Verifique se a solução da versão mais recente processa a solicitação maliciosa como fez na versão anterior.