# AWS VPC に Wallarm をプロキシとして配置する

この例では、[Terraform モジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を使用して既存の AWS Virtual Private Cloud (VPC) に Wallarm をインラインプロキシとしてデプロイする方法を説明します。

Wallarm プロキシソリューションは、WAF と API セキュリティ機能を備えた高度な HTTP トラフィックルーターとしての役割を果たす追加的な機能ネットワークレイヤーを提供します。

ソリューションの柔軟性を[プロキシ高度なソリューション](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced)を試すことで確認できます。

## 主な特徴

* Wallarm は同期モードでトラフィックを処理し、Wallarm の機能を制限せず、即座の脅威対策が可能です(`preset=proxy`)。
* Wallarm ソリューションは独立したネットワークレイヤーとしてデプロイされ、他のレイヤーとは独立して制御でき、またほぼ任意のネットワーク構造位置に置くことができます。推奨される位置はインターネット向けロードバランサーの背後です。

## ソリューションのアーキテクチャ

![Wallarm proxy scheme](https://github.com/wallarm/terraform-aws-wallarm/blob/main/images/wallarm-as-proxy.png?raw=true)

Wallarm プロキシソリューションの例には以下のコンポーネントが含まれています。

* Wallarm ノードのインスタンスにトラフィックをルーティングするインターネット向けアプリケーションのロードバランサー。
* トラフィックを分析し、任意のリクエストをさらにプロキシする Wallarm ノードのインスタンス。スキーム上の対応する要素は A、B、C の EC2 インスタンスです。

    例では、Wallarm ノードを監視モードで実行し、説明される動作を適用します。Wallarm ノードは、有害なリクエストをブロックし、正当なリクエストのみをさらに前進させるようにするなど、他のモードでも稼働できます。Wallarm ノードモードについて詳しく知るには、[当社のドキュメンテーション](https://docs.wallarm.com/admin-en/configure-wallarm-mode/)を利用してください。
* Wallarm ノードがプロキシリクエストを送り先となるサービス。サービスには任意のタイプを用いることができ、例えば：

    * VPC エンドポイントを介して VPC に接続された AWS API Gateway アプリケーション（対応する Wallarm Terraform デプロイメントは、[API Gateway の例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/apigateway)で説明されています）
    * AWS S3
    * EKS クラスターで稼働する EKS ノード (この場合、内部のロードバランサーや NodePort サービスの設定が推奨されます)
    * その他の任意のバックエンドサービス

    デフォルトでは、Wallarm ノードはトラフィックを `https://httpbin.org` に転送します。この例の起動時に、AWS Virtual Private Cloud (VPC) からアクセス可能な任意のその他のサービスドメインまたはパスを指定して、トラフィックをプロキシすることができます。

    `https_redirect_code = 302` モジュールの設定オプションによって、AWS ALB を使用して HTTP リクエストを HTTPS に安全にリダイレクトできます。

上記のすべてのコンポーネント（プロキシ化されたサーバーを除く）は、提供された `wallarm` の例のモジュールによってデプロイされます。

## コードのコンポーネント

この例には以下のコードのコンポーネントが含まれています。

* `main.tf`：プロキシソリューションとしてデプロイされる `wallarm` モジュールの主要な設定。AWS ALB と Wallarm のインスタンスを生成する設定です。
* `ssl.tf`：新たな AWS Certificate Manager (ACM) を `domain_name` 変数に指定したドメインに自動的に発行し、それを AWS ALB へ紐付ける SSL/TLS オフロード設定。

    この機能を無効にするには、`ssl.tf` と `dns.tf` ファイルを削除またはコメントアウトし、`wallarm` モジュールの定義で `lb_ssl_enabled`、`lb_certificate_arn`、`https_redirect_code`、`depends_on` オプションもコメントアウトします。この機能が無効化されている場合、HTTP ポート (80) のみを利用できます。
* `dns.tf`：AWS ALB の DNS レコードをプロビジョニングする AWS Route 53 設定。

    この機能を無効にするには、上の注意を参照してください。

## 要件

* ローカルに [インストールされた](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5 以上
* Wallarm コンソールの [EU クラウド](https://my.wallarm.com/) または [US クラウド](https://us1.my.wallarm.com/) について、**管理者** ロールを持つアカウントへのアクセス
* EUのWallarmクラウドを使用している場合は `https://api.wallarm.com`、USのWallarmクラウドを使用している場合は `https://us1.api.wallarm.com` へのアクセス。ファイアウォールによってアクセスがブロックされていないことを確認してください
* SSL と DNS の機能が有効な状態で例を実行するには、[Route 53 ホストゾーン](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html)を設定してください

## Wallarm AWS プロキシソリューションの例を実行する

1. [EU クラウド](https://my.wallarm.com/nodes) または [US クラウド](https://us1.my.wallarm.com/nodes) の Wallarm コンソールにサインアップします。
1. Wallarm コンソールを開き、**Nodes** で**Wallarm ノード**のタイプのノードを作成します。
1. 生成されたノードトークンをコピーします。
1. 例のコードを含むリポジトリを自分のマシンにクローンします：

    ```
    git clone https://github.com/wallarm/terraform-aws-wallarm.git
    ```
1. クローンしたリポジトリの `examples/proxy/variables.tf` ファイルの `default` オプションに変数の値を設定し、変更を保存します。
1. `examples/proxy/main.tf` → `proxy_pass` でプロキシするサーバーのプロトコルとアドレスを設定します。

    デフォルトでは、Wallarmはトラフィックを `https://httpbin.org` にプロキシします。デフォルトの値が必要なものであればそのままにしておいてください。
1. `examples/proxy` ディレクトリから次のコマンドを実行してスタックをデプロイします：

    ```
    terraform init
    terraform apply
    ```

デプロイした環境を削除するには、次のコマンドを使用します：

```
terraform destroy
```

## トラブルシューティング

### Wallarm が繰り返しインスタンスを作成し終了する

提供された AWS Auto Scaling グループの設定は、サービスの最高の信頼性とスムーズさを目指しています。AWS Auto Scaling グループの初期化中の EC2 インスタンスの繰り返しの作成と削除は、ヘルスチェックに失敗している可能性があります。

この問題を解消するには、次の設定を確認し、修正してください：

* Wallarm ノードトークンの値が Wallarm コンソール UI からコピーしたものと一致している
* NGINX の設定が有効である
* NGINX 設定で指定されたドメイン名が正常に解決されている (例えば、`proxy_pass` の値)


**極端な方法** 上記の設定が有効な場合、アウトスケーリンググループの設定で ELB ヘルスチェックを手動で無効にすることで問題の原因を探すことができます。これにより、サービス設定が無効であっても、インスタンスはアクティブなままで、再起動せずに、ログを詳細に調査することができます。

## 参考資料

* [AWS ACM 証明書](https://docs.aws.amazon.com/acm/latest/userguide/gs.html)
* [パブリックとプライベートサブネット (NAT) を持つ AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)