A memória do Tarantool é configurada para o pod `ingress-controller-wallarm-tarantool` usando as seguintes seções no arquivo `values.yaml`:

* Para configurar a memória em GB:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* Para configurar a memória em CPU:
    ```
    controller:
      wallarm:
        tarantool:
          resources:
            limits:
              cpu: 1000m
              memory: 1640Mi
            requests:
              cpu: 1000m
              memory: 1640Mi
    ```

Os parâmetros listados são configurados usando a opção `--set` dos comandos `helm install` e `helm upgrade`, por exemplo:

=== "Instalação do controlador Ingress"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <NOME_DO_CONTROLADOR_INGRESS> ingress-chart/wallarm-ingress -n <ESPAÇO_DE_NOMES_KUBERNETES>
    ```

    Também existem [outros parâmetros](../configure-kubernetes-en.md#additional-settings-for-helm-chart) necessários para a correta instalação do controlador Ingress. Por favor, passe-os na opção `--set` também.
=== "Atualização dos parâmetros do controlador Ingress"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <NOME_DO_CONTROLADOR_INGRESS> ingress-chart/wallarm-ingress -n <ESPAÇO_DE_NOMES_KUBERNETES>
    ```