# NGINX、EnvoyなどでミラーリングされたトラフィックのためのWallarm OOB

この記事では、NGINX、Envoyまたは類似のソリューションでトラフィックミラーを生成するための[OOB](../overview.ja.md)ソリューションとしてWallarmをデプロイする方法を解説します。

トラフィックミラーリングは、Webサーバー、プロキシサーバーなどを設定して、入ってきたトラフィックをWallarmのサービスにコピーしたり分析したりすることで実現できます。このアプローチでは、通常のトラフィックのフローは以下のようになります：

![!OOBスキーム](../../../images/waf-installation/oob/oob-for-traffic-mirrored-by-server.png)

## デプロイメント手順

トラフィックミラーを分析するためにWallarmをデプロイおよび設定するには以下の手順を実行します：

1. 以下のいずれかの方法でWallarmノードをインフラにデプロイします：

    * [Terraformモジュールを使用してAWSに](../terraform-module/mirroring-by-web-server.ja.md)
    * [マシンイメージを使用してAWSに](aws-ami.ja.md)
    * [マシンイメージを使用してGCPに](gcp-machine-image.ja.md)

    <!-- * [NGINXベースのDockerイメージを使用してコンテナベースの環境に](docker-image.ja.md)
    * [DEB/RPMパッケージからDebianまたはUbuntu OSのマシンに](packages.ja.md) -->

    !!! info "ミラーリングされたトラフィック解析のサポート"
        ミラーリングされたトラフィックのフィルタリングは、NGINXベースのWallarmノードのみがサポートしています。
1. トラフィックのコピーを解析するようにWallarmを設定します - 上記の手順には必要なステップが含まれています。
1. あなたのインフラを設定して、入ってきたトラフィックのコピーを作成し、そのコピーを追加のバックエンドとしてWallarmノードに送信します。

    設定の詳細については、あなたのインフラで使用されているコンポーネントのドキュメンテーションを参照することをお勧めします。[以下](#examples-of-web-server-configuration-for-traffic-mirroring)で、NGINX、Envoyなどの人気のあるソリューションの設定例をいくつか紹介しますが、実際の設定はあなたのインストラの特性に依存します。

## トラフィックミラーリングの設定例

以下は、NGINX、Envoy、Traefik、Istioを設定して、入ってきたトラフィックを追加のバックエンドとしてWallarmノードにミラーリングする方法の例です。

### NGINX

NGINX 1.13から、追加のバックエンドにトラフィックをミラーリングすることができます。トラフィックをミラーリングするためにNGINXを設定するには：

1. `location`または`server`ブロックで`mirror`ディレクティブを設定して[`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)モジュールを設定します。

    下の例では、`location /`で受けたリクエストが`location /mirror-test`にミラーリングされます。
1. ミラーリングされたトラフィックをWallarmノードに送信するために、ミラーリングされるべきヘッダーをリスト化し、ノードがあるマシンのIPアドレスを`mirror`ディレクティブが指す`location`に指定します。

```
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

[NGINXのドキュメンテーションを確認する](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)

### Envoy

この例では、ポート80（TLSなし）をリッスンする単一の`listener`を介してEnvoyでトラフィックミラーリングを設定し、単一の`filter`を持っています。元のバックエンドとミラーリングされたトラフィックを受信する追加のバックエンドのアドレスは`clusters`ブロックで指定されます。

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
                    cluster: httpbin     # <-- original clustersへのリンク 
                    request_mirror_policies:
                    - cluster: wallarm   # <--  mirrors requestを受け取るclusterへのリンク 
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### original clusterの定義
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
              ### original endpointのアドレス。AddressはDNS名 
              ### or IPアドレス、port_valueはTCPポート番号です
              ###
              socket_address:
                address: httpbin # <-- original clustersの定義 
                port_value: 80

  ###mirrorsを受け取るclusterの定義
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
              ### Address of the original endpoint. AddressはDNS名 
              ### またはIPアドレス、port_valueはTCPポート番号です。Wallarm
              ### mirrorスキーマは任意のポートでデプロイできますが、
              ### デフォルト値はTerraform moduleの場合はTCP/8445、
              ### その他のデプロイオプションのデフォルト値は80になります。
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Envoyのドキュメンテーションを確認する](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

### Istio

Istioでトラフィックをミラーリングするためには、`VirtualService`のミラーリングルートを内部エンドポイント（Istioにとっての内部、例えばKubernetes内）または`ServiceEntry`を用いた外部エンドポイントに設定することができます。

* クラスタ内リクエスト（例えばポッド間）のミラーリングを有効にするには、`.spec.gateways`に`mesh`を追加します。
* 外部リクエスト（例えばLoadBalancerやNodePortサービスを介したリクエスト）のミラーリングを有効にするには、Istioの`Gateway`コンポーネントを設定し、そのコンポーネントの名前を`VirtualService`の`.spec.gateways`に追加します。このオプションは以下の例で示されています。

```yaml
---
### mirrored trafficの宛先の設定
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # mirroring destination address
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # mirroring destination port
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
    ### istio `Gateway` componentの名前。外部ソースからのトラフィックの取り扱いに
    ### 必要な部分です。
    ###
    - httpbin-gateway
    ### 特別なラベル。virtual service routesをKubernetesポッドからのリクエスト
    ### (gatewayを介さないクラスタ内通信)で動作させることが可能になります。
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
        host: some.external.service.tld # ミラーリング先のアドレス
        port:
          number: 8445 # ミラーリング先のポート
---
### 外部のリクエストの取り扱い
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

[Istioのドキュメンテーションを確認する](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

### Traefik

以下の設定例は[`動的設定ファイル`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/)のアプローチに基づいています。Traefikは他の設定モードもサポートしており、提供されるものをそれらに簡単に調整することができます。

```yaml
### 動的設定ファイル### 注意：エントリーポイントは静的設定ファイルで説明されています
http:
  services:
    ### 以下は、オリジナルとwallarmの`services`をマッピングする方法です。
    ### さらなる`routers`の設定において（下記参照）、
    ### このサービスの名前（`with_mirroring`）を使用してください。
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### トラフィックをミラーリングする`service` - エンドポイント。
    ### オリジナルの`service`からミラーリング（コピー）された要求を受信する必要があります。
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### オリジナルの`service`。このサービスは、
    ### オリジナルのトラフィックを受信する必要があります。
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### ルーターの名前は、トラフィックミラーリングが機能するためには
    ### `service`名と同じでなければなりません（with_mirroring）。
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### オリジナルのトラフィック用のルーター。
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"


[Traefikのドキュメンテーションを確認してください](https://doc.traefik.io/traefik/routing/services/#mirroring-service)