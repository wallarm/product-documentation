# Wallarm統合サービス付きKong Ingress Controllerのカスタマイズ

この記事ではWallarm統合サービス付きKong Ingress Controllerの安全かつ効果的なカスタマイズ方法について説明します。

## 設定領域

Wallarm統合サービス付きKong Ingress Controllerは標準のKubernetesコンポーネントをベースとしているため、ソリューションの設定は大部分がKubernetesスタックの設定と類似しています。

ソリューションは以下の方法で設定できます:

* グローバルに `values.yaml` を使用して設定する - これにより一般的なデプロイ構成、Kong API Gateway、および基本的なWallarm設定の設定が可能です。これらの設定はソリューションがトラフィックをプロキシするすべてのIngressリソースに適用されます。
* Ingressアノテーションを使用して設定する - これにより、IngressごとにWallarm設定を微調整できます。

    !!! warning "アノテーションサポート"
        IngressアノテーションはオープンソースのKong Ingress Controllerベースのソリューションでのみサポートされております。[サポートされるアノテーションのリストは限定されています](#fine-tuning-of-traffic-analysis-via-ingress-annotations-only-for-the-open-source-edition).
* Wallarm Console UIを使用して設定する - これによりWallarm設定を微調整できます.

## Kong API Gatewayの設定

Kong API Gateway用のKong Ingress Controllerの設定は[デフォルトのHelmチャート値](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml)により設定されています。この設定はユーザーが`helm install`または`helm upgrade`時に提供する`values.yaml`ファイルで上書き可能です.

デフォルトのHelmチャート値をカスタマイズするには、[KongおよびIngress Controllerの設定に関する公式手順](https://github.com/Kong/charts/tree/main/charts/kong#configuration)を参照してください.

## Wallarmレイヤーの設定

以下の方法でソリューションのWallarmレイヤーを設定できます:

* `values.yaml` を使用して基本設定を行う: Wallarm Cloudへの接続、リソース割り当て、フェールバック.
* アノテーションを使用してIngressごとにトラフィック解析を微調整する（オープンソース版のみ）: トラフィックフィルトレーションモード、アプリケーション管理、マルチテナンシー設定など.
* Wallarm Console UIを使用してトラフィック解析を微調整する: トラフィックフィルトレーションモード、セキュリティイベントの通知、リクエストソース管理、機微なデータのマスク、特定の攻撃タイプの許可など.

### `values.yaml` を使用した基本設定

デフォルトの`values.yaml`ファイルは次のWallarm設定を提供しております:

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
    podAnnotations:
      sidecar.istio.io/inject: false
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

変更する必要がある可能性がある主なパラメータは次の通りです:

| Parameter | Description | Default value |
| --- | --- | --- |
| `wallarm.enabled` | Wallarmレイヤーの有効化または無効化を設定します. | `true` |
| `wallarm.apiHost` | Wallarm APIサーバー:<ul><li>`us1.api.wallarm.com`はUS Cloud用</li><li>`api.wallarm.com`はEU Cloud用</li></ul> | `api.wallarm.com` |
| `wallarm.token` | Wallarmノードトークン．**必須**. | Empty |
| `wallarm.fallback` | Wallarmサービスの起動失敗時にKong API Gatewayサービスを実行するか否か. | `on` |
| `wallarm.tarantool.replicaCount` | ローカルデータ解析バックエンドであるWallarm postanalyticsモジュールの稼働中のポッド数. | `1` |
| `wallarm.tarantool.arena` | Wallarm postanalyticsモジュールに割り当てるメモリ量を指定します．直近の5～15分間のリクエストデータを格納できる十分な値を設定することを推奨します. | `0.2` |
| `wallarm.metrics.enabled` | 情報およびメトリクス収集の切り替え．Kubernetesクラスターに[Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus)がインストールされている場合、追加設定は不要です. | `false` |

他のパラメータはデフォルト値のままであり、変更する必要はほとんどありません.

### Ingressアノテーションを使用したトラフィック解析の微調整（オープンソース版のみ）

以下はWallarm統合サービス付きオープンソースのKong Ingress Controllerでサポートされるアノテーションの一覧です.

!!! info "グローバル設定とIngressごとの設定の優先順位"
    IngressごとのアノテーションはHelmチャート値より優先されます.

| Annotation | Description | 
|----------- |------------ |
| `wallarm.com/wallarm-mode` | [トラフィックフィルトレーションモード][wallarm-mode-docs]：`off`（デフォルト）、`monitoring`、`safe_blocking`、または`block`. |
| `wallarm.com/wallarm-application` | [WallarmアプリケーションID][applications-docs]．値は`0`以外の正の整数です. |
| `wallarm.com/wallarm-parse-response` | アプリケーションのレスポンスを攻撃に対して解析するか否か：`true`（デフォルト）または`false`．レスポンス解析は[パッシブ検出][passive-vuln-detection-docs]及び[脅威リプレイテスト][active-threat-ver-docs]時の脆弱性検出に必要です. |
| `wallarm.com/wallarm-parse-websocket` | Wallarmは完全なWebSocketsサポートを備えています．デフォルトではWebSocketsのメッセージは攻撃解析対象外です．機能を強制するにはAPI Securityの[subscription plan][subscription-docs]を有効にし、本アノテーションを`true`または`false`（デフォルト）で使用します. |
| `wallarm.com/wallarm-unpack-response` | アプリケーションのレスポンスで返される圧縮データを展開するか否か：`true`（デフォルト）または`false`. |
| `wallarm.com/wallarm-partner-client-uuid` | [マルチテナントの概要][multitenancy-overview]に準じるWallarmノードにおけるテナントのユニーク識別子．値はUUID形式の文字列である必要があります．例えば`123e4567-e89b-12d3-a456-426614174000`.<br><br>確認方法：<ul><li>[テナント作成時にテナントのUUIDを取得する方法][get-tenant-via-api-docs]</li><li>[既存テナントのUUID一覧の取得方法][get-tenant-uuids-docs]</li></ul> |

### Wallarm Console UIを使用したトラフィック解析の微調整

Wallarm Console UIを使用すると、Wallarmレイヤーによるトラフィック解析を以下のように微調整できます:

* トラフィックフィルトレーションモードの設定
    
    [ソリューションがデプロイされる](deployment.md)と、すべての着信リクエストは**monitoring**[モード][available-filtration-modes]でフィルタリングが開始されます.

    Wallarm Console UIではモードを変更できます:
    
    * [すべての着信リクエストに対してグローバルに設定][general-settings-ui-docs]
    * Ingress単位で[ルール][wallarm-mode-rule-docs]を使用して設定

    !!! info "Ingressごとの設定とWallarm Console UIで指定された設定の優先順位"
        Kongオープンソースベースのソリューションのモードが`wallarm-mode`アノテーションとWallarm Console UIの両方で指定されている場合、後者がアノテーションより優先されます.
* [セキュリティイベントの通知設定][integrations-docs]を行います
* [リクエストソースによるAPIアクセス管理][ip-lists-docs]を行います
* [トラフィックフィルトレーションルールのカスタマイズ][rules-docs]を行います
