# Terraformを使用してAWSにWallarmをデプロイする

WallarmはTerraform互換環境から[AWS](https://aws.amazon.com/)へノードをデプロイするための[Terraformモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を提供しています。これらの手順を使用してモジュールを確認し、提供されているデプロイ例をお試しください。

Wallarm Terraformモジュールを実装することで、Wallarmノードの**[in-line](../../../inline/overview.md)（このデプロイ方法ではプロキシ）**デプロイが可能になります。デプロイ方式はWallarmモジュールの変数`preset`で容易に制御できます。

## ユースケース

サポートされている[Wallarmのデプロイオプション](../../../supported-deployment-options.md)の中でも、次のユースケースではTerraformモジュールによるWallarmのデプロイを推奨します。

* 既存のインフラストラクチャがAWS上にある場合。
* Infrastructure as Code（IaC）を実践している場合。WallarmのTerraformモジュールにより、AWS上のWallarmノードを自動で管理・プロビジョニングでき、効率と一貫性が向上します。

## 要件

* Terraform 1.0.5以上が[ローカルにインストール済み](https://learn.hashicorp.com/tutorials/terraform/install-cli)
* USまたはEU[Cloud](../../../../about-wallarm/overview.md#cloud)のWallarm Consoleで**Administrator**[ロール](../../../../user-guides/settings/users.md#user-roles)を持つアカウントへのアクセス
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`へのアクセス。ファイアウォールでブロックされていないことを確認してください
* 攻撃検出ルールや[API仕様](../../../../api-specification-enforcement/overview.md)の更新をダウンロードし、また[許可リスト・拒否リスト・グレーリスト](../../../../user-guides/ip-lists/overview.md)に登録された国・地域・データセンターの正確なIPを取得するため、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"

本トピックには、VPCクラスターなどWallarmのデプロイに必要なすべてのAWSリソースを作成する手順は含まれていません。詳細は、該当する[Terraformガイド](https://learn.hashicorp.com/tutorials/terraform/module-use)を参照してください。

## Wallarm AWS Terraformモジュールの使用方法

AWS Terraformモジュールを使用して本番環境にWallarmをデプロイするには:

1. [US Cloud](https://us1.my.wallarm.com/signup)または[EU Cloud](https://my.wallarm.com/signup)でWallarm Consoleにサインアップします。
1. Wallarm Console → **Nodes**を開き、種類が**Wallarm node**のノードを作成します。

    ![Wallarmノードの作成](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. 生成されたノードトークンをコピーします。
1. Terraform構成に`wallarm`モジュールのコードを追加します。

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
1. `wallarm`モジュール構成の変数値を設定します。

| 変数  | 説明 | 型 | 必須？ |
| --------- | ----------- | --------- | --------- |
| `instance_type` | Wallarmのデプロイに使用する[Amazon EC2インスタンスタイプ](https://aws.amazon.com/ec2/instance-types/)（例：`t3.small`）。 | string | はい
| `vpc_id` | Wallarm EC2インスタンスをデプロイする[Amazon Virtual Private CloudのID](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html)。 | string | はい
| `token` | Wallarm Console UIからコピーした[Wallarmノードトークン](../../../../user-guides/nodes/nodes.md#creating-a-node)。<br><div class="admonition info"> <p class="admonition-title">1つのトークンを複数のインストールで使用する</p> <p>選択した[プラットフォーム](../../../../installation/supported-deployment-options.md)に関係なく、1つのトークンを複数のインストールで使用できます。これにより、Wallarm Console UI内でノードインスタンスを論理的にグループ化できます。例：複数のWallarmノードを開発環境にデプロイし、各ノードが特定の開発者の所有する専用マシン上にある場合。</p></div> | string | はい
| **Wallarm固有の変数** | | | |
| `host` | [Wallarm APIサーバー](../../../../about-wallarm/overview.md#cloud)。設定可能な値：<ul><li>`us1.api.wallarm.com`（US Cloud）</li><li>`api.wallarm.com`（EU Cloud）</li></ul>デフォルトは`api.wallarm.com`です。 | string | いいえ
`upstream` | デプロイする[Wallarmノードのバージョン](../../../../updating-migrating/versioning-policy.md#version-list)。サポートされる最小バージョンは`4.0`です。<br><br>デフォルトは`4.8`です。 | string | いいえ
| `preset` | Wallarmのデプロイスキーム。設定可能：`proxy`（デフォルト）。 | string | いいえ
| `proxy_pass` | プロキシ対象のサーバープロトコルとアドレス。Wallarmノードは指定されたアドレス宛のリクエストを処理し、正当なもののみをプロキシします。プロトコルには'http'または'https'を指定できます。アドレスはドメイン名またはIPアドレス（任意でポート）を指定できます。 | string | はい（`preset`が`proxy`の場合）
| `mode` | [トラフィックフィルタリングモード](../../../../admin-en/configure-wallarm-mode.md)。設定可能：`off`、`monitoring`、`safe_blocking`、`block`。<br><br>デフォルトは`monitoring`です。 | string | いいえ
|`libdetection` | トラフィック解析時に[libdetectionライブラリを使用するか](../../../../admin-en/configure-parameters-en.md#wallarm_enable_libdetection)。<br><br>デフォルトは`true`です。 | bool | いいえ
|`global_snippet` | NGINXのグローバル設定に追加するカスタム設定。設定を記述したファイルをTerraformコードのディレクトリに配置し、この変数にそのパスを指定できます。<br><br>[プロキシの高度なソリューションデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17)に設定例があります。 | string | いいえ
|`http_snippet` | NGINXの`http`設定ブロックに追加するカスタム設定。設定を記述したファイルをTerraformコードのディレクトリに配置し、この変数にそのパスを指定できます。<br><br>[プロキシの高度なソリューションデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18)に設定例があります。 | string | いいえ
|`server_snippet` | NGINXの`server`設定ブロックに追加するカスタム設定。設定を記述したファイルをTerraformコードのディレクトリに配置し、この変数にそのパスを指定できます。<br><br>[プロキシの高度なソリューションデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19)に設定例があります。 | string | いいえ
|`post_script` | [Wallarmノード初期化スクリプト（`cloud-init.py`）](../../cloud-init.md)の実行後に実行するカスタムスクリプト。任意のスクリプトを記述したファイルをTerraformコードのディレクトリに配置し、この変数にそのパスを指定できます。<br><br>[プロキシの高度なソリューションデプロイ例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34)に設定例があります。 | string | いいえ
| **AWSデプロイ構成** | | | |
| `app_name` | Wallarmモジュールが作成するAWSリソース名のプレフィックス。<br><br>デフォルトは`wallarm`です。 | string | いいえ
| `app_name_no_template` | Wallarmモジュールが作成するAWSリソース名に大文字・数字・特殊文字を使用するかどうか。`false`の場合、リソース名は小文字のみになります。<br><br>デフォルトは`false`です。 | bool | いいえ
| `lb_subnet_ids` | Application Load Balancerをデプロイする[VPCサブネットIDのリスト](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)。推奨値は、インターネットゲートウェイへのルートを持つルートテーブルに関連付けられたパブリックサブネットです。 | list(string) | いいえ
| `instance_subnet_ids` | Wallarm EC2インスタンスをデプロイする[VPCサブネットIDのリスト](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)。推奨値は、送信専用接続に構成されたプライベートサブネットです。 | list(string) | いいえ
| `lb_enabled` | AWS Application Load Balancerを作成するかどうか。`custom_target_group`変数でカスタムターゲットグループを指定しない限り、この変数に渡した値に関係なくターゲットグループが作成されます。<br><br>デフォルトは`true`です。 | bool | いいえ
| `lb_internal` | Application Load Balancerを[内部ロードバランサー](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html)にするかどうか。デフォルトではALBはinternet-facingタイプです。非同期アプローチで接続を処理する場合は`true`を推奨します。<br><br>デフォルトは`false`です。 | bool | いいえ
| `lb_deletion_protection` | [誤って削除されることを防ぐための保護](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection)をApplication Load Balancerに対して有効にするかどうか。本番デプロイでは`true`を推奨します。<br><br>デフォルトは`true`です。 | bool | いいえ
| `lb_ssl_enabled` | クライアントとApplication Load Balancer間で[SSL接続をネゴシエートするか](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)。`true`の場合、`lb_ssl_policy`と`lb_certificate_arn`が必須です。本番デプロイで推奨されます。<br><br>デフォルトは`false`です。 | bool | いいえ
| `lb_ssl_policy` | [Application Load Balancerのセキュリティポリシー](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)。 | string | `lb_ssl_enabled`が`true`の場合は必須
| `lb_certificate_arn` | AWS Certificate Manager（ACM）証明書の[Amazon Resource Name（ARN）](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html)。 | string | `lb_ssl_enabled`が`true`の場合は必須
| `custom_target_group` | 作成されるAuto Scaling groupに[アタッチする](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)既存のターゲットグループ名。デフォルトでは新規ターゲットグループが作成されアタッチされます。非デフォルト値の場合、AWS ALBの作成は無効化されます。 | string | いいえ
| `inbound_allowed_ip_ranges` | Wallarmインスタンスへのインバウンド接続を許可する送信元IPおよびネットワークのリスト。トラフィックがパブリックサブネット発であっても、AWSはロードバランサーのトラフィックをマスクする点に留意してください。<br><br>デフォルト：<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | いいえ
| `outbound_allowed_ip_ranges` | Wallarmインスタンスからのアウトバウンド接続を許可する宛先IPおよびネットワークのリスト。<br><br>デフォルト：`"0.0.0.0/0"`。 | list(string) | いいえ
| `extra_ports` | Wallarmインスタンスへのインバウンド接続を許可する内部ネットワークの追加ポートのリスト。セキュリティグループに適用されます。 | list(number) | いいえ
| `extra_public_ports` | Wallarmインスタンスへのインバウンド接続を許可するパブリックネットワークの追加ポートのリスト。| list(number) | いいえ
| `extra_policies` | Wallarmスタックに関連付けるAWS IAMポリシー。Amazon S3からデータを取得するスクリプトを`post_script`変数で実行する場合などに役立ちます。 | list(string) | いいえ
| `source_ranges` | AWS Application Load Balancerからのトラフィックを許可する送信元IPおよびネットワークのリスト。<br><br>デフォルト：`"0.0.0.0/0"`。 | list(string) | いいえ
| `https_redirect_code` | HTTPリクエストをHTTPSへリダイレクトする際のコード。設定可能： <ul><li>`0` - リダイレクト無効</li><li>`301` - 恒久的リダイレクト</li><li>`302` - 一時的リダイレクト</li></ul>デフォルトは`0`です。 | number | いいえ
| `asg_enabled` | [AWS Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html)を作成するかどうか。<br><br>デフォルトは`true`です。 | bool | いいえ
| `min_size` | 作成されるAWS Auto Scaling group内の最小インスタンス数。<br><br>デフォルトは`1`です。| number | いいえ
| `max_size` | 作成されるAWS Auto Scaling group内の最大インスタンス数。<br><br>デフォルトは`3`です。| number | いいえ
| `desired_capacity` | 作成されるAWS Auto Scaling group内の初期インスタンス数。`min_size`以上、`max_size`以下である必要があります。<br><br>デフォルトは`1`です。| number | いいえ
| `autoscaling_enabled` | Wallarmクラスターに[Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)を有効にするかどうか。<br><br>デフォルトは`false`です。 | bool | いいえ
| `autoscaling_cpu_target` | AWS Auto Scaling groupが維持すべき平均CPU使用率（％）。デフォルトは`70.0`です。 | string | いいえ
| `ami_id` | Wallarmインスタンスのデプロイに使用する[Amazon Machine ImageのID](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html)。デフォルト（空文字列）の場合、アップストリームの最新イメージが使用されます。Wallarmノードを基にしたカスタムAMIを作成しても構いません。 | string | いいえ
| `key_name` | SSHでWallarmインスタンスに接続するために使用する[AWSキーペア名](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)。デフォルトではSSH接続は無効です。 | string | いいえ
| `tags` | Wallarmモジュールが作成するAWSリソースに付与するタグ。| map(string) | いいえ

## 例でWallarm Terraformモジュールを試す

本番デプロイ前にWallarmモジュールの使い方を試せる例を用意しています。

* [AWS VPCでのプロキシ](proxy-in-aws-vpc.md)
* [Amazon API Gateway向けプロキシ](proxy-for-aws-api-gateway.md)

## WallarmとTerraformに関する補足情報

Terraformには、多数の統合（provider）と、すぐに使える構成（module）があり、多くのベンダーが公開[レジストリ](https://www.terraform.io/registry#navigating-the-registry)に提供しています。

このレジストリに、Wallarmは以下を公開しています。

* Terraform互換環境からAWSへノードをデプロイするための[Wallarmモジュール](https://registry.terraform.io/modules/wallarm/wallarm/aws/)（本記事で説明）。
* Terraform経由でWallarmを管理するための[Wallarmプロバイダー](../../../../admin-en/managing/terraform-provider.md)。

これら2つは目的が異なる独立した要素であり、相互に依存しません。

## 制限事項
* 現時点では[Credential stuffingの検出](../../../../about-wallarm/credential-stuffing.md)はサポートされていません。