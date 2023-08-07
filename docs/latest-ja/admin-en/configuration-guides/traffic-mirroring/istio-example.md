# トラフィックミラーリング用の Istio 設定の例

この記事では、Istio が[トラフィックをミラーリングし、それを Wallarm ノードにルーティングする](overview.md)ために必要な設定の例を提供しています。

## ステップ 1：トラフィックミラーリングを可能にする Istio の設定

Istio がトラフィックをミラーリングするためには、内部エンドポイント（Istioの内部、つまり Kubernetes でホストされているなど）または `ServiceEntry` とともに外部エンドポイントにミラーリング・ルートを設定するための `VirtualService` を設定することができます：

* クラスタ内のリクエスト（例えばポッド間）のミラーリングを可能にするには、`mesh` を `.spec.gateways` に追加します。
* 外部リクエストのミラーリングを可能にするには（例えばLoadBalancerやNodePortサービスを通じて）、Istioの `Gateway` コンポーネントを設定し、そのコンポーネントの名前を `VirtualService` の `.spec.gateways` に追加します。このオプションは下の例で示されています。

```yaml
---
### ミラーリングされたトラフィックの送信先設定
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
    ### Istio `Gateway` コンポーネントの名前。外部からのトラフィックを取り扱うために必要です。
    ###
    - httpbin-gateway
    ### 特定のラベル、この仮想サービスのルートがKubernetesのポッドからのリクエスト（ゲートウェイを経由しないクラスタ内通信）を取り扱うことを可能にする
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
### 外部リクエストの取り扱い用
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

[Istio のドキュメンテーションを確認する](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

## ステップ 2：ミラーリングされたトラフィックをフィルタするための Wallarm ノードの設定

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"
