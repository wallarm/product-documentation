# Amazon S3

あなたはWallarmにAmazon S3バケットへ検出されたヒットの情報を含むファイルを送信するように設定することができます。情報は10分ごとにJSON形式のファイルに送信されます。

各ヒットのデータフィールド:

* `time` - ヒット検出の日付と時間
* `request_id`
* `IP` - 攻撃者のIP
* ヒットのソースタイプ: `datacenter`, `proxy_type`, `tor`, `remote_country`
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

S3バケットに配置されたファイルは`wallarm_hits_{timestamp}.json`という名前で保存されます。

## インテグレーションの設定

Amazon S3とのインテグレーションを設定する際には、どの認証方法を使用するかを決定します。

* **ロールARNを通じて（推奨）** - リソースへのアクセスを許可するために外部IDオプション付きのロールを使用することは、AWSによって"混乱した代理"攻撃を防ぎ、セキュリティを強化する手段として[推奨](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html?icmpid=docs_iam_console)されています。Wallarmはあなたの組織アカウント専用のそのようなIDを提供します。
* **シークレットアクセスキーを通じて** - より一般的で、単純な方法であり、あなたのAWS IAMユーザーの共有[アクセスキー](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)が必要となります。この方法を選択する場合、インテグレーションで使用されるS3バケットへの書き込みのみ許可された別のIAMユーザーのアクセスキーを使用することが推奨されます。

Amazon S3のインテグレーションを設定するには：

1. [指示](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html)に従ってWallarmのためのAmazon S3バケットを作成します。
1. 選択した認証方法に応じて異なる手順を実行します。

    === "ロールARN"

        1. AWS UIで、S3 → 自分のバケット → **Properties**（プロパティ）タブに移動し、バケットの**AWS Region**（AWSリージョン）と**Amazon Resource Name (ARN)**のコードをコピーします。

            例として、リージョンは`us-west-1`、ARNは`arn:aws:s3:::test-bucket-json`となります。

        1. WallarmコンソールUIで、**Integrations**（統合）セクションを開きます。
        1. **AWS S3**ブロックをクリックするか、**Add integration**（統合を追加）ボタンをクリックして**AWS S3**を選択します。
        1. 統合名を入力します。
        1. 先程コピーしたS3バケットのAWSリージョンコードを入力します。
        1. S3バケット名を入力します。
        1. 提供されたWallarmアカウントIDをコピーします。
        1. 提供された外部IDをコピーします。
        1. AWS UIで、IAM → **Access Management**（アクセス管理）→ **Roles**（ロール）で[新しいロール](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html)の作成を開始します。
        1. 信頼されるエンティティタイプとして**AWSアカウント** → **別のAWSアカウント**を選択します。
        1. Wallarmの**アカウントID**を貼り付けます。
        1. **Require external ID（外部IDが必要）** を選択し、Wallarmによって提供された外部IDを貼り付けます。
        1. **Next（次へ）**をクリックしてロールのポリシーを作成します：

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
        1. ロール作成を終了し、ロールのARNをコピーします。
        1. WallarmコンソールUIの統合作成ダイアログで、**Role ARN**タブにロールのARNを貼り付けます。

            ![Amazon S3 integration](../../../images/user-guides/settings/integrations/add-amazon-s3-integration.png)

    === "シークレットアクセスキー"

        1. AWS UIで、S3 → あなたのバケット → **Properties**タブに移動し、あなたのバケットの**AWS Region**のコードをコピーします。例えば`us-west-1`。
        1. IAM → ダッシュボード → **Manage access keys** → **Access keys**セクションに移動します。
        1. どこかに保存してあるアクセスキーのIDを取得するか、または[ここ](https://aws.amazon.com/ru/blogs/security/wheres-my-secret-access-key/)で説明されているように新規キーを作成/紛失したキーを復元します。いずれにせよ、アクティブなキーとそのIDが必要となります。
        1. Wallarm Console UIで、**Integrations**（統合）セクションを開きます。
        1. **AWS S3**ブロックをクリックするか、**Add integration**（統合を追加）ボタンをクリックして**AWS S3**を選択します。
        1. 統合名を入力します。
        1. 先程コピーしたS3バケットのAWSリージョンコードを入力します。
        1. S3バケット名を入力します。
        1. **Secret access key**タブでアクセスキーIDとそのキー自体を入力します。

1. **Regular notifications（定期通知）**セクションで、過去10分間のヒットが選択されて送信されることを確認します。選択されていない場合、データはS3バケットには送信されません。
1. [Integrationをテスト](#testing-integration)し、設定が正しいことを確認します。
1. **Add integration（インテグレーションを追加）**をクリックします。

保存されるデータの量を制御するためには、Amazon S3バケットから古いオブジェクトの自動削除を設定することをお勧めします。詳しくは[こちら](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)をご覧ください。

## インテグレーションのテスト

統合テストによって、設定の正確性、Wallarm Cloudの可用性、および送信データ形式を確認することができます。統合をテストするためには、統合を作成または編集する際に**Test integration（統合テスト）**を使用することができます。

Amazon S3の場合、統合テストはデータを含むJSONファイルをあなたのバケットに送信します。以下は、過去10分間に検出されたヒットのデータを含むJSONファイルの例です：

```json
[
{
    "time":1678984671,
    "request_id":"d2a900a6efac7a7c893a00903205071a",
    "ip":"127.0.0.1",
    "datacenter":"unknown",
    "tor":"none",
    "remote_country":null,
    "application_id":null,
    "domain":"localhost",
    "method":"GET",
    "uri":"/etc/passwd",
    "port":45070,
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
    "time":1678984675,
    "request_id":"b457fccec9c66cdb07eab7228b34eca6",
    "ip":"127.0.0.1",
    "datacenter":"unknown",
    "tor":"none",
    "remote_country":null,
    "application_id":null,
    "domain":"localhost",
    "method":"GET",
    "uri":"/etc/passwd",
    "port":45086,
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

## インテグレーションを更新する

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションを無効にする

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションを削除する

--8<-- "../include-ja/integrations/remove-integration.md"