Tarantoolのメモリは`ingress-controller-wallarm-tarantool`ポッドに対して、`values.yaml`ファイル内の以下のセクションを使用して設定します:

* メモリをGB単位で設定する場合:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* メモリをCPU単位で設定する場合:
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

リストされたパラメーターは、`helm install`および`helm upgrade`コマンドの`--set`オプションを使用して設定します。例えば:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しいIngress controllerのインストールには[その他パラメーター](../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。これらのパラメーターも`--set`オプションで指定してください。
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```