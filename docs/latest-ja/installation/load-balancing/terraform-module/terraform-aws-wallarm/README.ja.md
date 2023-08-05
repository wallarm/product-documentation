# Wallarm AWS Terraform モジュール

[Wallarm](https://www.wallarm.com/)は、クラウドネイティブAPIを安全に構築し、現代の脅威を監視し、脅威が発生したときにアラートを受け取るために、Dev、Sec、Opsチームが選択するプラットフォームです。既存のアプリを保護するか新たなクラウドネイティブAPIを保護するかにかかわらず、Wallarmは新たに出現する脅威からビジネスを保護するための主要な要素を提供します。

このリポジトリには、Terraformを使用して[AWS](https://aws.amazon.com/)上にWallarmをデプロイするモジュールが含まれています。

![Wallarmプロキシスキーム](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

WallarmのTerraformモジュールを実装することで、私たちはproxyとmirrorの2つの主要なWallarmデプロイメントオプションを可能にするソリューションを提供しています。デプロイメントオプションは、`preset` Wallarmモジュール変数によって簡単に制御できます。[提供される例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples)をデプロイするか、モジュール自体を設定することで、どちらのオプションも試すことができます。

## 要件

* Terraform 1.0.5以上が[ローカルにインストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)されていること
* Wallarmコンソールで**管理者**ロールを持つアカウントへのアクセスがあり、[EUクラウド](https://my.wallarm.com/)または[USクラウド](https://us1.my.wallarm.com/)に存在すること
* EU Wallarmクラウドを使用している場合は`https://api.wallarm.com`、US Wallarmクラウドを使用している場合は`https://us1.api.wallarm.com`へのアクセスがあること。アクセスがファイアウォールによってブロックされていないことを確認してください

## このモジュールをどのように使用しますか？

このリポジトリには以下のフォルダ構造があります：

* [`modules`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/modules): このフォルダには、Wallarmモジュールをデプロイするために必要なサブモジュールが含まれています。
* [`examples`](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples): このフォルダには、Wallarmをデプロイするために`modules`フォルダのモジュールを使用するさまざまな方法の例が示されています。

このリポジトリを使ってWallarmを本番環境にデプロイするには：

1. [EUクラウド](https://my.wallarm.com/signup)または[USクラウド](https://us1.my.wallarm.com/signup)でWallarmコンソールにサインアップします。
1. Wallarmコンソールを開き、**ノード**で**Wallarmノード**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 以下のように`wallarm`モジュールのコードをTerraform設定に追加します：

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."

      host       = "api.wallarm.com" # or "us1.api.wallarm.com"
      token      = "..."

      instance_type = "..."

      ...
    }
    ```
1. `token`変数にコピーしたノードトークンを指定し、他の必要な変数を設定します。

## このモジュールはどのようにメンテナンスされていますか？

Wallarm AWSモジュールは[Wallarmチーム](https://www.wallarm.com/)によってメンテナンスされています。

Wallarm AWSモジュールに関連する質問や機能のリクエストがある場合は、遠慮なく[support@wallarm.com](mailto:support@wallarm.com?Subject=Terraform%20Module%20Question)までメールをお送りください。

## ライセンス

このコードは[MITライセンス](https://github.com/wallarm/terraform-aws-wallarm/tree/main/LICENSE)の下でリリースされています。

著作権 © 2022 Wallarm, Inc.