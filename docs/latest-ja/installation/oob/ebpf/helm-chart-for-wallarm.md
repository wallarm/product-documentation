# Wallarm eBPF HelmチャートのWallarm固有の値

本書では、eBPFソリューションの[デプロイ](deployment.md)またはアップグレード時に変更可能な、Wallarm固有のHelmチャート値について説明します。これらの値は、Wallarm eBPF Helmチャートのグローバル設定を制御します。

!!! warning "バージョン4.10に限定"
    現在、WallarmのeBPFベースのソリューションは[Wallarm Node 4.10](/4.10/installation/oob/ebpf/deployment/)で利用可能な機能のみをサポートします。

デフォルトの`values.yaml`のうち、変更が必要になる場合があるWallarm固有部分は次のとおりです。

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    port: 443
    useSSL: true
  mutualTLS: false
  agent:
    mirror:
      allNamespaces: false
      filters: []
      # - namespace: "default"
      # - namespace: 'my-namespace'
      #   pod_labels:
      #     label_name1: 'label_value_1'
      #     label_name2: 'label_value_2,label_value_3'
      #   pod_annotations:
      #      annotation_name1: 'annotation_value_1'
      #      annotation_name2: 'annotation_value_2,annotation_value_4'
    loadBalancerRealIPHeader: 'X-Real-IP'
    loadBalancerTrustedCIDRs: []
      # - 10.0.0.0/8
      # - 192.168.0.0/16
      # - 172.16.0.0/12
      # - 127.0.0.0/8
      # - fd00::/8
    ...
processing:
  ...
  metrics:
    enabled: false
    ...

  affinity: {}
  # podAntiAffinity:
  #   preferredDuringSchedulingIgnoredDuringExecution:
  #   - weight: 100
  #     podAffinityTerm:
  #       labelSelector:
  #         matchExpressions:
  #         - key: component
  #           operator: In
  #           values:
  #           - mtls-router
  #         - key: app
  #           operator: In
  #           values:
  #           - mtls-router
  #       topologyKey: kubernetes.io/hostname
  nodeSelector:
    kubernetes.io/os: linux
```

## config.api.token

USまたはEU CloudのWallarm Consoleで作成したWallarmノードトークンです（[US](https://us1.my.wallarm.com/nodes) / [EU](https://my.wallarm.com/nodes)）。Wallarm APIへのアクセスに必要です。

## config.api.host

Wallarm APIのエンドポイントです。次のいずれかです。

* [USクラウド](../../../about-wallarm/overview.md#cloud)の場合は`us1.api.wallarm.com`
* [EUクラウド](../../../about-wallarm/overview.md#cloud)の場合は`api.wallarm.com`（デフォルト）

## config.api.port

Wallarm APIのエンドポイントポートです。デフォルトは`443`です。

## config.api.useSSL

Wallarm APIへのアクセスにSSLを使用するかどうかを指定します。デフォルトは`true`です。 

## config.mutualTLS

mTLSを有効にし、[Wallarm処理ノード](deployment.md#how-it-works)がeBPFエージェントからのトラフィックのセキュリティを認証できるようにします。デフォルトは`false`（無効）です。

このパラメータはHelmチャートバージョン0.10.26以降でサポートされます。

## config.agent.mirror.allNamespaces

すべてのNamespaceに対してトラフィックミラーリングを有効にします。デフォルト値は`false`です。

!!! warning "`true`への設定は推奨しません"
    これを`true`に設定して有効化すると、データの重複やリソース使用量の増加を招く可能性があります。Namespaceラベル、Podアノテーション、または`values.yaml`の`config.agent.mirror.filters`を用いた[選択的ミラーリング](selecting-packets.md)を推奨します。

## config.agent.mirror.filters

トラフィックミラーリングの対象範囲を制御します。`filters`パラメータの例は次のとおりです。

```yaml
...
  agent:
    mirror:
      allNamespaces: false
      filters:
        - namespace: "default"
        - namespace: 'my-namespace'
          pod_labels:
            label_name1: 'label_value_1'
            label_name2: 'label_value_2,label_value_3'
          pod_annotations:
            annotation_name1: 'annotation_value_1'
            annotation_name2: 'annotation_value_2,annotation_value_4'
```

[詳細](selecting-packets.md)

## config.agent.loadBalancerRealIPHeader

ロードバランサーが元のクライアントIPアドレスを伝達するために使用するヘッダー名を指定します。正しいヘッダー名については、ご利用のロードバランサーのドキュメントを参照してください。デフォルトは`X-Real-IP`です。

`loadBalancerRealIPHeader`と`loadBalancerTrustedCIDRs`パラメータにより、Kubernetesクラスター外部のL7ロードバランサー（例: AWS ALB）経由でトラフィックがルーティングされる場合でも、Wallarm eBPFが送信元IPを正確に特定できるようになります。

## config.agent.loadBalancerTrustedCIDRs

信頼するL7ロードバランサーのCIDR範囲の許可リストを定義します。例:

```yaml
config:
  agent:
    loadBalancerTrustedCIDRs:
      - 10.10.0.0/24
      - 192.168.0.0/16
```

Helmを使用してこれらの値を更新するには:

```
# リストに単一の項目を追加する場合:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24'

# リストに複数の項目を追加する場合:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24,config.agent.loadBalancerTrustedCIDRs[1]=192.168.0.0/16'
```

## processing.metrics

Wallarmノードの[メトリクスサービス](../../../admin-en/configure-statistics-service.md)の設定を制御します。デフォルトではサービスは無効です。

サービスを有効にする場合は、`port`、`path`、`scrapeInterval`のデフォルト値を維持することを推奨します。

```yaml
processing:
  ...
  metrics:
    enabled: true
    port: 9090
    path: /metrics
    scrapeInterval: 30s
```

## processing.affinityとprocessing.nodeSelector

Wallarm eBPFのdaemonSetをデプロイするKubernetesノードを制御します。デフォルトでは各ノードにデプロイされます。

## 変更の適用

`values.yaml`ファイルを変更し、デプロイ済みチャートをアップグレードする場合は、次のコマンドを使用します。

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```