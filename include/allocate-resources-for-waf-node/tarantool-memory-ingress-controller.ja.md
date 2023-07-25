`ingress-controller-wallarm-tarantool`ポッドのTarantoolメモリは、`values.yaml`ファイルの以下のセクションを使用して設定されます：

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

リストされたパラメータは、`helm install`および`helm upgrade`のコマンドの`--set`オプションを使用して設定されます。例：

=== "Ingressコントローラーのインストール"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しいIngressコントローラーのインストールには、[`--set`オプション](../configure-kubernetes-en.ja.md#additional-settings-for-helm-chart)でも他のパラメータが必要です。それらも`--set`オプションで渡してください。
=== "Ingressコントローラーパラメータの更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```