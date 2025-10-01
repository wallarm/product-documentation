# Amazon API Gateway向けプロキシとしてのWallarmのデプロイ

この例では、[Amazon API Gateway](https://aws.amazon.com/api-gateway/)を保護する方法を示します。具体的には、[Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用し、AWS Virtual Private Cloud(VPC)にインラインプロキシとしてデプロイしたWallarmを用います。

Wallarmプロキシソリューションは、WAAPおよびAPIセキュリティ機能を備えた高度なHTTPトラフィックルーターとして機能する追加のネットワーク層を提供します。Amazon API Gatewayを含むほぼあらゆる種類のサービスへ、機能を制限することなくリクエストをルーティングできます。

!!! info "セキュリティに関する注意"
    本ソリューションはAWSのセキュリティベストプラクティスに従うよう設計されています。デプロイにはAWSのrootアカウントを使用しないことを推奨します。代わりに、必要最小限の権限のみを持つIAMユーザーまたはロールを使用してください。
    
    デプロイ手順は最小権限の原則を前提としており、Wallarmコンポーネントのプロビジョニングおよび運用に必要な最小限のアクセスのみを付与します。

## ユースケース

サポートされている[Wallarmのデプロイオプション](https://docs.wallarm.com/installation/supported-deployment-options)の中でも、以下のようなユースケースでは、AWS VPCへのWallarmのデプロイにTerraformモジュールを推奨します:

* 既存のインフラストラクチャがAWS上にあります。
* Infrastructure as Code(IaC)の実践を活用しています。WallarmのTerraformモジュールにより、AWS上のWallarm nodeの管理とプロビジョニングを自動化でき、効率と一貫性が向上します。

## 要件

* Terraform 1.0.5以上が[ローカルにインストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)されていること
* USまたはEUの[Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)にあるWallarm Consoleで**Administrator**[ロール](https://docs.wallarm.com/user-guides/settings/users/#user-roles)を持つアカウントへのアクセス
* US Wallarm Cloudを使用する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを使用する場合は`https://api.wallarm.com`へアクセスできること。ファイアウォールでブロックされていないことを確認してください
* 任意のAWSリージョンを選択できます。Wallarm nodeのデプロイに地域の特別な制約はありません
* Terraform、AWS EC2、Security Groupsおよびその他のAWSサービスに関する理解
* リソースのデプロイにAWSのrootアカウントを使用してはいけません

    本ガイドで説明するデプロイを実行するには、必要最小限の権限だけを付与した専用のIAMユーザーまたはロールを使用してください。
* 広範な権限(例: `AdministratorAccess`)の使用は避け、このモジュールの動作に必要なアクションのみを付与してください

    このデプロイで使用するIAMロールと権限は最小権限の原則に基づいて設計されています。必要なAWSリソース(例: EC2、ネットワーキング、ログ記録)の作成・管理に必要な権限のみを付与してください。

## ソリューションアーキテクチャ

![Wallarmプロキシの構成図](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

この例のWallarmプロキシソリューションには、次のコンポーネントがあります:

* インターネット向けApplication Load BalancerがトラフィックをWallarm nodeインスタンスへルーティングします。
* Wallarm nodeインスタンスがトラフィックを分析し、すべてのリクエストをAPI Gatewayにプロキシします。

    この例では、説明した動作を実現するためにWallarm nodeをモニタリングモードで実行します。Wallarm nodeは、悪意のあるリクエストをブロックして正当なリクエストのみを転送するなど、他のモードでも動作できます。Wallarm nodeのモードの詳細は[ドキュメント](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)をご覧ください。
* Wallarm nodeがリクエストをプロキシするAPI Gateway。API Gatewayには次の設定があります:

    * `/demo/demo`パスが割り当てられています。
    * 単一のモックが構成されています。
    * このTerraformモジュールのデプロイ中に、"regional"または"private"の[API Gatewayのエンドポイントタイプ](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)を選択できます。これらのタイプの詳細や相互の移行については後述します。

    なお、この例は通常のAmazon API Gatewayをデプロイするため、Wallarm nodeの影響を受けずに動作します。

API Gatewayを含む上記のすべてのコンポーネントは、提供されている`wallarm`サンプルモジュールによってデプロイされます。

## コードコンポーネント

この例には、次のコードコンポーネントがあります:

* `main.tf`: プロキシソリューションとしてデプロイする`wallarm`モジュールのメイン構成です。この構成により、AWS ALBとWallarmインスタンスが作成されます。
* `apigw.tf`: `/demo/demo`パスでアクセス可能なAmazon API Gatewayを作成する構成です。単一のモック統合が設定されます。モジュールのデプロイ時に、"regional"または"private"のエンドポイントタイプも選択できます(詳細は後述)。
* `endpoint.tf`: API Gatewayエンドポイントの"private"タイプ用のAWS VPC Endpointの構成です。

## "regional"と"private"のAPI Gatewayエンドポイントの違い

`apigw_private`変数はAPI Gatewayのエンドポイントタイプを設定します:

* "regional"オプションでは、Wallarm nodeインスタンスはパブリックに利用可能なAPI Gatewayの[`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html)サービスにリクエストを送信します。
* "private"オプションでは、`execute-api`サービスに接続されたAWS VPC Endpointへ送信します。**本番環境のデプロイには"private"オプションを推奨します。**

### API Gatewayへのアクセス制限の追加オプション

エンドポイントタイプが"private"でも"regional"でも、次の方法でAPI Gatewayへのアクセスを制限できます:

* いずれのエンドポイントタイプでも[リソースポリシー](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)を使用します。
* エンドポイントタイプが"private"の場合、[送信元IP](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)でアクセスを制御します。
* エンドポイントタイプが"private"の場合(設計上、API Gatewayはパブリックネットワークから到達不能です)、[VPCおよび/またはEndpoint](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)でアクセスを制御します。

### API Gatewayのエンドポイントタイプ間の移行

コンポーネントを再作成せずにAPI Gatewayのエンドポイントタイプを変更できますが、次の点に注意してください:

* タイプを"regional"から"private"に変更すると、パブリックエンドポイントはプライベートになり、パブリックなリソースからは到達不能になります。これは`execute-api`エンドポイントとドメイン名の両方に適用されます。
* タイプを"private"から"regional"に変更すると、API Gatewayに関連付けられているAWS VPC Endpointが即座に切り離され、API Gatewayは到達不能になります。
* コミュニティ版のNGINXはDNS名の変更を自動検出できないため、エンドポイントタイプを変更した後は、Wallarm nodeインスタンスで手動でNGINXを再起動する必要があります。

    各インスタンスの再起動、インスタンスの再作成、または各インスタンスでの`nginx -s reload`の実行を行います。 

"regional"から"private"にエンドポイントタイプを変更する場合:

1. AWS VPC Endpointを作成し、`execute-api`に関連付けます。例は`endpoint.tf`の構成ファイルにあります。
1. API Gatewayのエンドポイントタイプを切り替え、API Gatewayの設定でAWS VPC Endpointを指定します。完了すると、トラフィックフローは停止します。
1. 各Wallarm nodeインスタンスで`nginx -s reload`を実行するか、各Wallarm nodeを再作成します。完了すると、トラフィックフローは復旧します。

"private"から"regional"へエンドポイントタイプを変更することは推奨しませんが、もし実施する場合は次のとおりです:

1. "private"モードでの稼働に必要なエンドポイントを削除し、その後にAPI Gatewayのエンドポイントタイプを"regional"へ切り替えます。
1. 各Wallarm nodeインスタンスで`nginx -s reload`を実行するか、各Wallarm nodeを再作成します。完了すると、トラフィックフローは復旧します。

**本番環境ではAPI Gatewayを"private"に変更することを推奨します**。そうしない場合、Wallarm nodeからAPI Gatewayへのトラフィックはパブリックネットワーク経由となり、追加料金が発生する可能性があります。

## API Gateway向けの例示Wallarm AWSプロキシソリューションの実行

1. [EU Cloud](https://my.wallarm.com/nodes)または[US Cloud](https://us1.my.wallarm.com/nodes)のWallarm Consoleにサインアップします。
1. Wallarm Console → Nodesを開き、Wallarm nodeタイプのノードを作成します。
1. 生成されたnode tokenをコピーします。
1. 例のコードを含むリポジトリをローカルマシンにクローンします:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの`examples/apigateway/variables.tf`ファイルの`default`オプションで変数値を設定し、変更を保存します。
1. `examples/apigateway`ディレクトリで次のコマンドを実行してスタックをデプロイします:

    ```
    terraform init
    terraform apply
    ```

デプロイ済みの環境を削除するには、次のコマンドを使用します:

```
terraform destroy
```

## 参考資料

* [パブリックおよびプライベートサブネット(NAT)を備えたAWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API GatewayのプライベートAPI](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gatewayのポリシー](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gatewayポリシーの例](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gatewayのタイプ](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)