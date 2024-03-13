# Wallarm AWS Terraform モジュールの例：ゼロからのプロキシソリューションのデプロイメント

この例では、Terraformモジュールを使用して、AWS Virtual Private Cloud（VPC）にWallarmをインラインプロキシとしてデプロイする方法を示します。[通常の](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)または[高度な](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)プロキシデプロイメントの例とは異なり、この例の設定は、この例のデプロイメント中に直接VPCリソースを作成します。[AWS VPC Terraform モジュール](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)を使用します。そのため、この例は「ゼロからのプロキシソリューション」と呼ばれます。

以下の場合、これが**推奨**デプロイオプションです：

* サブネットやNAT、ルートテーブルその他のVPCリソースが設定されていない場合。このデプロイメント例では、Wallarm Terraformモジュールとともに[AWS VPC Terraform モジュール](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)を起動して、VPCリソースを作成し、Wallarmとそれらを統合します。
* Wallarm モジュールが AWS VPC とどのように統合されているか、また、この統合に必要な VPC リソースとモジュール変数を学びたい場合。

## 主な特徴

* Wallarmは同期モードでトラフィックを処理し、Wallarmの機能を制限しないでインスタントの脅威の緩和を可能にします（`preset=proxy`）。
* Wallarmソリューションは別のネットワーク層としてデプロイされ、他の層とは独立にそれを制御し、ほとんどのネットワーク構造の場所にレイヤーを配置することができます。推奨される位置は、インターネットに面した負荷分散装置の背後です。
* このソリューションでは、DNSとSSL機能を設定する必要はありません。
* VPCリソースを作成し、Wallarmインラインプロキシを作成したVPCに自動的に統合します。一方、通常のプロキシ例は、VPCリソースが存在し、その識別子の要求を必要とします。
* この例を実行するために必要な唯一の変数は、Wallarmノードトークンをもつ `token` です。

## ソリューションアーキテクチャ

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

この例のソリューションは、[通常のプロキシソリューション](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/proxy)と同じアーキテクチャを持っています。

* AWS VPCリソース（サブネット、NAT、ルートテーブル、EIPなど）はこの例の起動中に[`vpc`](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)モジュールによって自動的にデプロイされます。これらは提供されたスキームでは表示されません。
* インターネットに面したアプリケーションロードバランサーがトラフィックをWallarmノードインスタンスにルーティングします。このコンポーネントは提供された `wallarm` の例モジュールによってデプロイされます。
* Wallarmノードインスタンスがトラフィックを解析し、任意のリクエストをさらにプロキシしています。対応する要素はスキーム上のA, B, CのEC2インスタンスです。このコンポーネントは提供された `wallarm` の例モジュールによってデプロイされます。

   この例では、Wallarmノードを監視モードで実行しています。Wallarmノードは、他のモードでも動作可能で、悪意のあるリクエストをブロックし、合法的なリクエストだけをさらに転送することを目指したモードも含まれます。Wallarmノードモードの詳細については、[当社のドキュメンテーション](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)をご覧ください。
* Wallarmノードがリクエストをプロキシするサービス。サービスは任意のタイプである可能性があります。例えば：

   * VPCエンドポイント経由でVPCに接続したAWS API Gatewayアプリケーション（対応するWallarm Terraformデプロイメントは[API Gatewayの例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)でカバーされます）
   * AWS S3
   * EKSクラスタ内で実行されているEKSノード（このケースでは、Internal Load BalancerまたはNodePort Serviceの設定が推奨されます）
   * その他のバックエンドサービス
* デフォルトでは、Wallarmノードはトラフィックを `https://httpbin.org` に転送します。この例の起動中に、他のサービスドメインまたはAWS Virtual Private Cloud（VPC）から利用可能なパスを指定して、トラフィックをプロキシすることができます。

## コードコンポーネント

この例では、次のモジュール設定を持つ唯一の `main.tf` 設定ファイルが存在します：

* AWS VPS リソースを作成するための[`vpc`モジュール](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/)の設定。
* プロキシソリューションとしてデプロイされるWallarm設定を持つ`wallarm`モジュール。この設定はAWS ALBとWallarmインスタンスを生成します。

## 必要条件

* ローカルにインストールされたTerraform 1.0.5 またはそれ以上のバージョン [ローカル環境へのインストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* [EU Cloud](https://my.wallarm.com/)または[US Cloud](https://us1.my.wallarm.com/)のWallarmコンソールで**Administrator**ロールを持つアカウントへのアクセス
* EU Wallarm Cloudを使用している場合は`https://api.wallarm.com`へ、US Wallarm Cloudを使用している場合は`https://us1.api.wallarm.com`へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください。

## Wallarm AWS プロキシソリューションの例の実行

1. [EU Cloud](https://my.wallarm.com/nodes)または[US Cloud](https://us1.my.wallarm.com/nodes)のWallarmコンソールにサインアップします。
1. Wallarmコンソール→ **Nodes**を開き、**Wallarm node**タイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. リポジトリをマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの`examples/from-scratch/variables.tf`ファイルの`default`オプションの中で変数値を設定し、変更を保存します。
1. `examples/from-scratch`ディレクトリから次のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイされた環境を削除するには、次のコマンドを使用します:

```
terraform destroy
```

## 参考文献

* [Wallarm documentation](https://docs.wallarm.com)
* [AWSのVPCリソースを作成するTerraformモジュール](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws)
* [AWS VPC with public and private subnets (NAT)](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)