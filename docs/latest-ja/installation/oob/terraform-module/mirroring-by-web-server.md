# Terraformモジュールを使用したNGINX、Envoy等のミラーリング向けWallarm OOBのデプロイ

本記事では[Wallarm Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用して、WallarmをOut-of-BandソリューションとしてAWSにデプロイする例を示します。NGINX、Envoy、Istio及び/またはTraefikがトラフィックミラーリングを提供することを前提としています。

## ユースケース

【Wallarmのサポートされている展開オプション】(https://docs.wallarm.com/installation/supported-deployment-options)の中で、これらの**ユースケース**において、Terraformモジュールを使用したAWS VPC上でのWallarmデプロイが推奨されます：

* 既存のインフラストラクチャがAWS上に存在します。
* Infrastructure as Code(IaC)を活用している場合、WallarmのTerraform moduleはAWS上のWallarm nodeの自動管理およびプロビジョニングを可能にし、効率性と一貫性を向上させます。

## 要件

* Terraform 1.0.5以上を[ローカルにインストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)済みであること。
* USまたはEU[Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)のWallarm Consoleで**Administrator**[role](https://docs.wallarm.com/user-guides/settings/users/#user-roles)を持つアカウントにアクセス可能であること。
* US Wallarm Cloudを利用する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを利用する場合は`https://api.wallarm.com`にアクセス可能であること。ファイアウォールによりアクセスがブロックされていないことを確認してください。

## ソリューションアーキテクチャ

![ミラーリングトラフィック向けWallarm](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-for-mirrored-traffic.png?raw=true)

本例のWallarmソリューションは以下のコンポーネントで構成されています：

* インターネット向けロードバランサがWallarm nodeインスタンスにトラフィックをルーティングします。既にロードバランサがデプロイ済みであることを前提としており、`wallarm`モジュールはこのリソースを作成しません。
* ロードバランサからトラフィックを提供し、HTTPリクエストを内部ALBエンドポイントおよびバックエンドサービスにミラーリングする任意のWebまたはプロキシサーバ（例：NGINX、Envoy）。トラフィックミラーリングに使用されるコンポーネントは既にデプロイ済みであることを前提としており、`wallarm`モジュールはこのリソースを作成しません。
* 内部ALBがWebまたはプロキシサーバからのミラーリングされたHTTPSリクエストを受け付け、Wallarm nodeインスタンスへ転送します。
* Wallarm nodeが内部ALBからのリクエストを解析し、悪意のあるトラフィックデータをWallarm Cloudに送信します。

本例では、Wallarm nodeを監視モードで実行し、上記の動作を実現します。[mode](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)を別の値に切り替えた場合でも、[OOB](https://docs.wallarm.com/installation/oob/overview/#advantages-and-limitations)アプローチは攻撃ブロックを許可しないため、nodeは引き続きトラフィックの監視のみを行います。

最後の2つのコンポーネントは、提供される`wallarm`例モジュールによってデプロイされます。

## コードコンポーネント

本例には以下のコードコンポーネントが含まれています：

* `main.tf`: ミラーソリューションとしてデプロイされる`wallarm`モジュールのメインな構成ファイルです。この構成は内部AWS ALBおよびWallarm nodeを作成します。

## 例示的なWallarmミラーソリューションの実行方法

例示的なWallarmミラーソリューションを実行するためには、HTTPリクエストのミラーリングを設定し、その後ソリューションをデプロイする必要があります。

### 1.HTTPリクエストミラーリングの設定

トラフィックミラーリングは、多くのWebおよびプロキシサーバによって提供される機能です。[こちらのリンク](https://docs.wallarm.com/installation/oob/web-server-mirroring/overview/#examples-of-web-server-configuration-for-traffic-mirroring)に、トラフィックミラーリングの設定方法に関するドキュメントが記載されています。

### 2.例示的なWallarmミラーソリューションのデプロイ

1. Wallarm Consoleに[EU Cloud](https://my.wallarm.com/nodes)または[US Cloud](https://us1.my.wallarm.com/nodes)でサインアップします。
2. Wallarm Consoleの**Nodes**を開き、**Wallarm node**タイプのnodeを作成します。
3. 生成されたnodeトークンをコピーします。
4. 例示コードを含むリポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
5. クローンしたリポジトリの`examples/mirror/variables.tf`ファイル内の`default`オプションの変数値を設定し、変更を保存します。
6. `examples/mirror`ディレクトリから以下のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイされた環境を削除するには、以下のコマンドを使用します：

```
terraform destroy
```

## 参考文献

* [パブリックおよびプライベートサブネット(NAT)を持つAWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)