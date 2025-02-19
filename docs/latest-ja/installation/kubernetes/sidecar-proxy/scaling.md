# Wallarm Sidecarのスケーリングと高可用性

本ガイドは[Wallarm Sidecar solution][sidecar-docs]のスケーリング、高可用性（HA）およびリソースの正しい割り当ての微妙な点に焦点を当てます。これらを効果的に構成することで、Wallarm Sidecarの信頼性とパフォーマンスを向上させ、ダウンタイムを最小限に抑え、効率的なリクエスト処理を実現できます。

構成は大きく二つのセグメントに分類されます：

* Wallarm Sidecarコントロールプレーン専用の設定
* サイドカーが注入されたアプリケーションワークロード用の設定

Wallarm Sidecarのスケーリングと高可用性は、標準的なKubernetesのプラクティスに依存します。推奨事項を適用する前に基本を理解するため、次の推奨リンクを参照してください：

* [Kubernetes Horizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
* [Highly available clusters in Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
* [Assigning CPU resources to containers and pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

## Wallarm Sidecarコントロールプレーンのスケーリング

Wallarm Sidecarソリューションは[controllerとpostanalytics (Tarantool)の2つのコンポーネント][sidecar-arch-docs]で構成されます。それぞれに対して、`replicas`、`requests`、および`podAntiAffinity`などのKubernetesパラメータを含む個別のスケーリング設定が必要です。

### コントローラー

Sidecar ControllerはミューテーティングAdmission Webhookとして機能し、アプリケーションのPodにサイドカーコンテナを注入します。ほとんどの場合、HPAスケーリングは不要です。高可用性（HA）展開の場合、次の`values.yaml`ファイルの設定を検討してください：

* 複数のSidecarポッドインスタンスを使用します。これは[`controller.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L877)属性で制御します。
* 必要に応じて、コントローラーのPodに予約されたリソースを確保するため、[`controller.resources.requests.cpu`および`controller.resources.requests.memory`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L1001)を設定します。
* 必要に応じて、ノード障害時の耐障害性を確保するため、pod anti-affinityを使用してコントローラーポッドを異なるノードに分散させます。

以下は、これらの推奨事項を組み込んだ`values.yaml`ファイル内の調整済み`controller`セクションの例です：

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

### Postanalytics (Tarantool)

postanalyticsコンポーネントはアプリケーションワークロードに注入されたすべてのサイドカーコンテナからのトラフィックを処理します。このコンポーネントはHPAによるスケーリングはできません。

高可用性（HA）展開の場合、次の`values.yaml`ファイルの設定を使用して、レプリカ数を手動で調整できます：

* 複数のTarantoolポッドインスタンスを使用します。これは[`postanalytics.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L382)属性で制御します。
* アプリケーションワークロードへの予想されるトラフィック量に基づき、ギガバイト（GB）単位で[`postanalytics.tarantool.config.arena`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L610C7-L610C7)を設定します。この設定はTarantoolが使用する最大メモリを決定します。計算ガイドラインについては、他のデプロイオプションに対する[同様の推奨事項][tarantool-memory-recommendations]が参考になります。
* [`postanalytics.tarantool.resources.limits`および`postanalytics.tarantool.resources.requests`](https://github.com/wallarm/sidecar/blob/4eb1a4c4f8d20989757c50c40e192eb7eb1f2169/helm/values.yaml#L639)を`arena`設定と一致させます。ピーク時の需要に対応し、メモリ関連のクラッシュを回避するため、`limits`を`arena`値以上に設定し、Tarantoolの最適なパフォーマンスのために`requests`が`arena`値と同等またはそれ以上であることを確認します。詳細については[Kubernetes documentation](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)を参照してください。
* 必要に応じて、Tarantoolポッドに専用のリソース割り当てを保証するため、`postanalytics`セクション内の他のすべてのコンテナに対して`resources.requests`および`resources.limits`を設定します。これらのコンテナには`postanalytics.init`、`postanalytics.supervisord`、および`postanalytics.appstructure`が含まれます。
* 必要に応じて、ノード障害時の耐障害性を確保するため、pod anti-affinityを実装してpostanalyticsポッドを異なるノードに分散させます。

以下は、これらの推奨事項を組み込んだ`values.yaml`ファイル内の調整済み`postanalytics`セクションの例です：

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
  supervisord:
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

## サイドカーコンテナが注入されたアプリケーションワークロードのスケーリング

アプリケーションワークロードの管理にHorizontal Pod Autoscaling（HPA）を使用する場合、Wallarm Sidecarによって注入されたコンテナを含む、Pod内のすべてのコンテナに対して`resources.requests`を構成することが不可欠です。

### 前提条件

Wallarmコンテナに対して[HPAを実装](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)するには、以下の前提条件が満たされていることを確認します：

* Kubernetesクラスターに[Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme)が展開され、構成されていること。
* initコンテナを含む、アプリケーションPod内のすべてのコンテナに対して[`resources.request`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)が構成されていること。

アプリケーションコンテナのリソース割り当てはそのマニフェストに指定される必要があります。Wallarmによって注入されたコンテナに関しては、リソース設定が以下に概説されており、[グローバルにおよびPodごとに][sidecar-conf-area]割り当てることが可能です。

### Helmチャートの値を使用したグローバル割り当て

| コンテナ展開パターン               | コンテナ名              | チャート値                                      |
|--------------------------------|-----------------------|--------------------------------------------------|
| [分割, 単一][single-split-deployment]     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| 分割                           | sidecar-helper        | config.sidecar.containers.helper.resources       |
| [分割, 単一][single-split-deployment]     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| 分割                           | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

以下はグローバルにリソース（requestsおよびlimits）を管理するためのHelmチャート値の例です：

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

### Podのアノテーションを使用したPodごとの割り当て

| コンテナ展開パターン            | コンテナ名              | アノテーション                                                             |
|-------------------------|-----------------------|------------------------------------------------------------------------|
| [単一, 分割][single-split-deployment]     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| 分割                    | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| [単一, 分割][single-split-deployment]     | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| 分割                    | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

以下は、Podごとの割り当て（requestsおよびlimits）を管理するためのアノテーションの例です（`single`コンテナパターンが有効な場合）：

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

以下は、上記の設定を適用したWallarmチャートの`values.yaml`ファイルの例です。この例は、Wallarmによって注入されたコンテナのリソースがグローバルに割り当てられていることを前提としています。

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
  supervisord:
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