`values.yaml`ファイルの以下のセクションを使用して、`ingress-controller-wallarm-tarantool`PodのTarantoolメモリを設定します:

* メモリをGBで設定する場合:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* CPUおよびメモリを設定する場合:
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

以下のパラメーターは`helm install`および`helm upgrade`コマンドの`--set`オプションで設定します。例:

=== "Ingressコントローラーのインストール"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しくIngressコントローラーをインストールするには[その他のパラメーター](../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。これらも`--set`オプションで指定してください。
=== "Ingressコントローラーのパラメーター更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```