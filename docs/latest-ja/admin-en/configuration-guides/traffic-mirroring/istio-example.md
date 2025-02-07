# トラフィックミラーリングにおけるIstio設定の例

この記事は、Istioがトラフィックをミラーリングして[Wallarmノードにルートする](overview.md)ために必要な設定例を提供します。

## ステップ1: Istioを使用したトラフィックのミラーリング設定

Istioがトラフィックをミラーリングするには、内部エンドポイント（Istio内部、例えばKubernetesにホスト）または`ServiceEntry`を使用した外部エンドポイントへのミラーリングルートを構成するために`VirtualService`を設定できます。

* クラスター内リクエスト（例：ポッド間）のミラーリングを有効にするには、`.spec.gateways`に`mesh`を追加してください。
* 外部リクエスト（例：LoadBalancerやNodePortサービス経由）のミラーリングを有効にするには、Istioの`Gateway`コンポーネントを構成し、VirtualServiceの`.spec.gateways`にそのコンポーネント名を追加してください。このオプションは下記の例で示されています。

```yaml
---
### ミラーリングされたトラフィックの宛先設定
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # ミラーリング先アドレス
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # ミラーリング先ポート
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
    ### Istioの`Gateway`コンポーネントの名前。外部ソースからのトラフィック処理に必要です
    ###
    - httpbin-gateway
    ### 特殊なラベルであり、Kubernetesポッドからのリクエスト（ゲートウェイを経由しないクラスター内通信）に対してこのVirtualServiceルートの動作を有効にします
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
        host: some.external.service.tld # ミラーリング先アドレス
        port:
          number: 8445 # ミラーリング先ポート
---
### 外部リクエストの処理用
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

[Istioドキュメントを確認してください](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

## ステップ2: ミラーリングされたトラフィックをフィルタリングするためのWallarmノードの設定

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"