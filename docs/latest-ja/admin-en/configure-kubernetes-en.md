# NGINXベースのWallarm Ingressコントローラの微調整

Wallarm Ingressコントローラで利用可能な微調整オプションを学び、Wallarmソリューションを最大限に活用しましょう。

!!! info "NGINX Ingressコントローラの公式ドキュメンテーション"
    Wallarm Ingressコントローラの微調整は、[公式ドキュメンテーション](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/)で説明されているNGINX Ingressコントローラのそれと非常に似ています。Wallarmを使用する際には、オリジナルのNGINX Ingressコントローラを設定するための全てのオプションが利用可能です。

## Helm Chartの追加設定

設定は[`values.yaml`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml)ファイルで定義されます。デフォルトでは、このファイルは以下のように表示されます：

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
      arena: "1.0"
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
        externalIPs: []
        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
    synccloud:
      resources: {}
    collectd:
      resources: {}
```

この設定を変更するには、`helm install`のオプション`--set`を使用することを推奨します（Ingressコントローラをインストールする場合）または`helm upgrade`（インストール済みのIngressコントローラのパラメータを更新する場合）。例えば：

=== "Ingressコントローラのインストール"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Ingressコントローラパラメータの更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

主なパラメータの説明を以下に提供します。他のパラメータはデフォルト値で提供され、それらの変更はほとんど必要ではありません。

### controller.wallarm.enabled

Wallarmの機能を有効にするか無効にすることができます。

**デフォルト値**：`false`

### controller.wallarm.apiHost

Wallarm APIエンドポイント。次のものが可能です：

* [USクラウド](../about-wallarm/overview.md#us-cloud)用の`us1.api.wallarm.com`。
* [EUクラウド](../about-wallarm/overview.md#eu-cloud)用の`api.wallarm.com`。

**デフォルト値**：`api.wallarm.com`

### controller.wallarm.token

*Wallarm Node*トークンは、[US](https://us1.my.wallarm.com/nodes)または[EU](https://my.wallarm.com/nodes)クラウドのWallarmポータルで作成されます。Wallarm APIにアクセスするために必要です。

パラメータは[`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret)の場合に無視されます。

**デフォルト値**：`指定なし`

### controller.wallarm.existingSecret

Helmチャートバージョン4.4.1から、この設定ブロックを使用してKubernetesのシークレットからWallarmノードトークンの値を取得することができます。これは別のシークレット管理がある環境に便利です（例：外部のシークレットオペレーターを使用します）

ノードトークンをK8sシークレットに保存し、Helmチャートに引き出すには：

1. Wallarmノードトークンを持つKubernetesシークレットを作成します：

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>`は、Wallarm Ingressコントローラを含むHelmリリース用に作成したKubernetes名前空間です
    * `wallarm-api-token`はKubernetesのシークレット名です
    * `<WALLARM_NODE_TOKEN>`は、Wallarm Console UIからコピーしたWallarmノードトークンの値です

    外部のシークレットオペレーターを使用する場合は、[適切なドキュメンテーションに従ってシークレットを作成](https://external-secrets.io)してください。

1. `values.yaml`で以下の設定を適用します：

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**デフォルト値**：`existingSecret.enabled: false`であり、これはHelmチャートが`controller.wallarm.token`からWallarmノードトークンを取得することを示しています。

### controller.wallarm.tarantool.replicaCount

postanalyticsのための動作中のポッドの数です。Postanalyticsは、振る舞いベースの攻撃検出に使用されます。

**デフォルト値**：`1`

### controller.wallarm.tarantool.arena

postanalyticsサービスのために割り当てられたメモリの量を指定します。過去5〜15分間のリクエストデータを保存するための十分な値を設定することをお勧めします。

**デフォルト値**：`0.2`

### controller.wallarm.metrics.enabled

このスイッチは、情報とメトリックの収集を[切り替えます](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)。[Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus)がKubernetesクラスタにインストールされている場合、追加の設定は必要ありません。

**デフォルト値**：`false`

## グローバルコントローラ設定

[ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/)を通じて実装されます。

以下の追加のパラメータがサポートされています。

* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Ingressアノテーション

これらのアノテーションは、個々のIngressインスタンスの処理パラメータを設定するために使用されます。

[標準的なものに加えて](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)、以下の追加のアノテーションがサポートされています：

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode)、デフォルト：オフ
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-application](configure-parameters-en.md#wallarm_application)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)
* [nginx.ingress.kubernetes.io/wallarm-partner-client-uuid](configure-parameters-en.md#wallarm_partner_client_uuid)

### Ingressリソースへの注釈の適用

設定をIngressに適用するには、以下のコマンドを使用してください：

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>`はIngressの名前です
* `<YOUR_INGRESS_NAMESPACE>`はIngressの名前空間です
* `<ANNOTATION_NAME>`は上記リストからの注釈の名前です
* `<VALUE>`は上記リストからの注釈の値です

### アノテーションの例

#### ブロックページとエラーコードの設定

アノテーション`nginx.ingress.kubernetes.io/wallarm-block-page`は、以下の理由でブロックされたリクエストの応答に戻されるブロックページとエラーコードを設定します：

* [入力の検証攻撃](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch攻撃](../user-guides/rules/vpatch-rule.md)、または[通常の表現に基づいて検出された攻撃](../user-guides/rules/regex-rule.md)のようなタイプの悪意のあるペイロードを含むリクエスト。
* 上記の悪意のあるペイロードを含むリクエストは[グレーリスト化されたIPアドレス](../user-guides/ip-lists/graylist.md)から発行され、ノードは[安全なブロックモード](configure-wallarm-mode.md)のリクエストをフィルタリングします。
* リクエストは[拒否リストに置かれたIPアドレス](../user-guides/ip-lists/denylist.md)から発行されます。

例えば、ブロックされた任意のリクエストへの応答に、デフォルトのWallarmブロックページとエラーコード445を返す設定：

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[ブロックページとエラーコードの設定方法の詳細 →](configuration-guides/configure-block-page-and-code.md)

#### libdetectionモードの管理

!!! info "**libdetection**のデフォルトモード"
    **libdetection**ライブラリのデフォルトモードは`オン`（有効）です。

以下のオプションのいずれかを使用して[**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection)モードを制御できます：

* Ingressリソースに以下の[`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet)アノテーションを適用します：

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection off;"
    ```
* パラメータ`controller.config.server-snippet`をHelmチャートに渡します：

    === "Ingressコントローラのインストール"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        正しいIngressコントローラのインストールには[他のパラメータが必要です](#additional-settings-for-helm-chart)。それらも`--set`オプションで渡してください。
    === "Ingressコントローラパラメータの更新"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
