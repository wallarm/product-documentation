# Wallarm統合サービスを搭載したKong Ingress Controllerのカスタマイズ

この記事では、[Wallarm統合サービスを搭載したKong Ingress Controller](deployment.md)の安全かつ効果的なカスタマイズ方法を説明します。

## 設定領域

Wallarm統合サービスを搭載したKong Ingress Controllerは、標準のKubernetesコンポーネントをベースにしているため、ソリューションの設定はKubernetesスタックの設定と大幅に類似しています。

以下の方法でソリューションを設定することができます。

* `values.yaml`を介して全体的に設定する - 一般的なデプロイメント設定、Kong API Gateway、基本的なWallarm設定を設定することができます。これらの設定は、ソリューションがトラフィックをプロキシするすべてのIngressリソースに適用されます。
* Ingressのアノテーションを介して - IngressごとにWallarm設定を微調整することができます。

    !!! warning "アノテーションのサポート"
        Ingressアノテーションは、オープンソースのKong Ingressコントローラをベースにしたソリューションでのみサポートされています。[対応しているアノテーションのリストは限られています](#open-source-editionのみのingress-annotations-via-finetuning-of-traffic-analysis)。
* Wallarm Console UIを介して - Wallarm設定を微調整することができます。

## Kong API Gatewayの設定

Kong API GatewayのKong Ingress Controllerの設定は、[デフォルトのHelmチャート値](https://github.com/wallarm/kong-charts/blob/main/charts/kong/values.yaml)で設定されます。この設定は、`helm install`または`helm upgrade`中にユーザーが提供する`values.yaml`ファイルで上書きできます。

デフォルトのHelmチャート値をカスタマイズするには、[KongとIngress Controllerの設定に関する公式の指示](https://github.com/Kong/charts/tree/main/charts/kong#configuration)を参照してください。

## Wallarmレイヤーの設定

ソリューションのWallarmレイヤーを以下の方法で設定できます。

* `values.yaml`を介して基本設定を行う : Wallarm Cloudへの接続、リソースの割り当て、フォールバック。
* アノテーションを使用して、Ingressごとのトラフィック解析を微調整する(オープンソース版のみ) : トラフィックフィルタリングモード、アプリケーション管理、マルチテナント設定など。
* Wallarm Console UIを通じてトラフィック解析を微調整する : トラフィックフィルタリングモード、セキュリティイベントに関する通知、リクエストソース管理、機密データのマスク、特定の攻撃タイプの許可など。

### `values.yaml`を介した基本設定

デフォルトの`values.yaml`ファイルは、以下のWallarm設定を提供します。

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

変更する必要がある主なパラメーターは以下の通りです。

| パラメーター | 説明 | デフォルト値 |
| --- | --- | --- |
| `wallarm.enabled` | Wallarmレイヤーを有効または無効にすることができます。 | `true` |
| `wallarm.apiHost` | Wallarm APIサーバー：<ul><li>`us1.api.wallarm.com`（USクラウド用）</li><li>`api.wallarm.com`（EUクラウド用）</li></ul> | `api.wallarm.com` |
| `wallarm.token` | Wallarmノードのトークン。**必須**。 | 空 |
| `wallarm.fallback` | Wallarmサービスの開始に失敗した場合にKong API Gatewayサービスを実行するかどうか。 | `on`
| `wallarm.tarantool.replicaCount` | ソリューションのローカルデータ解析バックエンドであるWallarm postanalyticsモジュールの実行中のポッドの数。 | `1`
| `wallarm.tarantool.arena` | Wallarm postanalyticsモジュールに割り当てるメモリの量を指定します。最後の5〜15分間のリクエストデータを格納するのに十分な値を設定することをお勧めします。 | `0.2`
| `wallarm.metrics.enabled` | このスイッチは情報収集とメトリクス収集を切り替えます。[Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus)がKubernetesクラスタにインストールされている場合、追加の設定は必要ありません。 | `false`

他のパラメーターはデフォルト値が付いており、変更する必要はほとんどありません。

### Ingressアノテーションを介したトラフィック解析の微調整（オープンソース版のみ）

以下は、Wallarm統合サービスを搭載したオープンソースKong Ingressコントローラでサポートされているアノテーションのリストです。

!!! info "グローバル設定とIngressごとの設定の優先度"
    Ingressのアノテーションは、Helmチャートの値よりも優先されます。

アノテーションを使用する前に、それに`wallarm.com/`プレフィックスを追加してください。例えば：

```bash
wallarm.com/wallarm-mode: block
```

| アノテーション | 説明 | 
|----------- |------------ |
| `wallarm-mode` | [トラフィックフィルタリングモード](../../../admin-en/configure-wallarm-mode.md)：`off`(デフォルト)、`monitoring`、`safe_blocking`、または`block`。 |
| `wallarm-application` | [WallarmアプリケーションID](../../../user-guides/settings/applications.md)。値は、`0`を除く正の整数にすることができます。 |
| `wallarm-parse-response` | アプリケーションの応答を攻撃の解析のために分析するかどうか：`true`(デフォルト)または`false`。レスポンスの解析は、[パッシブ検出](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection)および[アクティブ脅威検証](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)中の脆弱性検出に必要です。 |
| `wallarm-parse-websocket` | WallarmはWebSocketsを完全にサポートしています。デフォルトでは、WebSocketsのメッセージは攻撃の解析が行われません。この機能を強制するためには、APIセキュリティ[サブスクリプションプラン](../../../about-wallarm/subscription-plans.md#subscription-plans)をアクティブ化し、このアノテーションを使用してください：`true`または`false`(デフォルト)。 |
| `wallarm-unpack-response` | アプリケーションの応答で返された圧縮されたデータを展開するかどうか：`true`(デフォルト)または`false`。 |
| `wallarm-partner-client-uuid` | [マルチテナント](../../multi-tenant/overview.md)のWallarmノードのテナントの一意の識別子。値は、UUID形式の文字列である必要があります。例：`123e4567-e89b-12d3-a456-426614174000`。<br><br>以下の方法で取得できます。<ul><li>[テナント作成時にテナントのUUIDを取得](../../multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)</li><li>[既存のテナントのUUIDのリストを取得](../../../updating-migrating/multi-tenant.md#get-uuids-of-your-tenants)</li></ul> |### Wallarm Console UIを通じたトラフィック解析の微調整

Wallarm Console UIを使用して、Wallarmレイヤーによって実行されるトラフィック解析を以下のように微調整できます。

* トラフィックフィルタリングモードの設定
    
    [ソリューションがデプロイされる](deployment.md)と、すべての受信リクエストを**監視**[モード](../../../admin-en/configure-wallarm-mode.md#available-filtration-modes)でフィルタリングし始めます。

    Wallarm Console UIを使用して、モードを変更できます。

    * [すべての受信リクエストに対してグローバルに](../../../user-guides/settings/general.md)
    * [ルール](../../../user-guides/rules/wallarm-mode-rule.md)を使用して、Ingressごとに

    !!! info "Ingressごとの設定とWallarm Console UIで指定された設定の優先順位"
        Kong Open-Sourceベースのソリューションのモードが`wallarm-mode`アノテーションとWallarm Console UIで指定されている場合、後者がアノテーションより優先されます。
* [セキュリティイベントに関する通知の設定](../../../user-guides/settings/integrations/integrations-intro.md)
* [リクエスト元によるAPIへのアクセスの管理](../../../user-guides/ip-lists/overview.md)
* [トラフィックフィルタリングルールのカスタマイズ](../../../user-guides/rules/intro.md)