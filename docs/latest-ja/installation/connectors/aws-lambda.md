[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md
[helm-chart-native-node]:           ../native-node/helm-chart.md
[custom-blocking-page]:             ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:                    ../../user-guides/rules/rate-limiting.md
[multi-tenancy]:                    ../multi-tenant/overview.md

# Amazon CloudFront向けWallarmコネクタ

[CloudFront](https://aws.amazon.com/cloudfront/)はAmazon Web Servicesが運用するコンテンツ配信ネットワークです。Wallarmはコネクタとして動作し、CloudFront経由で配信されるトラフィックを保護および監視できます。

CloudFront向けコネクタとしてWallarmを使用するには、Wallarmノードを外部にデプロイし、Wallarm提供のLambda@Edge関数を実行して、分析のためにトラフィックをWallarmノードへルーティングする必要があります。

CloudFrontコネクタは、[インライン](../inline/overview.md)および[アウトオブバンド](../oob/overview.md)の両方のトラフィック解析をサポートします:

=== "インラインのトラフィックフロー"

    Wallarmが悪意のあるアクティビティをブロックするように設定されている場合:

    ![WallarmとCloudFront - インライン構成](../../images/waf-installation/gateways/cloudfront/traffic-flow-inline.png)
=== "アウトオブバンドのトラフィックフロー"
    ![WallarmとCloudFront - アウトオブバンド構成](../../images/waf-installation/gateways/cloudfront/traffic-flow-oob.png)

!!! info "セキュリティに関する注意"
    提示のソリューションは最小権限の原則に従って設計されています。関数はCloudFrontおよびWallarmノードで動作するのに必要最小限の権限のみをリクエストし、デフォルトで安全なデプロイを実現します。

## ユースケース

サポートされている[Wallarmのデプロイオプション](../supported-deployment-options.md)の中でも、Amazon CloudFront経由でトラフィックを配信する場合に本ソリューションの利用を推奨します。

## 制限事項

* Lambda@Edge関数レベルの制約:

    * HTTPステータスコード4xxのviewer responseではLambda@Edge関数はトリガーされません。
    * Lambda@Edgeはorigin responseおよびviewer responseイベントのいずれでもレスポンスボディへのアクセスを許可しないため、レスポンス内容に基づく処理は実行できません。
    * ボディサイズはviewer requestで40KB、origin requestで1MBに制限されます。
    * Wallarmノードからの最大応答時間はviewer requestで5秒、origin requestで30秒です。
    * Lambda@Edgeはプライベートネットワーク(VPC)をサポートしません。
    * 同時リクエストのデフォルト上限はリージョンあたり1,000ですが、数万まで引き上げることができます。
    * WallarmのLambda@Edge関数はoriginレベルで動作するため、CDNキャッシュで処理されるリクエストは監視しません。そのため、そのようなリクエストに含まれる潜在的な攻撃は検出されません。
* 機能上の制約:
    * [Helmチャート][helm-chart-native-node]を使用して`LoadBalancer`タイプでWallarmサービスをデプロイする場合、ノードインスタンスのドメインには信頼されたSSL/TLS証明書が必要です。自己署名証明書はまだサポートしていません。
    * [カスタムブロックページとブロックコード][custom-blocking-page]の設定はまだサポートしていません。
    * [パッシブ検知](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)に基づく脆弱性検知および[API DiscoveryにおけるAPIのレスポンス構造](../../api-discovery/exploring.md#endpoint-details)は、Lambda@Edgeのレスポンストリガー制限により制約されます。Wallarmの関数はレスポンスボディを受け取って依存することができないため、これらの機能は利用できません。
    * Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートしていません。
    * [マルチテナンシー](../multi-tenant/overview.md)はまだサポートしていません。

## 前提条件

デプロイを進める前に、以下の要件を満たしていることを確認してください。

* AWS CloudFrontおよびLambdaの技術に関する理解があること。
* CloudFront CDNを経由するAPIまたはトラフィックがあること。

## デプロイ

<a id="1-deploy-a-wallarm-node"></a>
### 1. Wallarmノードをデプロイする

WallarmノードはWallarmプラットフォームの中核コンポーネントで、受信トラフィックを検査し、不正なアクティビティを検出し、脅威を緩和するように設定できます。

必要な管理レベルに応じて、Wallarmがホストするノードとして、またはお客様のインフラストラクチャ内に自己ホストでデプロイできます。

=== "エッジノード"
    コネクタ用のWallarmホスト型ノードをデプロイするには、[手順](../security-edge/se-connector.md)に従ってください。
=== "自己ホストノード"
    自己ホストノードのデプロイに使用するアーティファクトを選択し、各手順に従ってください:

    * ベアメタルまたはVM上のLinuxインフラ向けの[All-in-oneインストーラー](../native-node/all-in-one.md)
    * コンテナ化デプロイを使用する環境向けの[Dockerイメージ](../native-node/docker-image.md)
    * AWSインフラ向けの[AWS AMI](../native-node/aws-ami.md)
    * Kubernetesを利用するインフラ向けの[Helmチャート](../native-node/helm-chart.md)

<a id="2-obtain-and-deploy-the-wallarm-lambdaedge-functions"></a>
### 2. WallarmのLambda@Edge関数を取得してデプロイする

CloudFront CDNをWallarmノードに接続するには、AWS上にWallarmのLambda@Edge関数をデプロイする必要があります。

Pythonベースの関数が2つあります: リクエストの転送と解析を行う関数と、レスポンスの転送と解析を行う関数です。

=== "手動でのダウンロードとデプロイ"
    1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に進み、プラットフォーム用のコードバンドルをダウンロードします。

        自己ホストノードを使用している場合は、コードバンドルの入手についてsales@wallarm.comにお問い合わせください。
    1. AWS Console → **Services** → **Lambda** → **Functions**に進みます。
    1. Lambda@Edge関数に[必要なリージョン](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function)である`us-east-1`(N. Virginia)を選択します。
    1. **Create function**で次の設定を行います:

        * Runtime: Python 3.x。
        * Execution role: **Create a new role from AWS policy templates** → **Basic Lambda@Edge permissions (for CloudFront trigger)**。
        * その他の設定はデフォルトのままで問題ありません。
    1. 関数が作成されたら、**Code**タブでWallarmのリクエスト処理コードを貼り付けます。
    1. コード内の次のパラメータを更新します:

        * `wlrm_node_addr`: お使いのWallarmノードのURL。
        * `wlrm_inline`: [非同期(アウトオブバンド)](../oob/overview.md)モードを使用する場合は`False`に設定します。
        * 必要に応じて他のパラメータも調整します。
    1. **Actions** → **Deploy to Lambda@Edge**に進み、次を指定します:

        * Configure new CloudFront trigger。
        * Distribution: 保護したいオリジンへトラフィックをルーティングするCDNを選択します。
        * Cache behavior: Lambda関数に適用するキャッシュビヘイビア。通常は`*`です。
        * CloudFront event: 
            
            * **Origin request**: CloudFront CDNがバックエンドへデータを要求するときのみ関数を実行します。CDNがキャッシュレスポンスを返す場合は実行されません。
            * **Viewer request**: CloudFront CDNへのすべてのリクエストに対して関数を実行します。
        * **Include body**にチェックを入れます。
        * **Confirm deploy to Lambda@Edge**にチェックを入れます。

        ![CloudFront関数のデプロイ](../../images/waf-installation/gateways/cloudfront/function-deploy.png)
    1. レスポンス用のWallarm提供関数についても同様の手順を繰り返し、トリガーとしてレスポンスを選択します。

        レスポンストリガーがリクエストトリガーと一致していることを確認してください(Origin requestにはorigin response、Viewer requestにはviewer response)。
=== "AWS SARから関数をデプロイする"
    両方の関数はAWS Serverless Application Repository(SAR)から直接デプロイできます。関数は、Lambda@Edge関数に[必要なリージョン](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function)である`us-east-1`(N. Virginia)にデプロイされます。

    1. [Wallarm policies on AWS Serverless Application Repository](https://serverlessrepo.aws.amazon.com/applications/us-east-1/381492110259/wallarm-connector) → **Deploy**に進みます。
    1. デプロイ設定はデフォルトのままとします。
    1. デプロイ完了後、作成されたIAMロール → **Trust relationships**に進み、以下のポリシーで両方のロール(リクエスト用とレスポンス用)を更新します:

        ```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": [
                            "edgelambda.amazonaws.com",
                            "lambda.amazonaws.com"
                        ]
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }
        ```

    1. AWS Console → **Services** → **Lambda** → **Functions**に進みます。
    1. `serverlessrepo-wallarm-connector-RequestHandler-xxx`関数を開きます。
    1. **Code**タブで次のパラメータを更新します:

        * `wlrm_node_addr`: お使いの[Wallarmノードインスタンス](#1-deploy-a-wallarm-node)のアドレス。
        * `wlrm_inline`: [アウトオブバンド](../oob/overview.md)モードを使用する場合は`False`に設定します。
        * 必要に応じて他のパラメータも調整します。
    1. **Actions** → **Deploy to Lambda@Edge**に進み、次を指定します:

        * Configure new CloudFront trigger。
        * Distribution: 保護したいオリジンへトラフィックをルーティングするCDNを選択します。
        * Cache behavior: Lambda関数に適用するキャッシュビヘイビア。通常は`*`です。
        * CloudFront event: 
            
            * **Origin request**: CloudFront CDNがバックエンドへデータを要求するときのみ関数を実行します。CDNがキャッシュレスポンスを返す場合は実行されません。
            * **Viewer request**: CloudFront CDNへのすべてのリクエストに対して関数を実行します。
        * **Include body**にチェックを入れます。
        * **Confirm deploy to Lambda@Edge**にチェックを入れます。

        ![CloudFront関数のデプロイ](../../images/waf-installation/gateways/cloudfront/function-deploy.png)
    1. AWS Console → **Services** → **Lambda** → **Functions**に戻ります。
    1. `serverlessrepo-wallarm-connector-ResponseHandler-xxx`関数を開きます。
    1. レスポンスをトリガーに選択して、同様の手順を繰り返します。

        レスポンストリガーがリクエストトリガーと一致していることを確認してください(Origin requestにはorigin response、Viewer requestにはviewer response)。

## テスト

デプロイ済み関数の動作をテストするには、次の手順に従います:

1. CloudFront CDNにテスト用の[Path Traversal][ptrav-attack-docs]攻撃リクエストを送信します:

    ```
    curl http://<CLOUDFRONT_CDN>/etc/passwd
    ```
1. Wallarm Console → **Attacks**セクションを[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃が一覧に表示されていることを確認します。
    
    ![インターフェースのAttacks][attacks-in-ui-image]

    Wallarmノードのモードが[blocking](../../admin-en/configure-wallarm-mode.md)に設定され、トラフィックがインラインで流れている場合は、リクエストもブロックされます。

## Lambda@Edge関数のアップグレード

デプロイ済みのLambda@Edge関数を[新しいバージョン](code-bundle-inventory.md#cloudfront)にアップグレードするには:

=== "手動でのダウンロードとデプロイ"
    1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に進み、更新版のWallarm Lambda@Edge関数をダウンロードします。

        自己ホストノードを使用している場合は、更新されたコードバンドルの入手についてsales@wallarm.comにお問い合わせください。
    1. デプロイ済みのLambda@Edge関数のコードを、更新版のバンドルに置き換えます。

        `wlrm_node_addr`、`wlrm_inline`などの既存のパラメータ値は保持します。

        既存の関数トリガーは変更しません。
    1. **Deploy**を実行して更新済み関数を反映します。
=== "AWS SARから関数をデプロイする"
    1. 新しいバージョンの関数を用いて、[2番目の手順](#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)で記載した手順を繰り返します。
    1. 更新版の関数をディストリビューションに関連付けた後、競合を避けるためにCloudFrontのトリガーから以前のバージョンの関数を削除します。

関数のアップグレードでは、特にメジャーバージョンアップの場合、Wallarmノードのアップグレードが必要になることがあります。自己ホストノードのリリースノートおよびアップグレード手順については[Native Nodeの変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)を、エッジコネクタのアップグレード手順については[Edge connectorのアップグレード手順](../security-edge/se-connector.md#upgrading-the-edge-node)を参照してください。非推奨を避け、将来のアップグレードを容易にするため、ノードの定期的な更新を推奨します。