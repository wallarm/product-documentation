# Wallarm固有のWallarm eBPF Helmチャートの値

本書は、[deployment.md](deployment.md) または eBPF ソリューションのアップグレード時に変更可能な Wallarm 固有の Helm チャート値について説明します。これらの値は、Wallarm eBPF Helm チャートのグローバル構成を制御します。

デフォルトの `values.yaml` 内で変更が必要な Wallarm 固有の部分は、以下のとおりです:

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
      # - namespace: "default"  # 「default」
      # - namespace: 'my-namespace'  # 「my-namespace」を指定
      #   pod_labels:  # Podラベル
      #     label_name1: 'label_value_1'
      #     label_name2: 'label_value_2,label_value_3'
      #   pod_annotations:  # Pod注釈
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

これは、[US](https://us1.my.wallarm.com/nodes) または [EU](https://my.wallarm.com/nodes) Cloud の Wallarm Console で作成された Wallarm ノードトークンです。Wallarm API にアクセスするために必要です。

## config.api.host

Wallarm API のエンドポイントです。次のいずれかになります:

* `us1.api.wallarm.com` は [US cloud](../../../about-wallarm/overview.md#cloud) 向けです
* `api.wallarm.com` は [EU cloud](../../../about-wallarm/overview.md#cloud) 向けです（デフォルト）

## config.api.port

Wallarm API のエンドポイントポートです。デフォルトは `443` です。

## config.api.useSSL

Wallarm API にアクセスする際に SSL を使用するかどうかを指定します。デフォルトは `true` です。

## config.mutualTLS

mTLS サポートを有効にし、[Wallarm processing node](deployment.md#how-it-works) が eBPF エージェントからのトラフィックの安全性を認証できるようにします。デフォルトは `false`（無効）です。

このパラメータは Helm チャート バージョン 0.10.26 以降でサポートされています。

## config.agent.mirror.allNamespaces

すべての namespace に対してトラフィックミラーリングを有効にします。デフォルト値は `false` です。

!!! warning "「true」に設定することはお勧めしません"
    これを「true」に設定すると、データの重複やリソース使用量の増加を招く可能性があります。namespaceラベル、pod注釈、または `values.yaml` の `config.agent.mirror.filters` を使用した selective mirroring を推奨します。

## config.agent.mirror.filters

トラフィックミラーリングのレベルを制御します。以下は `filters` パラメータの例です:

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

[詳細はこちら](selecting-packets.md)

## config.agent.loadBalancerRealIPHeader

ロードバランサーが元のクライアントIPアドレスを伝達するために使用するヘッダー名を指定します。正しいヘッダー名を確認するには、お使いのロードバランサーのドキュメントを参照してください。デフォルトは `X-Real-IP` です。

`loadBalancerRealIPHeader` および `loadBalancerTrustedCIDRs` パラメータにより、Wallarm eBPF は Kubernetes クラスター外部の L7 ロードバランサー（例：AWS ALB）を通じたトラフィックの送信元IPアドレスを正確に判別できます。

## config.agent.loadBalancerTrustedCIDRs

信頼できる L7 ロードバランサーの CIDR 範囲のホワイトリストを定義します。例:

```yaml
config:
  agent:
    loadBalancerTrustedCIDRs:
      - 10.10.0.0/24
      - 192.168.0.0/16
```

これらの値を Helm を使用して更新するには:

```
# リストに項目を追加する場合:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24'

# 複数の項目をリストに追加する場合:
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24,config.agent.loadBalancerTrustedCIDRs[1]=192.168.0.0/16'
```

## processing.metrics

Wallarm ノードの [metrics service](../../../admin-en/configure-statistics-service.md) の構成を制御します。デフォルトでは、このサービスは無効です。

サービスを有効にする場合、`port`、`path`、および `scrapeInterval` のデフォルト値を保持することを推奨します:

```yaml
processing:
  ...
  metrics:
    enabled: true
    port: 9090
    path: /metrics
    scrapeInterval: 30s
```

## processing.affinity および processing.nodeSelector

Wallarm eBPF daemonSet がデプロイされる Kubernetes ノードを制御します。デフォルトでは、各ノードにデプロイされます。

## 変更の適用方法

もし `values.yaml` ファイルを変更し、デプロイ済みのチャートをアップグレードしたい場合は、以下のコマンドを使用してください:

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```