# エンドユーザーの公開IPアドレスの正確なレポーティング（NGINXベースのIngressコントローラー）

これらの指示は、ロードバランサーの背後にコントローラーが配置されている場合に、クライアント（エンドユーザー）の発信IPアドレスを特定するために必要なWallarm Ingressコントローラーの設定について説明しています。

デフォルトでは、Ingressコントローラーは直接インターネットに公開されており、接続するクライアントのIPアドレスが実際のIPであると仮定しています。しかし、リクエストはロードバランサー（例えば、AWS ELBやGoogle Network Load Balancer）を経由してIngressコントローラーに送られることがあります。

コントローラーがロードバランサーの背後に配置されている場合、IngressコントローラーはロードバランサーのIPを実際のエンドユーザーのIPと見なすことがあり、これにより[一部のWallarm機能が誤って動作する](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address)可能性があります。エンドユーザーのIPアドレスをIngressコントローラーに正確に報告するためには、以下のようにコントローラーを設定してください。

## ステップ1: ネットワーク層で実際のクライアントIPを通過させる機能を有効にする

この機能は使用しているクラウドプラットフォームに大きく依存しています。ほとんどの場合、`values.yaml`ファイルの属性`controller.service.externalTrafficPolicy`を`Local`という値に設定することで有効化することができます：

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## ステップ2: IngressコントローラーがX-FORWARDED-FOR HTTPリクエストヘッダーから値を取得するように設定する

通常、ロードバランサーはオリジナルのクライアントIPアドレスを含むHTTPヘッダー[`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)を追加します。ロードバランサーのドキュメンテーションで正確なヘッダー名を探すことができます。

`values.yaml`のコントローラー設定が以下のようになっている場合、Wallarm Ingressコントローラーはこのヘッダーから実際のエンドユーザーのIPアドレスを得ることができます：

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [`enable-real-ip`パラメータに関するドキュメンテーション](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header)パラメータでは、元のクライアントIPアドレスを含むロードバランサーのヘッダー名を指定してください。

--8<-- "../include/ingress-controller-best-practices-intro.md"