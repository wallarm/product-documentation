# NGINXベースのWallarm Ingressコントローラーのインストール

このトラブルシューティングガイドでは、[Wallarm NGINXベースのIngressコントローラのデプロイメント](../admin-en/installation-kubernetes-en.ja.md)中に遭遇する可能性のある一般的な問題を記載しています。ここで適切な詳細が見つからない場合は、[Wallarm技術サポート](mailto:support@wallarm.com)にお問い合わせください。

## Ingressコントローラーが検出/使用しているクライアントのIPアドレスを確認する方法は？

* コントローラーコンテナのログを確認し、処理されたリクエストに関するレコードを探します。デフォルトのログ形式では、最初に報告されるフィールドが検出されたクライアントのIPアドレスです。以下の例では、検出されたIPアドレスは `25.229.38.234` です：
```
[wallarm-ingress-nginx-ingress-controller-775cf75564-6jlt9 nginx-ingress-controller] 25.229.38.234 - - [14/Mar/2020:23:55:11 +0000] "GET /ping HTTP/1.1" 200 893 "-" "curl/7.64.1" 172 0.020 [default-sise-80] [] 172.17.0.5:8080 893 0.020 200 d8402076753798d3b065269c16d4b34f 
```

* [USクラウド](https://us1.my.wallarm.com)または[EUクラウド](https://my.wallarm.com)のWallarm Consoleにアクセスし、**イベント**セクションでリクエストの詳細を展開します。*Source*フィールドには、IPアドレスが表示されます。例えば：

    ![!リクエストが送信されたIPアドレス](../images/request-ip-address.png)

    攻撃のリストが空の場合は、Wallarm Ingressコントローラで保護されたアプリケーションに対して[テスト攻撃](../admin-en/installation-check-operation-en.ja.md#2-run-a-test-attack)を送信できます。

## IngressコントローラーがX-FORWARDED-FORリクエストヘッダーを受信しているかどうかを確認する方法は？

[USクラウド](https://us1.my.wallarm.com)または[EUクラウド](https://my.wallarm.com)のWallarm Consoleにアクセスし、**イベント**セクションでリクエストの詳細を展開してください。表示されるリクエストの詳細で、`X-FORWARDED-FOR`ヘッダーに注目します。例えば：

![!リクエストのX-FORWARDED-FORヘッダー](../images/x-forwarded-for-header.png)

攻撃のリストが空の場合は、Wallarm Ingressコントローラで保護されたアプリケーションに対して[テスト攻撃](../admin-en/installation-check-operation-en.ja.md#2-run-a-test-attack)を送信できます。