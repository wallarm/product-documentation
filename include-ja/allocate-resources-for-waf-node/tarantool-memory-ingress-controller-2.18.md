`ingress-controller-wallarm-tarantool` ポッドの Tarantool メモリは、`values.yaml` ファイルの以下のセクションを使用して設定されます：

* GB単位でメモリを設定する：
    ``` yaml
    controller:
      wallarm:
        tarantool:
          arena: "0.2"
    ```

* CPU単位でメモリを設定する：
    ``` yaml
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

上記のパラメーターは、`helm install` と `helm upgrade` コマンドの `--set` オプションを使用して設定されます。例えば：

=== "Ingress コントローラーのインストール"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しい Ingress コントローラーのインストールには、他の[追加設定](../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。それらも `--set` オプションで渡してください。
=== "Ingress コントローラーパラメータの更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
