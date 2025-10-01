[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# NGINXベースのWallarm Ingressコントローラーの詳細チューニング

セルフホスト型のWallarm Ingressコントローラーで利用可能な詳細チューニング方法をご紹介します。これにより、Wallarmソリューションを最大限に活用できます。

!!! info "NGINX Ingress Controllerの公式ドキュメント"
    Wallarm Ingressコントローラーの詳細チューニングは、[公式ドキュメント](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/)で説明されているNGINX Ingress Controllerのものと非常に類似しています。Wallarmを使用する場合でも、元のNGINX Ingress Controllerの設定オプションはすべて利用できます。

## Additional Settings for Helm Chart

設定は[`values.yaml`](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml)ファイルで定義します。デフォルトでは、以下のとおりです。

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
    postanalytics:
      kind: Deployment
      service:
        annotations: {}
      arena: "2.0"
      serviceAddress: "[::]:3313"
      livenessProbe:
        failureThreshold: 3
        initialDelaySeconds: 10
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      tls:
        enabled: false
      #  certFile: "/root/test-tls-certs/server.crt"
      #  keyFile: "/root/test-tls-certs/server.key"
      #  caCertFile: "/root/test-tls-certs/ca.crt"
      #  mutualTLS:
      #    enabled: false
      #    clientCACertFile: "/root/test-tls-certs/ca.crt"
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wallarm-appstructure:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wallarm-antibot:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    metrics:
      port: 18080
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## stats-exporterサービスを利用可能にするIPアドレスの一覧
        ## 参考: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 18080
        type: ClusterIP
    init:
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wcliController:
      logLevel: warn
      commands:
        apispec:
          logLevel: INFO
        blkexp:
          logLevel: INFO
        botexp:
          logLevel: WARN
        cntexp:
          logLevel: ERROR
        cntsync:
          logLevel: INFO
        credstuff:
          logLevel: INFO
        envexp:
          logLevel: INFO
        ipfeed:
          logLevel: INFO
        iplist:
          logLevel: INFO
        jwtexp:
          logLevel: INFO
        metricsexp:
          logLevel: INFO
        mrksync:
          logLevel: INFO
        register:
          logLevel: INFO
        reqexp:
          logLevel: INFO
        syncnode:
          logLevel: INFO
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    wcliPostanalytics:
      logLevel: warn
      commands:
        apispec:
          logLevel: INFO
        blkexp:
          logLevel: INFO
        botexp:
          logLevel: WARN
        cntexp:
          logLevel: ERROR
        cntsync:
          logLevel: INFO
        credstuff:
          logLevel: INFO
        envexp:
          logLevel: INFO
        ipfeed:
          logLevel: INFO
        iplist:
          logLevel: INFO
        jwtexp:
          logLevel: INFO
        metricsexp:
          logLevel: INFO
        mrksync:
          logLevel: INFO
        register:
          logLevel: INFO
        reqexp:
          logLevel: INFO
        syncnode:
          logLevel: INFO
      resources: {}
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
    apiFirewall:
      enabled: true
      config:
        ...
      extraEnvs:
        - name: EXTRA_ENV_VAR_NAME
          value: EXTRA_ENV_VAR_VALUE
validation:
  enableCel: false
  forbidDangerousAnnotations: false
```

この設定を変更する場合、Ingressコントローラーのインストール時は`helm install`の`--set`オプション、既存のIngressコントローラーのパラメータを更新する場合は`helm upgrade`の`--set`オプションの使用を推奨します。例:

=== "Ingressコントローラーのインストール"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Ingressコントローラーのパラメータ更新"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

以下に主なパラメータの説明を示します。その他のパラメータはデフォルト値が設定されており、変更の必要はほとんどありません。

### controller.wallarm.enabled

Wallarmの機能を有効化または無効化できます。

**デフォルト値**: `false`

### controller.wallarm.apiHost

Wallarm APIエンドポイントです。次のいずれかを指定します。

* [USクラウド](../about-wallarm/overview.md#cloud)の場合は`us1.api.wallarm.com`
* [EUクラウド](../about-wallarm/overview.md#cloud)の場合は`api.wallarm.com`

**デフォルト値**: `api.wallarm.com`

### controller.wallarm.token

フィルタリングノードのトークン値です。Wallarm APIへのアクセスに必要です。

トークンは次の[種類][node-token-types]のいずれかです。

* **API token（推奨）** - UIの編成のためにノードグループを動的に追加/削除したい場合や、セキュリティ向上のためにトークンのライフサイクルを管理したい場合に最適です。API tokenを作成するには:

    API tokenを作成するには:
    
    1. Wallarm Console → **Settings** → **API tokens**（[US Cloud](https://us1.my.wallarm.com/settings/api-tokens)または[EU Cloud](https://my.wallarm.com/settings/api-tokens)）に移動します。
    1. 使用タイプに**Node deployment/Deployment**を選択してAPI tokenを作成します。
    1. ノードのデプロイ時に作成したトークンを使用し、`controller.wallarm.nodeGroup`パラメータでグループ名を指定します。異なるAPI tokenを使用して複数のノードを同一グループに追加できます。
* **Node token** - 使用するノードグループがすでに決まっている場合に適しています。

    Node tokenを作成するには:
    
    1. Wallarm Console → **Nodes**（[US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)）に移動します。
    1. ノードを作成し、ノードグループ名を設定します。
    1. そのグループに含めたい各ノードのデプロイ時に、グループのトークンを使用します。

[`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret)の場合、このパラメータは無視されます。

**デフォルト値**: `not specified`

### controller.wallarm.nodeGroup

Helmチャートバージョン4.6.8以降、新規デプロイするノードを追加するフィルタリングノードグループの名前を指定します。この方法でのノードのグループ化は、使用タイプに**Node deployment/Deployment**を持つAPI token（その値を`controller.wallarm.token`に渡します）でノードを作成してWallarm Cloudに接続する場合にのみ利用できます。

**デフォルト値**: `defaultIngressGroup`

### controller.wallarm.existingSecret

Helmチャートバージョン4.4.1以降、Kubernetes SecretからWallarmノードトークン値を取得するためにこの設定ブロックを使用できます。外部のシークレット管理（例: external secrets operatorを使用）を行う環境で有用です。

ノードトークンをK8s Secretに保存し、Helmチャートへ渡すには:

1. Wallarmノードトークンを格納するKubernetes Secretを作成します:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>`は、Wallarm IngressコントローラーのHelmリリース用に作成したKubernetesのNamespaceです
    * `wallarm-api-token`はKubernetes Secret名です
    * `<WALLARM_NODE_TOKEN>`はWallarm ConsoleのUIからコピーしたWallarmノードトークン値です

    外部のSecretオペレーターを使用する場合は、[該当ドキュメントに従ってSecretを作成](https://external-secrets.io)してください。
1. `values.yaml`に以下の設定を行います:

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**デフォルト値**: `existingSecret.enabled: false`（Helmチャートは`controller.wallarm.token`からWallarmノードトークンを取得します）

### controller.wallarm.postanalytics.arena

postanalyticsサービスに割り当てるメモリ量を指定します。直近5〜15分のリクエストデータを保持できる十分な値を設定することを推奨します。

**デフォルト値**: `2.0`

[NGINX Node 5.x以前](../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)では、このパラメータ名は`controller.wallarm.tarantool.arena`でした。アップグレード時には名称変更が必要です。

### controller.wallarm.postanalytics.serviceAddress

**wstore**が受信接続を受け付けるアドレスとポートを指定します。

リリース6.3.0以降でサポートされています。

**デフォルト値**: `[::]:3313`（IPv4およびIPv6のすべてのインターフェースでポート3313をリッスン）。これは6.3.0以前のバージョンにおけるデフォルト動作でもあります。

### controller.wallarm.postanalytics.tls

postanalyticsモジュールへの安全な接続を可能にするTLSおよび相互TLS（mTLS）の設定を行います（任意）:

```yaml
controller:
  wallarm:
    postanalytics:
      tls:
        enabled: false
      #  certFile: "/root/test-tls-certs/server.crt"
      #  keyFile: "/root/test-tls-certs/server.key"
      #  caCertFile: "/root/test-tls-certs/ca.crt"
      #  mutualTLS:
      #    enabled: false
      #    clientCACertFile: "/root/test-tls-certs/ca.crt"
```

リリース6.2.0以降でサポートされています。

| パラメータ | 説明 | 必須か |
| --------- | ---- | ------ |
| `enabled` | postanalyticsモジュールへの接続に対するSSL/TLSを有効化/無効化します。デフォルトは`false`（無効）です。 | はい |
| `certFile` | Filtering NodeがpostanalyticsモジュールへのSSL/TLS接続を確立する際に自身を認証するために使用するクライアント証明書のパスを指定します。 | `mutualTLS.enabled`が`true`の場合は必須 |
| `keyFile` | `certFile`で指定したクライアント証明書に対応する秘密鍵のパスを指定します。 | `mutualTLS.enabled`が`true`の場合は必須 |
| `caCertFile` | postanalyticsモジュールが提示するTLS証明書を検証するために使用する信頼された認証局（CA）証明書のパスを指定します。 | カスタムCAを使用する場合は必須 |
| `mutualTLS.enabled` | Filtering Nodeとpostanalyticsモジュールの双方が証明書で相互にアイデンティティを検証する相互TLS（mTLS）を有効にします。デフォルトは`false`（無効）です。 | いいえ |
| `mutualTLS.clientCACertFile` | Filtering Nodeが提示するTLS証明書を検証するために使用する信頼された認証局（CA）証明書のパスを指定します。 | カスタムCAを使用する場合は必須 |

### controller.wallarm.metrics.enabled

情報およびメトリクス収集を[切り替え](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)ます。Kubernetesクラスターに[Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus)がインストールされている場合、追加の設定は不要です。

**デフォルト値**: `false`

### controller.wallarm.apifirewall

リリース4.10以降で利用可能な[API Specification Enforcement](../api-specification-enforcement/overview.md)の設定を制御します。デフォルトでは有効で、以下のとおり設定されています。この機能を使用している場合、これらの値は変更しないことを推奨します。

```yaml
controller:
  wallarm:
    apiFirewall:
      ### API Firewall機能の有効化/無効化（true|false）
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

Node 5.1.0以降では、次の設定項目が提供されています（デフォルト値は上記例を参照）。

| 設定 | 説明 |
| ---- | ---- |
| `readBufferSize` | リクエスト読み取り用の接続ごとのバッファサイズです。これは最大ヘッダーサイズの上限にもなります。クライアントが数KBのRequestURIや数KBのヘッダー（例: 大きなCookie）を送信する場合は、このバッファを増やしてください。 |
| `writeBufferSize` | レスポンス書き込み用の接続ごとのバッファサイズです。 |
| `maxRequestBodySize` | リクエストボディの最大サイズです。サーバーはこの上限を超えるボディを持つリクエストを拒否します。 |
| `disableKeepalive` | keep-alive接続を無効にします。このオプションが`true`の場合、サーバーはクライアントに最初のレスポンスを送信した後にすべての受信接続を閉じます。 |
| `maxConnectionsPerIp` | IPアドレスごとに許可される同時クライアント接続の最大数です。`0`は無制限です。 |
| `maxRequestsPerConnection` | 接続1本あたりで処理するリクエストの最大数です。サーバーは最後のリクエスト処理後に接続を閉じ、最後のレスポンスに`Connection: close`ヘッダーを追加します。`0`は無制限です。 |

### controller.wallarm.container_name.extraEnvs

ソリューションで使用するDockerコンテナに渡す追加の環境変数です。リリース4.10.6以降でサポートされています。

以下は、`https_proxy`と`no_proxy`環境変数をDockerコンテナに渡す例です。この構成により、送信HTTPSトラフィックは指定したプロキシを経由し、ローカルトラフィックはプロキシをバイパスします。Wallarm APIとの通信など外部通信をセキュリティ上の理由でプロキシ経由にする必要がある環境で重要です。

```yaml
controller:
  wallarm:
    apiHost: api.wallarm.com
    enabled: "true"
    token:  <API_TOKEN>
    init:
      extraEnvs:
        - name: https_proxy
          value: https://1.1.1.1:3128
```

### validation.enableCel

[Validating Admission Policies](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/)を使用して`Ingress`リソースを検証できるようにします。

この機能には以下が必要です。

* Kubernetes v1.30以上
* Wallarm Helmチャート 5.3.14+（5.x系）または6.0.2+

`true`に設定すると、Helmチャートは次をデプロイします。

* すべての`Ingress`リソース（`networking.k8s.io/v1`）に対するCELルールを定義する`ValidatingAdmissionPolicy ingress-safety-net`
* それらのルールを`cluster-wide`に`Deny`アクションで実行する`ValidatingAdmissionPolicyBinding ingress-safety-net-binding`

デフォルトルールは、通常`nginx -t`で検出される一般的な誤設定を検出します。

* ワイルドカードホストの禁止（例: `*.example.com`）
* Ingress内のすべてのhost値が一意であることの確認
* 各HTTPパスにサービス名とポートが含まれていることの検証
* すべてのパスが`/`で始まることの要求
* 一般的なサイズ/時間/真偽値アノテーション（`proxy-buffer-size`、`proxy-read-timeout`、`ssl-redirect`）のフォーマット検証

検証はIngressの作成または更新時に行われ、不適切に設定されたリソースは拒否されます。

この仕組みは、[CVE-2025-1974](https://nvd.nist.gov/vuln/detail/CVE-2025-1974)により現在[上流のNGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx)で無効化されているテンプレートテストを置き換えるものです。

**デフォルト値**: `false`

**検証ルールのカスタマイズ**

[Common Expression Language（CEL）](https://github.com/google/cel-spec)を使用して、デフォルトのルールセットを拡張または変更できます。

1. 必要なバージョンの[Wallarm Helmチャート](https://github.com/wallarm/helm-charts/tree/main/wallarm-ingress)をダウンロードします。
1. `templates/ingress-safety-vap.yaml`ファイル内のルールを修正します。
1. [標準のデプロイ手順](installation-kubernetes-en.md)に従い、修正したディレクトリからチャートをデプロイします。

### validation.forbidDangerousAnnotations

明示的に危険なNGINX Ingressのアノテーション`server-snippet`および`configuration-snippet`をブロックする追加のCELルールを有効にします。

すべてのsnippet系アノテーションを許可すると攻撃面が広がります。Ingressの作成や更新権限を持つ任意のユーザーが、安全でない、または不安定な動作を導入できてしまうためです。

この機能には以下が必要です。

* Kubernetes v1.30以上
* Wallarm Helmチャート 6.3.0+
* [`validation.enableCel`](#validationenablecel)が`true`に設定されていること

!!! info "Node 6.2.0以前の挙動"
    Node 6.2.0以前では、[`validation.enableCel`](#validationenablecel)が`true`の場合、明示的に危険な`server-snippet`および`configuration-snippet`はデフォルトでブロックされます。

**デフォルト値**: `false`（`server-snippet`と`configuration-snippet`の明示的に危険なアノテーションのブロックは無効）

## グローバルコントローラー設定 

[ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/)で実装します。

標準のものに加えて、以下の追加パラメータをサポートします。

* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_wstore_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_wstore_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)

## Ingressアノテーション

これらのアノテーションは、個々のIngressインスタンスの処理パラメータを設定するために使用します。

[標準のアノテーション](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)に加えて、以下の追加アノテーションをサポートします。

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

Ingressに設定を適用するには、次のコマンドを使用します。

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>`は対象のIngress名です
* `<YOUR_INGRESS_NAMESPACE>`は対象のIngressのNamespaceです
* `<ANNOTATION_NAME>`は上記一覧のアノテーション名です
* `<VALUE>`は上記一覧のアノテーション値です

### アノテーション例

#### ブロックページとエラーコードの設定

`nginx.ingress.kubernetes.io/wallarm-block-page`アノテーションは、次の理由でブロックされたリクエストへのレスポンスとして返すブロックページとエラーコードを設定するために使用します。

* リクエストに次の種類の悪意あるペイロードが含まれている: [入力検証攻撃](../attacks-vulns-list.md#attack-types)、[vpatch攻撃](../user-guides/rules/vpatch-rule.md)、[正規表現に基づいて検出された攻撃](../user-guides/rules/regex-rule.md)
* 上記の悪意あるペイロードを含むリクエストが[graylisted IPアドレス](../user-guides/ip-lists/overview.md)からのもので、かつノードがsafe blocking [mode](configure-wallarm-mode.md)でリクエストをフィルタリングしている
* リクエストが[denylisted IPアドレス](../user-guides/ip-lists/overview.md)からのものである

例えば、ブロックされた任意のリクエストに対してデフォルトのWallarmブロックページとエラーコード445を返すには次のとおりです。

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[ブロックページとエラーコードの設定方法の詳細 →](configuration-guides/configure-block-page-and-code.md)

#### libdetectionモードの管理

!!! info "**libdetection**のデフォルトモード"
    **libdetection**ライブラリのデフォルトモードは`on`（有効）です。

[**libdetection**](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection)のモードは次のいずれかの方法で制御できます。

* 次の[`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet)アノテーションをIngressリソースに適用します:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection off;"
    ```

    `wallarm_enable_libdetection`の有効な値は`on`/`off`です。
* `controller.config.server-snippet`パラメータをHelmチャートに渡します:

    === "Ingressコントローラーのインストール"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        正しくIngressコントローラーをインストールするには[他にもパラメータ](#additional-settings-for-helm-chart)が必要です。これらも`--set`オプションで指定してください。
    === "Ingressコントローラーのパラメータ更新"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

    `wallarm_enable_libdetection`の有効な値は`on`/`off`です。