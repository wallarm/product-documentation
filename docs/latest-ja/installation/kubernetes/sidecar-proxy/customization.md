# Wallarm Sidecarのカスタマイズ

本記事では、[Wallarm Kubernetes Sidecarソリューション](deployment.md)を安全かつ効果的にカスタマイズする方法を、一般的なカスタマイズユースケースの例とともに説明します。

## 設定範囲

Wallarm Sidecarソリューションは標準のKubernetesコンポーネントに基づいているため、ソリューションの設定は概ねKubernetesスタックの設定に類似しています。Wallarm Sidecarソリューションは、`values.yaml`によるグローバル設定と、アプリケーションPod単位のアノテーションによる設定の両方が可能です。

### グローバル設定

グローバルな設定オプションは、Wallarmコントローラが作成するすべてのSidecarリソースに適用され、[既定のHelmチャートの値](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)で定義されています。`helm install`または`helm upgrade`の実行時に、独自の`values.yaml`を指定することで上書きできます。

利用可能なグローバル設定オプションの数に制限はありません。結果のPodを完全に変更できてしまうため、カスタマイズの際には注意が必要で、設定を誤るとソリューションが適切に機能しなくなる可能性があります。グローバル設定を変更する際は、HelmおよびKubernetesのドキュメントを参照してください。

[Wallarm固有のチャート値の一覧はこちらです](helm-chart-for-wallarm.md)

### Pod単位の設定

Pod単位の設定により、特定のアプリケーションに対するソリューションの挙動をカスタマイズできます。

アプリケーションPod単位の設定は、アプリケーションPodのアノテーションで行います。アノテーションはグローバル設定より優先されます。同じオプションがグローバル設定とアノテーションの両方で指定されている場合は、アノテーションの値が適用されます。

サポートされるアノテーションの種類は限定されていますが、`nginx-*-include`および`nginx-*-snippet`アノテーションを使用すると、任意の[カスタムNGINX設定をソリューションで利用できます](#using-custom-nginx-configuration)。

[サポートされるPod単位のアノテーション一覧はこちらです](pod-annotations.md)

## 設定ユースケース

前述のとおり、本ソリューションはインフラやセキュリティ要件に合わせて多様な方法でカスタマイズできます。ここでは、関連するベストプラクティスを踏まえつつ、一般的なカスタマイズ例を解説します。

### コンテナの単一/分割デプロイメント

Wallarmは、PodへのWallarmコンテナのデプロイ方式として次の2つを提供します。

* 単一デプロイメント（既定）
* 分割デプロイメント

![単一/分割コンテナ][single-split-containers-img]

コンテナのデプロイ方式は、グローバル設定とPod単位の設定の両方で指定できます。

* グローバル: Helmチャート値`config.injectionStrategy.schema`を`single`（既定）または`split`に設定します。
* Pod単位: 対象アプリケーションPodのアノテーション`sidecar.wallarm.io/sidecar-injection-schema`に`"single"`または`"split"`を設定します。

!!! info "Postanalyticsモジュール"
    Postanalyticsモジュールのコンテナは[別コンテナとして実行されます](deployment.md#solution-architecture)。ここで説明するデプロイ方式は他のコンテナにのみ関係します。

#### 単一デプロイメント（既定）

単一デプロイメントでは、任意の**iptables**を実行するinitコンテナを除き、Pod内で実行されるWallarmコンテナは1つだけです。

結果として、次の2つのコンテナが実行されます。

* `sidecar-init-iptables`はiptablesを実行するinitコンテナです。既定ではこのコンテナは起動しますが、[無効化](#capturing-incoming-traffic-port-forwarding)できます。
* `sidecar-proxy`は、Wallarmモジュール付きのNGINXプロキシといくつかのヘルパーサービスを実行します。これらのプロセスはすべて[supervisord](http://supervisord.org/)によって実行・管理されます。

#### 分割デプロイメント

分割デプロイメントでは、2つのinitコンテナに加えて、さらに2つのコンテナがPod内で実行されます。

このオプションでは、すべてのヘルパーサービスを`sidecar-proxy`コンテナから分離し、そのコンテナではNGINXサービスのみを起動します。

分割デプロイメントにより、NGINXとヘルパーサービスが消費するリソースをより細かく制御できます。CPU/Memory/Storageなどのリソースや名前空間をWallarmコンテナとヘルパーコンテナで分離する必要がある高負荷アプリケーションに推奨されるオプションです。

結果として、次の4つのコンテナが実行されます。

* `sidecar-init-iptables`はiptablesを実行するinitコンテナです。既定ではこのコンテナは起動しますが、[無効化](#capturing-incoming-traffic-port-forwarding)できます。
* `sidecar-init-helper`は、WallarmノードをWallarm Cloudに接続する役割のヘルパーサービスを含むinitコンテナです。
* `sidecar-proxy`はNGINXサービスを含むコンテナです。
* `sidecar-helper`はいくつかのその他のヘルパーサービスを含むコンテナです。

### アプリケーションコンテナポートの自動検出

保護対象のアプリケーションのポートはさまざまな方法で設定できます。受信トラフィックを適切に処理・転送するには、Wallarm sidecarがアプリケーションコンテナが受信要求を受け付けるTCPポートを把握している必要があります。

既定では、sidecarコントローラは次の優先順位でポートを自動検出します。

1. `sidecar.wallarm.io/application-port`というPodのアノテーションでポートが定義されている場合、Wallarmコントローラはその値を使用します。
1. アプリケーションコンテナの設定に`name: http`としてポートが定義されている場合、Wallarmコントローラはその値を使用します。
1. `name: http`としてのポート定義がない場合、アプリケーションコンテナの設定で最初に見つかったポートの値を使用します。
1. アプリケーションコンテナの設定にポート定義がない場合、WallarmコントローラはWallarm Helmチャートの`config.nginx.applicationPort`の値を使用します。

アプリケーションコンテナポートの自動検出が期待どおりに動作しない場合は、1または4の方法で明示的にポートを指定してください。

### 受信トラフィックの捕捉（ポートフォワーディング）

既定では、Wallarm sidecarコントローラは次のようにトラフィックをルーティングします。

1. 接続されたPodのIPとアプリケーションコンテナのポートに到達する受信トラフィックを捕捉します。
1. 組み込みのiptables機能を使用して、このトラフィックをsidecarコンテナへリダイレクトします。
1. Sidecarが悪意のあるリクエストを軽減し、正当なトラフィックをアプリケーションコンテナへ転送します。

受信トラフィックの捕捉は、iptablesを実行するinitコンテナを用いて実装されています。これは自動ポートフォワーディングのベストプラクティスです。このコンテナは特権モードで、`NET_ADMIN`ケイパビリティを付与して実行します。

![iptablesを用いた既定のポートフォワーディング][port-forwarding-with-iptables-img]

ただし、Istioのようなサービスメッシュとはこの方式は互換性がありません。Istioはすでにiptablesベースのトラフィック捕捉を実装しているためです。この場合はiptablesを無効化でき、ポートフォワーディングは次のように機能します。

![iptablesなしのポートフォワーディング][port-forwarding-without-iptables-img]

!!! info "保護されないアプリケーションコンテナ"
    iptablesを無効化すると、公開されているアプリケーションコンテナはWallarmで保護されなくなります。その結果、攻撃者にコンテナのIPアドレスとポートが知られている場合は、悪意のある「east-west」トラフィックがアプリケーションコンテナに到達する可能性があります。

    east/westトラフィックとは、Kubernetesクラスター内を流れるトラフィック（例: サービス間通信）です。

既定の挙動は次のとおり変更できます。

1. 次のいずれかの方法でiptablesを無効化します。

    * グローバル: Helmチャート値`config.injectionStrategy.iptablesEnable`を`"false"`に設定します。
    * Pod単位: Podのアノテーション`sidecar.wallarm.io/sidecar-injection-iptables-enable`を`"false"`に設定します。
2. Serviceのマニフェストで`spec.ports.targetPort`設定を`proxy`ポートを指すように更新します。

    iptablesベースのトラフィック捕捉を無効化すると、Wallarm sidecarコンテナは`proxy`という名前のポートを公開します。Kubernetes Serviceからの受信トラフィックを`proxy`ポートへ流すために、Serviceのマニフェスト内の`spec.ports.targetPort`設定をこのポートを指すように指定する必要があります。

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

### SSL/TLS終端

既定では、SidecarソリューションはHTTPトラフィックのみを受け付け、プレーンHTTPトラフィックをアプリケーションPodへ転送します。SSL/TLS終端は、sidecarソリューションの前段にあるインフラコンポーネント（IngressやApplication Gatewayなど）で行われ、sidecarソリューションがプレーンHTTPを処理できる前提になっています。

ただし、既存インフラがSSL/TLS終端をサポートしていない場合があります。そのような場合は、Wallarm sidecar側でSSL/TLS終端を有効化できます。この機能はHelmチャート4.6.1からサポートされています。

!!! warning "SidecarソリューションはSSLまたはプレーンHTTPのいずれかのみを処理します"
    Wallarm Sidecarソリューションは、SSL/TLSまたはプレーンHTTPのいずれか一方のトラフィック処理をサポートします。SSL/TLS終端を有効化すると、sidecarソリューションはプレーンHTTPトラフィックを処理しなくなり、逆にSSL/TLS終端を無効化するとHTTPSトラフィックのみが処理されます。

SSL/TLS終端を有効化するには:

1. SidecarがSSL/TLSを終端する対象サーバに対応するサーバ証明書（公開鍵）と秘密鍵を取得します。
1. アプリケーションPodのNamespace内で、サーバ証明書と秘密鍵を含む[TLS Secret](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets)を作成します。
1. Secretをマウントするために、`values.yaml`に`config.profiles`セクションを追加します。以下の例は複数の証明書マウント構成を示しています。

    コメントに基づいてコードを調整し、要件に合わせてください。証明書が1つだけ必要な場合は、不要なマウント構成を削除してください。

    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com" # EU Cloudを使用する場合は空文字にします
        # その他のWallarm設定 https://docs.wallarm.com/installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm/
      profiles:
        tls-profile: # 任意のTLSプロファイル名を設定します
          sidecar:
            volumeMounts:
              - name: nginx-certs-example-com # example.comの鍵を含むボリューム名
                mountPath: /etc/nginx/certs/example.com # コンテナ内でexample.comの鍵をマウントするパス
                readOnly: true
              - name: nginx-certs-example-io # example.ioの鍵を含むボリューム名
                mountPath: /etc/nginx/certs/example.io # コンテナ内でexample.ioの鍵をマウントするパス
                readOnly: true
            volumes:
              - name: nginx-certs-example-com # example.comの鍵を含むボリューム名
                secret:
                  secretName: example-com-certs # example.comバックエンド用に作成したSecret名（公開鍵と秘密鍵を含む）
              - name: nginx-certs-example-io # example.ioの鍵を含むボリューム名
                secret:
                  secretName: example-io-certs # example.ioバックエンド用に作成したSecret名（公開鍵と秘密鍵を含む）
          nginx:
            # TLS/SSL終端手順に合わせたNGINX SSLモジュールの設定です。
            # https://nginx.org/en/docs/http/ngx_http_ssl_module.html を参照してください。
            # Sidecarがトラフィックの終端を行うために必要な設定です。
            servers:
              - listen: "ssl http2"
                include:
                  - "server_name example.com www.example.com"
                  - "ssl_protocols TLSv1.3"
                  - "ssl_certificate /etc/nginx/certs/example.com/tls.crt"
                  - "ssl_certificate_key /etc/nginx/certs/example.com/tls.key"
                  - "ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384"
                  - "ssl_conf_command Ciphersuites TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256"
              - listen: "ssl"
                include:
                  - "server_name example.io www.example.io"
                  - "ssl_protocols TLSv1.2 TLSv1.3"
                  - "ssl_certificate /etc/nginx/certs/example.io/tls.crt"
                  - "ssl_certificate_key /etc/nginx/certs/example.io/tls.key"
    ```
1. 次のコマンドで`values.yaml`の変更をSidecarソリューションに適用します。

    ```bash
    helm upgrade <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f values.yaml
    ```
1. アプリケーションPodに`sidecar.wallarm.io/profile: tls-profile`アノテーションを[適用](pod-annotations.md#how-to-use-annotations)します。
1. 設定を適用後、[こちら](deployment.md#step-4-test-the-wallarm-sidecar-operation)の手順に従って、HTTPをHTTPSに置き換えて動作をテストできます。

SidecarソリューションはTLS/SSLトラフィックを受け付けて終端し、プレーンHTTPトラフィックをアプリケーションPodへ転送します。

### admission webhook用の証明書

リリース4.10.7以降、admission webhook用の証明書を独自に発行して利用できるようになりました。

既定では、ソリューションは[`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen)を使用してadmission webhook用の証明書を自動生成します。

独自の証明書を使用するには、次のオプションがあります。

* cert-managerの使用: クラスターで[`cert-manager`](https://cert-manager.io/)を使用しており、admission webhookの証明書生成にもそれを用いたい場合は、`values.yaml`を次のように更新します。

    これにより`certgen`は自動的に無効化されます。

    ```yaml
    controller:
      admissionWebhook:
        certManager:
          enabled: true
    ```
* 手動アップロード: 次の設定を`values.yaml`に追加して証明書を手動でアップロードできます。これにより`certgen`は自動的に無効化されます。

    ```yaml
    controller:
      admissionWebhook:
        secret:
          enabled: true
          ca: <base64-encoded-CA-certificate>
          crt: <base64-encoded-certificate>
          key: <base64-encoded-private-key>
    ```

バージョン4.10.6以前からアップグレードする場合は、[特定のアップグレード手順][sidecar-upgrade-docs]に従ってください。この更新には破壊的変更が含まれており、ソリューションの再インストールが必要です。

### 追加のNGINXモジュールの有効化

Wallarm sidecarのDockerイメージには、以下の追加NGINXモジュールが含まれていますが、既定では無効です。

* [ngx_http_brotli_filter_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_brotli_static_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_geoip2_module.so](https://github.com/leev/ngx_http_geoip2_module)

追加モジュールは、Podのアノテーション`sidecar.wallarm.io/nginx-extra-modules`を設定することで、Pod単位でのみ有効化できます。

アノテーション値の形式は配列です。以下は追加モジュールを有効化した例です。

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

### カスタムNGINX設定の使用

特定のNGINX設定に対応する[Podアノテーション](pod-annotations.md)がない場合、Pod単位の「スニペット」と「インクルード」で設定できます。

#### スニペット

スニペットは、NGINX設定に1行の変更を加えるのに便利な方法です。より複雑な変更には、[インクルード](#include)の使用を推奨します。

スニペットでカスタム設定を指定するには、以下のPod単位のアノテーションを使用します。

| NGINX設定セクション | アノテーション                                  | 
|----------------------|---------------------------------------------|
| http                 | `sidecar.wallarm.io/nginx-http-snippet`     |
| server               | `sidecar.wallarm.io/nginx-server-snippet`   |
| location             | `sidecar.wallarm.io/nginx-location-snippet` |

[`disable_acl`][disable-acl-directive-docs]というNGINXディレクティブの値を変更するアノテーションの例です。

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

複数のディレクティブを指定するには、`;`記号を使用します。例:

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### インクルード

Wallarm sidecarコンテナに追加のNGINX設定ファイルをマウントするには、そのファイルから[ConfigMapを作成](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files)するか、[Secretリソース](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret)を作成し、コンテナ内でそのリソースを使用します。

ConfigMapまたはSecretリソースを作成したら、以下のPod単位のアノテーションを使用して、[VolumeおよびVolumeMountsコンポーネント](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap)経由でコンテナにマウントできます。

| 項目          |  アノテーション                                    | 値の型  |
|---------------|------------------------------------------------|-------------|
| Volumes       | `sidecar.wallarm.io/proxy-extra-volumes`       | JSON |
| Volume mounts | `sidecar.wallarm.io/proxy-extra-volume-mounts` | JSON |

リソースをコンテナにマウントしたら、対応するアノテーションでマウントしたファイルのパスを渡すことで、設定を追加するNGINXのコンテキストを指定します。

| NGINX設定セクション | アノテーション                                  | 値の型 |
|----------------------|---------------------------------------------|------------|
| http                 | `sidecar.wallarm.io/nginx-http-include`     | Array  |
| server               | `sidecar.wallarm.io/nginx-server-include`   | Array  |
| location             | `sidecar.wallarm.io/nginx-location-include` | Array  |

以下は、マウントした設定ファイルをNGINX設定の`http`レベルでインクルードする例です。この例では、事前に`nginx-http-include-cm`というConfigMapが作成され、有効なNGINX設定ディレクティブを含んでいることを前提としています。

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
        sidecar.wallarm.io/proxy-extra-volumes: '[{"name": "nginx-http-extra-config", "configMap": {"name": "nginx-http-include-cm"}}]'
        sidecar.wallarm.io/proxy-extra-volume-mounts: '[{"name": "nginx-http-extra-config", "mountPath": "/nginx_include/http.conf", "subPath": "http.conf"}]'
        sidecar.wallarm.io/nginx-http-include: "['/nginx_include/http.conf']"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

### Wallarm機能の設定

上記の一般的なソリューション設定に加えて、[Wallarmによる攻撃防止のベストプラクティス][wallarm-attack-prevention-best-practices-docs]もぜひご確認ください。

この設定は、[アノテーション](pod-annotations.md)およびWallarm Console UIで行います。

## アノテーションによるその他の設定

上記の設定ユースケースに加え、さまざまなアノテーションを用いて、アプリケーションPod向けのWallarm sidecarソリューションを細かく調整できます。

[サポートされるPod単位のアノテーション一覧はこちらです](pod-annotations.md)