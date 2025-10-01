wstoreメモリは`values.yaml`ファイルの次のセクションで設定します:

* GB単位でメモリを設定するには:
    ```
    controller:
      wallarm:
        postanalytics:
          arena: "1.0"
    ```

* CPU/メモリのリソースを設定するには:
    ```
    controller:
      wallarm:
        postanalytics:
          resources:
            limits:
              cpu: 400m
              memory: 3280Mi
            requests:
              cpu: 200m
              memory: 1640Mi
    ```

以下のパラメータは`helm install`および`helm upgrade`コマンドの`--set`オプションで設定します。例:

=== "Ingressコントローラのインストール"
    ```bash
    helm install --set controller.wallarm.postanalytics.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    正しくIngressコントローラをインストールするには[その他のパラメータ](../configure-kubernetes-en.md#additional-settings-for-helm-chart)も必要です。それらも`--set`オプションで渡してください。
=== "Ingressコントローラのパラメータ更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.postanalytics.arena='1.0' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```