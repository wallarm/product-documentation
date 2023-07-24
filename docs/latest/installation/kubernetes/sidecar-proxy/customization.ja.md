					# Wallarm Sidecarプロキシのカスタマイズ

この記事では、一般的なカスタマイズのユースケースの例を示しながら、[Wallarm Kubernetes Sidecarプロキシソリューション](deployment.md) を安全かつ効果的にカスタマイズする方法を説明します。

## 設定領域

Wallarm Sidecarプロキシソリューションは、標準のKubernetesコンポーネントに基づいているため、ソリューションの設定はKubernetesスタックの設定と大幅に類似しています。`values.yaml` を介してWallarm Sidecarプロキシソリューションをグローバルに設定するか、アノテーションを介してアプリケーションポッドごとに設定できます。

### グローバル設定

グローバル設定オプションは、Wallarmコントローラーによって作成されたすべてのサイドカーリソースに適用され、[デフォルトのHelmチャート値](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)で設定されます。カスタム `values.yaml` を提供して `helm install` や `helm upgrade` でそれらを上書きできます。

利用可能なグローバル設定オプションの数に制限はありません。ソリューションのカスタマイズには注意が必要です。結果として得られるPodと不適切なソリューション機能が完全に変更できるからです。グローバル設定の変更時には、HelmおよびKubernetesのドキュメントを参照してください。

[Wallarm固有のチャート値のリストがあります](helm-chart-for-wallarm.md)

### ポッドごとの設定

ポッドごとの設定により、特定のアプリケーションのソリューションの動作をカスタマイズできます。

アプリケーションポッドごとの設定は、アプリケーションPodの注釈を介して設定されます。アノテーションはグローバル設定よりも優先されます。同じオプションがグローバルに指定され、アノテーションも指定されている場合、アノテーションからの値が適用されます。

サポートされるアノテーションセットは限られていますが、`nginx-*-include`および`nginx-*-snippet`アノテーションにより、[ソリューションで使用可能なカスタムNGINX設定](#using-custom-nginx-configuration) が可能です。

[サポートされているper-podのアノテーションのリストがあります](pod-annotations.md)

## 設定ユースケース

上記で述べたように、インフラストラクチャとセキュリティソリューションへの要件に合わせて、ソリューションをさまざまな方法でカスタマイズできます。最も一般的なカスタマイズオプションをより簡単に実装できるように、関連するベストプラクティスを検討しながらそれらを説明しました。

### コンテナのシングルおよびスプリットデプロイメント

Wallarmは、WallarmコンテナーをPodにデプロイするための2つのオプションを提供しています。

* シングルデプロイメント（デフォルト）
* スプリットデプロイメント

![!シングルおよびスプリットコンテナ](../../../images/waf-installation/kubernetes/sidecar-controller/single-split-deployment.png)

グローバルベースおよびポッドごとのベースでコンテナデプロイメントオプションを設定できます。

* Helmチャート値 `config.injectionStrategy.schema` を `single`（デフォルト）または `split` に設定してグローバルに設定します。
* 適切なアプリケーションPodのアノテーション `sidecar.wallarm.io/sidecar-injection-schema` を `"single"` または `"split"` に設定して、ポッドごとに設定します。

!!! info "Postanalyticsモジュール"
    postanalyticsモジュールコンテナは[別々に実行され](deployment.md#solution-architecture)、記述されたデプロイメントオプションは他のコンテナにのみ関連しています。

#### シングルデプロイメント（デフォルト）

Wallarmコンテナのシングルデプロイメントでは、**iptables** を持つオプションのinitコンテナを除き、Podで1つのコンテナのみが実行されます。

その結果、2つの実行中のコンテナがあります。

* `sidecar-init-iptables` は、initコンテナでiptablesを実行します。デフォルトでは、このコンテナが起動しますが、[#capturing-incoming-traffic-port-forwarding]で無効にできます。
* `sidecar-proxy` は、Wallarmモジュールおよびいくつかのヘルパーサービスを持つNGINXプロキシを実行します。これらのプロセスは、すべて[supervisord](http://supervisord.org/)によって実行および管理されます。

#### スプリットデプロイメント

Wallarmコンテナのスプリットデプロイメントでは、2つのinitコンテナを除いて、Podで2つの追加コンテナが実行されます。

このオプションでは、ヘルパーサービスをすべて `sidecar-proxy` コンテナから移動させ、コンテナが起動するのはNGINXサービスのみになります。

スプリットコンテナデプロイメントは、NGINXとヘルパーサービスが消費するリソースに対してより細かい制御を提供します。高負荷のアプリケーションでCPU /メモリ/ストレージネームスペースをWallarmとヘルパーコンテナ間で分割する必要がある場合、推奨されるオプションです。

その結果、実行中のコンテナは4つあります。

* `sidecar-init-iptables` は、initコンテナでiptablesを実行します。デフォルトでは、このコンテナが起動しますが、[#capturing-incoming-traffic-port-forwarding]で無効にできます。
* `sidecar-init-helper` は、WallarmノードをWallarmクラウドに接続するヘルパーサービスを持つinitコンテナです。
* `sidecar-proxy` は、NGINXサービスを持つコンテナです。
* `sidecar-helper` は、他のいくつかのヘルパーサービスを持つコンテナです。

### アプリケーションコンテナポートの自動検出

保護されたアプリケーションポートは、さまざまな方法で設定できます。着信トラフィックを適切に処理および転送するためには、Wallarmサイドカープロキシは、アプリケーションコンテナが着信リクエストを受け入れるTCPポートを認識している必要があります。

デフォルトでは、サイドカーコントローラーは、次の優先順位でポートを自動検出します。

1. ポートがPodのアノテーション `sidecar.wallarm.io/application-port` を介して定義されている場合、Wallarmコントローラーはこの値を使用します。
1. `name：http` アプリケーションコンテナ設定の下でポートが定義されている場合、Wallarmコントローラーはこの値を使用します。
1. `name：http` 設定のポートが定義されていない場合、Wallarmコントローラーはアプリケーションコンテナ設定で最初に見つかったポート値を使用します。
1. アプリケーションコンテナ設定にポートが定義されていない場合、WallarmコントローラーはWallarm Helmチャートから `config.nginx.applicationPort` の値を使用します。

アプリケーションコンテナポートの自動検出が期待通りに機能しない場合、1番目または4番目のオプションを使用してポートを明示的に指定してください。### 受信トラフィックの取得（ポートフォワーディング）

デフォルトでは、Wallarmのサイドカーコントローラは以下のようにトラフィックをルーティングします。

1. 接続されたPodのIPとアプリケーションコンテナーポートに来る受信トラフィックをキャプチャします。
1. このトラフィックを組み込みのiptables機能を使用して、サイドカープロキシコンテナにリダイレクトします。
1. サイドカープロキシは悪意のあるリクエストを軽減し、正当なトラフィックをアプリケーションコンテナへ転送します。

受信トラフィックの取得は、自動ポートフォワーディングのためのベストプラクティスであるiptablesを実行しているinitコンテナを使用して実装されています。このコンテナは、`NET_ADMIN` 権限を持つ特権を持って実行されます。

![!iptablesを使用したデフォルトのポートフォワーディング](../../../images/waf-installation/kubernetes/sidecar-controller/port-forwarding-with-iptables.png)

ただし、このアプローチはIstioのようなサービスメッシュと互換性がないため、Istioではすでにiptablesベースのトラフィックキャプチャが実装されています。この場合、iptablesを無効にしてポートフォワーディングが以下のように動作します：

![!iptablesなしのポートフォワーディング](../../../images/waf-installation/kubernetes/sidecar-controller/port-forwarding-without-iptables.png)

!!! info "保護されていないアプリケーションコンテナ"
    iptablesが無効になっている場合、公開されているアプリケーションコンテナはWallarmによって保護されません。その結果、攻撃者にIPアドレスとポートが知られている場合、悪意のある「イースト・ウェスト」トラフィックがアプリケーションコンテナに到達する可能性があります。

    イースト/ウェストトラフィックとは、Kubernetesクラスター内を流れるトラフィック（例えば、サービス間の通信）です。

デフォルトの動作は以下のように変更できます。

1. 以下のいずれかの方法でiptablesを無効にします。

    * Helmチャートの値 `config.injectionStrategy.iptablesEnable` を `"false"` に設定してグローバルに無効にする
    * Podのアノテーション `sidecar.wallarm.io/sidecar-injection-iptables-enable` を `"false"` に設定して、1つずつ無効にする
2. Serviceマニフェストの `spec.ports.targetPort` 設定を更新して、`proxy` ポートを指すようにします。

    iptablesベースのトラフィックキャプチャが無効になっている場合、Wallarmサイドカープロキシコンテナは`proxy`という名前のポートを公開します。Kubernetesサービスから `proxy` ポートに受信トラフィックが来るようにするには、Serviceマニフェストの `spec.ports.targetPort` 設定がこのポートを指すようにします：

```yaml hl_lines="16-17 34"
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
        sidecar.wallarm.io/sidecar-injection-iptables-enable: "false"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc
  namespace: default
spec:
  ports:
    - port: 80
      targetPort: proxy
      protocol: TCP
      name: http
  selector:
    app: myapp
```

### コンテナのリソース割り当て

Wallarmサイドカーコンテナに割り当てられたメモリの量は、リクエスト処理の品質と速度を決定します。メモリリクエストと制限に十分なリソースを割り当てるために、[こちらの推奨事項を参照してください](../../../admin-en/configuration-guides/allocate-resources-for-node.md).

リソースの割り当ては、グローバルおよび個別のポッドレベルで許可されています。

#### Helmチャートの値を使ったグローバル割り当て

| コンテナデプロイメントパターン | コンテナ名         | チャートの値                                       |
|-------------------|-----------------------|--------------------------------------------------|
| [スプリット、シングル](#single-and-split-deployment-of-containers)    | sidecar-proxy         | config.sidecar.containers.proxy.resources        |
| スプリット            | sidecar-helper        | config.sidecar.containers.helper.resources       |
| スプリット、シングル    | sidecar-init-iptables | config.sidecar.initContainers.iptables.resources |
| スプリット            | sidecar-init-helper   | config.sidecar.initContainers.helper.resources   |

リソース（リクエストと制限）をグローバルに管理するHelmチャートの値の例：

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

#### Podのアノテーションを使った個別の割り当て

| コンテナデプロイメントパターン | コンテナ名         | アノテーション                                                             |
|-------------------|-----------------------|------------------------------------------------------------------------|
| [シングル、スプリット](#single-and-split-deployment-of-containers)     | sidecar-proxy         | sidecar.wallarm.io/proxy-{cpu,memory,cpu-limit,memory-limit}         |
| スプリット            | sidecar-helper        | sidecar.wallarm.io/helper-{cpu,memory,cpu-limit,memory-limit}        |
| シングル、スプリット    | sidecar-init-iptables | sidecar.wallarm.io/init-iptables-{cpu,memory,cpu-limit,memory-limit} |
| スプリット            | sidecar-init-helper   | sidecar.wallarm.io/init-helper-{cpu,memory,cpu-limit,memory-limit}   |

リソース（リクエストと制限）を個別のポッドごとに管理するアノテーションの例（`シングル`コンテナパターンが有効化されている場合）：

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
```### 追加の NGINX モジュールの有効化

Wallarm のサイドカープロキシの Docker イメージは、デフォルトで以下の追加 NGINX モジュールが無効になっています。

* [ngx_http_auth_digest_module.so](https://github.com/atomx/nginx-http-auth-digest)
* [ngx_http_brotli_filter_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_brotli_static_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_geoip2_module.so](https://github.com/leev/ngx_http_geoip2_module)
* [ngx_http_influxdb_module.so](https://github.com/influxdata/nginx-influxdb-module)
* [ngx_http_modsecurity_module.so](https://github.com/SpiderLabs/ModSecurity)
* [ngx_http_opentracing_module.so](https://github.com/opentracing-contrib/nginx-opentracing)

Pod のアノテーション `sidecar.wallarm.io/nginx-extra-modules` を設定することで、追加のモジュールを1つのPodずつ有効にできます。

アノテーションの値の形式は配列です。追加モジュールが有効化された例：

```yaml hl_lines="16-17"
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
        sidecar.wallarm.io/nginx-extra-modules: "['ngx_http_brotli_filter_module.so','ngx_http_brotli_static_module.so', 'ngx_http_opentracing_module.so']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### カスタム NGINX 設定の使用

NGINX 設定の一部に専用の [pod のアノテーション](pod-annotations.md) がない場合、**スニペット**や**インクルード**経由でPod毎に設定を指定できます。

#### スニペット

スニペットは、NGINX 設定に1行の変更を追加する便利な方法です。より複雑な変更の場合、[インクルード](＃include) が推奨されます。

スニペット経由でカスタム設定を指定するには、以下の Pod のアノテーションを使用します。

| NGINX config section | Annotation                                  | 
|----------------------|---------------------------------------------|
| http                 | `sidecar.wallarm.io/nginx-http-snippet`     |
| server               | `sidecar.wallarm.io/nginx-server-snippet`   |
| location             | `sidecar.wallarm.io/nginx-location-snippet` |

[`disable_acl`](../../../admin-en/configure-parameters-en.md#disable_acl) NGINX ディレクティブの値を変更するアノテーションの例：

```yaml hl_lines="18"
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
        sidecar.wallarm.io/wallarm-mode: block
        sidecar.wallarm.io/nginx-location-snippet: "disable_acl on"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

1つ以上のディレクティブを指定するには `;` 記号を使用してください。

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### インクルード

Wallarm サイドカー コンテナに追加の NGINX 設定ファイルをマウントするには、このファイルから [ConfigMap を作成](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) するか、[Secret リソース](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret) を使用してコンテナで作成したリソースを使用できます。

ConfigMap または Secret リソースが作成されたら、次の Pod のアノテーションを使用して、[ボリュームとボリュームマウントコンポーネント](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap) を介してコンテナにマウントできます。

| Item          |  Annotation                                    | Value type  |
|---------------|------------------------------------------------|-------------|
| Volumes       | `sidecar.wallarm.io/proxy-extra-volumes`       | JSON |
| Volume mounts | `sidecar.wallarm.io/proxy-extra-volume-mounts` | JSON |

リソースがコンテナにマウントされたら、対応するアノテーションのマウントされたファイルへのパスを渡して、設定を追加する NGINX コンテキストを指定します。

| NGINX config section | Annotation                                  | Value type |
|----------------------|---------------------------------------------|------------|
| http                 | `sidecar.wallarm.io/nginx-http-include`     | Array  |
| server               | `sidecar.wallarm.io/nginx-server-include`   | Array  |
| location             | `sidecar.wallarm.io/nginx-location-include` | Array  |

以下は、NGINX 設定の `http` レベルでインクルードされたマウント済みの設定ファイルの例です。この例では、事前に `nginx-http-include-cm` ConfigMap が作成され、有効な NGINX 設定ディレクティブが含まれていることが前提となっています。

```yaml hl_lines="16-19"
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
        sidecar.wallarm.io/proxy-extra-volumes: "[{'name': 'nginx-http-extra-config', 'configMap': {'name': 'nginx-http-include-cm'}}]"
        sidecar.wallarm.io/proxy-extra-volume-mounts: "[{'name': 'nginx-http-extra-config', 'mountPath': '/nginx_include/http.conf', 'subPath': 'http.conf'}]"
        sidecar.wallarm.io/nginx-http-include: "['/nginx_include/http.conf']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### Wallarm 機能の設定

一般的なソリューション設定に加えて、[Wallarm 機能設定のベストプラクティス](../../../about-wallarm/deployment-best-practices.md)も確認することをお勧めします。

この設定は、[アノテーション](pod-annotations.md)と Wallarm Console UI を使用して行われます。

## アノテーションを使用した他の設定

一覧にある設定の使用例に加えて、他のアノテーションを使用して、アプリケーション Pod の Wallarm サイドカー プロキシ ソリューションを微調整できます。

[Pod のアノテーションのサポートされているリスト](pod-annotations.md)です。