# Terraformを使ってAWSにWallarmをデプロイする

Wallarmは、Terraform互換の環境から[AWS](https://aws.amazon.com/)へのノードデプロイメントを行うための[Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を提供しています。この手順を使用してモジュールを探索し、提供されたデプロイメントの例を試してください。

Wallarm Terraformモジュールを実装することで、Wallarmの2つの主要なデプロイメントオプション、すなわち**プロキシ**と**ミラー**のセキュリティソリューションを可能にしました。デプロイメントオプションは、`preset` Wallarmモジュール変数によって容易に制御されます。

## 前提条件

* ローカルに[Terraform 1.0.5以上をインストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* WallarmコンソールのUSまたはEU[クラウド](../../../../about-wallarm/overview.md#cloud)におけるアカウントの**Administrator**[役割](../../../../user-guides/settings/users.md#user-roles)へのアクセス 
* USのWallarmクラウドを使用している場合は`https://us1.api.wallarm.com`へ、EUのWallarmクラウドを使用している場合は`https://api.wallarm.com`へのアクセスが必要です。ファイアウォールによってアクセスがブロックされていないことを確認してください

このトピックには、Wallarmをデプロイするために必要なすべてのAWSリソースを作成する手順は含まれていません。詳細は、関連する[Terraformガイド](https://learn.hashicorp.com/tutorials/terraform/module-use)を参照してください。

## Wallarm AWS Terraformモジュールの使い方は？

AWS Terraformモジュールを使用してWallarmをプロダクション用にデプロイするためには:

1. [USクラウド](https://us1.my.wallarm.com/signup)または[EUクラウド](https://my.wallarm.com/signup)のWallarmコンソールにサインアップします。
1. Wallarmコンソール → **Nodes**を開き、**Wallarm node**タイプのノードを作成します。

    ![Wallarmノードの作成](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. 生成されたノードトークンをコピーします。
1. Terraform設定に`wallarm`モジュールのコードを追加します:

    ```conf
    module "wallarm" {
      source = "wallarm/wallarm/aws"

      instance_type = "..."

      vpc_id     = "..."

      preset     = "proxy"
      proxy_pass = "https://..."
      token      = "..."

      ...
    }
    ```
1. `wallarm`モジュールの設定で変数の値を設定します:

| 変数  | 説明 | タイプ | 必要？ |
| --------- | ----------- | --------- | --------- |
| `instance_type` | Wallarmデプロイメントで使用される[Amazon EC2インスタンスタイプ](https://aws.amazon.com/ec2/instance-types/)。たとえば、`t3.small`。 | string | はい
| `vpc_id` | Wallarm EC2インスタンスをデプロイする[AWS Virtual Private CloudのID](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html)。 | string | はい
| `token` | Wallarm Console UIからコピーした[Wallarmノードトークン](../../../../user-guides/nodes/nodes.md#creating-a-node)。<br><div class="admonition info"> <p class="admonition-title">複数のインストールで1つのトークンを使用する</p> <p>You can use one token in several installations regardless of the selected [platform](../../../../installation/supported-deployment-options.md). It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</p></div> | string | はい
| **Wallarm特有の変数** | | | |
| `host` | [Wallarm APIサーバー](../../../../about-wallarm/overview.md#cloud)。可能な値:<ul><li>`us1.api.wallarm.com`（USクラウド用）</li><li>`api.wallarm.com`（EUクラウド用）</li></ul>デフォルトでは、`api.wallarm.com`. | string | いいえ
`upstream` | デプロイする[Wallarmノードバージョン](../../../../updating-migrating/versioning-policy.md#version-list)。最低サポートバージョンは`4.0`。<br><br>デフォルトでは、`4.6`. | string | いいえ
| `preset` | Wallarmデプロイメントスキーム。可能な値:<ul><li>`proxy`</li><li>`mirror`</li></ul>デフォルトでは、`proxy`. | string | いいえ
| `proxy_pass` | プロキシ対象のサーバープロトコルとアドレス。Wallarmノードは、指定されたアドレスに送信されたリクエストを処理し、合法的なものをプロキシします。プロトコルとしては、「http」または「https」を指定できます。アドレスは、ドメイン名またはIPアドレス、オプションのポートで指定できます。 | string | Yes, if `preset` is `proxy`
| `mode` | [トラフィックフィルタモード](../../../../admin-en/configure-wallarm-mode.md)。可能な値：`off`、`monitoring`、`safe_blocking`、`block`。<br><br>デフォルトでは、`monitoring`. | string | いいえ
|`libdetection` | トラフィック解析中に[libdetection ライブラリを使用するか](../../../../about-wallarm/protecting-against-attacks.md#library-libdetection)。<br><br>デフォルトでは、`true`. | bool | いいえ
|`global_snippet` | NGINXのグローバル設定に追加されるカスタム設定。設定ファイルをTerraformコードディレクトリに置き、この変数でそのファイルへのパスを指定できます。<br><br>変数の設定例は、[プロキシアドバンスソリューションのデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17)で見ることができます。 | string | いいえ
|`http_snippet` | NGINXの`http`設定ブロックに追加されるカスタム設定。設定ファイルをTerraformコードディレクトリに置き、この変数でそのファイルへのパスを指定できます。<br><br>変数の設定例は、[プロキシアドバンスソリューションのデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18)で見ることができます。 | string | いいえ
|`server_snippet` | NGINXの`server`設定ブロックに追加されるカスタム設定。設定ファイルをTerraformコードディレクトリに置き、この変数でそのファイルへのパスを指定できます。<br><br>変数の設定例は、[プロキシアドバンスソリューションのデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19)で見ることができます。 | string | いいえ
|`post_script` | [Wallarmノード初期化スクリプト(`cloud-init.py`)](../../cloud-init.md)の後に実行するカスタムスクリプト。任意のスクリプトを含むファイルをTerraformコードディレクトリに置き、この変数でそのファイルへのパスを指定できます。<br><br>変数の設定例は、[プロキシアドバンスソリューションのデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34)で見ることができます。 | string | いいえ
| **AWSデプロイメント設定** | | | |
| `app_name` | Wallarmモジュールが作成するAWSリソース名の接頭辞。<br><br>デフォルトでは、`wallarm`。 | string | いいえ
| `app_name_no_template` | Wallarmモジュールが作成するAWSリソース名に大文字、数字、特殊文字を使用するかどうか。`false`の場合、リソース名には小文字のみが含まれます。<br><br>デフォルトでは、`false`。 | bool | いいえ
| `lb_subnet_ids` | アプリケーションロードバランサーをデプロイする[AWS Virtual Private CloudサブネットIDのリスト](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)。推奨値は、インターネットゲートウェイへのルートを持つルートテーブルに関連付けられた公開サブネットです。 | list(string) | いいえ
| `instance_subnet_ids` | Wallarm EC2インスタンスをデプロイする[AWS Virtual Private CloudサブネットIDのリスト](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)。推奨値は、出口専用接続が設定されたプライベートサブネットです。 | list(string) | いいえ
| `lb_enabled` | AWSアプリケーションロードバランサーを作成するかどうか。この変数で任意の値が渡されると、ターゲットグループが作成されます（`custom_target_group`変数でカスタムターゲットグループが指定されていない場合）。<br><br>デフォルトは、`true`。 | bool | いいえ
| `lb_internal` | アプリケーションロードバランサーを[内部ロードバランサー](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html)にするかどうか。デフォルトでは、ALBはインターネット対応タイプです。非同期的な接続処理を行う場合、推奨値は`true`です。<br><br>デフォルトは、`false`。 | bool | いいえ
| `lb_deletion_protection` | [誤ってアプリケーションロードバランサーが削除されるのを阻止する保護を有効にするかどうか](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection)。プロダクション環境のデプロイメントには、推奨値は`true`です。<br><br>デフォルトは、`true`。 | bool | いいえ
| `lb_ssl_enabled` | クライアントとアプリケーションロードバランサーの間で[SSL接続をネゴシエートするかどうか](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)。`true`を指定した場合、`lb_ssl_policy`と`lb_certificate_arn`変数が必要です。プロダクション環境のデプロイメントには推奨されます。<br><br>デフォルトは、`false`。 | bool | いいえ
| `lb_ssl_policy` | アプリケーションロードバランサーの[セキュリティポリシー](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)。 | string | はい、`lb_ssl_enabled`が`true`の場合
| `lb_certificate_arn` | AWS証明書マネージャー(ACM)証明書の[Amazonリソースネーム(ARN)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html)。 | string | はい、`lb_ssl_enabled`が`true`の場合
| `custom_target_group` | 作成されたAuto Scalingグループに[アタッチする既存のターゲットグループの名称](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)。デフォルトでは新しいターゲットグループが作成され、アタッチされます。値が非デフォルトの場合、AWS ALBの作成は無効になります。 | string | いいえ
| `inbound_allowed_ip_ranges` | Wallarmインスタンスへの受信接続を許可するソースIPとネットワークのリスト。AWSがパブリックサブネットからのロードバランサトラフィックをマスクすることを念頭に置いてください。<br><br>デフォルトでは：<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | いいえ
| `outbound_allowed_ip_ranges` | Wallarmインスタンスからのアウトバウンド接続を許可するソースIPとネットワークのリスト。<br><br>デフォルトは、`"0.0.0.0/0"`。 | list(string) | いいえ
| `extra_ports` | セキュリティグループに適用される設定の一部として、Wallarmインスタンスへの受信接続を許可する内部ネットワークの追加ポートのリスト。 | list(number) | いいえ
| `extra_public_ports` | Wallarmインスタンスへの受信接続を許可するパブリックネットワークの追加ポートのリスト。| list(number) | いいえ
| `extra_policies` | Wallarmスタックに関連付けるAWS IAMポリシー。Amazon S3からデータを要求するスクリプトを実行する`post_script`変数と一緒に使用すると便利です。 | list(string) | いいえ
| `source_ranges` | AWSアプリケーションロードバランサーのトラフィックを許可するソースIPとネットワークのリスト。<br><br>デフォルトは、`"0.0.0.0/0"`。 | list(string) | いいえ
| `https_redirect_code` | HTTPリクエストのHTTPSへのリダイレクトコード。可能な値： <ul><li>`0` - リダイレクトは無効</li><li>`301` - 恒久的なリダイレクト</li><li>`302` - 一時的なリダイレクト</li></ul>デフォルトは、`0`。 | number | いいえ
| `asg_enabled` | [AWS Auto Scalingグループを作成するかどうか](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html).<br><br>デフォルトは、`true` | bool | いいえ
| `min_size` | 作成されたAWS Auto Scalingグループ内のインスタンスの最小数。<br><br>デフォルトは、`1`.| number | いいえ
| `max_size` | 作成されたAWS Auto Scalingグループ内のインスタンスの最大数。<br><br>デフォルトは、`3`.| number | いいえ
| `desired_capacity` | 作成されたAWS Auto Scalingグループ内の初期インスタンス数。「min_size`以上、`max_size`以下である必要があります。<br><br>デフォルトは、`1`.| number | いいえ
| `autoscaling_enabled` | Wallarmクラスターの[Amazon EC2 Auto Scalingを有効にするかどうか](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)。<br><br>デフォルトは、`false`。 | bool | いいえ
| `autoscaling_cpu_target` | AWS Auto Scalingグループを保つための平均CPU利用率パーセンテージ。デフォルトは、`70.0`。 | string | いいえ
| `ami_id` | Wallarmインスタンスのデプロイメントに使用する[Amazon Machine Image ID](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html)。デフォルトでは（空文字列）、アップストリームからの最新のイメージが使用されます。Wallarmノードに基づいてカスタムAMIを作成することができます。 | string | いいえ
| `key_name` | WallarmインスタンスへのSSH接続に使用される[AWSキーペアの名称](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)。デフォルトでは、SSH接続は無効になります。 | string | いいえ
| `tags` | Wallarmモジュールが作成するAWSリソースのタグ。| map(string) | いいえ

## 例を使ってWallarm Terraformモジュールを試す

Wallarmモジュールを使ったさまざまな方法の例を準備しました。これにより、本番環境にデプロイする前に試すことができます:

* [AWS VPC内のプロキシ](proxy-in-aws-vpc.md)
* [Amazon API Gatewayのためのプロキシ](proxy-for-aws-api-gateway.md)
* [NGINX、Envoyまたは類似のミラーリングのためのOOB](oob-for-web-server-mirroring.md)

## WallarmとTerraformに関する詳細情報

Terraformは、公開[レジストリ](https://www.terraform.io/registry#navigating-the-registry)を介してユーザーに利用可能な、多数の統合（**プロバイダー**）と使用可能な設定（**モジュール**）をサポートしています。このレジストリで、Wallarmが公開したものは次のとおりです:

* Terraform互換の環境からAWSへノードをデプロイするための[Wallarm モジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)。現在の記事で説明されています。
* TerraformによるWallarmの管理のための[Wallarm プロバイダー](../../../../admin-en/managing/terraform-provider.md)。

これら2つは独立した要素であり、それぞれ異なる目的で使用され、互いには必要としません。