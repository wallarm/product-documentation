# Wallarm Sidecarのスケーリングと高可用性

このガイドでは、[Wallarm Sidecarソリューション][sidecar-docs]におけるスケーリング、高可用性(HA)、および適切なリソース割り当ての要点に焦点を当てます。これらを適切に構成することで、Wallarm Sidecarの信頼性とパフォーマンスを向上させ、ダウンタイムを最小化しつつ効率的なリクエスト処理を実現できます。

構成は大きく次の2つのセグメントに分類されます：

* Wallarm Sidecarコントロールプレーン用の設定
* sidecarが注入されたアプリケーションワークロード用の設定

Wallarm Sidecarのスケーリングと高可用性は、標準的なKubernetesのプラクティスに依存します。推奨事項を適用する前に基礎を把握するため、次のリンクを参照することをおすすめします:

* [KubernetesのHorizontal Pod Autoscaling (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
* [Kubernetesにおける高可用クラスター](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
* [コンテナとPodへのCPUリソースの割り当て](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

## Wallarm Sidecarコントロールプレーンのスケーリング

Wallarm Sidecarソリューションは[controllerとpostanalytics(wstore)の2つのコンポーネントで構成されます][sidecar-arch-docs]。それぞれに個別のスケーリング設定が必要で、`replicas`、`requests`、`podAntiAffinity`といったKubernetesパラメータを使用します。

### Controller

Sidecar Controllerはmutating admission webhookとして機能し、アプリケーションのPodにsidecarコンテナを注入します。多くの場合、HPAによるスケーリングは不要です。HAデプロイメントのために、`values.yaml`ファイルで次の設定を検討してください:

* Sidecar Podを2つ以上のインスタンスで実行します。これは[`controller.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L867)属性で制御します。
* 必要に応じて、ControllerのPodに予約リソースを確保するため[`controller.resources.requests.cpu`と`controller.resources.requests.memory`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L991)を設定します。
* 必要に応じて、Pod anti-affinityを使用してControllerのPodを複数のノードに分散し、ノード障害発生時の耐障害性を高めます。

これらの推奨事項を反映した`values.yaml`ファイルの`controller`セクションの例を次に示します:

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
      cpu: 250m
      memory: 300Mi
    requests:
      cpu: 50m
      memory: 150Mi
```

### Postanalytics(wstore)

postanalyticsコンポーネントは、アプリケーションワークロードに注入されたすべてのsidecarコンテナからのトラフィックを処理します。このコンポーネントはHPAではスケールできません。

HAデプロイメントでは、`values.yaml`ファイルの次の設定を使用してReplica数を手動で調整できます:

* postanalytics Podを2つ以上のインスタンスで実行します。これは[`postanalytics.replicaCount`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L447)属性で制御します。
* 予想されるアプリケーションワークロードのトラフィック量に基づいて、[`postanalytics.wstore.config.arena`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L625)をギガバイト(GB)単位で設定します。この設定はwstoreが使用する最大メモリを決定します。計算の目安については、[他のデプロイメントオプション向けの当社推奨と同様の指針][wstore-memory-recommendations]が参考になります。

    [NGINX Node 5.x以前][what-is-new-wstore]では、このパラメータ名は`postanalytics.tarantool.config.arena`でした。アップグレード時には名称の変更が必要です。
* [`postanalytics.wstore.resources.limits`と`postanalytics.wstore.resources.requests`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml#L654)を`arena`の設定に合わせます。ピーク需要に対応しメモリ関連のクラッシュを回避するため、`limits`は`arena`の値以上に設定します。wstoreの最適なパフォーマンスのため、`requests`も`arena`の値以上であることを確認します。詳細は[Kubernetesのドキュメント](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)を参照してください。

    [NGINX Node 5.x以前][what-is-new-wstore]では、これらのパラメータ名は`postanalytics.tarantool.resources.limits`および`postanalytics.tarantool.resources.requests`でした。アップグレード時には名称の変更が必要です。
* 必要に応じて、postanalytics(wstore) Podに専用のリソースを確保できるよう、`postanalytics`セクション内の他のすべてのコンテナに対しても`resources.requests`と`resources.limits`を設定します。これらのコンテナには`postanalytics.init`、`postanalytics.supervisord`、`postanalytics.appstructure`が含まれます。
* 必要に応じて、Pod anti-affinityを実装してpostanalyticsのPodを複数のノードに分散し、ノード障害時の耐障害性を高めます。

これらの推奨事項を反映した`values.yaml`ファイルの`postanalytics`セクションの例を次に示します:

```yaml
postanalytics:
  replicaCount: 2
  wstore:
    config:
      arena: "2.0"
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 500m
        memory: 2Gi
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

## sidecarコンテナを注入したアプリケーションワークロードのスケーリング

アプリケーションワークロードの管理にHorizontal Pod Autoscaling(HPA)を使用する場合、Wallarm Sidecarが注入するものを含め、Pod内のすべてのコンテナに対して`resources.requests`を設定することが不可欠です。

### 前提条件

Wallarmコンテナに対して[HPAを実装](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)するには、次の前提条件を満たしていることを確認してください:

* Kubernetesクラスターに[Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme)がデプロイされ、構成されていること。
* Initコンテナを含め、アプリケーションPod内のすべてのコンテナに[`resources.request`](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)が設定されていること。

    アプリケーションコンテナのリソース割り当ては、そのマニフェストで指定する必要があります。Wallarmが注入するコンテナについては、以下にリソース設定を示しており、[グローバルまたはPod単位][sidecar-conf-area]のいずれでも割り当て可能です。

### Helmチャートのvaluesによるグローバルな割り当て

| コンテナのデプロイパターン | コンテナ名        | チャート値                                      |
|-------------------|-----------------------|--------------------------------------------------|
| [Split、Single][single-split-deployment]     | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| Split             | sidecar-helper        | config.sidecar.containers.helper.resources       |
| Split、Single     | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| Split             | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

リソース(requestsとlimits)をグローバルに管理するためのHelmチャートのvaluesの例:

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

### PodのアノテーションによるPod単位の割り当て

| コンテナのデプロイパターン | コンテナ名        | アノテーション                                                             |
|-------------------|-----------------------|----------------------------------------------------------------------------|
| [Single、Split][single-split-deployment]     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| Split             | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| Single、Split     | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| Split             | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

`single`コンテナパターンを有効化した場合の、Pod単位でリソース(requestsとlimits)を管理するためのアノテーション例:

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

以下は、前述の設定を適用したWallarmチャートの`values.yaml`ファイルの例です。この例では、Wallarmが注入するコンテナのリソースがグローバルに割り当てられていることを前提としています。

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
      cpu: 250m
      memory: 300Mi
    requests:
      cpu: 50m
      memory: 150Mi
postanalytics:
  replicaCount: 2
  wstore:
    config:
      arena: "2.0"
    resources:
      limits:
        cpu: 1000m
        memory: 2Gi
      requests:
        cpu: 500m
        memory: 2Gi
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