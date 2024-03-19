A memória do Tarantool é configurada para o pod `ingress-controller-wallarm-tarantool` usando as seguintes seções no arquivo `values.yaml`:

* Para configurar a memória em GB:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "1.0"
    ```

* Para configurar a memória em CPU:
    ```
    controller:
      wallarm:
        tarantool:
          resources:
            limits:
              cpu: 400m
              memory: 3280Mi
            requests:
              cpu: 200m
              memory: 1640Mi
    ```

Os parâmetros listados são definidos usando a opção `--set` dos comandos `helm install` e `helm upgrade`, por exemplo:

=== "Instalação do controlador de entrada"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Também existem [outros parâmetros](../configure-kubernetes-en.md#additional-settings-for-helm-chart) necessários para a instalação correta do Controlador de Entrada. Por favor, passe-os na opção `--set` também.
=== "Atualizando parâmetros do controlador de entrada"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
