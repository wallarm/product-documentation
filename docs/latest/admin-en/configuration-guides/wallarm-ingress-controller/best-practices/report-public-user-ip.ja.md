# エンドユーザーパブリックIPアドレスの適切な報告（NGINXベースのIngressコントローラ）

これらの手順は、ロードバランサーの背後にあるコントローラーで、クライアント（エンドユーザー）の送信元IPアドレスを識別するために必要なWallarm Ingressコントローラーの設定について説明しています。

デフォルトでは、Ingressコントローラーは、インターネットに直接公開されており、接続するクライアントのIPアドレスが実際のIPアドレスであると想定しています。ただし、リクエストは、ロードバランサー（例: AWS ELBまたはGoogle Network Load Balancer）を経由して、Ingressコントローラーに送信されることがあります。

コントローラーがロードバランサーの背後に配置されている場合、IngressコントローラーはロードバランサーのIPを実際のエンドユーザーIPとみなし、[一部のWallarm機能の誤動作](../../../using-proxy-or-balancer-en.ja.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address)につながる可能性があります。適切なエンドユーザーIPアドレスをIngressコントローラーに報告するには、以下のようにコントローラーを設定してください。

## ステップ1：ネットワークレイヤーで実際のクライアントIPの通過を有効にする

この機能は、使用されているクラウドプラットフォームに大きく依存しており、ほとんどの場合、`values.yaml`ファイルの属性`controller.service.externalTrafficPolicy`を値`Local`に設定することで有効にできます：

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## ステップ2：Ingressコントローラーで、X-FORWARDED-FOR HTTPリクエストヘッダーからの値の取得を有効にする

通常、ロードバランサーは、オリジナルのクライアントIPアドレスを含むHTTPヘッダー[`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For) を追加します。ロードバランサーのドキュメントで正確なヘッダー名を見つけることができます。

Wallarm Ingressコントローラーは、コントローラー`values.yaml`が以下のように設定されている場合、このヘッダーから実際のエンドユーザーIPアドレスを取得できます：

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [ `enable-real-ip`パラメータに関するドキュメント](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header)パラメータで、オリジナルクライアントIPアドレスを含むロードバランサーヘッダー名を指定してください

--8<-- "../include/ingress-controller-best-practices-intro.ja.md"