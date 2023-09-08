# NGINX、EnvoyなどによるミラーリングされたトラフィックのためのWallarm OOB

この記事では、NGINX、Envoy、または類似のツールによりトラフィック・ミラーを作成する選択をした場合の、Wallarmを[OOB](../overview.md)ソリューションとしてデプロイする方法について説明します。

トラフィック・ミラーリングは、ウェブサーバー、プロキシサーバー、または類似のサーバーを設定して、入力トラフィックをWallarmサービスにコピーし、分析を行うことで実装することが可能です。このアプローチでは、典型的なトラフィックフローは以下のようになります：

![OOBスキーム](../../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## デプロイメント手順

トラフィック・ミラーを解析するためにWallarmをデプロイおよび設定するには、以下の手順を実行します：

1. 以下のいずれかの方法で、Wallarmノードをインフラストラクチャにデプロイします：

   * [Terraformモジュールを使用してAWSに](../terraform-module/mirroring-by-web-server.md)
   * [マシンイメージを使用してAWSに](aws-ami.md)
   * [マシンイメージを使用してGCPに](gcp-machine-image.md)

   <!-- * [NGINXベースのDockerイメージを使用してコンテナベースの環境に](docker-image.md)
    * [DEB/RPMパッケージからDebianまたはUbuntu OSのマシンに](packages.md) -->

    !!! info "ミラーリングされたトラフィック解析のサポート"
        ミラーリングされたトラフィックのフィルタリングは、NGINXベースのWallarmノードのみでサポートされています。
1. トラフィックのコピーを解析するようにWallarmを設定します - 上記の手順には必要なステップが含まれています。
1. あなたのインフラストラクチャを設定し、あなたの入力トラフィックのコピーを生成し、そのコピーを追加のバックエンドとしてWallarmノードに送信します。

    設定詳細については、あなたのインフラストラクチャで使用されているコンポーネントのドキュメンテーションを参照することをお勧めします。[以下](#examples-of-web-server-configuration-for-traffic-mirroring)では、NGINX、Envoy、類似した一般的なソリューションの設定例を提供しますが、実際の設定はあなたのインフラストラクチャの特性に依存します。

## トラフィックミラーリングの設定例

以下は、NGINX、Envoy、Traefik、Istioを設定して、入力トラフィックを追加のバックエンドとしてWallarmノードにミラーリングする方法の例です。

### NGINX

NGINX 1.13からは、追加のバックエンドへトラフィックをミラーリングすることができます。トラフィックのミラーリングを行うためにNGINXを設定するには：

1. `location` または `server` ブロックで `mirror` ディレクティブを設定することで、[`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)モジュールを設定します。

下記の例では、`location /` で受信したリクエストを `location /mirror-test` にミラーリングします。
1. ミラーされたトラフィックをWallarmノードに送信するために、ミラーリングするヘッダーをリストし、`mirror`ディレクティブが指す `location` にノードがあるマシンのIPアドレスを指定します。 

```nginx
location / {
        mirror /mirror-test;
        mirror_request_body on;
        root   /usr/share/nginx/html;
        index  index.html index.htm; 
    }
    
location /mirror-test {
        internal;
        #proxy_pass http://111.11.111.1$request_uri;
        proxy_pass http://222.222.222.222$request_uri;
        proxy_set_header X-SERVER-PORT $server_port;
        proxy_set_header X-SERVER-ADDR $server_addr;
        proxy_set_header HOST $http_host;
        proxy_set_header X-Forwarded-For $realip_remote_addr;
        proxy_set_header X-Forwarded-Port $realip_remote_port;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Request-ID $request_id;
    }
```

[NGINXのドキュメンテーションを確認](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)

### Envoy

この例では、Envoyによるトラフィックミラーリングを設定しています。この構成では、単一の `listener` がポート80（TLSなし）をリッスンし、単一の `filter` を持つ。元のバックエンドとミラーリングされたトラフィックを受け取る追加のバックエンドのアドレスは `clusters` ブロックで指定されています。

```yaml
static_resources:
  listeners:
  - address:
      socket_address:
        address: 0.0.0.0
        port_value: 80
    filter_chains:
    - filters:
        - name: envoy.filters.network.http_connection_manager
          typed_config:
            "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
            stat_prefix: ingress_http
            codec_type: AUTO
            route_config:
              name: local_route
              virtual_hosts:
              - name: backend
                domains:
                - "*"
                routes:
                - match:
                    prefix: "/"
                  route:
                    cluster: httpbin     # <-- 元のクラスターへのリンク
                    request_mirror_policies:
                    - cluster: wallarm   # <-- ミラーリングされたリクエストを受け取るクラスターへのリンク
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### 元のクラスターの定義
  ###
  - name: httpbin
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: httpbin
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              ### 元のエンドポイントのアドレス。アドレスはDNS名
              ### またはIPアドレス、port_valueはTCPポート番号です
              ###
              socket_address:
                address: httpbin # <-- 元のクラスターの定義
                port_value: 80

  ### ミラーリングされたリクエストを受け取るクラスターの定義
  ###
  - name: wallarm
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: wallarm
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              ### 元のエンドポイントのアドレス。アドレスはDNS名
              ### またはIPアドレス、port_valueはTCPポート番号です。Wallarmの
              ### ミラーリングスキーマは任意のポートでデプロイ可能ですが、
              ### デフォルト値はTerraformモジュールではTCP/8445、
              ### 他のデプロイオプションでは80がデフォルト値となります。
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Envoyのドキュメンテーションを確認](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

### Istio

Istioでトラフィックをミラーリングするためには、ミラーリングルートを内部エンドポイント（Istioの内部、例えばKubernetes内部）または `ServiceEntry` を用いた外部エンドポイントに対して `VirtualService` を設定することができます：

* クラスタ内のリクエスト（例えば、ポッド間）のミラーリングを有効にするには、`.spec.gateways` に `mesh` を追加します。
* 外部リクエスト（例えば、LoadBalancerやNodePortサービス経由）のミラーリングを有効にするには、Istioの `Gateway` コンポーネントを設定し、`VirtualService` の `.spec.gateways` にそのコンポーネントの名前を追加します。このオプションは下記の例に示されています。

```yaml
---
### ミラーリングされたトラフィックの送信先の設定
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # ミラーリングの宛先アドレス
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # ミラーリングの宛先ポート
      name: http
      protocol: HTTP
  resolution: DNS
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - ...
  gateways:
    ### istio `Gateway`コンポーネントの名前。外部からのトラフィックを処理するために必要
    ###
    - httpbin-gateway
    ### 特殊なラベル。これにより、この仮想サービスのルートは、Kubernetesのポッドからのリクエスト（ゲートウェイを経由しないクラスタ内通信）と一緒に機能します
    ###
    - mesh
  http:
    - route:
        - destination:
            host: httpbin
            port:
              number: 80
          weight: 100
      mirror:
        host: some.external.service.tld # ミラーリングの宛先アドレス
        port:
          number: 8445 # ミラーリングの宛先ポート
---
### 外部からのリクエストを処理するための設定
###
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: httpbin-gateway
spec:
  selector:
    istio: ingress
    app: istio-ingress
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "httpbin.local"
```

[Istioのドキュメンテーションを確認](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

### Traefik

以下の設定例は、「[動的設定ファイル](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/)」アプローチに基づいています。Traefikは他の設定モードもサポートしており、提供されたものを類似の構造を持つ他のモードに簡単に調整することができます。

```yaml
### 動的設定ファイル
### 注意：entrypointsは静的設定ファイルで記述されています
http:
  services:
    ### 元のサービスとwallarm `services`のマッピング方法。
    ### 次の`routers`の設定では（下記参照）、このサービスの
    ### 名前（`with_mirroring`）を使用してください。
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### ミラーリングされたトラフィックを送信する`service` – 
    ### リクエストがオリジナルの`service`からコピー（ミラーリング）されて
    ### 受信するべきエンドポイント
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### オリジナルの`service`。このサービスは
    ### オリジナルのトラフィックを受け取るべき。
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### トラフィックミラーリングが機能するためには、ルーター名は
    ### トラフィックミラーリング用の`service`名（with_mirroring）と
    ### 同じである必要があります。
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### オリジナルのトラフィック用のルーター
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[Traefikのドキュメンテーションを確認](https://doc.traefik.io/traefik/routing/services/#mirroring-service)
