# WallarmをAmazon API Gatewayのプロキシとしてデプロイする

この例では、[Terraform モジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用して、WallarmをAWS Virtual Private Cloud （VPC）のインラインプロキシとしてデプロイし、[Amazon API Gateway](https://aws.amazon.com/api-gateway/)を保護する方法を示しています。

Wallarmのプロキシソリューションは、WAFとAPIセキュリティ機能を備えた高度なHTTPトラフィックルーターとして機能する追加のネットワーク層を提供します。 Amazon API Gatewayを含むほぼすべてのサービスタイプへのリクエストをルーティングでき、その機能は制限されません。

## 主な特性

* Wallarmは、Wallarmの機能を制限せず、即時の脅威の軽減を可能にする同期モードでトラフィックを処理します（`preset=proxy`）。
* Wallarmソリューションは、API Gatewayとは独立して制御できる別のネットワーク層としてデプロイされます。

## ソリューションアーキテクチャ

![Wallarmプロキシスキーム](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

例示のWallarmプロキシソリューションは、以下のコンポーネントを含みます：

* Wallarmノードインスタンスへのトラフィックをルーティングするインターネット対応のアプリケーションロードバランサー。
* トラフィックを分析し、APIゲートウェイへのリクエストをすべてプロキシするWallarmノードインスタンス。

    この例では、Wallarmノードが説明された動作を処理するモニタリングモードで実行されます。 Wallarmノードは、悪意のあるリクエストをブロックし、合法的なリクエストのみをさらに転送することを目指した他のモードでも動作できます。 Wallarmノードモードの詳細については、[ドキュメンテーション](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)を参照してください。
* WallarmノードがリクエストをプロキシするAPIゲートウェイ。 APIゲートウェイには次の設定があります：

    * `/demo/demo`パスが割り当てられています。
    * 単一のモックが設定されています。
    * このTerraformモジュールのデプロイ中に、APIゲートウェイの「regional」または「private」[エンドポイントタイプ](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)を選択することができます。 このタイプとそれらの間の移行の詳細については、以下で提供されています。

    提供された例が通常のAmazon API Gatewayをデプロイするため、その動作はWallarmノードによって影響を受けることがありません。

すべてのリストされたコンポーネントは、提供された`wallarm`例モジュールによって展開されます。

## コードコンポーネント

この例には次のコードコンポーネントがあります：

* `main.tf`: プロキシソリューションとしてデプロイされる`wallarm`モジュールのメインの設定。 設定は、AWS ALBとWallarmインスタンスを生成します。
* `apigw.tf`: `/demo/demo`パスでアクセス可能なAmazon APIゲートウェイを生成する設定。単一のモック統合が設定されています。 モジュールのデプロイ中に、「regional」または「private」エンドポイントタイプを選択することもできます（詳細は以下を参照）。
* `endpoint.tf`: AWS VPC Endpointの設定。 API Gatewayエンドポイントの「private」タイプのためのものです。

## "regional"と"private"のAPI Gatewayエンドポイントの違い

`apigw_private`変数は、API Gatewayエンドポイントのタイプを設定します：

* "regional"オプションでは、Wallarmノードインスタンスは、公に利用可能なAPI Gateway [`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html) サービスへのリクエストを送信します。
* "private"オプションでは、`execute-api`サービスに接続されたAWS VPCエンドポイントにリクエストを送信します。 **プロダクションのデプロイの場合、"private"オプションが推奨されます。**

### API Gatewayへのアクセスを制限するためのその他のオプション

Amazonでは、以下のように"private"または"regional"エンドポイントタイプに関係なく、API Gatewayへのアクセスを制限することも可能です：

* [リソースポリシー](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)を使用して、任意の2つのエンドポイントタイプを指定します。
* エンドポイントタイプが"private"である場合、[ソースIP](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)によるアクセスを管理します。
* エンドポイントタイプが"private"で、これはAPI Gatewayが設計上公開ネットワークから利用できないことが想定されている場合、[VPCおよび/またはエンドポイント](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)によるアクセスを管理します。

### API Gatewayエンドポイントタイプ間の移行

コンポーネントを再作成せずにAPI Gatewayエンドポイントタイプを変更することができますが、以下を考慮してください：

* タイプが"regional"から"private"に変更されると、公開エンドポイントはプライベートになり、したがって公開リソースからは利用できなくなります。 これは、`execute-api`エンドポイントとドメイン名の両方に適用されます。
* タイプが"private"から"regional"に変更されると、あなたのAPI Gatewayにターゲットを絞ったAWS VPCエンドポイントがすぐに切り離され、API Gatewayは利用できなくなります。
* コミュニティバージョンのNGINXはDNS名の変更を自動的に検出できないため、変更されたエンドポイントタイプはWallarmノードインスタンスでの手動のNGINX再起動に続いて行われるべきです。

    インスタンスを再起動するか、再作成するか、または各インスタンスで`nginx -s reload`を実行することができます。

エンドポイントタイプを"regional"から"private"に変更する場合：

1. AWS VPCエンドポイントを作成し、`execute-api`に接続します。 `endpoint.tf`設定ファイルに例があります。
1. API Gatewayエンドポイントタイプを切り替えて、API Gateway設定でAWS VPCエンドポイントを指定します。 完了すると、トラフィックの流れは停止します。
1. 各Wallarmノードインスタンスで`nginx -s reload`を実行するか、単に各Wallarmノードを再作成します。 完了すると、トラフィックの流れが回復します。

エンドポイントタイプを"private"から"regional"に変更することは推奨されていませんが、それを行う場合：

1. 自身で運用している「プライベート」モードで必要なエンドポイントを削除し、次にAPI Gatewayエンドポイントを「リージョン」に切り替えます。
1. 各Wallarmノードインスタンスで`nginx -s reload`を実行するか、単に各Wallarmノードを再作成します。 完了すると、トラフィックの流れが回復します。

**プロダクションでは、API Gatewayを"private"に変更することを推奨します**。 そうしないと、WallarmノードからAPI Gatewayへのトラフィックが公開ネットワーク経由で送信され、追加の料金が発生する可能性があります。

## 必要条件

* ローカルにインストールされたTerraform 1.0.5以上（[ここからダウンロード](https://learn.hashicorp.com/tutorials/terraform/install-cli)）
* Wallarm Consoleの**管理者**ロールのアカウントへのアクセス（[EUクラウド](https://my.wallarm.com/)または[USクラウド](https://us1.my.wallarm.com/)）
* EU Wallarmクラウドで作業する場合は`https://api.wallarm.com`へのアクセス、US Wallarmクラウドで作業する場合は`https://us1.api.wallarm.com`へのアクセスが可能であること。 ファイアウォールによってアクセスがブロックされていないことを確認してください。

## API Gateway向けのWallarm AWSプロキシソリューションの実行例

1. [EUクラウド](https://my.wallarm.com/nodes)または[USクラウド](https://us1.my.wallarm.com/nodes)のWallarm Consoleにサインアップします。
1. Wallarm Console → **ノード**で**Wallarmノード**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 以下のコードを含むリポジトリをマシンに複製します：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. 複製したリポジトリの`examples/apigateway/variables.tf`ファイルのデフォルトオプション内で変数の値を設定し、変更を保存します。
1. 右記のコマンドを実行して、`examples/apigateway`ディレクトリからスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

展開された環境を削除するには、次のコマンドを使用します：

```
terraform destroy
```

## 参照

* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway Private APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gateway Policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gateway Policies examples](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gateway Types](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)