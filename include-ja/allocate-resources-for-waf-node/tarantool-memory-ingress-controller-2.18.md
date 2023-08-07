`ingress-controller-wallarm-tarantool`パッドのTarantoolメモリ設定は、`values.yaml`ファイルの以下のセクションを使用して設定します：

* GB単位でメモリを設定するには：
    ```
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* CPU単位でメモリを設定するには：
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

リストされたパラメータは、コマンド`helm install`と`helm upgrade`の`--set`オプションを使って設定されます。例えば：

=== "Ingressコントローラのインストール"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しくIngressコントローラをインストールするためには、他にも必要な[パラメーター](../configure-kubernetes-en.md#additional-settings-for-helm-chart)があります。それらも`--set`オプションで渡してください。
=== "Ingressコントローラのパラメータ更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```