# Wallarm AWS Terraformモジュールのサンプルデプロイ：ゼロからのプロキシソリューション

この例では、Terraformモジュールを使用して、WallarmをAWS Virtual Private Cloud（VPC）にインラインプロキシとしてデプロイする方法を示しています。[通常](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)または[高度](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)なプロキシデプロイの例とは異なり、この例の設定では、[AWS VPC Terraformモジュール](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)を使用して、この例のデプロイ中に直接VPCリソースを作成します。そのため、この例は「ゼロからのプロキシソリューション」の例と呼ばれています。

以下が、**推奨**されるデプロイオプションです：

* サブネット、NAT、ルートテーブル、その他のVPCリソースが設定されていない場合。このデプロイの例では、Wallarm Terraformモジュールとともに[AWS VPC Terraformモジュール](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)を起動し、VPCリソースを作成し、Wallarmと統合します。
* WallarmモジュールがAWS VPCとどのように統合され、この統合に必要なVPCリソースとモジュール変数の方法を学びたい場合。

## 主要な特徴

* Wallarmは、Wallarmの機能を制限せず、即座に脅威の軽減を可能にする同期モードでトラフィックを処理します（`preset=proxy`）。
* Wallarmソリューションは、他のレイヤーから独立して制御でき、ほぼすべてのネットワーク構造位置にレイヤーを配置できるようにする独立したネットワークレイヤーとしてデプロイされます。推奨される位置は、インターネット対応のロードバランサーの後ろです。
* このソリューションは、DNSとSSLの機能を設定する必要はありません。
* VPCリソースを作成し、Wallarmインラインプロキシを作成したVPCに自動的に統合しますが、一方、通常のプロキシの例では、VPCリソースが存在し、その識別子の要求が必要です。
* この例を実行するために必要な唯一の変数は、Wallarmノードトークンを持つ`token`です。

## ソリューションアーキテクチャ

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

この例のソリューションは、[通常のプロキシソリューション](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)と同じアーキテクチャを持っています：

* サブネット、NAT、ルートテーブル、EIP等のAWS VPCリソースは、この例の開始中に[`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)モジュールによって自動的にデプロイされます。それらは提供されたスキームには表示されません。
* Wallarmノードインスタンスへトラフィックをルーティングするインターネット向けのアプリケーションロードバランサ。このコンポーネントは、提供された`wallarm`例モジュールによってデプロイされます。
* トラフィックを分析し、すべてのリクエストをさらにプロキシするWallarmノードインスタンス。スキーマ上の対応する要素はA、B、CのEC2インスタンスです。このコンポーネントは、提供された`wallarm`例モジュールによってデプロイされます。

    例では、Wallarmノードは説明された振る舞いを駆動するモニタリングモードで動作します。Wallarmノードは他のモードでも運用でき、その中には悪意のあるリクエストをブロックし、正当なものだけをさらに転送することを目的としたものも含まれます。Wallarmノードモードの詳細については、[当社のドキュメンテーション](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)をご覧ください。
* Wallarmノードがリクエストをプロキシするサービス。サービスは任意のタイプであることができます。例えば：

    * VPCエンドポイント経由でVPCに接続されたAWS API Gatewayアプリケーション（対応するWallarm Terraformデプロイメントは、[API Gatewayの例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)でカバーされています）
    * AWS S3
    * EKSクラスターで動作するEKSノード（このケースでは、Internal Load BalancerまたはNodePort Serviceの設定が推奨されます）
    * 他の任意のバックエンドサービス

    デフォルトでは、Wallarmノードはトラフィックを`https://httpbin.org`に転送します。この例の開始中に、AWS Virtual Private Cloud（VPC）から利用可能な任意の他のサービスドメインまたはパスをプロキシトラフィック先として指定することができます。

## コードのコンポーネント

この例には、以下のモジュール設定を持つ唯一の`main.tf`設定ファイルがあります：

* AWS VPSリソースを作成するための[`vpc`モジュール](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)の設定。
* AWS ALBとWallarmインスタンスを生成するプロキシソリューションとしてデプロイするためのWallarm設定を持つ`wallarm`モジュール。

## 必要条件

* Terraform 1.0.5またはそれより高いバージョンが[ローカルにインストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Wallarmコンソールで**管理者**ロールを持つアカウントへのアクセスがあること。[EU Cloud](https://my.wallarm.com/)または[US Cloud](https://us1.my.wallarm.com/)
* EUのWallarm Cloudを使用している場合は`https://api.wallarm.com`へのアクセスがあり、USのWallarm Cloudを使用している場合は`https://us1.api.wallarm.com`へのアクセスがあり、ファイアウォールによってアクセスがブロックされていないことを確認する。

## Wallarm AWSプロキシソリューションの例の実行

1. [EU Cloud](https://my.wallarm.com/nodes)または[US Cloud](https://us1.my.wallarm.com/nodes)でWallarmコンソールにサインアップします。
1. Wallarm Console → **Nodes**を開き、**Wallarm node**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 例のコードが含まれるリポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの`examples/from-scratch/variables.tf`ファイルで`default`オプションの変数値を設定し、変更を保存します。
1. `examples/from-scratch`ディレクトリから以下のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイされた環境を削除するには、次のコマンドを使用します：

```
terraform destroy
```

## 参考資料

* [Wallarm documentation](https://docs.wallarm.com)
* [Terraform module which creates VPC resources on AWS](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)
* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)