# NGINX Wallarm Ingress controllerインストール時の問題

このトラブルシューティングガイドでは、[Wallarm NGINXベースのIngress controller展開](../admin-en/installation-kubernetes-en.md)中に発生する可能性がある一般的な問題を一覧しています。ここに該当する詳細が見つからない場合は、[Wallarm technical support](mailto:support@wallarm.com)にお問い合わせください。

## Ingress controllerによって検出/使用されるクライアントのIPアドレスを確認する方法

* コントローラコンテナのログを確認し、処理されたリクエストに関する記録を探してください。デフォルトのログ形式では、最初に記録されるフィールドが検出されたクライアントのIPアドレスになります。以下の例では `25.229.38.234` が検出されたIPアドレスです:
```
[wallarm-ingress-nginx-ingress-controller-775cf75564-6jlt9 nginx-ingress-controller] 25.229.38.234 - - [14/Mar/2020:23:55:11 +0000] "GET /ping HTTP/1.1" 200 893 "-" "curl/7.64.1" 172 0.020 [default-sise-80] [] 172.17.0.5:8080 893 0.020 200 d8402076753798d3b065269c16d4b34f 
```

* [US cloud](https://us1.my.wallarm.com)または[EU cloud](https://my.wallarm.com)用のWallarm Consoleにアクセスし、**Attacks**セクションでリクエストの詳細を展開してください。**Source**フィールドにIPアドレスが表示されます。例えば:

    ![リクエストが送信されたIPアドレス](../images/request-ip-address.png)

    攻撃一覧が空の場合、Wallarm Ingress controllerで保護されているアプリケーションに[テスト攻撃](../admin-en/installation-check-operation-en.md#2-run-a-test-attack)を送信できます。

## Ingress controllerがX-FORWARDED-FORリクエストヘッダーを受信しているか確認する方法

US cloudまたはEU cloud用のWallarm Consoleにアクセスし、**Attacks**セクションでリクエストの詳細を展開してください。表示されたリクエストの詳細において、`X-FORWARDED-FOR`ヘッダーにご注意ください。例えば:

![リクエストのX-FORWARDED-FORヘッダー](../images/x-forwarded-for-header.png)

攻撃一覧が空の場合、Wallarm Ingress controllerで保護されているアプリケーションに[テスト攻撃](../admin-en/installation-check-operation-en.md#2-run-a-test-attack)を送信できます。