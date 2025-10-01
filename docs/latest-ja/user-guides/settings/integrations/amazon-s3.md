# Amazon S3

[Amazon S3](https://aws.amazon.com/s3/?nc1=h_ls)は、Amazon Web Services(AWS)が提供するスケーラブルなクラウドストレージサービスで、正式名称はAmazon Simple Storage Serviceです。データバックアップ、データアーカイブ、コンテンツ配信、ウェブサイトホスティング、アプリケーションデータの保存など、さまざまな用途に利用されます。Wallarmを設定して、検出されたhitsに関する情報を含むファイルをAmazon S3バケットに送信できます。情報は10分ごとにJSON形式のファイルで送信されます。

各hitのデータ項目:

* `time` - hit検出日時(Unixタイムスタンプ形式)
* `request_id`
* `ip` - 攻撃者のIP
* hitの発生元タイプ: `datacenter`、`tor`、`remote_country`
* `application_id`
* `domain`
* `method`
* `uri`
* `protocol`
* `status_code`
* `attack_type`
* `block_status`
* `payload` 
* `point`
* `tags`

ファイルは、命名規則`wallarm_hits_{timestamp}.json`または`wallarm_hits_{timestamp}.jsonl`に従ってS3バケットに保存されます。形式はJSON ArrayまたはNew Line Delimited JSON(NDJSON)のいずれかで、インテグレーション設定時の選択に依存します。

## インテグレーションの設定

Amazon S3とのインテグレーションを設定する際は、使用する認証方法を選択します:

* **ロールARN経由(推奨)** - リソースへのアクセスを付与する際にexternal IDオプション付きのロールを使用する方法は、セキュリティを高め「confused deputy」攻撃を防ぐ方法としてAWSが[推奨](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html?icmpid=docs_iam_console)しています。Wallarmは組織のアカウント専用の一意なIDを提供します。
* **シークレットアクセスキー経由** - より一般的で簡単な方法で、AWS IAMユーザーの共有[アクセスキー](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)を必要とします。この方法を選ぶ場合、インテグレーションで使用するS3バケットへの書き込み権限のみを持つ専用のIAMユーザーのアクセスキーを使用することを推奨します。

Amazon S3インテグレーションを設定するには:

1. [手順](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html)に従って、Wallarm用のAmazon S3バケットを作成します。
1. 選択した認証方法に応じて異なる手順を実行します。

    === "ロールARN"

        1. AWS UIで、S3 → 対象のバケット → **Properties**タブに移動し、バケットの**AWS Region**のコードと**Amazon Resource Name (ARN)**をコピーします。

            例えば、リージョンは`us-west-1`、ARNは`arn:aws:s3:::test-bucket-json`です。

        1. Wallarm Console UIで、**Integrations**セクションを開きます。
        1. **AWS S3**ブロックをクリックするか、**Add integration**ボタンをクリックして**AWS S3**を選択します。
        1. インテグレーション名を入力します。
        1. 先ほどコピーしたS3バケットのAWSリージョンコードを入力します。
        1. S3バケット名を入力します。
        1. 表示されたWallarmアカウントIDをコピーします。
        1. 表示されたexternal IDをコピーします。
        1. AWS UIで、IAM → **Access Management** → **Roles**から[新しいロール](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)の作成を開始します。
        1. 信頼されるエンティティタイプとして**AWS account** → **Another AWS Account**を選択します。
        1. Wallarmの**Account ID**を貼り付けます。
        1. **Require external ID**を選択し、Wallarmが提供するexternal IDを貼り付けます。
        1. **Next**をクリックし、ロール用のポリシーを作成します:

            ```json
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "VisualEditor0",
                        "Effect": "Allow",
                        "Action": "s3:PutObject",
                        "Resource": "<YOUR_S3_BUCKET_ARN>/*"
                    }
                ]
            }
            ```
        1. ロールの作成を完了し、そのARNをコピーします。
        1. Wallarm Console UIのインテグレーション作成ダイアログの**Role ARN**タブで、ロールのARNを貼り付けます。

            ![Amazon S3インテグレーション](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "シークレットアクセスキー"

        1. AWS UIで、S3 → 対象のバケット → **Properties**タブに移動し、バケットの**AWS Region**のコードをコピーします。例えば`us-west-1`です。
        1. IAM → **Dashboard** → **Manage access keys** → **Access keys**セクションに進みます。
        1. 保管しているアクセスキーIDを取得するか、[こちら](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/)の説明に従って新規作成または紛失したキーの復元を行います。いずれの場合も、有効なキーとそのIDが必要です。
        1. Wallarm Console UIで、**Integrations**セクションを開きます。
        1. **AWS S3**ブロックをクリックするか、**Add integration**ボタンをクリックして**AWS S3**を選択します。
        1. インテグレーション名を入力します。
        1. 先ほどコピーしたS3バケットのAWSリージョンコードを入力します。
        1. S3バケット名を入力します。
        1. **Secret access key**タブで、アクセスキーIDとキー本体を入力します。

1. Wallarmデータの形式を選択します。JSON ArrayまたはNew Line Delimited JSON(NDJSON)のいずれかです。
1. **Regular notifications**セクションで、直近10分のhitsを送信対象として選択していることを確認します。選択していない場合、データはS3バケットに送信されません。
1. **Test integration**をクリックして、設定の正しさ、Wallarm Cloudの到達性、および通知フォーマットを確認します。

    Amazon S3では、インテグレーションテストによりデータを含むJSONファイルがバケットに送信されます。以下は、直近10分に検出されたhitsのデータを含むJSONファイルの例です。

    === "JSON配列"
        ```json
        [
        {
            "time":"1687241470",
            "request_id":"d2a900a6efac7a7c893a00903205071a",
            "ip":"127.0.0.1",
            "datacenter":"unknown",
            "tor":"none",
            "remote_country":null,
            "application_id":[
                -1
            ],
            "domain":"localhost",
            "method":"GET",
            "uri":"/etc/passwd",
            "protocol":"none",
            "status_code":499,
            "attack_type":"ptrav",
            "block_status":"monitored",
            "payload":[
                "/etc/passwd"
            ],
            "point":[
                "uri"
            ],
            "tags":{
                "lom_id":7,
                "libproton_version":"4.4.11",
                "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
                "wallarm_mode":"monitoring",
                "final_wallarm_mode":"monitoring"
            }
        },
        {
            "time":"1687241475",
            "request_id":"b457fccec9c66cdb07eab7228b34eca6",
            "ip":"127.0.0.1",
            "datacenter":"unknown",
            "tor":"none",
            "remote_country":null,
            "application_id":[
                -1
            ],
            "domain":"localhost",
            "method":"GET",
            "uri":"/etc/passwd",
            "protocol":"none",
            "status_code":499,
            "attack_type":"ptrav",
            "block_status":"monitored",
            "payload":[
                "/etc/passwd"
            ],
            "point":[
                "uri"
            ],
            "tags":{
                "lom_id":7,
                "libproton_version":"4.4.11",
                "brute_counter":"c188cd2baa2cefb3f3688cb4008a649e",
                "wallarm_mode":"monitoring",
                "final_wallarm_mode":"monitoring"
            }
        }
        ]
        ```
    === "改行区切りJSON(NDJSON)"
        ```json
        {"time":"1687241470","request_id":"d2a900a6efac7a7c893a00903205071a","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        {"time":"1687241475","request_id":"b457fccec9c66cdb07eab7228b34eca6","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        ```
1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

保存データ量を制御するため、[こちら](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)に記載のとおり、Amazon S3バケット内の古いオブジェクトの自動削除を設定することを推奨します。

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可およびインテグレーションパラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"