# エンドユーザーのパブリックIPアドレスの適切な報告 (NGINXベースのIngressコントローラ)

本手順書では、ロードバランサーの背後にコントローラが配置されている場合に、クライアント（エンドユーザー）の起点IPアドレスを特定するために必要なWallarm Ingressコントローラの設定方法について説明します。

デフォルトでは、Ingressコントローラはインターネットに直接公開されており、接続してくるクライアントのIPアドレスが実際のIPであると仮定します。しかし、リクエストはIngressコントローラに送信される前に、ロードバランサー（例：AWS ELBやGoogle Network Load Balancer）を通過する場合があります。

ロードバランサーの背後にコントローラが配置される場合、IngressコントローラはロードバランサーのIPを実際のエンドユーザーIPとみなしてしまい、一部のWallarm機能が[正しく動作しない可能性](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address)があります。エンドユーザーの正しいIPアドレスをIngressコントローラへ報告するため、以下の設定を実施してください。

## ステップ1: ネットワーク層で実際のクライアントIPの受け渡しを有効化

本機能は使用しているクラウドプラットフォームに大きく依存しますが、ほとんどの場合、`values.yaml`ファイルの属性`controller.service.externalTrafficPolicy`に値`Local`を設定することで有効化できます。

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## ステップ2: X-FORWARDED-FOR HTTPリクエストヘッダーから値を取得するようIngressコントローラを有効化

通常、ロードバランサーは元のクライアントIPアドレスを含むHTTPヘッダー[`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)を追加します。正確なヘッダー名はロードバランサーのドキュメントで確認してください。

Wallarm Ingressコントローラは、以下のように`values.yaml`を設定することで、このヘッダーから実際のエンドユーザーIPアドレスを取得できます。

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [`enable-real-ip`パラメータに関するドキュメント](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* [`forwarded-for-header`パラメータ]内には、元のクライアントIPアドレスを含むロードバランサーのヘッダー名を指定してください

--8<-- "../include/ingress-controller-best-practices-intro.md"