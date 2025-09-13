# Wallarm Ingress Controllerのトラブルシューティング

このトラブルシューティングガイドでは、[WallarmのNGINXベースのIngress controllerのデプロイ](../admin-en/installation-kubernetes-en.md)中に直面する可能性がある一般的な問題をまとめます。ここに該当する内容が見つからない場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)までお問い合わせください。

## Ingress controllerが検出・使用するクライアントのIPアドレスを確認するには

* Ingress controllerのコンテナのログを確認し、処理されたリクエストに関する記録を探します。デフォルトのログ形式では、最初に出力されるフィールドが検出されたクライアントのIPアドレスです。以下の例では、検出されたIPアドレスは`25.229.38.234`です。
```
[wallarm-ingress-nginx-ingress-controller-775cf75564-6jlt9 nginx-ingress-controller] 25.229.38.234 - - [14/Mar/2020:23:55:11 +0000] "GET /ping HTTP/1.1" 200 893 "-" "curl/7.64.1" 172 0.020 [default-sise-80] [] 172.17.0.5:8080 893 0.020 200 d8402076753798d3b065269c16d4b34f 
```

* Wallarm Consoleの[USクラウド](https://us1.my.wallarm.com)または[EUクラウド](https://my.wallarm.com)に移動し、→ **Attacks**セクションでリクエストの詳細を展開します。IPアドレスは**Source**フィールドに表示されます。例えば:
  
    ![リクエストが送信されたIPアドレス](../images/request-ip-address.png)

    Attacksのリストが空の場合は、Wallarm Ingress controllerで保護されているアプリケーションに[テスト攻撃](../admin-en/uat-checklist-en.md#node-registers-attacks)を送信できます。
    
## Ingress controllerがX-FORWARDED-FORリクエストヘッダーを受信していることを確認するには

Wallarm Consoleの[USクラウド](https://us1.my.wallarm.com)または[EUクラウド](https://my.wallarm.com)に移動し、→ **Attacks**セクションでリクエストの詳細を展開します。表示されたリクエスト詳細の`X-FORWARDED-FOR`ヘッダーを確認します。例えば:

![リクエストのX-FORWARDED-FORヘッダー](../images/x-forwarded-for-header.png)

Attacksのリストが空の場合は、Wallarm Ingress controllerで保護されているアプリケーションに[テスト攻撃](../admin-en/uat-checklist-en.md#node-registers-attacks)を送信できます。