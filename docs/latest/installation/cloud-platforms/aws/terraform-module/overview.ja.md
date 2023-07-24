# Terraformを使用してAWSにWallarmを展開

Wallarmは、Terraformと互換性のある環境から[AW](https://aws.amazon.com/)にノードを展開するための[Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を提供しています。 これらの指示に従ってモジュールを調査し、提供されたデプロイメント例を試してみてください。

WallarmのTerraformモジュールを実装することで、2つの主要なWallarmデプロイメントオプション、すなわち**プロキシ**と**ミラー**のセキュリティソリューションを可能にするソリューションを提供しました。デプロイメントオプションは、`preset` Wallarmモジュール変数によって容易に制御できます。

## 必要条件

* ローカルに[インストールされた](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform 1.0.5以上
* Wallarm Consoleで**管理者** [役割](../../../../user-guides/settings/users.md#user-roles)を持つアカウントへのアクセス、米国またはEU [クラウド](../../../../about-wallarm/overview.md#cloud)
* 米国のWallarm Cloudで作業している場合は`https://us1.api.wallarm.com`へ、EUのWallarm Cloudで作業している場合は`https://api.wallarm.com`へのアクセス。ファイアウォールでアクセスがブロックされていないことを確認してください

このトピックには、Wallarmをデプロイするために必要なすべてのAWSリソースを作成するための指示は含まれていません。詳しくは、関連する[Terraformガイド](https://learn.hashicorp.com/tutorials/terraform/module-use)を参照してください。## Wallarm AWS Terraformモジュールの使い方は？

AWS Terraformモジュールを使用してWallarmをプロダクション用にデプロイするには:

1. [USクラウド](https://us1.my.wallarm.com/signup)または[EUクラウド](https://my.wallarm.com/signup)のWallarmコンソールにサインアップします。
1. Wallarmコンソール→ **ノード**を開き、**Wallarmノード**タイプのノードを作成します。

    ![!Wallarmノードの作成](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. 生成されたノードトークンをコピーします。
1. `wallarm`モジュールコードをTerraform設定に追加します:

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
1. `wallarm`モジュール設定の変数値を設定します:

| 変数  | 説明 | タイプ | 必須? |
| --------- | ----------- | --------- | --------- |
| `instance_type` | Wallarmのデプロイメントに使用する[Amazon EC2インスタンスタイプ](https://aws.amazon.com/ec2/instance-types/)。例：`t3.small`。 | string | はい |
| `vpc_id` | Wallarm EC2インスタンスをデプロイする[AWS Virtual Private CloudのID](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html)。 | string | はい |
| `token` | WallarmコンソールUIからコピーした[Wallarmノードトークン](../../../../user-guides/nodes/nodes.md#creating-a-node)。<br><div class="admonition info"> <p class="admonition-title">一つのトークンを複数のインストールで使用する</p><p>選択した[プラットフォーム](../../../../installation/supported-deployment-options.md)に関係なく、一つのトークンを複数のインストールで使用できます。それにより、WallarmコンソールUIでノードインスタンスを論理的にグループ化することが可能になります。例：開発環境に複数のWallarmノードをデプロイし、各ノードは特定の開発者が所有する独自のマシンにあります。</p></div> | string | はい |
| **Wallarm固有の変数** | | | |
| `host` | [Wallarm APIサーバ](../../../../about-wallarm/overview.md#cloud)。可能な値:<ul><li>`us1.api.wallarm.com` - USクラウド用</li><li>`api.wallarm.com` - EUクラウド用</li></ul>デフォルトは `api.wallarm.com`。| string | いいえ |
`upstream` | デプロイする[Wallarmノードバージョン](../../../../updating-migrating/versioning-policy.md#version-list)。最低サポートバージョンは `4.0`。<br><br>デフォルトは、`4.6`。| string | いいえ |
| `preset` | Wallarmのデプロイメントスキーム。可能な値:<ul><li>`proxy`</li><li>`mirror`</li></ul>デフォルトは`proxy`。 | string | いいえ |
| `proxy_pass` | プロキシ化されるサーバーのプロトコルとアドレス。Wallarmノードは指定されたアドレスに送られたリクエストを処理し、正当なものをプロキシ化します。プロトコルとしては、'http'または'https'を指定できます。アドレスは、ドメイン名またはIPアドレスを指定し、オプションでポートを追加できます。 | string | はい、`preset`が `proxy`の場合 |
| `mode` | [トラフィックフィルタリングモード](../../../../admin-en/configure-wallarm-mode.md)。可能な値: `off`、`monitoring`、`safe_blocking`、`block`。<br><br>デフォルトは、`monitoring`。 | string | いいえ |
|`libdetection` | トラフィック解析中に[libdetectionライブラリを使用するかどうか](../../../../about-wallarm/protecting-against-attacks.md#library-libdetection)。<br><br>デフォルトは、`true`。| bool | いいえ |
|`global_snippet` | NGINXのグローバル設定に追加するカスタム設定。Terraformコードディレクトリに設定ファイルを置き、この変数でそのファイルへのパスを指定することができます。<br><br>変数設定の例は、[プロキシ高度なソリューションのデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17)で見つけることができます。| string | いいえ |
|`http_snippet` | NGINXの `http` 設定ブロックに追加するカスタム設定。Terraformコードディレクトリに設定ファイルを置き、この変数でそのファイルへのパスを指定することができます。<br><br>変数設定の例は、[プロキシ高度なソリューションのデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18)で見つけることができます。| string | いいえ |
|`server_snippet` | NGINXの `server` 設定ブロックに追加するカスタム設定。Terraformコードディレクトリに設定ファイルを置き、この変数でそのファイルへのパスを指定することができます。<br><br>変数設定の例は、[プロキシ高度なソリューションのデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19)で見つけることができます。| string | いいえ |
|`post_script` | [Wallarmノード初期化スクリプト (`cloud-init.py`)](../../cloud-init.md)の後に実行するカスタムスクリプト。Terraformコードディレクトリに任意のスクリプトのファイルを置き、この変数でそのファイルへのパスを指定します。<br><br>変数設定の例は、[プロキシ高度なソリューションのデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34)で見つけることができます。| string | いいえ |
| **AWSデプロイメント設定** | | | |
| `app_name` | Wallarmモジュールが作成するAWSリソース名のプレフィクス。<br><br>デフォルトは、`wallarm`。| string | いいえ |
| `app_name_no_template` | Wallarmモジュールが作成するAWSリソース名に大文字、数字、特殊文字を使用するかどうか。`false`の場合、リソース名は小文字のみを含む。<br><br>デフォルトは、`false`。 | bool | いいえ |
| `lb_subnet_ids` | Application Load Balancerをデプロイする[AWS Virtual Private CloudのサブネットIDのリスト](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)。推奨値は、インターネットゲートウェイへのルートが設定されたルートテーブルに関連付けられたパブリックサブネットです。 | list(string) | いいえ |
| `instance_subnet_ids` | Wallarm EC2インスタンスをデプロイする[AWS Virtual Private CloudのサブネットIDのリスト](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)。推奨値は、egress-only接続が設定されたプライベートサブネットです。 | list(string) | いいえ |
| `lb_enabled` | AWS Application Load Balancerを作成するかどうか。この変数に任意の値を渡すと、ターゲットグループが作成されます（`custom_target_group`変数でカスタムターゲットグループが指定されていない場合）。<br><br>デフォルトは、`true`。 | bool | いいえ |
| `lb_internal` | Application Load Balancerを[内部ロードバランサー](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html)にするかどうか。デフォルトでは、ALBはインターネット向けのタイプになっています。接続の非同期処理を使用している場合、推奨値は`true`です。<br><br>デフォルトは、`false`。 | bool | いいえ |
| `lb_deletion_protection` | [Application Load Balancerの誤って削除されることを防ぐための保護](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection)を有効にするかどうか。本番環境へのデプロイメントでは、推奨値は`true`です。<br><br>デフォルトは、`true`。 | bool | いいえ |
| `lb_ssl_enabled` | クライアントとApplication Load Balancerとの間で[SSLコネクションをネゴシエート](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)するかどうか。`true`の場合、`lb_ssl_policy`および`lb_certificate_arn`変数が必要です。本番環境へのデプロイメントでは推奨されます。<br><br>デフォルトは、`false`。| bool | いいえ |
| `lb_ssl_policy` | Application Load Balancerの[セキュリティポリシー](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)。 | string | はい、`lb_ssl_enabled`が `true`の場合 |
| `lb_certificate_arn` | [Amazonリソースネーム (ARN)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html)のAWS証明書マネージャー (ACM)証明書。 | string | はい、`lb_ssl_enabled`が `true`の場合 |
| `custom_target_group` | 作成したAuto Scalingグループに[アタッチする既存のターゲットグループの名前](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)。デフォルトでは、新しいターゲットグループが作成され、アタッチされます。値が非デフォルトの場合、AWS ALBの作成は無効になります。 | string | いいえ |
| `inbound_allowed_ip_ranges` | Wallarmインスタンスへのインバウンド接続を許可するソースIPとネットワークのリスト。AWSは、パブリックサブネットから来るロードバランサートラフィックをマスクすることを念頭に置いてください。<br><br>デフォルトは:<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | いいえ |
| `outbound_allowed_ip_ranges` | Wallarmインスタンスがアウトバウンド接続を許可するソースIPとネットワークのリスト。<br><br>デフォルトは: `"0.0.0.0/0"`。 | list(string) | いいえ |
| `extra_ports` | セキュリティグループに適用される設定で、Wallarmインスタンスへのインバウンド接続を許可する内部ネットワークの追加ポートのリスト。 | list(number) | いいえ |
| `extra_public_ports` | Wallarmインスタンスへのインバウンド接続を許可する公開ネットワークの追加ポートのリスト。| list(number) | いいえ |
| `extra_policies` | Wallarmスタックに関連付けられるAWS IAMポリシー。Amazon S3からデータをリクエストするスクリプトを実行する`post_script`変数と一緒に使用すると便利です。 | list(string) | いいえ |
| `source_ranges` | AWS Application Load Balancerからのトラフィックを許可するソースIPとネットワークのリスト。<br><br>デフォルトは、`"0.0.0.0/0"`。 | list(string) | いいえ |
| `https_redirect_code` | HTTPリクエストをHTTPSにリダイレクトするコード。可能な値: <ul><li>`0` - リダイレクトは無効</li><li>`301` - 恒久的なリダイレクト</li><li>`302` - 一時的なリダイレクト</li></ul>デフォルトは `0`。 | number | いいえ |
| `asg_enabled` | AWS Auto Scalingグループ](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html)を作成するかどうか。<br><br>デフォルトは、`true` | bool | いいえ |
| `min_size` | 作成するAWS Auto Scalingグループ内のインスタンスの最小数。<br><br>デフォルトは、`1`。| number | いいえ |
| `max_size` | 作成するAWS Auto Scalingグループ内のインスタンスの最大数。<br><br>デフォルトは、`3`。| number | いいえ |
| `desired_capacity` | 作成するAWS Auto Scalingグループ内の初期インスタンス数。`min_size`以上`max_size`以下でなければなりません。<br><br>デフォルトは、`1`。| number | いいえ |
| `autoscaling_enabled` | Wallarmクラスターの[Amazon EC2オートスケーリング](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)を有効にするかどうか。<br><br>デフォルトは、`false`。 | bool | いいえ |
| `autoscaling_cpu_target` | AWSオートスケーリンググループを維持するための平均CPU利用率のパーセンテージ。デフォルトは `70.0`。| string | いいえ |
| `ami_id` | Wallarmインスタンスのデプロイメントに使用する[AmazonマシンイメージのID](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html)。デフォルト（空文字列）の場合、上流からの最新のイメージが使用されます。Wallarmノードに基づいたカスタムAMIを作成することも可能です。| string | いいえ |
| `key_name` | WallarmインスタンスへのSSH接続に使用する[AWSキーペア](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)の名前。デフォルトでは、SSH接続は無効になっています。 | string | いいえ |
| `tags` | Wallarmモジュールが作成するAWSリソースのタグ。 | map(string) | いいえ |## Wallarm Terraform モジュールの例を試す

Wallarm モジュールの異なる使用方法の例を用意しましたので、本番環境にデプロイする前に試してみてください：

* [AWS VPCでのプロキシ](proxy-in-aws-vpc.md)
* [Amazon API Gateway用プロキシ](proxy-for-aws-api-gateway.md)
* [NGINX、Envoyまたは類似のミラーリングを持つOOB](oob-for-web-server-mirroring.md)
* [AWS VPCミラーリング用のOOB](oob-for-aws-vpc-mirroring.md)

## Wallarm と Terraform についての詳細情報

Terraformは、利用者がパブリック[レジストリ](https://www.terraform.io/registry#navigating-the-registry)を通じて利用できる、いくつかの統合 (**プロバイダー**) とすぐに利用できる設定 (**モジュール**) をサポートしています。これらはいくつかのベンダーによって供給されています。

このレジストリに、Wallarmは以下を公開しています：

* Terraformと互換性のある環境からAWSにノードをデプロイするための[Wallarmモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)。本記事で説明されています。
* Terraformを介してWallarmを管理するための[Wallarmプロバイダー](../../../../admin-en/managing/terraform-provider.md)。

これら二つは独立した要素であり、それぞれ異なる目的で使用され、お互いには必要としません。