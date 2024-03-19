# Wallarm Sidecarのスケーリングと高可用性

このガイドは、スケーリング、高可用性（HA）、および[Wallarm Sidecarソリューション][sidecar-docs]のリソース割り当ての適切な設定のニュアンスに焦点を当てています。これらを効果的に設定することで、Wallarm Sidecarの信頼性とパフォーマンスを向上させ、ダウンタイムを最小限に抑え、効率的なリクエスト処理を確保することができます。

設定は大きく2つのセグメントに分類されます：

* Wallarm Sidecar制御プレーン専用の設定
* インジェクトされたサイドカーを含むアプリケーションのワークロードの設定

Wallarm Sidecarのスケーリングと高可用性は標準的なKubernetesの慣行に依存しています。弊社の推奨を適用する前に基礎知識を理解するために、以下の推奨リンクの探索を考慮してください：

* [KubernetesのHorizontal Pod Autoscaling（HPA）](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
* [Kubernetesでの高可用性クラスタ](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
* [コンテナとポッドにCPUリソースを割り当てる](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

## Wallarm Sidecar制御プレーンのスケーリング

Wallarm Sidecarソリューションは[2つのコンポーネントから成る：コントローラとpostanalytics（Tarantool)][sidecar-arch-docs]。それぞれには個別のスケーリング設定が必要で、`replicas`、`requests`、および`podAntiAffinity`などのKubernetesパラメーターが関与します。

### コントローラ

サイドカーコントローラは、アプリケーションのPodにサイドカーコンテナを注入する変異認証Webhookとして機能します。ほとんどの場合、HPAスケーリングは必要ありません。HAデプロイメントのために、`values.yaml`ファイルの以下の設定を検討してください：

* サイドカーPodのインスタンスを1つ以上使用します。これは[`controller.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L877)属性で制御します。
* 必要に応じて、[`controller.resources.requests.cpu`と`controller.resources.requests.memory`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L1001)を設定して、コントローラのPodのための予約されたリソースを確保します。
* 必要に応じて、ポッドの反アフィニティを使用して、コントローラのポッドを異なるノードに分散し、ノードの障害発生時の強固さを提供します。

以下は、これらの推奨事項を取り入れた`values.yaml`ファイルの`controller`セクションの調整された例です：

```yaml
controller:
  replicaCount: 2
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - controller
          topologyKey: kubernetes.io/hostname
  resources:
    limits:
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 50m
      memory: 32Mi
```

### Postanalytics（Tarantool）

postanalyticsコンポーネントは、アプリケーションワークロードに注入されたすべてのサイドカーコンテナからのトラフィックを処理します。このコンポーネントはHPAによってスケールアウトすることができません。

HAデプロイメントのために、`values.yaml`ファイルの次の設定を使用して手動でレプリカの量を調整できます：

* Tarantool Podのインスタンスを1つ以上使用します。これは[`postanalytics.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L382)属性で制御します。
* アプリケーションワークロードへの予想トラフィック量に基づいて、ギガバイト（GB）単位で[`postanalytics.tarantool.config.arena`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L610C7-L610C7)を設定します。この設定は、Tarantoolが利用する最大メモリーを決定します。計算のガイドラインについては、[他のデプロイメントオプションに対する私たちの推奨事項][tarantool-memory-recommendations]が役立つかもしれません。
* [`postanalytics.tarantool.resources.limits`と`postanalytics.tarantool.resources.requests`](https://github.com/wallarm/sidecar/blob/4eb1a4c4f8d20989757c50c40e192eb7eb1f2169/helm/values.yaml#L639)を`arena`設定と揃えます。ピーク需要を処理し、メモリー関連のクラッシュを避けるために、`limits`を`arena`値以上に設定します。Tarantoolの最適なパフォーマンスを確保するために、`requests`が`arena`値以上になるようにします。詳細は[Kubernetesのドキュメンテーション](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)を参照してください。
* 必要に応じて、`postanalytics`セクション内のすべての他のコンテナの`resources.requests`と`resources.limits`を設定して、Tarantool Podのための専用リソース割り当てを確保します。これらのコンテナには`postanalytics.init`、`postanalytics.cron`、`postanalytics.appstructure`、および`postanalytics.antibot`が含まれます。
* 必要に応じて、ポッドの反アフィニティを実装して、postanalyticsポッドを異なるノードに分散し、ノード障害発生時の強固さを提供します。

以下は、これらの推奨事項を取り入れた`values.yaml`ファイルの`postanalytics`セクションの調整された例です：

```yaml
postanalytics:
  replicaCount: 2
  tarantool:
    config:
      arena: "1.0"
    resources:
      limits:
        cpu: 500m
        memory: 1Gi
      requests:
        cpu: 100m
        memory: 1Gi
  init:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  cron:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  appstructure:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  antibot:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - postanalytics
          topologyKey: kubernetes.io/hostname
```

## インジェクトされたサイドカーコンテナを含むアプリケーションワークロードのスケーリング

アプリケーションのワークロードを管理するためのHorizontal Pod Autoscaling（HPA）を使用する場合、Wallarm Sidecarに注入されたものを含めて、Pod内のすべてのコンテナに対して`resources.requests`を設定することが重要です。

### 前提条件

Wallarmのコンテナに対して[HPAを実装](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)するための前提条件を満たすことを確認してください：

* [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme)がKubernetesクラスタにデプロイされ、設定されています。
* アプリケーションのPod内のすべてのコンテナに対して[`resources.request`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)が設定されています。これにはinitコンテナも含まれます。

    アプリケーションコンテナのリソース割り当てはそのマニフェストで指定されるべきです。Wallarmによって注入されるコンテナのリソース設定は下記にアウトライン化されており、どちらも[globallyまたはper-pod basis][sidecar-conf-area]で割り当てが可能です。

### Helmチャート値を介したグローバル割り当て

| コンテナデプロイメントパターン | コンテナ名            | チャートの値                                  |
|-------------------|-----------------------|------------------------------------------------|
| [Split, Single][single-split-deployment]    | sidecar-proxy         | config.sidecar.containers.proxy.resources     |
| Split              | sidecar-helper        | config.sidecar.containers.helper.resources    |
| Split, Single     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources  |
| Split              | sidecar-init-helper   | config.sidecar.initContainers.helper.resources    |

リソース（リクエストと制限）を全体的に管理するためのHelmチャート値の例：

```yaml
config:
  sidecar:
    containers:
      proxy:
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
      helper:
        resources:
          requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 300m
              memory: 256Mi
    initContainers:
      helper:
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
          limits:
            cpu: 300m
            memory: 128Mi
      iptables:
        resources:
          requests:
            cpu: 50m
            memory: 32Mi
          limits:
            cpu: 100m
            memory: 64Mi
```

### Podのアノテーションを介したPodごとの割り当て

| コンテナデプロイメントパターン | コンテナ名            | アノテーション                                                        |
|-------------------|-----------------------|------------------------------------------------------------------------|
| [Single, Split][single-split-deployment]     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}          |
| Split             | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}         |
| Single, Split     | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit}  |
| Split             | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}    |

Podごとにリソース（リクエストと制限）を管理するためのアノテーションの例（`single`コンテナパターンが有効化されている）：

```yaml hl_lines="16-24"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        sidecar.wallarm.io/proxy-cpu: 200m
        sidecar.wallarm.io/proxy-cpu-limit: 500m
        sidecar.wallarm.io/proxy-memory: 256Mi
        sidecar.wallarm.io/proxy-memory-limit: 512Mi
        sidecar.wallarm.io/init-iptables-cpu: 50m
        sidecar.wallarm.io/init-iptables-cpu-limit: 100m
        sidecar.wallarm.io/init-iptables-memory: 32Mi
        sidecar.wallarm.io/init-iptables-memory-limit: 64Mi
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

## 例

以下は、上記で記述した設定を適用したWallarmチャートの`values.yaml`ファイルの例です。この例では、Wallarmに注入されたコンテナのリソースがグローバルに割り当てられていることを想定しています。

```yaml
controller:
  replicaCount: 2
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - controller
          topologyKey: kubernetes.io/hostname
  resources:
    limits:
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 50m
      memory: 32Mi
postanalytics:
  replicaCount: 2
  tarantool:
    config:
      arena: "1.0"
    resources:
      limits:
        cpu: 500m
        memory: 1Gi
      requests:
        cpu: 100m
        memory: 1Gi
  init:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  cron:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  appstructure:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  antibot:
    resources:
      limits:
        cpu: 250m
        memory: 300Mi
      requests:
        cpu: 50m
        memory: 150Mi
  affinity:
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app.kubernetes.io/name
              operator: In
              values:
              - wallarm-sidecar
            - key: app.kubernetes.io/component
              operator: In
              values:
              - postanalytics
          topologyKey: kubernetes.io/hostname
config:
  sidecar:
    containers:
      proxy:
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
      helper:
        resources:
          requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 300m
              memory: 256Mi
    initContainers:
      helper:
        resources:
          requests:
            cpu: 100m
            memory: 64Mi
          limits:
            cpu: 300m
            memory: 128Mi
      iptables:
        resources:
          requests:
            cpu: 50m
            memory: 32Mi
          limits:
            cpu: 100m
            memory: 64Mi
```
