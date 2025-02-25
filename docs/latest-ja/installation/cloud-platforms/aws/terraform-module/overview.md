# Terraformを使用したAWS上でのWallarmの展開

WallarmはTerraform互換環境から[AWS](https://aws.amazon.com/)上にノードを展開するための[Terraform module](https://registry.terraform.io/modules/wallarm/wallarm/aws/)を提供します。これらの手順を使用してモジュールを検証し、提供された展開例をお試しください。

Wallarm Terraform moduleを実装することで、2つの主要なWallarm展開オプション、**[in-line](../../../inline/overview.md)（この展開方法ではproxyです）**および[**Out‑of‑band (mirror)**](../../../oob/overview.md)セキュリティソリューションを実現するソリューションを提供しています。展開オプションは`preset`Wallarmモジュール変数によって容易に制御できます。

## ユースケース

サポートされる[Wallarm展開オプション](../../../supported-deployment-options.md)の中で、Terraform moduleは以下の**ユースケース**におけるWallarm展開に推奨されます:

* 既存のインフラストラクチャがAWS上にある場合
* Infrastructure as Code (IaC)の実践を活用する場合。WallarmのTerraform moduleはAWS上のWallarmノードの自動管理とプロビジョニングを可能にし、効率性と一貫性を向上させます。

## 必要条件

* ローカルにTerraform 1.0.5以上を[インストール](https://learn.hashicorp.com/tutorials/terraform/install-cli)してください
* USまたはEU[Cloud](../../../../about-wallarm/overview.md#cloud)のWallarm Consoleで**Administrator**[role](../../../../user-guides/settings/users.md#user-roles)を持つアカウントへアクセスできること
* US Wallarm Cloudで作業する場合は`https://us1.api.wallarm.com`へ、EU Wallarm Cloudで作業する場合は`https://api.wallarm.com`へアクセスできること。ファイアウォールによってアクセスがブロックされていないかご確認ください
* アタック検知ルールのアップデートと[API仕様](../../../../api-specification-enforcement/overview.md)の取得、ならびに[allowlisted, denylisted, or graylisted](../../../../user-guides/ip-lists/overview.md)国、地域、データセンターの正確なIPを取得するため、以下のIPアドレスにアクセスできること

    --8<-- "../include/wallarm-cloud-ips.md"

このトピックでは、VPCクラスタ等のWallarm展開に必要なすべてのAWSリソースを作成する手順は含まれていません。詳細については、該当する[Terraformガイド](https://learn.hashicorp.com/tutorials/terraform/module-use)を参照してください。

## Wallarm AWS Terraform Moduleの使用方法

AWS Terraform moduleを使用して本番環境向けのWallarmを展開するには、以下の手順を実行してください:

1. [US Cloud](https://us1.my.wallarm.com/signup)または[EU Cloud](https://my.wallarm.com/signup)でWallarm Consoleにサインアップしてください。
1. Wallarm Console → **Nodes**を開き、**Wallarm node**タイプのノードを作成してください。

    ![Creation of a Wallarm node](../../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)
1. 生成されたノードトークンをコピーしてください。
1. Terraform構成に`wallarm`モジュールコードを追加してください:

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
1. `wallarm`モジュール構成で変数の値を設定してください:

| 変数 | 説明 | 型 | 必須か |
| --- | --- | --- | --- |
| `instance_type` | Wallarm展開に使用する[Amazon EC2 instance type](https://aws.amazon.com/ec2/instance-types/)、例:`t3.small`。 | string | Yes |
| `vpc_id` | Wallarm EC2インスタンスを展開する[AWS Virtual Private Cloud](https://docs.aws.amazon.com/managedservices/latest/userguide/find-vpc.html)のID。 | string | Yes |
| `token` | Wallarm Console UIからコピーした[Wallarm node token](../../../../user-guides/nodes/nodes.md#creating-a-node)。<br><div class="admonition info"> <p class="admonition-title">複数のインストールで1つのトークンを使用する場合</p> <p>選択された[platform](../../../../installation/supported-deployment-options.md)に関係なく、複数のインストールで1つのトークンを使用できます。これにより、Wallarm Console UI上でノードの論理的なグループ化が可能となります。例: 複数のWallarmノードを開発環境に展開し、各ノードが特定の開発者所有のマシン上に配置される場合。</p></div> | string | Yes |
| **Wallarm特有の変数** |  |  |  |
| `host` | [Wallarm API server](../../../../about-wallarm/overview.md#cloud)。可能な値:<ul><li>`us1.api.wallarm.com`（US Cloudの場合）</li><li>`api.wallarm.com`（EU Cloudの場合）</li></ul>デフォルトは`api.wallarm.com`です。 | string | No |
| `upstream` | 展開する[Wallarm node version](../../../../updating-migrating/versioning-policy.md#version-list)。最低サポートバージョンは`4.0`です。<br><br>デフォルトは`4.8`です。 | string | No |
| `preset` | Wallarm展開スキーム。可能な値:<ul><li>`proxy`</li><li>`mirror`</li></ul>デフォルトは`proxy`です。 | string | No |
| `proxy_pass` | プロキシ先のサーバのプロトコルとアドレス。Wallarmノードは指定されたアドレスに送信されたリクエストを処理し、正当なリクエストをプロキシします。プロトコルとしては`http`または`https`が指定できます。アドレスはドメイン名またはIPアドレス、オプションのポートを指定できます。 | string | Yes、`preset`が`proxy`の場合 |
| `mode` | [Traffic filtration mode](../../../../admin-en/configure-wallarm-mode.md)。可能な値: `off`,`monitoring`,`safe_blocking`,`block`。<br><br>デフォルトは`monitoring`です。 | string | No |
| `libdetection` | トラフィック分析中に[libdetectionライブラリ](../../../../about-wallarm/protecting-against-attacks.md#library-libdetection)を使用するかどうか。<br><br>デフォルトは`true`です。 | bool | No |
| `global_snippet` | NGINXのグローバル設定に追加するカスタム設定。Terraformコードディレクトリに設定ファイルを配置し、この変数でそのファイルのパスを指定できます。<br><br>変数設定例は[proxy advanced solution展開の例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L17)にあります。 | string | No |
| `http_snippet` | NGINXの`http`設定ブロックに追加するカスタム設定。Terraformコードディレクトリに設定ファイルを配置し、この変数でそのファイルのパスを指定できます。<br><br>変数設定例は[proxy advanced solution展開の例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L18)にあります。 | string | No |
| `server_snippet` | NGINXの`server`設定ブロックに追加するカスタム設定。Terraformコードディレクトリに設定ファイルを配置し、この変数でそのファイルのパスを指定できます。<br><br>変数設定例は[proxy advanced solution展開の例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L19)にあります。 | string | No |
| `post_script` | [Wallarm node初期化スクリプト(`cloud-init.py`)](../../cloud-init.md)実行後に実行するカスタムスクリプト。Terraformコードディレクトリに任意のスクリプトを配置し、この変数でそのファイルのパスを指定できます。<br><br>変数設定例は[proxy advanced solution展開の例](https://github.com/wallarm/terraform-aws-wallarm/tree/main/examples/advanced/main.tf#L34)にあります。 | string | No |
| **AWS展開構成** |  |  |  |
| `app_name` | Wallarm moduleが作成するAWSリソース名のプレフィックス。<br><br>デフォルトは`wallarm`です。 | string | No |
| `app_name_no_template` | Wallarm moduleが作成するAWSリソース名に大文字、数字、特殊文字を使用するかどうか。`false`の場合、リソース名は小文字のみになります。<br><br>デフォルトは`false`です。 | bool | No |
| `lb_subnet_ids` | [Application Load Balancerの展開先となるAWS Virtual Private CloudサブネットID](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)のリスト。推奨値はインターネットゲートウェイへのルートを持つルートテーブルに関連付けられたパブリックサブネットです。 | list(string) | No |
| `instance_subnet_ids` | Wallarm EC2インスタンスを展開する[AWS Virtual Private CloudサブネットID](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html)のリスト。推奨値は出口専用接続用に構成されたプライベートサブネットです。 | list(string) | No |
| `lb_enabled` | AWS Application Load Balancerを作成するかどうか。カスタムtarget groupが`custom_target_group`変数で指定されない限り、この変数に渡された任意の値でターゲットグループが作成されます。<br><br>デフォルトは`true`です。 | bool | No |
| `lb_internal` | Application Load Balancerを[内部ロードバランサ](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-internal-load-balancers.html)にするかどうか。デフォルトではALBはインターネットフェイシングタイプです。非同期の接続処理を使用する場合、推奨値は`true`です。<br><br>デフォルトは`false`です。 | bool | No |
| `lb_deletion_protection` | [Application Load Balancerの誤削除防止のための保護機能](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#deletion-protection)を有効にするかどうか。本番環境での展開には推奨値は`true`です。<br><br>デフォルトは`true`です。 | bool | No |
| `lb_ssl_enabled` | クライアントとApplication Load Balancer間のSSL接続を[交渉](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)するかどうか。`true`の場合、`lb_ssl_policy`と`lb_certificate_arn`変数が必須となります。本番環境の展開に推奨されます。<br><br>デフォルトは`false`です。 | bool | No |
| `lb_ssl_policy` | Application Load Balancerの[セキュリティポリシー](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)。 | string | Yes、`lb_ssl_enabled`が`true`の場合 |
| `lb_certificate_arn` | AWS Certificate Manager (ACM)証明書の[Amazon Resource Name (ARN)](https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html)。 | string | Yes、`lb_ssl_enabled`が`true`の場合 |
| `custom_target_group` | [Auto Scaling groupにアタッチする既存のターゲットグループの名前](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)。デフォルトでは新しいターゲットグループが作成されアタッチされます。非デフォルトの値の場合、AWS ALBの作成は無効となります。 | string | No |
| `inbound_allowed_ip_ranges` | Wallarmインスタンスへの着信接続を許可するソースIPおよびネットワークのリスト。AWSはパブリックサブネットから起動された場合でもロードバランサのトラフィックをマスクする点にご留意ください。<br><br>デフォルト:<ul><li>`"10.0.0.0/8",`</li><li>`"172.16.0.0/12",`</li><li>`"192.168.0.0/16"`</li></ul> | list(string) | No |
| `outbound_allowed_ip_ranges` | Wallarmインスタンスからのアウトバウンド接続を許可するソースIPおよびネットワークのリスト。<br><br>デフォルトは`"0.0.0.0/0"`です。 | list(string) | No |
| `extra_ports` | Wallarmインスタンスへの着信接続を許可する内部ネットワークの追加ポートのリスト。この設定はセキュリティグループに適用されます。 | list(number) | No |
| `extra_public_ports` | Wallarmインスタンスへの着信接続を許可するパブリックネットワークの追加ポートのリスト。 | list(number) | No |
| `extra_policies` | Wallarmスタックに関連付けるAWS IAMポリシー。Amazon S3からデータを要求するスクリプトを実行する`post_script`変数と合わせて使用する際に有用です。 | list(string) | No |
| `source_ranges` | AWS Application Load Balancerへのトラフィックを許可するソースIPおよびネットワークのリスト。<br><br>デフォルトは`"0.0.0.0/0"`です。 | list(string) | No |
| `https_redirect_code` | HTTPリクエストをHTTPSにリダイレクトするためのコード。可能な値: <ul><li>`0` - リダイレクト無効</li><li>`301` - 永続的リダイレクト</li><li>`302` - 一時的リダイレクト</li></ul>デフォルトは`0`です。 | number | No |
| `asg_enabled` | [AWS Auto Scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-groups.html)を作成するかどうか。<br><br>デフォルトは`true`です。 | bool | No |
| `min_size` | 作成されるAWS Auto Scaling groupの最小インスタンス数。<br><br>デフォルトは`1`です。 | number | No |
| `max_size` | 作成されるAWS Auto Scaling groupの最大インスタンス数。<br><br>デフォルトは`3`です。 | number | No |
| `desired_capacity` | 作成されるAWS Auto Scaling groupの初期インスタンス数。`min_size`以上かつ`max_size`以下である必要があります。<br><br>デフォルトは`1`です。 | number | No |
| `autoscaling_enabled` | Wallarmクラスターに対して[Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)を有効にするかどうか。<br><br>デフォルトは`false`です。 | bool | No |
| `autoscaling_cpu_target` | AWS Auto Scaling groupの目標とする平均CPU利用率（%）。デフォルトは`70.0`です。 | string | No |
| `ami_id` | Wallarmインスタンス展開に使用する[Amazon Machine ImageのID](https://docs.aws.amazon.com/managedservices/latest/userguide/find-ami.html)。デフォルト（空文字列）の場合、最新のupstreamイメージが使用されます。Wallarm nodeを基にしたカスタムAMIの作成も可能です。 | string | No |
| `key_name` | WallarmインスタンスへSSH接続するために使用する[AWS key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)の名前。デフォルトではSSH接続は無効です。 | string | No |
| `tags` | Wallarm moduleが作成するAWSリソースのタグ。 | map(string) | No |

## 例によるWallarm Terraform Moduleの試用

Wallarm moduleの使用方法についてさまざまな例を準備しておりますので、本番環境への展開前にお試しください:

* [Proxy in AWS VPC](proxy-in-aws-vpc.md)
* [Proxy for Amazon API Gateway](proxy-for-aws-api-gateway.md)

## WallarmとTerraformに関する追加情報

Terraformは多数の統合（**providers**）や即時利用可能な構成（**modules**）をサポートしており、パブリックな[registry](https://www.terraform.io/registry#navigating-the-registry)を通じて多くのベンダーから提供されています。

このregistryにおいて、Wallarmは以下を公開しました:

* AWS上へのノード展開を可能にする[Wallarm module](https://registry.terraform.io/modules/wallarm/wallarm/aws/)（本記事で説明しております）。
* WallarmをTerraformで管理するための[Wallarm provider](../../../../admin-en/managing/terraform-provider.md)。

これらは、目的が異なる独立した要素であり、互いに依存するものではありません。

## 制限事項
* [Credential stuffing detection](../../../../about-wallarm/credential-stuffing.md)は現在サポートされていません