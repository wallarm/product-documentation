# Considerações de Alta Disponibilidade (Controlador de Ingresso baseado em NGINX)

Este artigo fornece recomendações de configuração para que o controlador de Ingresso Wallarm seja altamente disponível e seja prevenido de inatividades.

--8<-- "../include/ingress-controller-best-practices-intro.md"

## Recomendações de configuração

As seguintes recomendações são relevantes para ambientes críticos (produção).

* Use mais de uma instância de pod do controlador de Ingresso. O comportamento é controlado usando o atributo `controller.replicaCount` no arquivo `values.yaml`. Por exemplo:
    ```
    controller:
      replicaCount: 2
    ```
* Forçar o cluster Kubernetes a colocar os pods do controlador de Ingresso em nós diferentes: isso aumentará a resiliência do serviço de Ingresso em caso de falha de um nó. Este comportamento é controlado usando a funcionalidade de anti-afinidade de pods do Kubernetes, que é configurada no arquivo `values.yaml`. Por exemplo:
    ```
    controller:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - nginx-ingress
            topologyKey: "kubernetes.io/hostname"
    ```
* Em clusters que estão sujeitos a picos de tráfego inesperados ou outras condições que podem justificar o uso do recurso de auto dimensionamento de pod horizontal do [Kubernetes (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/), ele pode ser habilitado no arquivo `values.yaml` usando o seguinte exemplo:
    ```
    controller:
      autoscaling:
        enabled: true
        minReplicas: 1
        maxReplicas: 11
        targetCPUUtilizationPercentage: 50
        targetMemoryUtilizationPercentage: 50
    ```
* Execute pelo menos duas instâncias do serviço pós-analítico da Wallarm baseado no banco de dados Tarantool. Esses pods incluem `ingress-controller-wallarm-tarantool` no nome. O comportamento é controlado no arquivo `values.yaml` usando o atributo `controller.wallarm.tarantool.replicaCount`. Por exemplo:
    ```
    controller:
      wallarm:
        tarantool:
          replicaCount: 2
    ```

## Procedimento de configuração

Para definir as configurações listadas, é recomendado usar a opção `--set` dos comandos `helm install` e `helm upgrade`, por exemplo:

=== "Instalação do controlador de Ingresso"
    ```bash
    helm install --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Existem também [outros parâmetros](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart) necessários para a correta instalação do controlador de ingresso. Por favor passe eles na opção `--set` também.
=== "Atualizando parâmetros do controlador de Ingresso"
    ```bash
    helm upgrade --reuse-values --set controller.replicaCount=2 <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```