# Wallarm AWS Terraformモジュール

[Wallarm](https://www.wallarm.com/)は、クラウドネイティブAPIを安全に構築するため、また、最新の脅威を監視し、脅威が生じた場合にアラートを出すためにDev、Sec、およびOpsチームが選ぶプラットフォームです。既存のレガシーアプリケーションの一部を保護するか、新規のクラウドネイティブAPIを保護するかを問わず、Wallarmは新進の脅威からビジネスを保護するための重要な要素を提供します。

このリポジトリには、Terraformを使用して[AWS](https://aws.amazon.com/)上にWallarmをデプロイするためのモジュールが含まれています。

![Wallarmプロキシスキーム](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Wallarm Terraformモジュールを実装することで、私たちはプロキシとミラーセキュリティソリューションという、二つの中核となるWallarmのデプロイオプションを可能にするソリューションを提供しました。デプロイオプションは、`preset` Wallarmモジュール変数によって簡単に制御できます。[提供される例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples)をデプロイするか、モジュール自体を設定することで、両方のオプションを試すことができます。

## 要求

* Terraform 1.0.5以上を[ローカルにインストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* [EUクラウド](https://my.wallarm.com/)または[USクラウド](https://us1.my.wallarm.com/)のWallarmコンソールに**管理者**ロールでアカウントへのアクセス権
* EUのWallarmクラウドで作業している場合は「https://api.wallarm.com」へ、USのWallarmクラウドで作業している場合は「https://us1.api.wallarm.com」へのアクセス権が必要になります。ファイアウォールによってアクセスがブロックされていないことを確認してください。

## このモジュールはどう使いますか？

このリポジトリは、以下のフォルダ構成を持っています：

* [`modules`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): このフォルダは、Wallarmモジュールのデプロイに必要なサブモジュールを含んでいます。
* [`examples`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): このフォルダは、Wallarmをデプロイするために、`modules`フォルダのモジュールをどのように使うかのさまざまな例を示しています。

このリポジトリを使用して、本番でWallarmをデプロイする方法：

1. [EU Cloud](https://my.wallarm.com/signup)または[US Cloud](https://us1.my.wallarm.com/signup)でWallarm Consoleにサインアップします。
1. Wallarm Consoleを開き、**Nodes**に移動し、**Wallarm node**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. Terraform設定に`wallarm`モジュールコードを追加します：

   ```conf
   module "wallarm" {
     source = "wallarm/wallarm/aws"

     vpc_id     = "..."

     preset     = "proxy"
     proxy_pass = "https://..."

     host       = "api.wallarm.com" # または "us1.api.wallarm.com"
     token      = "..."

     instance_type = "..."

     ...
   }
   ```
1. `token`変数にコピーしたノードトークンを指定し、他の必要な変数を設定します。

## このモジュールのメンテナンスはどのように行われていますか？

Wallarm AWSモジュールは[Wallarmチーム](https://www.wallarm.com/)によってメンテナンスされています。

もしあなたがWallarm AWSモジュールに関する質問や機能要求がある場合は、[support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question)へメールをお送りください。

## ライセンス

このコードは、[MITライセンス](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE)の下でリリースされています。

著作権 &copy; 2022 Wallarm, Inc.
