# Wallarm Ingressコントローラー（NGINXベース）のインストール

このトラブルシューティングガイドでは、[Wallarm NGINXベースのIngressコントローラのデプロイメント](../admin-en/installation-kubernetes-en.md)中に遭遇する可能性のある一般的な問題を一覧表示しています。ここで関連する詳細を見つけられなかった場合、[Wallarmの技術サポート](mailto:support@wallarm.com)にお問い合わせください。

## IngressコントローラがどのクライアントのIPアドレスを検出/使用しているかを確認する方法は？

* コントローラコンテナのログを見て、処理されたリクエストに関するレコードを探します。デフォルトのログ形式では、最初に報告されるフィールドが検出されたクライアントのIPアドレスです。以下の例では、`25.229.38.234`が検出されたIPアドレスです：
```
[wallarm-ingress-nginx-ingress-controller-775cf75564-6jlt9 nginx-ingress-controller] 25.229.38.234 - - [14/Mar/2020:23:55:11 +0000] "GET /ping HTTP/1.1" 200 893 "-" "curl/7.64.1" 172 0.020 [default-sise-80] [] 172.17.0.5:8080 893 0.020 200 d8402076753798d3b065269c16d4b34f 
```

* [USクラウド](https://us1.my.wallarm.com)用または[EUクラウド](https://my.wallarm.com)用のWallarmのコンソールに移動し、**イベント**セクションでリクエストの詳細を展開します。「ソース」フィールドにはIPアドレスが表示されます。例えば：

    ![!リクエストが送信されたIPアドレス](../images/request-ip-address.png)

    もし攻撃のリストが空の場合は、Wallarm Ingressコントローラによって保護されているアプリケーションに[テスト攻撃](../admin-en/installation-check-operation-en.md#2-run-a-test-attack)を送信することができます。
    
## Ingressコントローラが「X-FORWARDED-FOR」リクエストヘッダを受信しているかどうかを確認する方法は？

[USクラウド](https://us1.my.wallarm.com)または[EUクラウド](https://my.wallarm.com)用のWallarmのコンソールに移動し、**イベント**セクションでリクエストの詳細を展開します。表示されたリクエストの詳細で、`X-FORWARDED-FOR`ヘッダを確認してください。例えば:

![! リクエストのX-FORWARDED-FORヘッダ](../images/x-forwarded-for-header.png)

もし攻撃のリストが空の場合は、Wallarm Ingressコントローラによって保護されているアプリケーションに[テスト攻撃](../admin-en/installation-check-operation-en.md#2-run-a-test-attack)を送信することができます。