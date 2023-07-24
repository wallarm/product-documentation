# トラフィックミラーリング用のIstio設定例

この記事では、Istioで[トラフィックをミラーリングし、Wallarmノードにルートする](overview.md)ために必要な設定例を提供します。

## ステップ1: トラフィックをミラーリングするためにIstioを設定する

Istioでトラフィックをミラーリングするために、`VirtualService`を内部エンドポイント（Istio用の内部、たとえばKubernetes内にホストされている）または`ServiceEntry`を用いた外部エンドポイントにミラーリングルートを設定することができます:

* クラスタ内のリクエスト（例：ポッド間）のミラーリングを有効にするには、`.spec.gateways` に `mesh`を追加します。
* 外部リクエスト（例：LoadBalancerやNodePortサービス経由）のミラーリングを有効にするには、Istioの`Gateway`コンポーネントを設定し、そのコンポーネント名を `VirtualService` の `.spec.gateways` に追加します。このオプションは、以下の例で示されています。

```yaml
---
### ミラーリング先のトラフィックの設定
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # ミラーリング先のアドレス
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # ミラーリング先のポート
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
    ### istio `Gateway` コンポーネントの名前。外部ソースからのトラフィックを処理するために必要です
    ###
    - httpbin-gateway
    ### 特別なラベル。この仮想サービスルートがゲートウェイ以外でKubernetesポッドからのリクエストを
    ### 処理できるようにする
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
### 外部リクエストの処理機能
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

[Istioのドキュメントをご確認ください](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

## ステップ2: Wallarmノードをミラーリングされたトラフィックをフィルタリングするように設定する

--8<-- "../include-ja/wallarm-node-configuration-for-mirrored-traffic.md"