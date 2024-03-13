# Wallarm固有のWallarm eBPF Helmチャートの値

このドキュメントでは、eBPFソリューションの[デプロイメント](deployment.md)やアップグレード中に変更できるWallarm固有のHelmチャートの値に関する情報を提供します。これらの値は、Wallarm eBPF Helmチャートのグローバル設定を制御します。

変更が必要かもしれない既定の`values.yaml`のWallarm固有部分は、以下のようになります：

```yaml
config:
  api:
    token: ""
    host: api.wallarm.com
    port: 443
    useSSL: true
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

Wallarm Consoleで[US](https://us1.my.wallarm.com/nodes)または[EU](https://my.wallarm.com/nodes) Cloudで作成されたWallarmノードトークン。Wallarm APIにアクセスするために必要です。

## config.api.host

Wallarm APIエンドポイント。次のようになります：

* `us1.api.wallarm.com` は、[USクラウド](../../../about-wallarm/overview.md#us-cloud) に対応
* `api.wallarm.com` は、[EUクラウド](../../../about-wallarm/overview.md#eu-cloud) に対応（デフォルト）

## config.api.port

Wallarm APIエンドポイントのポート。デフォルトでは、`443`です。

## config.api.useSSL

SSLを使用してWallarm APIにアクセスするかどうかを指定します。デフォルトでは、`true`です。

## config.agent.mirror.allNamespaces

すべての名前空間でのトラフィックミラーリングを有効にします。デフォルト値は`false`です。

!!! warning " `true`に設定することは推奨されません"
    これを`true`に設定すると、データの重複とリソースの増加が発生する可能性があります。名前空間のラベル、ポッドの注釈、または`values.yaml`の`config.agent.mirror.filters`を使用した[選択的なミラーリング](selecting-packets.md)を優先してください。

## config.agent.mirror.filters

トラフィックミラーリングのレベルを制御します。`filters`パラメータの例は、以下の通りです：

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

ロードバランサーが元のクライアントIPアドレスを伝えるために使用するヘッダー名を指定します。正しいヘッダー名を識別するために、ロードバランサーのドキュメントを参照してください。デフォルトでは、`X-Real-IP`です。

`loadBalancerRealIPHeader`および`loadBalancerTrustedCIDRs`パラメーターは、Kubernetesクラスター外部のL7ロードバランサー（例、AWS ALB）を介してルーティングされるときに、Wallarm eBPFがソースIPを正確に特定するのを有効にします。

## config.agent.loadBalancerTrustedCIDRs

信頼できるL7ロードバランサーのCIDR範囲のホワイトリストを定義します。例：

```yaml
config:
  agent:
    loadBalancerTrustedCIDRs:
      - 10.10.0.0/24
      - 192.168.0.0/16
```

これらの値をHelmで更新するには：

```
# リストに単一のアイテムを追加する場合：
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24'

# リストに複数のアイテムを追加する場合：
helm upgrade <RELEASE_NAME> <CHART> --set 'config.agent.loadBalancerTrustedCIDRs[0]=10.10.0.0/24,config.agent.loadBalancerTrustedCIDRs[1]=192.168.0.0/16'
```

## processing.metrics

Wallarmノード[メトリクスサービス](../../../admin-en/configure-statistics-service.md)の設定を制御します。デフォルトでは、サービスは無効です。

サービスを有効にする場合、`port`、`path`、`scrapeInterval`のデフォルト値を保持することをお勧めします：

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

Wallarm eBPFデーモンセットがデプロイされるKubernetesノードを制御します。デフォルトでは、それぞれのノードにデプロイされます。

## 変更の適用

`values.yaml`ファイルを変更してデプロイされたチャートをアップグレードしたい場合、次のコマンドを使用します：

```
helm upgrade <RELEASE_NAME> wallarm/wallarm-oob -n wallarm-ebpf -f <PATH_TO_VALUES>
```