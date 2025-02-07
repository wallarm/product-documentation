# AWS VPCでProxyとしてWallarmを展開する

本例は[Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用して、既存のAWS Virtual Private Cloud (VPC)にインラインプロキシとしてWallarmを展開する方法を示します。

Wallarm proxyソリューションは、WAAPおよびAPIセキュリティ機能を備えた高度なHTTPトラフィックルーターとして機能する追加のネットワーク層を提供します。

プロキシ高度ソリューションを試すことで、ソリューションの柔軟性を確認できます： [proxy advanced solution](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)

## ユースケース

すべてのサポートされる[Wallarmデプロイメントオプション](https://docs.wallarm.com/installation/supported-deployment-options)の中で、Terraformモジュールは以下の**ユースケース**においてAWS VPCでのWallarm展開に推奨されます：

* 既存のインフラストラクチャがAWS上に存在します。
* Infrastructure as Code (IaC)のプラクティスを活用しています。WallarmのTerraformモジュールは、AWS上のWallarmノードの自動管理とプロビジョニングを可能にし、効率性と一貫性を向上させます。

## 要件

* Terraform1.0.5以上[ローカルにインストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)済み
* USまたはEU[Cloud](https://docs.wallarm.com/about-wallarm/overview/#cloud)のWallarm Consoleで**Administrator**[role](https://docs.wallarm.com/user-guides/settings/users/#user-roles)を持つアカウントへのアクセス権が必要です。
* US Wallarm Cloudを利用する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudを利用する場合は`https://api.wallarm.com`へのアクセス権が必要です。ファイアウォールによってアクセスがブロックされていないことを確認ください。

## ソリューションアーキテクチャ

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

本例のWallarm proxyソリューションは、以下のコンポーネントで構成されます：

* インターネットに公開されるApplication Load BalancerがWallarmノードインスタンスへトラフィックをルーティングします。
* Wallarmノードインスタンスがトラフィックを解析し、リクエストをさらにプロキシします。図中の対応する要素はA、B、CのEC2インスタンスです。

    本例ではWallarmノードが説明された挙動を促進する監視モードで実行されます。Wallarmノードは、悪意のあるリクエストをブロックし正当なリクエストのみを転送するなど、他のモードでも動作可能です。Wallarmノードのモードの詳細は[当社ドキュメント](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)をご参照ください。

* Wallarmノードがリクエストをプロキシするサービスです。サービスは以下のような任意のタイプで構成可能です：

    * AWS API GatewayアプリケーションがVPC Endpoints経由でVPCに接続されています（該当するWallarm Terraformデプロイメントは[API Gatewayの例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)で説明されています）。
    * AWS S3
    * EKSクラスターで稼働するEKSノード（この場合はInternal Load BalancerまたはNodePort Serviceの設定が推奨されます）。
    * その他の任意のバックエンドサービス

    デフォルトでは、Wallarmノードはトラフィックを`https://httpbin.org`に転送します。本例の起動中に、AWS Virtual Private Cloud (VPC)から利用可能な任意のサービスドメインまたはパスを指定してトラフィックをプロキシすることが可能です。

    `https_redirect_code = 302`モジュール構成オプションにより、AWS ALBがHTTPリクエストを安全にHTTPSへリダイレクトするように設定できます。

リストアップされた全てのコンポーネント（プロキシされるサーバーを除く）は、提供された`wallarm`例モジュールによってデプロイされます。

## コードコンポーネント

本例は以下のコードコンポーネントで構成されます：

* `main.tf`: プロキシソリューションとしてデプロイするための`wallarm`モジュールのメイン構成です。この構成では、AWS ALBとWallarmインスタンスを生成します。
* `ssl.tf`: `domain_name`変数で指定されたドメインに対して自動的に新規のAWS Certificate Manager (ACM)を発行し、AWS ALBにバインドするSSL/TLS offloadの構成です。

    この機能を無効化するには、`ssl.tf`および`dns.tf`ファイルを削除またはコメントアウトし、`wallarm`モジュール定義内の`lb_ssl_enabled`、`lb_certificate_arn`、`https_redirect_code`、`depends_on`オプションもコメントアウトしてください。機能を無効化すると、HTTPポート (80) のみを使用できます。
* `dns.tf`: AWS ALBのDNSレコードをプロビジョニングするAWS Route 53の構成です。

    機能を無効化する場合は、上記の注意事項に従ってください。

## 例のWallarm AWS proxyソリューションの実行方法

1. [EU Cloud](https://my.wallarm.com/nodes)または[US Cloud](https://us1.my.wallarm.com/nodes)のWallarm Consoleにサインアップします。
1. Wallarm Consoleを開き、**Nodes**を選択して**Wallarm node**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 例のコードを含むリポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリ内の`examples/proxy/variables.tf`ファイルの`default`オプションに変数値を設定し、変更を保存します。
1. `examples/proxy/main.tf`内の`proxy_pass`に、プロキシするサーバーのプロトコルとアドレスを設定します。

    デフォルトでは、Wallarmはトラフィックを`https://httpbin.org`にプロキシします。デフォルト値で問題なければそのままにしてください。
1. `examples/proxy`ディレクトリから以下のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイされた環境を削除するには、以下のコマンドを使用してください：

```
terraform destroy
```

## トラブルシューティング

### Wallarmが繰り返しインスタンスを作成および終了する

提供されたAWS Auto Scalingグループの構成は、サービスの高い信頼性と安定性に注力しています。AWS Auto Scalingグループの初期化中にEC2インスタンスが繰り返し作成および終了される場合、ヘルスチェックの失敗が原因である可能性があります。

この問題を解決するため、以下の設定を確認し、修正してください：

* WallarmノードトークンがWallarm Console UIから正しい値をコピーされていること
* NGINX設定が正しいこと
* NGINX設定で指定されたドメイン名が正常に解決されていること（例：`proxy_pass`の値）

**極端な方法**  
上記の設定が正しい場合、Auto Scalingグループ設定でELBのヘルスチェックを手動で無効化し、問題の原因を特定することが可能です。これにより、サービスの構成が無効であってもインスタンスをアクティブに保ち、インスタンスが再起動しません。数分で問題を調査する代わりに、ログを徹底的に確認してサービスをデバッグできます。

## 参考資料

* [AWS ACM証明書](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [AWS VPC(パブリック及びプライベートサブネット、NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)