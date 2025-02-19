# Wallarm Sidecarのカスタマイズ

このドキュメントでは、[Wallarm Kubernetes Sidecar solution](deployment.md)の安全かつ効果的なカスタマイズ方法を説明し、一般的なカスタマイズユースケースの例を示します。

## 設定領域

Wallarm Sidecarソリューションは標準のKubernetesコンポーネントに基づいているため、ソリューションの設定はKubernetesスタックの設定と大部分が似ています。Wallarm Sidecarソリューションは、グローバルに`values.yaml`で設定するか、各アプリケーションPod単位でannotationsを使用して設定できます。

### グローバル設定

グローバル設定オプションは、Wallarmコントローラによって作成されるすべてのsidecarリソースに適用され、[default Helm chart values](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml)に設定されています。`helm install`や`helm upgrade`の際にカスタム`values.yaml`を提供することで上書きできます。

利用可能なグローバル設定オプションは無制限に存在します。ソリューションのカスタマイズ時には、Podの構成が完全に変更される可能性があり、ソリューションが正しく動作しなくなる場合があるため、注意が必要です。グローバル設定を変更する場合は、HelmおよびKubernetesのドキュメントを参照することを推奨します。

[Wallarm固有のチャート値の一覧はこちら](helm-chart-for-wallarm.md)

### Pod単位の設定

Pod単位の設定により、特定のアプリケーションの動作をカスタマイズできます。

各アプリケーションPodの設定は、Podのannotationsを介して設定されます。annotationsはグローバル設定より優先されます。同じオプションがグローバルとannotationの両方で指定された場合、annotationの値が適用されます。

サポートされるannotationセットは限定的ですが、`nginx-*-include`および`nginx-*-snippet`のannotationsにより、[任意のカスタムNGINX設定をソリューションで利用することが可能です](#using-custom-nginx-configuration)。

[サポートされるPod単位のannotationsの一覧はこちら](pod-annotations.md)

## 設定ユースケース

前述の通り、ソリューションは多様な方法でカスタマイズでき、インフラストラクチャとセキュリティ要件に適合させることが可能です。最も一般的なカスタマイズオプションの実装を容易にするため、関連するベストプラクティスを考慮して説明します。

### コンテナのシングルおよび分割デプロイメント

Wallarmは、PodへのWallarmコンテナのデプロイメントに2つのオプションを提供します：

* シングルデプロイメント（デフォルト）
* 分割デプロイメント

![シングルおよび分割コンテナ][single-split-containers-img]

コンテナのデプロイメントオプションはグローバルおよびPod単位で設定できます：

* グローバルには、Helmチャートの値`config.injectionStrategy.schema`を`single`（デフォルト）または`split`に設定します。
* Pod単位には、該当するアプリケーションPodのannotation`sidecar.wallarm.io/sidecar-injection-schema`に`"single"`または`"split"`を設定します。

!!! info "Postanalyticsモジュール"
    ご注意ください。postanalyticsモジュールのコンテナは[別に実行されます](deployment.md#solution-architecture)ので、記述されたデプロイメントオプションは他のコンテナにのみ関連します。

#### シングルデプロイメント（デフォルト）

Wallarmコンテナのシングルデプロイメントでは、オプションのinitコンテナ（**iptables**付き）を除き、Pod内で1つのコンテナのみが実行されます。

その結果、次の2つのコンテナが実行されます：

* `sidecar-init-iptables`はiptablesを実行するinitコンテナです。デフォルトではこのコンテナは起動しますが、[無効化可能です](#capturing-incoming-traffic-port-forwarding)。
* `sidecar-proxy`は、Wallarmモジュールおよび補助サービスを備えたNGINXプロキシを実行します。これらのプロセスはすべて[supervisord](http://supervisord.org/)により実行および管理されます。

#### 分割デプロイメント

Wallarmコンテナの分割デプロイメントでは、2つのinitコンテナに加え、さらに2つのコンテナがPod内で実行されます。

このオプションでは、`sidecar-proxy`コンテナからすべての補助サービスを分離し、NGINXサービスのみをコンテナが起動するようにします。

分割コンテナのデプロイメントにより、NGINXと補助サービスのリソース消費をより細かく制御できます。これは、Wallarmコンテナと補助コンテナ間でCPU/Memory/Storageの名前空間を分割する必要がある高負荷アプリケーションに推奨されるオプションです。

その結果、次の4つのコンテナが実行されます：

* `sidecar-init-iptables`はiptablesを実行するinitコンテナです。デフォルトではこのコンテナは起動しますが、[無効化可能です](#capturing-incoming-traffic-port-forwarding)。
* `sidecar-init-helper`は、WallarmノードとWallarm Cloudを接続する補助サービスを実行するinitコンテナです。
* `sidecar-proxy`はNGINXサービスを実行するコンテナです。
* `sidecar-helper`はその他の補助サービスを実行するコンテナです。

### アプリケーションコンテナポートの自動検出

保護されるアプリケーションポートは、複数の方法で設定可能です。受信トラフィックを適切に処理および転送するため、Wallarm Sidecarはアプリケーションコンテナが受け入れるTCPポートを認識する必要があります。

デフォルトでは、Sidecarコントローラは以下の優先順位でポートを自動検出します：

1. Podのannotation`sidecar.wallarm.io/application-port`でポートが定義されている場合、Wallarmコントローラはこの値を使用します。
1. アプリケーションコンテナの設定で`name: http`が定義されている場合、Wallarmコントローラはこの値を使用します。
1. `name: http`設定でポートが定義されていない場合、最初に見つかったアプリケーションコンテナ設定のポート値を使用します。
1. アプリケーションコンテナの設定にポートが定義されていない場合、Wallarm Helmチャートの`config.nginx.applicationPort`の値を使用します。

アプリケーションコンテナポートの自動検出が期待通りに動作しない場合は、1番目または4番目のオプションを使用して明示的にポートを指定してください。

### 受信トラフィックのキャプチャ（ポートフォワーディング）

デフォルトでは、Wallarm Sidecarコントローラはトラフィックを以下のようにルーティングします：

1. アタッチされたPodのIPとアプリケーションコンテナポートに到達する受信トラフィックをキャプチャします。
1. このトラフィックを組み込みのiptables機能を使用してsidecarコンテナにリダイレクトします。
1. Sidecarは不正なリクエストを緩和し、正当なトラフィックをアプリケーションコンテナに転送します。

受信トラフィックのキャプチャは、iptablesを実行するinitコンテナを使用して実装されており、これは自動ポートフォワーディングのベストプラクティスです。このコンテナはprivilegedモードで、`NET_ADMIN` capabilityを付与して実行されます。

![iptablesによるデフォルトのポートフォワーディング][port-forwarding-with-iptables-img]

ただし、このアプローチはIstioのようなサービスメッシュと互換性がありません。Istioはすでにiptablesベースのトラフィックキャプチャを実装しているためです。この場合、iptablesを無効化することでポートフォワーディングは以下のように動作します：

![iptablesなしのポートフォワーディング][port-forwarding-without-iptables-img]

!!! info "保護されていないアプリケーションコンテナ"
    iptablesが無効になっている場合、公開されたアプリケーションコンテナはWallarmによる保護を受けません。その結果、攻撃者がIPアドレスとポートを把握している場合、不正な「east-west」トラフィックがアプリケーションコンテナに到達する可能性があります。

    East/westトラフィックとは、Kubernetesクラスター内部でサービス間などで流れるトラフィックを指します。

デフォルトの動作を変更するには、以下の方法を使用します：

1. iptablesを以下のいずれかの方法で無効化します：

    * Helmチャートの値`config.injectionStrategy.iptablesEnable`を`"false"`に設定してグローバルに無効化する
    * Podのannotation`sidecar.wallarm.io/sidecar-injection-iptables-enable`を`"false"`に設定してPod単位で無効化する
2. Serviceマニフェストの`spec.ports.targetPort`の設定を`proxy`ポートに更新します。

    iptablesベースのトラフィックキャプチャが無効になっている場合、Wallarm Sidecarコンテナは`proxy`という名前のポートを公開します。Kubernetesサービスから`proxy`ポートに受信トラフィックを流すには、Serviceマニフェストの`spec.ports.targetPort`の設定をこのポートに向ける必要があります。

```yaml
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

### SSL/TLS終端処理

デフォルトでは、SidecarソリューションはHTTPトラフィックのみを受け入れ、プレーンHTTPトラフィックをアプリケーションPodに転送します。SSL/TLS終端処理は、Sidecarソリューションより前のインフラストラクチャコンポーネント（IngressやApplication Gatewayなど）により実施され、SidecarではプレーンHTTPを処理します。

しかし、既存のインフラストラクチャがSSL/TLS終端処理に対応していない場合、Wallarm SidecarレベルでSSL/TLS終端処理を有効化できます。この機能はHelmチャート4.6.1以降でサポートされています。

!!! warning "SidecarソリューションはSSL/TLSまたはプレーンHTTPトラフィック処理のいずれかしかサポートしていません"
    Wallarm Sidecarソリューションは、SSL/TLSまたはプレーンHTTPトラフィック処理のいずれかしかサポートしていません。SSL/TLS終端処理を有効にすると、SidecarソリューションはプレーンHTTPトラフィックを処理せず、SSL/TLS終端処理が無効の場合はHTTPSトラフィックのみが処理されます。

SSL/TLS終端処理を有効にする手順は以下の通りです：

1. SidecarがSSL/TLS終端処理を行うサーバーに関連付けられたサーバー証明書（公開鍵）と秘密鍵を取得します。
1. アプリケーションPodのnamespace内で、サーバー証明書と秘密鍵を含む[TLS secret](https://kubernetes.io/docs/concepts/configuration/secret/#tls-secrets)を作成します。
1. `values.yaml`ファイルに、secretマウント用の`config.profiles`セクションを追加します。以下の例は複数の証明書マウント設定を示しています。

    コメントに基づいて必要に応じてコードをカスタマイズしてください。1つの証明書のみが必要な場合は、不要な証明書マウント設定を削除してください。

    ```yaml
    config:
      wallarm:
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com" # or empty string if using the EU Cloud
        # Other Wallarm settings https://docs.wallarm.com/installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm/
      profiles:
        tls-profile: # Set any desired TLS profile name here
          sidecar:
            volumeMounts:
              - name: nginx-certs-example-com # Name of the volume containing example.com keys
                mountPath: /etc/nginx/certs/example.com # Path to mount example.com keys in the container
                readOnly: true
              - name: nginx-certs-example-io # Name of the volume containing example.io keys
                mountPath: /etc/nginx/certs/example.io # Path to mount example.io keys in the container
                readOnly: true
            volumes:
              - name: nginx-certs-example-com # Name of the volume containing example.com keys
                secret:
                  secretName: example-com-certs # Name of the secret created for the example.com backend, containing public and private keys
              - name: nginx-certs-example-io # Name of the volume containing example.io keys
                secret:
                  secretName: example-io-certs # Name of the secret created for the example.io backend, containing public and private keys
          nginx:
            # NGINX SSL module configuration specific to your TLS/SSL termination procedure.
            # Refer to https://nginx.org/en/docs/http/ngx_http_ssl_module.html.
            # This configuration is required for the Sidecar to perform traffic termination.
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
1. 以下のコマンドを使用して、`values.yaml`の変更をSidecarソリューションに適用します：

    ```bash
    helm upgrade <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f values.yaml
    ```
1. アプリケーションPodに[こちらの手順](pod-annotations.md#how-to-use-annotations)に従い、`sidecar.wallarm.io/profile: tls-profile`のannotationを適用します。
1. 設定が適用された後、[こちら](deployment.md#step-4-test-the-wallarm-sidecar-operation)に記載の手順に従い、HTTPをHTTPSに置き換えてソリューションのテストを実施してください。

Sidecarソリューションは、TLS/SSLトラフィックを受け入れ、終端処理を行い、プレーンHTTPトラフィックをアプリケーションPodに転送します。

### admission webhook用の証明書

リリース4.10.7以降、admission webhook用の証明書を独自に発行および使用するオプションが提供されています。

デフォルトでは、ソリューションは[`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen)を使用してadmission webhookの証明書を自動生成します。

独自の証明書を使用する場合、次のオプションがあります：

* **cert-managerを使用する方法**：クラスター内で[`cert-manager`](https://cert-manager.io/)を使用しており、admission webhook証明書の生成にcert-managerを利用する場合は、`values.yaml`を以下のように更新してください。

    これにより、自動的に`certgen`が無効化されます。

    ```yaml
    controller:
      admissionWebhook:
        certManager:
          enabled: true
    ```
* **手動で証明書をアップロードする方法**：`values.yaml`に以下の設定を追加することで、証明書を手動でアップロードできます。これにより、自動的に`certgen`が無効化されます。

    ```yaml
    controller:
      admissionWebhook:
        secret:
          enabled: true
          ca: <base64-encoded-CA-certificate>
          crt: <base64-encoded-certificate>
          key: <base64-encoded-private-key>
    ```

バージョン4.10.6以前からアップグレードする場合は、[こちらの特定のアップグレード手順](sidecar-upgrade-docs)に従ってください。この更新は破壊的変更を含むため、ソリューションの再インストールが必要です。

### 追加のNGINXモジュールの有効化

Wallarm SidecarのDockerイメージには、以下の追加NGINXモジュールがデフォルトで無効化されています：

* [ngx_http_brotli_filter_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_brotli_static_module.so](https://github.com/google/ngx_brotli)
* [ngx_http_geoip2_module.so](https://github.com/leev/ngx_http_geoip2_module)

追加のモジュールは、Pod単位でPodのannotation`sidecar.wallarm.io/nginx-extra-modules`を設定することで有効化できます。

annotationの値は配列形式で指定します。追加モジュールを有効化した例は以下の通りです：

```yaml
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

一部のNGINX設定に対して専用の[Pod annotations](pod-annotations.md)が存在しない場合、Pod単位の**snippets**および**includes**を使用して設定を指定できます。

#### Snippet

Snippetは、NGINX設定に1行の変更を加えるための便利な方法です。より複雑な変更が必要な場合は、[includes](#include)の使用を推奨します。

Pod単位のannotationを使用してカスタム設定を指定するには、次のannotationsを使用してください：

| NGINX設定セクション | Annotation                                     | 
|---------------------|------------------------------------------------|
| http                | `sidecar.wallarm.io/nginx-http-snippet`         |
| server              | `sidecar.wallarm.io/nginx-server-snippet`       |
| location            | `sidecar.wallarm.io/nginx-location-snippet`     |

[`disable_acl`][disable-acl-directive-docs] NGINXディレクティブの値を変更するannotationの例は以下の通りです：

```yaml
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

複数のディレクティブを指定する場合は、`;`記号を使用してください。例：

```yaml
sidecar.wallarm.io/nginx-location-snippet: "disable_acl on;wallarm_timeslice 10"
```

#### Include

カスタムのNGINX設定ファイルをWallarm Sidecarコンテナにマウントするには、まずこのファイルから[ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files)または[Secret resource](https://kubernetes.io/docs/concepts/configuration/secret/#creating-a-secret)を作成し、コンテナで作成されたリソースを使用します。

ConfigMapまたはSecretリソースを作成した後、[VolumeおよびVolumeMountsコンポーネント](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#populate-a-volume-with-data-stored-in-a-configmap)を使用してコンテナにマウントできます。次のPod単位のannotationsを使用してください：

| 項目          | Annotation                                      | 値の型    |
|---------------|-------------------------------------------------|-----------|
| Volumes       | `sidecar.wallarm.io/proxy-extra-volumes`         | JSON      |
| Volume mounts | `sidecar.wallarm.io/proxy-extra-volume-mounts`   | JSON      |

コンテナにリソースがマウントされた後、マウントされたファイルへのパスを対応するannotationに渡すことで、NGINXの設定追加用のコンテキストを指定します：

| NGINX設定セクション | Annotation                                      | 値の型    |
|---------------------|-------------------------------------------------|-----------|
| http                | `sidecar.wallarm.io/nginx-http-include`         | Array     |
| server              | `sidecar.wallarm.io/nginx-server-include`       | Array     |
| location            | `sidecar.wallarm.io/nginx-location-include`     | Array     |

以下は、NGINX設定のhttpレベルにマウントされた設定ファイルを含める例です。この例では、事前に有効なNGINX設定ディレクティブを含む`nginx-http-include-cm` ConfigMapが作成されているものとします。

```yaml
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

記載の一般的なソリューション設定に加えて、[Wallarmによる攻撃防止のベストプラクティス](wallarm-attack-prevention-best-practices-docs)についても確認することを推奨します。

この設定は、[annotations](pod-annotations.md)およびWallarm Console UIを介して行います。

## その他のannotationsによる設定

記載の設定ユースケースに加えて、その他多数のannotationsを使用してアプリケーションPodのWallarm Sidecarソリューションを細かく調整できます。

[サポートされるPod単位のannotationsの一覧はこちら](pod-annotations.md)