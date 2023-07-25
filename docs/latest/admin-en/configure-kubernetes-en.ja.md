[link-helm-chart-details]: https://github.com/wallarm/ingress-chart#configuration

# NGINXベースのWallarm Ingressコントローラーのファインチューニング

Wallarm Ingressコントローラーで利用可能なファインチューニングオプションを学び、Wallarmソリューションを最大限に活用しましょう。

!!! info "NGINX Ingressコントローラーの公式ドキュメント"
    Wallarm Ingressコントローラーのファインチューニングは、[公式ドキュメント](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/)で説明されているNGINX Ingressコントローラーのものと似ています。Wallarmで作業する際には、オリジナルのNGINX Ingressコントローラーを設定するためのすべてのオプションが利用可能です。

## Helmチャートの追加設定

この設定は、[`values.yaml`](https://github.com/wallarm/ingress-chart/blob/master/wallarm-ingress/values.yaml)ファイルに定義されています。デフォルトでは、ファイルは以下のようになっています。

```
controller:
  wallarm:
    enabled: false
    apiHost: api.wallarm.com
    apiPort: 443
    apiSSL: true
    token: ""
    existingSecret:
      enabled: false
      secretKey: token
      secretName: wallarm-api-token
    tarantool:
      kind: Deployment
      service:
        annotations: {}
      replicaCount: 1
      arena: "0.2"
      livenessProbe:
        failureThreshold: 3
        initialDelaySeconds: 10
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      resources: {}
    metrics:
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## List of IP addresses at which the stats-exporter service is available
        ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 9913
        type: ClusterIP
    synccloud:
      resources: {}
    collectd:
      resources: {}
```

この設定を変更するには、`helm install`（Ingressコントローラをインストールする場合）または`helm upgrade`（インストール済みのIngressコントローラのパラメータを更新する場合）のオプション`--set`を使用することをお勧めします。例えば、

=== "Ingressコントローラのインストール"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Ingressコントローラパラメーターの更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>### Ingressリソースに注釈を適用する

Ingressに設定を適用するには、次のコマンドを使用してください。

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>`は、Ingressの名前です。
* `<YOUR_INGRESS_NAMESPACE>`は、Ingressの名前空間です。
* `<ANNOTATION_NAME>`は、上記リストからの注釈の名前です。
* `<VALUE>`は、上記リストからの注釈の値です。

### 注釈の例

#### ブロックページとエラーコードの設定

注釈 `nginx.ingress.kubernetes.io/wallarm-block-page`は、次の理由でブロックされたリクエストへの応答で返されるブロックページとエラーコードを設定するために使用されます。

* 次の種類の悪意のあるペイロードを含むリクエスト：[入力検証攻撃](../about-wallarm/protecting-against-attacks.ja.md#input-validation-attacks)、[vpatch攻撃](../user-guides/rules/vpatch-rule.ja.md)、または[正規表現に基づいて検出される攻撃](../user-guides/rules/regex-rule.ja.md)。
* 上記リストからの悪意のあるペイロードを含むリクエストは、[グレーリストIPアドレス](../user-guides/ip-lists/graylist.ja.md)から発信され、ノードはセーフブロック[モード](configure-wallarm-mode.ja.md)でリクエストをフィルタリングします。
* リクエストは、[拒否リストIPアドレス](../user-guides/ip-lists/denylist.ja.md)から発信されます。

たとえば、ブロックされたすべてのリクエストへの応答で、デフォルトのWallarmブロックページとエラーコード445を返すには、次のようにします。

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[ブロックページとエラーコードの設定方法の詳細 →](configuration-guides/configure-block-page-and-code.ja.md)

#### libdetectionモードの管理

!!! info "**libdetection** デフォルトモード"
    **libdetection**ライブラリのデフォルトモードは`on`（有効）です。

[**libdetection**](../about-wallarm/protecting-against-attacks.ja.md#library-libdetection)モードを制御するには、次のオプションのいずれかを使用します。

* Ingressリソースに次の[`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet)注釈を適用します。

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection on/off;"
    ```
* ヘルムチャートに`controller.config.server-snippet`パラメータを渡します。

    === "Ingressコントローラのインストール"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        正しいIngressコントローラのインストールには、[他のパラメータ](#additional-settings-for-helm-chart)も必要です。それらも`--set`オプションで渡してください。
    === "Ingressコントローラパラメータの更新"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```