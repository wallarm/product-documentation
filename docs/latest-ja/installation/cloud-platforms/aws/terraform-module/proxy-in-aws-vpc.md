# AWS VPCでWallarmをプロキシとしてデプロイする

この例では、[Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用して、既存のAWS Virtual Private Cloud (VPC)にWallarmをインラインプロキシとしてデプロイする方法を説明します。

Wallarmのプロキシソリューションは、WAAPおよびAPIセキュリティ機能を備えた高度なHTTPトラフィックルーターとして機能する追加のネットワーク層を提供します。

この[プロキシのアドバンスドソリューション](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)を試すことで、ソリューションの柔軟性を実際に確認できます。

!!! info "セキュリティに関する注意"
    このソリューションはAWSのセキュリティベストプラクティスに準拠するよう設計されています。デプロイにはAWSのルートアカウントの使用を避けることを推奨します。代わりに、必要最小限の権限のみを付与したIAMユーザーまたはロールを使用してください。
    
    デプロイプロセスは最小権限の原則を前提としており、Wallarmコンポーネントのプロビジョニングおよび運用に必要な最小限のアクセスのみを付与します。

## ユースケース

サポートされる[Wallarmのデプロイオプション](https://docs.wallarm.com/installation/supported-deployment-options)の中でも、次のようなユースケースではAWS VPCへのWallarmのデプロイにTerraformモジュールの使用を推奨します:

* 既存のインフラストラクチャがAWS上にあります。
* Infrastructure as Code (IaC)の実践を活用しています。WallarmのTerraformモジュールにより、AWS上のWallarmノードの管理とプロビジョニングを自動化でき、効率性と一貫性が向上します。

## 要件

* Terraform 1.0.5以上が[ローカルにインストール済み](https://learn.hashicorp.com/tutorials/terraform/install-cli)であること
* USまたはEUの[Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)にあるWallarm Consoleで**Administrator**[ロール](https://docs.wallarm.com/user-guides/settings/users/#user-roles)を持つアカウントへのアクセス
* USのWallarm Cloudを使用する場合は`https://us1.api.wallarm.com`、EUのWallarm Cloudを使用する場合は`https://api.wallarm.com`へのアクセス。ファイアウォールでアクセスがブロックされていないことを確認してください
* 任意のAWSリージョンを使用できます。Wallarmノードのデプロイにリージョンの特別な制限はありません
* Terraform、AWS EC2、Security Groupsおよびその他のAWSサービスに関する理解
* リソースのデプロイにAWSのルートアカウントは決して使用しないでください

    本ガイドで説明するデプロイを実行するには、必要最小限の権限のみを持つ専用のIAMユーザーまたはロールを使用してください。
* 広範な権限（例: `AdministratorAccess`）の使用は避け、このモジュールの動作に必要なアクションのみに権限を付与してください

    このデプロイで使用するIAMロールと権限は最小権限の原則に従って設計されています。必要なAWSリソース（例: EC2、ネットワーキング、ログ）の作成と管理に必要な権限のみを付与してください。

## ソリューションアーキテクチャ

![Wallarmプロキシの構成図](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

この例のWallarmプロキシソリューションは次のコンポーネントで構成されます:

* インターネット向けApplication Load BalancerがトラフィックをWallarmノードインスタンスへルーティングします。
* トラフィックを解析し、リクエストをさらにプロキシするWallarmノードインスタンス。構成図上の該当要素はA、B、CのEC2インスタンスです。

    この例では、説明した動作を実現する監視モードでWallarmノードを実行します。Wallarmノードは、悪意のあるリクエストをブロックして正当なリクエストのみを転送するなど、他のモードでも動作できます。Wallarmノードのモードの詳細は[ドキュメント](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)をご参照ください。
* Wallarmノードがリクエストをプロキシ転送するサービス。サービスの種類は問いません。例:

    * VPC Endpoints経由でVPCに接続されたAWS API Gatewayアプリケーション（対応するWallarmのTerraformデプロイは[API Gateway向けの例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)で説明しています）
    * AWS S3
    * EKSクラスターで稼働するEKSノード（この場合はInternal Load BalancerまたはNodePort Serviceの構成を推奨します）
    * その他の任意のバックエンドサービス

    デフォルトでは、Wallarmノードはトラフィックを`https://httpbin.org`へ転送します。本例の起動時に、AWS Virtual Private Cloud (VPC)から到達可能でプロキシ先とできる任意のサービスのドメインまたはパスを指定できます。

    モジュール設定オプション`https_redirect_code = 302`により、AWS ALBでHTTPリクエストをHTTPSへ安全にリダイレクトできます。

上記のコンポーネント（プロキシ対象のサーバーを除く）は、提供されている`wallarm`の例モジュールによってデプロイされます。

## コードコンポーネント

この例には次のコードコンポーネントがあります:

* `main.tf`: プロキシソリューションとしてデプロイする`wallarm`モジュールのメイン設定です。この設定によりAWS ALBとWallarmインスタンスが作成されます。
* `ssl.tf`: `domain_name`変数で指定したドメインに対して新しいAWS Certificate Manager (ACM)証明書を自動発行し、AWS ALBにバインドするSSL/TLSオフロードの設定です。

    この機能を無効にするには、`ssl.tf`および`dns.tf`ファイルを削除するかコメントアウトし、さらに`wallarm`モジュール定義内の`lb_ssl_enabled`、`lb_certificate_arn`、`https_redirect_code`、`depends_on`の各オプションをコメントアウトしてください。機能を無効にした場合は、HTTPポート（80）のみを使用できます。
* `dns.tf`: AWS Route 53でAWS ALB向けのDNSレコードをプロビジョニングする設定です。

    この機能を無効にするには、上記の注意に従ってください。

## 例のWallarm AWSプロキシソリューションを実行する

1. [EU Cloud](https://my.wallarm.com/nodes)または[US Cloud](https://us1.my.wallarm.com/nodes)のWallarm Consoleにサインアップします。
1. Wallarm Console → **Nodes**を開き、**Wallarm node**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 例のコードを含むリポジトリをローカルマシンにクローンします:

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの`examples/proxy/variables.tf`ファイルの`default`オプションに変数値を設定し、変更を保存します。
1. `examples/proxy/main.tf`の`proxy_pass`にプロキシ先サーバーのプロトコルとアドレスを設定します。

    デフォルトでは、Wallarmはトラフィックを`https://httpbin.org`へプロキシします。デフォルト値で要件を満たす場合は、そのまま使用してください。
1. `examples/proxy`ディレクトリで次のコマンドを実行してスタックをデプロイします:

    ```
    terraform init
    terraform apply
    ```

デプロイした環境を削除するには、次のコマンドを使用します:

```
terraform destroy
```

## トラブルシューティング

### Wallarmがインスタンスを繰り返し作成および終了します

提供されているAWS Auto Scalingグループの設定は、サービスの高い信頼性と安定稼働に重点を置いています。AWS Auto Scalingグループの初期化中にEC2インスタンスが繰り返し作成および終了される場合は、ヘルスチェックの失敗が原因である可能性があります。

この問題に対処するには、次の設定を確認し、修正してください:

* WallarmノードトークンがWallarm Console UIからコピーした有効な値になっていること
* NGINXの設定が有効であること
* NGINXの設定で指定したドメイン名が正しく解決できていること（例: `proxy_pass`の値）

**最終手段** 上記の設定に問題がない場合は、原因を特定するためにAuto Scalingグループの設定でELBのヘルスチェックを手動で無効化してみることができます。これにより、サービス設定が不正でもインスタンスはアクティブな状態を維持し、再起動されません。数分での切り分けに追われるのではなく、ログを十分に調査してサービスをデバッグできます。

## 参考情報

* [AWS ACM証明書](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [パブリック/プライベートサブネット（NAT）を持つAWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)