# Amazon API Gatewayに対するProxyとしてのWallarmのデプロイ

この例では、[Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用してAWS Virtual Private Cloud（VPC）にインラインプロキシとしてデプロイされたWallarmで[Amazon API Gateway](https://aws.amazon.com/api-gateway/)を保護する方法を示しています。

Wallarmのプロキシソリューションは、WAFとAPIセキュリティ機能を持つ高度なHTTPトラフィックルーターとして機能する追加のネットワークレイヤーを提供します。これは、Amazon API Gatewayを含むほぼすべてのサービスタイプへのリクエストをルーティングでき、その能力を制限しません。

## 主な特徴

* Wallarmは、Wallarmの能力を制限せず、即時の脅威緩和を可能にする同期モードでトラフィックを処理します（`preset=proxy`）。
* Wallarmのソリューションは、API Gatewayから独立してコントロールできる別のネットワークレイヤーとしてデプロイされます。

## ソリューションのアーキテクチャ

![Wallarmのプロキシスキーム](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

Wallarmのプロキシソリューションの例には次のコンポーネントが含まれています：

* WallarmノードインスタンスにトラフィックをルーティングするInternet-facing Application Load Balancer。
* トラフィックを分析し、API Gatewayへの任意のリクエストをプロキシするWallarmノードインスタンス。

    この例では、説明された動作を指定するモニタリングモードでWallarmノードを実行します。Wallarmノードは、悪意のあるリクエストをブロックし、正当なものだけをさらに転送することを目指す他のモードでも動作できます。Wallarmノードのモードについて詳しくは、[こちらのドキュメンテーション](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)をご覧ください。
* WallarmノードがリクエストをプロキシするAPI Gateway。API Gatewayには次の設定があります：

    * `/demo/demo`パスが割り当てられています。
    * シングルモックが設定されています。
    * このTerraformモジュールのデプロイ中に、"regional"または"private"の[API Gatewayのエンドポイントタイプ](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)を選択できます。これらのタイプとそれら間の移行についての詳細は以下に提供されています。

    提供された例は通常のAmazon API Gatewayをデプロイするため、その操作はWallarmノードによって影響を受けません。

すべてのリストされたコンポーネント、API Gatewayを含むものは、提供された`wallarm`の例モジュールによってデプロイされます。

## コードのコンポーネント

この例には以下のコードコンポーネントがあります：

* `main.tf`：プロキシソリューションとしてデプロイされる`wallarm`モジュールの主要な設定。この設定はAWS ALBとWallarmインスタンスを生成します。
* `apigw.tf`：`/demo/demo`パスでアクセス可能なAmazon API Gatewayを生成する設定。シングルモック統合が設定されています。モジュールのデプロイ時に、"regional"または"private"のエンドポイントタイプを選択することもできます（詳細は以下を参照）。
* `endpoint.tf`：API Gatewayエンドポイントの"private"タイプに対するAWS VPC Endpoint設定。

## "regional"と"private"のAPI Gatewayエンドポイント間の違い

`apigw_private`変数はAPI Gatewayエンドポイントのタイプを設定します：

* "regional"オプションでは、Wallarmノードインスタンスは、公に利用可能なAPI Gatewayの[`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html)サービスにリクエストを送信します。
* "private"オプションでは、`execute-api`サービスに接続されたAWS VPCエンドポイントにリクエストを送信します。**本番環境の展開には"private"オプションが推奨されます。**

### API Gatewayへのアクセスを制限する他のオプション

Amazonでは、"private"または"regional"エンドポイントタイプに関係なく、API Gatewayへのアクセスを制限することも可能です：

* 2つのエンドポイントタイプのいずれかで[リソースポリシー](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)を使用します。
* エンドポイントタイプが"private"である場合、[ソースIP](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)によるアクセスを管理します。
* エンドポイントタイプが"private"である場合、[VPCおよび/またはエンドポイント](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)によるアクセスを管理します。これは、設計上、API Gatewayが公衆ネットワークから利用できないということになります。

### API Gatewayエンドポイントタイプ間の移行

コンポーネントを再作成せずにAPI Gatewayエンドポイントタイプを変更することができますが、次の点に注意してください：

* タイプが"regional"から"private"に変更されると、公開エンドポイントはプライベートになり、公共のリソースからは利用できなくなります。これは、`execute-api`エンドポイントとドメイン名の両方に適用されます。
* タイプが"private"から"regional"に変更されると、API Gatewayに対象となるAWS VPCエンドポイントは直ちに切り離され、API Gatewayは利用できなくなります。
* コミュニティ版のNGINXはDNS名の変更を自動的に検出できないため、エンドポイントタイプの変更後は、Wallarmノードインスタンスで手動でNGINXを再起動する必要があります。

    インスタンスを再起動するか、インスタンスを再作成するか、各インスタンスで`nginx -s reload`を実行できます。

エンドポイントタイプを"regional"から"private"に変更する場合：

1. AWS VPCエンドポイントを作成し、`execute-api`にアタッチします。例は`endpoint.tf`の設定ファイルにあります。
1. API Gatewayエンドポイントタイプを切り替え、API Gateway設定でAWS VPCエンドポイントを指定します。これが完了すると、トラフィックの流れは停止します。
1. 各Wallarmノードインスタンスで`nginx -s reload`を実行するか、各Wallarmノードを再作成します。これが完了すると、トラフィックの流れは回復します。

エンドポイントタイプを"private"から"regional"に変更することは推奨されていませんが、変更する場合は：

1. "private"モードでの運用に必要なエンドポイントを削除し、その後でAPI Gatewayエンドポイントを"regional"に切り替えます。
1. 各Wallarmノードインスタンスで`nginx -s reload`を実行するか、各Wallarmノードを再作成します。これが完了すると、トラフィックの流れは回復します。

**本番環境では、API Gatewayを"private"に変更することを推奨します。**それ以外の場合、WallarmノードからAPI Gatewayへのトラフィックは公衆ネットワークを介して送信され、追加の料金が発生する可能性があります。

## 要件

* ローカルにインストールされたTerraform 1.0.5以上 [インストール方法](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* Wallarmコンソールで**管理者**ロールのアカウントへのアクセス（[EUクラウド](https://my.wallarm.com/)または[USクラウド](https://us1.my.wallarm.com/)）
* EUのWallarmクラウドで作業している場合は`https://api.wallarm.com`へ、USのWallarmクラウドで作業している場合は`https://us1.api.wallarm.com`へのアクセス。通信がファイアウォールでブロックされていないことを確認してください

## Wallarm AWSプロキシソリューションのAPI Gatewayの例の実行

1. [EUクラウド](https://my.wallarm.com/nodes)または[USクラウド](https://us1.my.wallarm.com/nodes)のWallarmコンソールで登録します。
1. **ノード**を開き、**Wallarmノード**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 例のコードを含むリポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンされたリポジトリの`examples/apigateway/variables.tf`ファイルの`default`オプションで変数値を設定し変更を保存します。
1. `examples/apigateway`ディレクトリから次のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイされた環境を削除するには次のコマンドを使用します：

```
terraform destroy
```

## 参照資料

* [公開およびプライベートサブネット（NAT）を持つAWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API GatewayのPrivate API](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gatewayのポリシー](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gatewayのポリシーの例](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gatewayのタイプ](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)