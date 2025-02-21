```markdown
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:             ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:           ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[api-token]:                        ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Amazon CloudFront用Wallarmコネクタ

[CloudFront](https://aws.amazon.com/cloudfront/)はAmazon Web Servicesが運営するコンテンツデリバリーネットワークです。WallarmはCloudFront経由で配信されるトラフィックを保護・監視するためのコネクタとして機能します。

CloudFront用コネクタとしてWallarmを使用するには、**Wallarmノードを外部にデプロイ**し、**Wallarm提供のLambda@Edge関数を実行**してトラフィックを分析のためにWallarmノードにルーティングする必要があります。

CloudFrontコネクタは[インライン](../inline/overview.md)と[アウトオブバンド](../oob/overview.md)の両方のトラフィック分析をサポートします:

=== "インライントラフィックフロー"

    Wallarmが悪意あるアクティビティをブロックするように設定されている場合:

    ![Cloudfront with Wallarm - in-line scheme](../../images/waf-installation/gateways/cloudfront/traffic-flow-inline.png)
=== "アウトオブバンドトラフィックフロー"
    ![Cloudfront with Wallarm - out-of-band scheme](../../images/waf-installation/gateways/cloudfront/traffic-flow-oob.png)

## ユースケース

サポートされている[Wallarmの展開オプション](../supported-deployment-options.md)の中で、Amazon CloudFront経由でトラフィックを配信する場合に、このソリューションが推奨されます.

## 制限事項

* Lambda@Edge関数レベルの制限:
    * Lambda@Edge関数はHTTPステータスコード4xxのビューワレスポンスではトリガーされません.
    * Lambda@Edgeではオリジンレスポンスおよびビューワレスポンスイベントの両方でレスポンスボディへのアクセスが許可されておらず、レスポンスの内容に基づくアクションの実行が制限されます.
    * ビューワリクエストではボディサイズが40KB、オリジンリクエストでは1MBに制限されます.
    * Wallarmノードからの最大レスポンスタイムは、ビューワリクエストの場合は5秒、オリジンリクエストの場合は30秒です.
    * Lambda@Edgeはプライベートネットワーク（VPC）をサポートしていません.
    * 同時リクエストのデフォルト制限はリージョンあたり1,000ですが、数万まで増加可能です.
    * Wallarm Lambda@Edge関数はオリジンレベルで動作するため、CDNキャッシュで処理されるリクエストは監視されません。その結果、該当するリクエストにおける攻撃が検出されない可能性があります.

* 機能の制限:
    * Lambda@Edgeのレスポンストリガー制限により、[パッシブ検知](../../about-wallarm/detecting-vulnerabilities.md#passive-detection)に基づく脆弱性検出およびAPI DiscoveryにおけるAPI[レスポンス構造](../../api-discovery/exploring.md#endpoint-details)は制限されます。Wallarm関数はレスポンスボディを受け取れず、依存することができないため、これらの機能は利用できません.
    * Wallarmルールによる[レート制限](../../user-guides/rules/rate-limiting.md)はサポートされていません.
    * [マルチテナンシー](../multi-tenant/overview.md)はまだサポートされていません.

## 要件

デプロイを進めるため、以下の要件を満たしていることを確認してください:

* AWSCloudFront及びLambdaテクノロジーの理解.
* CloudFront CDNを経由して実行されるAPIまたはトラフィック.

## デプロイ

### 1. Wallarmノードのデプロイ

Wallarmノードはデプロイが必要なWallarmプラットフォームの中核コンポーネントです。受信トラフィックを検査し、悪意ある活動を検出し、脅威の緩和を構成することができます.

必要な制御レベルに応じて、Wallarmがホストする場合または自社インフラでデプロイする場合のいずれかが選べます.

=== "エッジノード"
    コネクタ用のWallarmホスト型ノードをデプロイするには、[手順](../se-connector.md)に従ってください.
=== "セルフホスト型ノード"
    セルフホスト型ノードのデプロイ用アーティファクトを選択し、添付の指示に従ってください:

    * ベアメタルまたはVM上のLinuxインフラ向け[オールインワンインストーラー](../native-node/all-in-one.md)
    * コンテナ化されたデプロイを使用する環境向け[Dockerイメージ](../native-node/docker-image.md)
    * Kubernetesを利用するインフラ向け[Helmチャート](../native-node/helm-chart.md)

### 2. Wallarm Lambda@Edge関数の入手とデプロイ

CloudFront CDNとWallarmノードを接続するには、AWS上にWallarm Lambda@Edge関数をデプロイする必要があります.

Pythonベースの関数が2種類あり、1つはリクエストの転送と分析用、もう1つはレスポンスの転送と分析用です.

=== "手動ダウンロードとデプロイ"
    1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に進み、プラットフォーム用のコードバンドルをダウンロードしてください.

        セルフホスト型ノードを実行している場合は、sales@wallarm.comに連絡してコードバンドルを取得してください.
    1. AWS Console → **Services** → **Lambda** → **Functions**に進んでください.
    1. Lambda@Edge関数に[必要な](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function) `us-east-1`（N.Virginia）リージョンを選択してください.
    1. **Create function**を以下の設定で実行してください:

        * Runtime: Python 3.x.
        * Execution role: **Create a new role from AWS policy templates** → **Basic Lambda@Edge permissions (for CloudFront trigger)**.
        * その他の設定はデフォルトのままで構いません.
    1. 関数が作成されたら、**Code**タブでWallarmのリクエスト処理コードを貼り付けてください.
    1. コード内の以下のパラメータを更新してください:

        * `wlrm_node_addr`: ご利用の[Wallarmノードインスタンス](#1-deploy-a-wallarm-node)のアドレス.
        * `wlrm_inline`: [アウトオブバンド](../oob/overview.md)モードを使用する場合は`False`に設定してください.
        * 必要に応じて、その他のパラメータを修正してください.
    1. **Actions** → **Deploy to Lambda@Edge**に進み、以下の設定を指定してください:

        * 新規CloudFrontトリガーを設定してください.
        * Distribution: 保護対象のオリジンにトラフィックをルーティングするCDNを指定してください.
        * Cache behavior: Lambda関数のキャッシュビヘイビア（通常は`*`）を指定してください.
        * CloudFront event: 
            
            * **Origin request**: CloudFront CDNがバックエンドからデータをリクエストする場合にのみ関数が実行されます。CDNがキャッシュされたレスポンスを返す場合、関数は実行されません.
            * **Viewer request**: CloudFront CDNへのすべてのリクエストに対して関数が実行されます.
        * **Include body**にチェックを入れてください.
        * **Confirm deploy to Lambda@Edge**にチェックを入れてください.

        ![Cloudfront function deployment](../../images/waf-installation/gateways/cloudfront/function-deploy.png)
    1. Wallarm提供のレスポンス関数についても、レスポンスをトリガーとして選択し、同様の手順を繰り返してください.

        レスポンスのトリガーがリクエストのトリガー（オリジンリクエストの場合はオリジンレスポンス、ビューワリクエストの場合はビューワレスポンス）と一致していることを確認してください.
=== "AWS SARからの関数デプロイ"
    AWS Serverless Application Repository (SAR)から直接両方の関数をデプロイすることができます。関数は[Lambda@Edge関数に必要な](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html#lambda-edge-how-it-works-tutorial-create-function)`us-east-1`（N.Virginia）リージョンにデプロイされます.

    1. [Wallarm policies on AWS Serverless Application Repository](https://serverlessrepo.aws.amazon.com/applications/us-east-1/381492110259/wallarm-connector)にアクセスし、**Deploy**をクリックしてください.
    1. デプロイ設定はデフォルトのままとしてください.
    1. デプロイ完了後、作成されたIAMロールの**Trust relationships**に移動し、リクエスト用とレスポンス用の両ロールを以下のポリシーで更新してください:

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

    1. AWS Console → **Services** → **Lambda** → **Functions**に進んでください.
    1. `serverlessrepo-wallarm-connector-RequestHandler-xxx`関数を開いてください.
    1. **Code**タブで以下のパラメータを更新してください:

        * `wlrm_node_addr`: ご利用の[Wallarmノードインスタンス](#1-deploy-a-wallarm-node)のアドレス.
        * `wlrm_inline`: [アウトオブバンド](../oob/overview.md)モードを使用する場合は`False`に設定してください.
        * 必要に応じて、その他のパラメータを修正してください.
    1. **Actions** → **Deploy to Lambda@Edge**に進み、以下の設定を指定してください:

        * 新規CloudFrontトリガーを設定してください.
        * Distribution: 保護対象のオリジンにトラフィックをルーティングするCDNを指定してください.
        * Cache behavior: Lambda関数のキャッシュビヘイビア（通常は`*`）を指定してください.
        * CloudFront event: 
            
            * **Origin request**: CloudFront CDNがバックエンドからデータをリクエストする場合にのみ関数が実行されます。CDNがキャッシュされたレスポンスを返す場合、関数は実行されません.
            * **Viewer request**: CloudFront CDNへのすべてのリクエストに対して関数が実行されます.
        * **Include body**にチェックを入れてください.
        * **Confirm deploy to Lambda@Edge**にチェックを入れてください.

        ![Cloudfront function deployment](../../images/waf-installation/gateways/cloudfront/function-deploy.png)
    1. AWS Console → **Services** → **Lambda** → **Functions**に戻ってください.
    1. `serverlessrepo-wallarm-connector-ResponseHandler-xxx`関数を開いてください.
    1. レスポンスをトリガーとして選択し、Wallarm提供のレスポンス関数についても同様の手順を繰り返してください.

        レスポンスのトリガーがリクエストのトリガー（オリジンリクエストの場合はオリジンレスポンス、ビューワリクエストの場合はビューワレスポンス）と一致していることを確認してください.

## テスト

デプロイされた関数の機能をテストするには、以下の手順に従ってください:

1. テスト用の[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストをCloudFront CDNに送信してください:

    ```
    curl http://<CLOUDFRONT_CDN>/etc/passwd
    ```
1. Wallarm Consoleの[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**セクションを開き、攻撃がリストに表示されていることを確認してください.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Wallarmノードモードが[blocking](../../admin-en/configure-wallarm-mode.md)に設定され、トラフィックがインラインで流れている場合、リクエストはブロックされます.

## Lambda@Edge関数のアップグレード

デプロイされたLambda@Edge関数を[新しいバージョン](code-bundle-inventory.md#cloudfront)にアップグレードするには:

=== "手動ダウンロードとデプロイ"
    1. Wallarm Console → **Security Edge** → **Connectors** → **Download code bundle**に進み、更新されたWallarm Lambda@Edge関数のコードバンドルをダウンロードしてください.

        セルフホスト型ノードを実行している場合は、sales@wallarm.comに連絡して更新されたコードバンドルを取得してください.
    1. デプロイ済みのLambda@Edge関数内のコードを、更新されたバンドルに置き換えてください.

        既存の`wlrm_node_addr`、`wlrm_inline`などのパラメータの値はそのまま保持してください.

        既存の関数トリガーは変更せずにそのままにしてください.
    1. 更新した関数を**Deploy**してください.
=== "AWS SARからの関数デプロイ"
    1. 新しいバージョンの関数を使用して、[2. Wallarm Lambda@Edge関数の入手とデプロイ](#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)に記載された手順を繰り返してください.
    1. 更新された関数をディストリビューションにリンクした後、競合を避けるためにCloudFrontトリガーから以前のバージョンの関数を削除してください.

関数のアップグレードには、特にメジャーバージョンの更新の場合、Wallarmノードのアップグレードが必要となる場合があります。リリースの更新およびアップグレード手順については、[Wallarm Native Node変更履歴](../../updating-migrating/native-node/node-artifact-versions.md)を参照してください。非推奨を避け、将来のアップグレードを容易にするために、定期的なノード更新を推奨します.
```