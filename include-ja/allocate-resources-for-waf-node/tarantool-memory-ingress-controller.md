`ingress-controller-wallarm-tarantool`ポッドのTarantoolメモリは、`values.yaml`ファイルの次のセクションで設定されます。

* GBでメモリーを設定するには：
    ```
    コントローラー:
      wallarm:
        tarantool:
          arena: "1.0"
    ```

* CPUのメモリーを設定するには：
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

上記のパラメーターは、`helm install`と`helm upgrade`コマンドの`--set`オプションを使用して設定されます。たとえば：

=== "Ingressコントローラーのインストール"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    Ingressコントローラーの正しいインストールには、他にも[必要なパラメーター](../configure-kubernetes-en.md#additional-settings-for-helm-chart)があります。それらも`--set`オプションで渡してください。
=== "Ingressコントローラーパラメーターの更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```