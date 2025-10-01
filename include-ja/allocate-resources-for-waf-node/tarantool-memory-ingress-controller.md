`ingress-controller-wallarm-tarantool` PodのTarantoolメモリは、`values.yaml`ファイルの以下のセクションで設定します:

* メモリをGB単位で設定する場合:
    ```
    controller:
      wallarm:
        tarantool:
          arena: "1.0"
    ```

* CPUとメモリを設定する場合:
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

列挙したパラメータは`helm install`および`helm upgrade`コマンドの`--set`オプションで設定します。例:

=== "Ingressコントローラーのインストール"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しくIngressコントローラーをインストールするには、[その他のパラメータ](../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。これらも`--set`オプションで指定してください。
=== "Ingressコントローラーのパラメータの更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```