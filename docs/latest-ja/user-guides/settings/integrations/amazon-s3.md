# Amazon S3

[Amazon S3](https://aws.amazon.com/s3/?nc1=h_ls)またはAmazon Simple Storage Serviceは、Amazon Web Services(AWS)によって提供されるスケーラブルなクラウドストレージサービスです。バックアップ、アーカイブ、コンテンツ配信、ウェブサイトホスティング、アプリケーションデータの保存など、さまざまな目的に使用されます。Wallarmを設定して、検出されたhitsの情報を含むファイルをAmazon S3バケットに送信することができます。情報はJSON形式のファイルで10分ごとに送信されます。

各hitのデータフィールド:

* `time` - hit検出の日時（Unix Timestamp形式）
* `request_id`
* `ip` - 攻撃者のIP
* Hitソースタイプ: `datacenter`、`tor`、`remote_country`
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

ファイルは、`wallarm_hits_{timestamp}.json`または`wallarm_hits_{timestamp}.jsonl`という命名規則でS3バケットに保存されます。形式は、統合設定時の選択により、JSON ArrayまたはNew Line Delimited JSON(NDJSON)のいずれかになります。

## 統合のセットアップ

Amazon S3との統合を設定する際は、どの認証方法を使用するかを決定する必要があります:

* **Role ARNによる方法(推奨)** - external IDオプション付きのロールを使用してリソースへのアクセスを許可する方法は、セキュリティを向上させ「confused deputy」攻撃を防止する方法としてAWSにより[推奨](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html?icmpid=docs_iam_console)されています。Wallarmは組織アカウント固有のIDを提供します。
* **Secret access keyによる方法** - より一般的で簡単な方法で、AWS IAMユーザーの共有[access key](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)を使用します。この方法を選択する場合は、統合で使用するS3バケットへの書き込み権限のみを持つ別のIAMユーザーのaccess keyを使用することを推奨します。

Amazon S3統合の設定手順:

1. Wallarm用のAmazon S3バケットを作成します。作成手順については[こちら](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html)をご参照ください。
1. 選択した認証方法に応じて、以下のステップを実行します。

    === "Role ARN"

        1. AWS UIにて、S3 → 対象バケット → **Properties**タブに移動し、バケットの**AWS Region**と**Amazon Resource Name(ARN)**のコードをコピーします。

            例として、リージョンが`us-west-1`、ARNが`arn:aws:s3:::test-bucket-json`の場合です。

        1. Wallarm Console UIにて、**Integrations**セクションを開きます。
        1. **AWS S3**ブロックをクリックするか、**Add integration**ボタンをクリックして**AWS S3**を選択します。
        1. 統合名を入力します。
        1. 先にコピーしたS3バケットのAWSリージョンコードを入力します。
        1. S3バケット名を入力します。
        1. 提供されたWallarmアカウントIDをコピーします。
        1. 提供されたexternal IDをコピーします。
        1. AWS UIにて、IAM → **Access Management** → **Roles**から[新しいロール](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)の作成を開始します。
        1. 信頼エンティティタイプとして**AWS account** → **Another AWS Account**を選択します。
        1. Wallarmの**Account ID**を貼り付けます。
        1. **Require external ID**を選択し、Wallarmから提供されたexternal IDを貼り付けます。
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
        1. ロールの作成を完了し、ロールのARNをコピーします。
        1. Wallarm Console UIに戻り、統合作成ダイアログの**Role ARN**タブに、コピーしたロールのARNを貼り付けます。

            ![Amazon S3統合](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "Secret access key"

        1. AWS UIにて、S3 → 対象バケット → **Properties**タブに移動し、バケットの**AWS Region**コード（例: `us-west-1`）をコピーします。
        1. IAM → Dashboard → **Manage access keys** → **Access keys**セクションに移動します。
        1. 保管してあるaccess keyのIDを取得するか、新規作成または紛失したキーを[こちら](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/)の説明に従って復旧します。いずれにしても、有効なキーとそのIDが必要です。
        1. Wallarm Console UIにて、**Integrations**セクションを開きます。
        1. **AWS S3**ブロックをクリックするか、**Add integration**ボタンをクリックして**AWS S3**を選択します。
        1. 統合名を入力します。
        1. 先にコピーしたS3バケットのAWSリージョンコードを入力します。
        1. S3バケット名を入力します。
        1. **Secret access key**タブで、access key IDとキー自体を入力します。

1. Wallarmデータの形式として、JSON ArrayまたはNew Line Delimited JSON(NDJSON)のいずれかを選択します。
1. **Regular notifications**セクションで、過去10分間のhitsが送信対象として選択されていることを確認します。選択されていない場合、データはS3バケットに送信されません。
1. **Test integration**をクリックし、構成の正しさ、Wallarm Cloudの利用可能性、通知形式を確認します。

    Amazon S3の場合、統合テストは過去10分間に検出されたhitsのデータが含まれるJSONファイルをバケットに送信します。以下はそのJSONファイルの例です:

    === "JSON Array"
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
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"time":"1687241470","request_id":"d2a900a6efac7a7c893a00903205071a","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        {"time":"1687241475","request_id":"b457fccec9c66cdb07eab7228b34eca6","ip":"127.0.0.1","datacenter":"unknown","tor":"none","remote_country":null,"application_id":[-1],"domain":"localhost","method":"GET","uri":"/etc/passwd","protocol":"none","status_code":499,"attack_type":"ptrav","block_status":"monitored","payload":["/etc/passwd"],"point":["uri"],"tags":{"lom_id":7,"libproton_version":"4.4.11","brute_counter":"c188cd2baa2cefb3f3688cb4008a649e","wallarm_mode":"monitoring","final_wallarm_mode":"monitoring"}}
        ```
1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

保存されるデータ量を制御するため、古いオブジェクトを自動的に削除するようにAmazon S3バケットを設定することを[こちら](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)の説明に従い推奨します。

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および不正な統合パラメータ

--8<-- "../include/integrations/integration-not-working.md"