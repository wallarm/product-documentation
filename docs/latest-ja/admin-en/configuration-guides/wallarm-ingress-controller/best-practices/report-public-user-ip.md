# エンドユーザーのパブリックIPアドレスの適切な報告（NGINXベースのIngressコントローラー）

本手順では、ロードバランサーの背後にコントローラーが配置されている場合に、クライアント（エンドユーザー）の発信元IPアドレスを特定するために必要なWallarm Ingress controllerの構成について説明します。

既定では、Ingressコントローラーは自分がインターネットに直接公開されており、接続クライアントのIPアドレスが実際のIPであると想定します。しかし、リクエストはIngressコントローラーに送信される前にロードバランサー（例：AWS ELBやGoogle Network Load Balancer）を経由する場合があります。

ロードバランサーの背後にコントローラーが配置されている場合、IngressコントローラーはロードバランサーのIPを実際のエンドユーザーのIPと見なすため、[一部のWallarm機能の誤動作](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address)につながる可能性があります。適切なエンドユーザーIPアドレスをIngressコントローラーに報告できるよう、以下の手順でコントローラーを構成してください。

## 手順1：ネットワーク層で実クライアントIPの受け渡しを有効化する

この機能は使用しているクラウドプラットフォームに大きく依存します。多くの場合、`values.yaml`ファイルの属性`controller.service.externalTrafficPolicy`を`Local`に設定することで有効化できます。

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## 手順2：IngressコントローラーがX-FORWARDED-FOR HTTPリクエストヘッダーから値を取得できるようにする

通常、ロードバランサーは元のクライアントIPアドレスを含むHTTPヘッダー[`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)を付加します。正確なヘッダー名はロードバランサーのドキュメントで確認できます。

以下のようにコントローラーの`values.yaml`を設定すると、Wallarm Ingress controllerはこのヘッダーから実際のエンドユーザーIPアドレスを取得できます。

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [`enable-real-ip`パラメータのドキュメント](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header)パラメータには、元のクライアントIPアドレスを含むロードバランサーのヘッダー名を指定してください

--8<-- "../include/ingress-controller-best-practices-intro.md"