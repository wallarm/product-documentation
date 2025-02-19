# Amazon API Gateway向けのWallarmをプロキシとして展開

この例は、[Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用して、AWS Virtual Private Cloud (VPC)にインラインプロキシとして展開されたWallarmにより[Amazon API Gateway](https://aws.amazon.com/api-gateway/)を保護する方法を示します。

Wallarmプロキシソリューションは、WAAPおよびAPIセキュリティ機能を備えた高度なHTTPトラフィックルーターとして機能する追加のネットワーク機能レイヤーを提供します。Amazon API Gatewayを含むほぼすべてのサービス型に対してリクエストをルーティング可能であり、その能力を制限しません。

## ユースケース

サポートされる[Wallarmの展開オプション](https://docs.wallarm.com/installation/supported-deployment-options)の中で、AWS VPCへのWallarm展開において、Terraformモジュールは以下の**ユースケース**において推奨されます：

* 既存のインフラストラクチャがAWS上にある場合です。
* Infrastructure as Code (IaC)の実践を活用している場合です。WallarmのTerraformモジュールは、AWS上のWallarmノードの自動管理およびプロビジョニングを可能にし、効率と一貫性を向上させます。

## 要件

* Terraform 1.0.5以上を[ローカルにインストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)してください。
* USまたはEU[Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)のWallarm Consoleで**Administrator**[role](https://docs.wallarm.com/user-guides/settings/users/#user-roles)を持つアカウントにアクセスしてください。
* US Wallarm Cloudをご利用の場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudをご利用の場合は`https://api.wallarm.com`にアクセスできるようにしてください。ファイアウォールでアクセスがブロックされていないことを確認してください。

## ソリューションアーキテクチャ

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy-for-aws-api-gateway.png?raw=true)

この例のWallarmプロキシソリューションは、以下のコンポーネントで構成されています：

* インターネット向けのApplication Load BalancerがWallarmノードインスタンスへトラフィックをルーティングします。
* Wallarmノードインスタンスがトラフィックを解析し、API Gatewayへのリクエストをプロキシします。

    この例では、監視モードでWallarmノードを実行し、上記の動作を実現します。Wallarmノードは、不正なリクエストをブロックし、正当なリクエストのみを転送するなど、他のモードでも動作可能です。Wallarmノードのモードの詳細については、[こちらのドキュメント](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)を参照してください。
* Wallarmノードがリクエストをプロキシする対象のAPI Gatewayです。API Gatewayには以下の設定が施されています：

    * `/demo/demo`パスが割り当てられています。
    * シングルモックが構成されています。
    * このTerraformモジュールの展開中に、API Gatewayの[エンドポイントタイプ](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)として、"regional"または"private"のいずれかを選択できます。これらのタイプおよびそれらの間の移行に関する詳細は以下に記載しています。

    提供される例は通常のAmazon API Gatewayを展開するため、Wallarmノードによる動作への影響はありません。

上記の全コンポーネント（API Gatewayを含む）は、提供される`wallarm`例モジュールによって展開されます。

## コードコンポーネント

この例には以下のコードコンポーネントが含まれます：

* `main.tf`: プロキシソリューションとして展開される`wallarm`モジュールのメイン設定です。この設定はAWS ALBとWallarmインスタンスを作成します。
* `apigw.tf`: `/demo/demo`パス下でアクセス可能なAmazon API Gatewayを作成する設定で、シングルモック統合が構成されています。モジュール展開中に"regional"または"private"のエンドポイントタイプを選択することもできます（詳細は以下を参照）。
* `endpoint.tf`: API Gatewayエンドポイントの"private"タイプ向けのAWS VPCエンドポイント設定です。

## "regional"と"private"のAPI Gatewayエンドポイントの違い

`apigw_private`変数でAPI Gatewayエンドポイントタイプが設定されます：

* "regional"オプションでは、Wallarmノードインスタンスが公開されているAPI Gateway [`execute-api`](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-call-api.html)サービスにリクエストを送信します。
* "private"オプションでは、`execute-api`サービスに接続されたAWS VPCエンドポイントへ送信します。**本番環境の展開では、"private"オプションが推奨されます。**

### API Gatewayへのアクセス制限のさらなるオプション

* いずれかのエンドポイントタイプに対して[リソースポリシー](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)を使用します。
* エンドポイントタイプが"private"の場合、[送信元IP](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)でアクセスを管理します。
* エンドポイントタイプが"private"の場合、[VPCおよび/またはエンドポイント](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)でアクセスを管理します。これは設計上、API Gatewayがパブリックネットワークから利用できないと仮定しています。

### API Gatewayエンドポイントタイプ間の移行

API Gatewayエンドポイントタイプはコンポーネントの再作成なしに変更可能ですが、以下にご留意ください：

* "regional"から"private"にタイプを変更すると、パブリックなエンドポイントがプライベートになり、パブリックリソースから利用できなくなります。これは`execute-api`エンドポイントおよびドメイン名の両方に適用されます。
* "private"から"regional"にタイプを変更すると、API Gatewayに接続されているAWS VPCエンドポイントが直ちに切り離され、API Gatewayが利用できなくなります。
* コミュニティ版NGINXはDNS名の変更を自動で検出できないため、タイプ変更後はWallarmノードインスタンス上で手動でNGINXを再起動する必要があります。

各インスタンスで再起動、再作成、または`nginx -s reload`を実行することができます。

"regional"から"private"へのエンドポイントタイプの変更の場合：

1. AWS VPCエンドポイントを作成し、`execute-api`にアタッチします。例は`endpoint.tf`設定ファイルに記載されています。
1. API Gatewayエンドポイントタイプを切り替え、API Gateway設定でAWS VPCエンドポイントを指定します。完了すると、トラフィックフローが停止します。
1. 各Wallarmノードインスタンスで`nginx -s reload`を実行するか、または各Wallarmノードを再作成します。完了するとトラフィックフローが回復します。

"private"から"regional"へのエンドポイントタイプの変更は推奨されませんが、実施する場合：

1. "private"モードで運用するために必要なエンドポイントを削除し、その後API Gatewayエンドポイントを"regional"に切り替えます。
1. 各Wallarmノードインスタンスで`nginx -s reload`を実行するか、または各Wallarmノードを再作成します。完了するとトラフィックフローが回復します。

**本番環境向けには、API Gatewayを"private"に変更することが推奨されます**。そうでない場合、WallarmノードからAPI Gatewayへのトラフィックがパブリックネットワークを経由し、追加料金が発生する可能性があります。

## API Gateway向けWallarm AWSプロキシソリューションの実行

1. [EU Cloud](https://my.wallarm.com/nodes)または[US Cloud](https://us1.my.wallarm.com/nodes)でWallarm Consoleにサインアップしてください。
1. Wallarm Consoleの**Nodes**を開き、**Wallarm node**タイプのノードを作成してください。
1. 生成されたノードトークンをコピーしてください。
1. 例のコードが含まれるリポジトリをローカルにクローンしてください：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの`examples/apigateway/variables.tf`ファイル内の`default`オプションに変数値を設定し、変更を保存してください。
1. `examples/apigateway`ディレクトリから以下のコマンドを実行してスタックを展開してください：

    ```
    terraform init
    terraform apply
    ```

展開された環境を削除するには、以下のコマンドを実行してください：

```
terraform destroy
```

## 参考資料

* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)
* [API Gateway Private APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)
* [API Gateway Policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies.html)
* [API Gateway Policies examples](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
* [API Gateway Types](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html)