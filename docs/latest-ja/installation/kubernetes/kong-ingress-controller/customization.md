# インテグレーションされたWallarmサービスを使用してKong Ingressコントローラーをカスタマイズする

この記事では、[Kong Ingressコントローラーと統合されたWallarmサービス][kong-ing-controller-customization-docs]の安全かつ効果的なカスタマイズ方法について説明します。

## 設定領域

Kong Ingressコントローラーと統合されたWallarmサービスは、標準のKubernetesコンポーネントに基づいているため、ソリューションの設定は大部分がKubernetesスタックの設定と同様です。

次のようにソリューションを設定できます。

* `values.yaml`を介して全体的に - これにより、一般的なデプロイメント設定、Kong API Gateway、および一部の基本的なWallarm設定を設定できます。これらの設定は、ソリューションがトラフィックをプロキシしているすべてのIngressリソースに適用されます。
* Ingress注釈を介して - これにより、IngressごとにWallarm設定を微調整できます。

    !!! warning "注釈のサポート"
        Ingress注釈は、オープンソースのKong Ingressコントローラーに基づいたソリューションでのみサポートされています。[サポートされている注釈のリストは限られています](#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition)。
* Wallarm Console UIを介して - これにより、Wallarm設定を微調整できます。

## Kong API Gatewayの設定

Kong API GatewayのKong Ingressコントローラーの設定は、[デフォルトのHelmチャート値](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml)によって設定されます。この設定は、ユーザーが`helm install`または`helm upgrade`中に提供する`values.yaml`ファイルによって上書きすることができます。

デフォルトのHelmチャート値をカスタマイズするには、[KongとIngressコントローラーの設定に関する公式の指示](https://github.com/Kong/charts/tree/main/charts/kong#configuration)を参照してください。

## Wallarm層の設定

ソリューションのWallarm層を次のように設定することができます。

* `values.yaml`を介して基本的な設定を設定する：Wallarm Cloudへの接続、リソースの割り当て、フォールバック。
* 注釈を介してIngressごとのトラフィック分析を微調整する（オープンソース版のみ）：トラフィックフィルタリングモード、アプリケーション管理、マルチテナント設定など。
* Wallarm Console UIを介してトラフィック分析を微調整する：トラフィックフィルタリングモード、セキュリティイベントの通知、リクエストソース管理、機密データマスキング、特定の攻撃タイプの許可など。

### `values.yaml`を介した基本設定

デフォルトの`values.yaml`ファイルは以下のWallarm設定を提供します。

```yaml
wallarm:
  image:
    tag: "<WALLARM_NODE_IMAGE_TAG>"
  enabled: true
  apiHost: api.wallarm.com
  apiPort: 443
  apiSSL: true
  token: ""
  fallback: "on"
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
  heartbeat:
    resources: {}
  wallarm-appstructure:
    resources: {}
  wallarm-antibot:
    resources: {}
  metrics:
    port: 18080
    enabled: false

    service:
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/path: /wallarm-metrics
        prometheus.io/port: "18080"

      # clusterIP: ""

      ## -- List of IP addresses at which the stats-exporter service is available
      ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
      ##
      externalIPs: []

      # loadBalancerIP: ""
      loadBalancerSourceRanges: []
      servicePort: 18080
      type: ClusterIP
      # externalTrafficPolicy: ""
      # nodePort: ""
  addnode:
    resources: {}
  cron:
    jobs:
      exportEnvironment:
        schedule: "0 */1 * * *"
        timeout: 10m
      exportAttacks:
        schedule: "* * * * *"
        timeout: 3h
      exportCounters:
        schedule: "* * * * *"
        timeout: 11m
      bruteDetect:
        schedule: "* * * * *"
        timeout: 6m
      syncIpLists:
        schedule: "* * * * *"
        timeout: 3h
      exportMetrics:
        schedule: "* * * * *"
        timeout: 3h
      syncIpListsSource:
        schedule: "*/5 * * * *"
        timeout: 3h
      syncMarkers:
        schedule: "* * * * *"
        timeout: 1h
    resources: {}
  exportenv:
    resources: {}
  synccloud:
    wallarm_syncnode_interval_sec: 120
    resources: {}
  collectd:
    resources: {}
```

変更する可能性のある主なパラメーターは次のとおりです。

| パラメーター | 説明 | デフォルト値 |
| --- | --- | --- |
| `wallarm.enabled` | Wallarm層を有効または無効にします。 | `true` |
| `wallarm.apiHost` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com`はUS Cloud用</li><li>`api.wallarm.com`はEU Cloud用</li></ul> | `api.wallarm.com` |
| `wallarm.token` | Wallarmノードトークン。**必須**。 | 空 |
| `wallarm.fallback` | Wallarmサービスの開始が失敗した場合にKong API Gatewayサービスを動作させるかどうか。 | `on` |
| `wallarm.tarantool.replicaCount` | ソリューションのローカルデータ分析バックエンドであるWallarm postanalyticsモジュールの実行中のポッドの数。 | `1` |
| `wallarm.tarantool.arena` | Wallarm postanalyticsモジュールに割り当てるメモリの量を指定します。過去5〜15分のリクエストデータを保存できる十分な値を設定することを推奨します。 | `0.2` |
| `wallarm.metrics.enabled` | このスイッチは情報収集とメトリックス収集を切り替えます。[Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus)がKubernetesクラスタにインストールされている場合、追加の設定は不要です。 | `false` |

他のパラメーターはデフォルト値で提供され、ほとんどの場合変更する必要はありません。

### Ingress注釈を介したトラフィック分析の微調整（オープンソース版のみ）

以下は、統合されたWallarmサービスを持つオープンソースのKong Ingressコントローラーでサポートされている注釈のリストです。

!!! info "グローバル設定とIngressごとの設定の優先順位"
    Ingressごとの注釈は、Helmチャートの値よりも優先されます。

| 注釈 | 説明 |
|----------- |------------ |
| `wallarm.com/wallarm-mode` | [トラフィックフィルタリングモード][wallarm-mode-docs]：`off`（デフォルト）、`monitoring`、`safe_blocking`、または`block`。 |
| `wallarm.com/wallarm-application` | [WallarmアプリケーションID][applications-docs]。値は0以外の正の整数です。 |
| `wallarm.com/wallarm-parse-response` | アプリケーションのレスポンスを攻撃のために分析するかどうか：`true`（デフォルト）または`false`。レスポンス分析は、[パッシブ検出][passive-vuln-detection-docs]と[アクティブな脅威検証][active-threat-ver-docs]中の脆弱性検出に必要です。 |
| `wallarm.com/wallarm-parse-websocket` | Wallarmは完全なWebSocketsをサポートしています。デフォルトでは、WebSocketsのメッセージは攻撃のために解析されません。この機能を強制するには、APIセキュリティ[サブスクリプションプラン][subscription-docs]を有効にし、この注釈を使用します：`true`または`false`（デフォルト）。 |
| `wallarm.com/wallarm-unpack-response` | アプリケーションのレスポンスで返される圧縮データを解凍するかどうか：`true`（デフォルト）または`false`。 |
| `wallarm.com/wallarm-partner-client-uuid` | [マルチテナント][multitenancy-overview]のWallarmノードのテナントの一意の識別子。値はUUID形式の文字列である必要があります。例：`123e4567-e89b-12d3-a456-426614174000`。<br><br>次のことを知っておく必要があります：<ul><li>[テナント作成時にテナントのUUIDを取得する方法][get-tenant-via-api-docs]</li><li>[既存のテナントのUUIDリストを取得する方法][get-tenant-uuids-docs]</li></ul> |

### Wallarm Console UIを介したトラフィック分析の微調整

Wallarm Console UIを使って、Wallarm層によって行われるトラフィック分析を以下のように微調整できます。

* トラフィックフィルタリングモードの設定
    
    [ソリューションがデプロイされる](deployment.md)と、すべての着信リクエストを**モニタリング**[モード][available-filtration-modes]でフィルタリングし始めます。

    Wallarm Console UIを使って、次のようにモードを変更できます。

    * [すべての着信リクエストに対してグローバルに設定][general-settings-ui-docs]
    * [ルール][wallarm-mode-rule-docs]を使用してIngressごとに設定

    !!! info "Ingressごとの設定とWallarm Console UIで指定された設定の優先順位"
        Kong Open-Sourceベースのソリューションのモードが`wallarm-mode`注釈とWallarm Console UIで指定されている場合、前者よりも後者が優先されます。
* [セキュリティイベントに対する通知を設定][integrations-docs]
* [リクエストソースによるAPIへのアクセスを管理][ip-lists-docs]
* [トラフィックフィルタリングルールをカスタマイズ][rules-docs]