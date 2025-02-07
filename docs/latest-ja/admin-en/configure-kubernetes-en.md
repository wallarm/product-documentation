[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# NGINXベースのWallarm Ingress Controllerの微調整

自己ホスト型Wallarm Ingress Controllerを最大限に活用するための微調整オプションを学びます。

!!! info "公式NGINX Ingress Controllerのドキュメント"
    Wallarm Ingress Controllerの微調整は、[公式ドキュメント](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/)に記載のNGINX Ingress Controllerの微調整と非常に類似しています。Wallarmを使用する場合、元のNGINX Ingress Controllerの設定オプションすべてが利用可能です。

## Helm Chartの追加設定

設定は[`values.yaml`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml)ファイルに定義されています。デフォルトでは、ファイルは以下のようになっています:

```
controller:
  wallarm:
    enabled: false
    apiHost: api.wallarm.com
    apiPort: 443
    apiSSL: true
    token: ""
    nodeGroup: defaultIngressGroup
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
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    wallarm-appstructure:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    wallarm-antibot:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    metrics:
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## stats-exporterサービスが利用可能なIPアドレス一覧
        ## 参照: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
    addnode:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    cron:
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    collectd:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
    apiFirewall:
      enabled: true
      config:
        ...
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
        - value: EXTRA_ENV_VAR_VALUE
```

この設定を変更するには、Ingress Controllerのインストールの場合は`helm install`、既存のIngress Controllerパラメータ更新の場合は`helm upgrade`の`--set`オプションを使用することを推奨します。たとえば:

=== "Ingress Controllerのインストール"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Ingress Controllerパラメータの更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

以下に設定可能な主なパラメータの説明を示します。他のパラメータはデフォルト値が設定され、ほとんど変更する必要はありません。

### controller.wallarm.enabled

Wallarm機能の有効または無効を設定できます。

**デフォルト値**: `false`

### controller.wallarm.apiHost

Wallarm APIエンドポイントです。次の場合があります:

* [US cloud](../about-wallarm/overview.md#cloud)の場合は`us1.api.wallarm.com`
* [EU cloud](../about-wallarm/overview.md#cloud)の場合は`api.wallarm.com`

**デフォルト値**: `api.wallarm.com`

### controller.wallarm.token

フィルタリングノードのトークン値です。Wallarm APIにアクセスするために必要です。

トークンは、次の[タイプ][node-token-types]のいずれかとなります:

* **API token (おすすめ)** - UIの整理のために動的にノードグループを追加/削除する必要がある場合や、セキュリティ強化のためにトークンのライフサイクルを管理したい場合に最適です。API tokenの生成方法:
    
    1. Wallarm Consoleの**Settings**→**API tokens**に移動します。[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)で利用可能です。
    1. **Deploy**ソースロールでAPI tokenを作成します。
    1. ノード展開時に、生成したトークンを使用し、`controller.wallarm.nodeGroup`パラメータでグループ名を指定します。同一グループに複数のノードを、異なるAPI tokenを使用して追加できます。
* **Node token** - 既に使用するノードグループが判明している場合に適しています。

    Node tokenの生成方法:
    
    1. Wallarm Consoleの**Nodes**に移動します。[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で利用可能です。
    1. ノードを作成し、ノードグループに名称を付けます。
    1. ノード展開時に、該当グループのトークンを、グループに含める各ノードに対して使用します。

パラメータは、[`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret)の場合は無視されます。

**デフォルト値**: `not specified`

### controller.wallarm.nodeGroup

Helm Chartバージョン4.6.8以降、これは新規展開されるノードを追加するフィルタリングノードグループの名称を指定します。この方法でのノードグルーピングは、**Deploy**ロールのAPI tokenを使用してCloudにノードを作成および接続する場合にのみ利用可能です（値は`controller.wallarm.token`パラメータに渡されます）。

**デフォルト値**: `defaultIngressGroup`

### controller.wallarm.existingSecret

Helm Chartバージョン4.4.1以降、この設定ブロックを使用してKubernetes SecretからWallarmノードtokenの値を取得できます。別個のSecret管理が行われる環境（例: 外部Secretsオペレーターを使用している場合）で有用です。

Kubernetes Secretにノードtokenを格納し、Helm Chartに取り込む方法:

1. Wallarmノードtokenを使用してKubernetes Secretを作成します:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>` はWallarm Ingress Controller用のHelmリリースを作成したKubernetes Namespaceです.
    * `wallarm-api-token` はKubernetes Secretの名称です.
    * `<WALLARM_NODE_TOKEN>` はWallarm Console UIからコピーしたWallarmノードtokenの値です.

    外部Secretオペレーターを使用している場合は、[適切なドキュメント](https://external-secrets.io)に従ってSecretを作成してください.
2. `values.yaml`に以下の設定を行います:

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**デフォルト値**: `existingSecret.enabled: false`（Helm Chartは`controller.wallarm.token`からWallarmノードtokenを取得します）

### controller.wallarm.tarantool.replicaCount

postanalyticsの稼働中のPod数を指定します。postanalyticsは、行動ベースの攻撃検出に使用されます.

**デフォルト値**: `1`

### controller.wallarm.tarantool.arena

postanalyticsサービスに割り当てるメモリ量を指定します。直近5～15分間のリクエストデータを格納できる十分な値を設定することを推奨します.

**デフォルト値**: `1.0`

### controller.wallarm.metrics.enabled

このスイッチは[情報およびメトリクスの収集の切り替え](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)を行います。Kubernetesクラスターに[Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus)がインストールされている場合、追加の設定は不要です.

**デフォルト値**: `false`

### controller.wallarm.apifirewall

[node 5.1.0](../updating-migrating/node-artifact-versions.md#510-2024-11-06_1)以降、[API Specification Enforcement](../api-specification-enforcement/overview.md)の設定を制御します。デフォルトでは有効であり、以下のように設定されています。この機能を利用する場合、これらの値は変更しないことを推奨します.

```yaml
controller:
  wallarm:
    apiFirewall:
      ### API Firewall機能の有効化または無効化 (true|false)
      ###
      enabled: true
      readBufferSize: 8192
      writeBufferSize: 8192
      maxRequestBodySize: 4194304
      disableKeepalive: false
      maxConnectionsPerIp: 0
      maxRequestsPerConnection: 0
      config:
        mainPort: 18081
        healthPort: 18082
        specificationUpdatePeriod: 1m
        unknownParametersDetection: true
        #### TRACE|DEBUG|INFO|WARNING|ERROR
        logLevel: DEBUG
        ### TEXT|JSON
        logFormat: TEXT
      ...
```

[node 5.1.0](../updating-migrating/node-artifact-versions.md#510-2024-11-06_1)以降、以下の内容が提示されます（上記例のデフォルト値を参照）:

| Setting                   | Description                                                                                                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `readBufferSize`          | 接続ごとのリクエスト読み取りバッファサイズです。ヘッダーの最大サイズもこれにより制限されます。クライアントが数KBのRequestURIや、数KBに及ぶヘッダー（例: 大容量のCookie）を送信する場合は、このバッファを増加させてください。 |
| `writeBufferSize`         | 接続ごとのレスポンス書き込み用バッファサイズです。                                                                                                                                                                                                          |
| `maxRequestBodySize`      | リクエストボディの最大サイズです。この制限を超えるリクエストはサーバーにより拒否されます。                                                                                                                                                                 |
| `disableKeepalive`        | Keep-alive接続を無効化します。このオプションが`true`に設定されている場合、サーバーは最初のレスポンス送信後に全ての着信接続を閉じます。                                                                                                                     |
| `maxConnectionsPerIp`     | IPごとに許可される同時クライアント接続の最大数です。`0`は無制限を意味します。                                                                                                                                                                               |
| `maxRequestsPerConnection`| 接続ごとに処理されるリクエストの最大数です。最後のリクエスト送信後、サーバーは接続を閉じます。最後のレスポンスには`Connection: close`ヘッダーが追加されます。`0`は無制限を意味します。                                               |

### controller.wallarm.container_name.extraEnvs

本ソリューションで利用されるDockerコンテナに渡される追加の環境変数です。リリース4.10.6以降サポートされます.

以下の例は、Dockerコンテナに`https_proxy`および`no_proxy`変数を渡す方法を示しています。この設定により、外向きのHTTPSトラフィックは指定されたプロキシを経由し、ローカルトラフィックはそれをバイパスします。このような構成は、Wallarm APIなど外部通信がセキュリティ上の理由でプロキシを通過する必要がある環境で非常に重要です.

```yaml
controller:
  wallarm:
    apiHost: api.wallarm.com
    enabled: "true"
    token:  <API_TOKEN>
    addnode:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
    cron:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
        - name: no_proxy
          value: "localhost"
    collectd:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
        - name: no_proxy
          value: "localhost"
```

## グローバルController設定 

これは[ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/)を通じて実装されます.

標準のパラメータに加え、以下の追加パラメータがサポートされています:

* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Ingressアノテーション

これらのアノテーションは、個々のIngressインスタンスのパラメータを設定するために使用されます.

標準のアノテーションに加え、以下の追加アノテーションがサポートされています:

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode)、デフォルト: `"off"`
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-application](configure-parameters-en.md#wallarm_application)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)
* [nginx.ingress.kubernetes.io/wallarm-partner-client-uuid](configure-parameters-en.md#wallarm_partner_client_uuid)

### Ingressリソースへのアノテーション適用

これらの設定をIngressに適用するには、以下のコマンドを使用してください:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>` はIngressの名称です.
* `<YOUR_INGRESS_NAMESPACE>` はIngressのNamespaceです.
* `<ANNOTATION_NAME>` は上記リストからのアノテーション名です.
* `<VALUE>` は上記リストからのアノテーション値です.

### アノテーション例

#### ブロッキングページとエラーコードの設定

アノテーション`nginx.ingress.kubernetes.io/wallarm-block-page`は、以下の理由によりリクエストがブロックされた際にレスポンスで返すブロッキングページおよびエラーコードを設定するために使用されます:

* リクエストに、以下のタイプの悪意のあるペイロードが含まれている場合: [input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)、[vpatch attacks](../user-guides/rules/vpatch-rule.md)、または[正規表現に基づいて検出された攻撃](../user-guides/rules/regex-rule.md)。
* 上記リストの悪意あるペイロードを含むリクエストが、[graylisted IP address](../user-guides/ip-lists/overview.md)から発信され、ノードがsafe blocking[mode](configure-wallarm-mode.md)でリクエストをフィルタリングする場合。
* リクエストが[denylisted IP address](../user-guides/ip-lists/overview.md)から発信された場合。

例えば、ブロックされた任意のリクエストに対して、デフォルトのWallarmブロッキングページとエラーコード445を返すには:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[ブロッキングページとエラーコードの設定方法の詳細→](configuration-guides/configure-block-page-and-code.md)

#### libdetectionモードの管理

!!! info "**libdetection**のデフォルトモード"
    **libdetection**ライブラリのデフォルトモードは`on`（有効）です.

以下のいずれかのオプションを使用して、[**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection)モードを制御できます:

* Ingressリソースに以下の[`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet)アノテーションを適用する:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection off;"
    ```

    `wallarm_enable_libdetection`の利用可能な値は`on`/`off`です.
* Helm Chartにパラメータ`controller.config.server-snippet`を渡します:

    === "Ingress Controllerのインストール"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        正しいIngress Controllerのインストールには、[他のパラメータ](#additional-settings-for-helm-chart)も必要です。これらも`--set`オプションに渡してください.
    === "Ingress Controllerパラメータの更新"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

    `wallarm_enable_libdetection`の利用可能な値は`on`/`off`です.