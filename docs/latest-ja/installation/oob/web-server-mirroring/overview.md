# Wallarm OOB for Traffic Mirrored by NGINX、Envoy and Similar

本記事では、NGINX、Envoyなどのソリューションでトラフィックミラーを生成する場合に、Wallarmを[OOB](../overview.md)ソリューションとしてデプロイする方法について説明します。

トラフィックミラーリングは、ウェブサーバー、プロキシサーバーなどを設定して、受信トラフィックのコピーをWallarmサービスに送信し、解析を行う形で実装できます。このアプローチでは、一般的なトラフィックフローは次のようになります:

![OOB scheme](../../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## デプロイ手順

トラフィックミラーを解析するようにWallarmをデプロイおよび構成するには、以下の手順を実行する必要があります:

1. 以下のいずれかの方法で、Wallarmノードをインフラストラクチャにデプロイします:

    * [Linux OS搭載マシンでのall-in-oneインストーラーによるデプロイ](linux/all-in-one.md)
    * [Machine Imageを利用してAWSへデプロイ](aws-ami.md)
    * [Machine Imageを使用してGCPへデプロイ](gcp-machine-image.md)
    * [NGINXベースのDockerイメージを使用してコンテナ環境へデプロイ](docker-image.md)

    !!! info "ミラーされたトラフィック解析のサポート"
        NGINXベースのWallarmノードのみがミラーされたトラフィックのフィルトレーションをサポートします。
1. トラフィックコピーを解析するようにWallarmを構成します ― 上記の手順には必要なステップが含まれています。
1. インフラストラクチャを構成して、受信トラフィックのコピーを生成し、追加バックエンドとしてWallarmノードへ送信します。

    設定の詳細については、インフラストラクチャで使用しているコンポーネントのドキュメントを参照することを推奨します。[下記](#configuration-examples-for-traffic-mirroring)に、NGINX、Envoyなどの一般的なソリューションの設定例を示しますが、実際の構成はインフラストラクチャの特性に依存します。

## トラフィックミラーリングの設定例

以下は、NGINX、Envoy、Traefik、Istioを使用して、受信トラフィックをWallarmノードへ追加バックエンドとしてミラーする方法の設定例です。

### NGINX

NGINX 1.13以降では、トラフィックを追加バックエンドにミラーできます。NGINXでトラフィックをミラーするには:

1. `location`または`server`ブロック内で`mirror`ディレクティブを設定し、[`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)モジュールを構成します。

    以下の例は、`location /`で受信したリクエストを`location /mirror-test`にミラーします。
1. ミラーされたトラフィックをWallarmノードへ送信するため、ミラーするヘッダーを列挙し、`mirror`ディレクティブが指す`location`でノードのあるマシンのIPアドレスを指定します。

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

[NGINXのドキュメントを確認](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)

### Envoy

以下の例では、ポート80( TLSなし)でリッスンする単一の`listener`と単一の`filter`を使用して、Envoyでトラフィックミラーリングを構成します。元のバックエンドとミラーされたトラフィックを受信する追加バックエンドのアドレスは、`clusters`ブロックで指定します。

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
                    cluster: httpbin     # <-- 元のクラスタへのリンク
                    request_mirror_policies:
                    - cluster: wallarm   # <-- ミラーされたリクエストを受信するクラスタへのリンク
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### 元のクラスタの定義
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
              ### 元のエンドポイントのアドレス。アドレスはDNS名またはIPアドレス、port_valueはTCPポート番号です。
              ###
              socket_address:
                address: httpbin # <-- 元のクラスタの定義
                port_value: 80

  ### ミラーされたリクエストを受信するクラスタの定義
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
              ### ミラー先エンドポイントのアドレス。アドレスはDNS名またはIPアドレス、port_valueはTCPポート番号です。Wallarmミラーリングスキーマは任意のポートでデプロイ可能ですが、Terraformモジュールのデフォルト値はTCP/8445であり、その他のデプロイメントオプションのデフォルト値は80です。
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Envoyのドキュメントを確認](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

### Istio

Istioでトラフィックをミラーするには、内部エンドポイント(たとえばKubernetes上でホストされる)または`ServiceEntry`を使用した外部エンドポイントへのルートに対して`VirtualService`を構成できます:

* クラスタ内リクエスト(たとえばポッド間の通信)のミラーリングを有効にするには、`.spec.gateways`に`mesh`を追加します。
* 外部リクエスト(たとえばLoadBalancerまたはNodePortサービス経由)のミラーリングを有効にするには、Istioの`Gateway`コンポーネントを構成し、そのコンポーネントの名前を`VirtualService`の`.spec.gateways`に追加します。このオプションは、以下の例で示しています。

```yaml
---
### ミラーされたトラフィックの送信先の構成
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # ミラー先アドレス
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # ミラー先ポート
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
    ### Istioの`Gateway`コンポーネントの名前。外部ソースからのトラフィックを処理するために必要です。
    ###
    - httpbin-gateway
    ### 特殊なラベルで、Kubernetesポッド間のリクエスト(ゲートウェイを経由しないクラスタ内通信)に対応するために有効化されます。
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
        host: some.external.service.tld # ミラー先アドレス
        port:
          number: 8445 # ミラー先ポート
---
### 外部リクエストを処理するための設定
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

[Istioのドキュメントを確認](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

### Traefik

以下の設定例は、[`dynamic configuration file`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/)アプローチに基づいています。Traefikはその他の設定モードもサポートしており、類似の構造を持つため、提供された例を任意のモードに容易に調整できます。

```yaml
### Dynamic configuration file
### Note: entrypointsはstatic configuration fileに記述されています
http:
  services:
    ### これが元の`service`とWallarmの`service`をマッピングする方法です。
    ### 今後の`routers`の設定(下記参照)では、このサービス名(`with_mirroring`)を使用してください。
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### トラフィックをミラーするための`service` ― すなわち、元の`service`からコピーされたリクエストを受信するエンドポイントです。
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### 元の`service` ― このサービスが元のトラフィックを受信します。
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### トラフィックミラーリングが機能するためには、ルーター名が`service`名(ここではwith_mirroring)と同一である必要があります。
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### 元のトラフィック用のルーター
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[Traefikのドキュメントを確認](https://doc.traefik.io/traefik/routing/services/#mirroring-service)