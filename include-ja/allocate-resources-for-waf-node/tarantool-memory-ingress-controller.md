Tarantoolメモリは`ingress-controller-wallarm-tarantool`ポッド用に、`values.yaml`ファイル内の以下のセクションを使用して構成されます：

* GB単位でメモリを設定するには：
    ```
    controller:
      wallarm:
        tarantool:
          arena: "1.0"
    ```

* CPU単位でメモリを設定するには：
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

以下のパラメータは、`helm install`および`helm upgrade`コマンドの`--set`オプションを使用して設定されます。例えば：

=== "Ingress controller installation"
    ```bash
    helm install --set controller.wallarm.tarantool.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    また、正しくIngressコントローラをインストールするために必要な[他のパラメータ](../configure-kubernetes-en.md#additional-settings-for-helm-chart)も存在します。それらも`--set`オプションで指定してください。
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.tarantool.arena='0.4' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```