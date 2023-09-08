# Wallarm DockerイメージをAWSへのデプロイ

この短いガイドは、[Amazon Elastic Container Service (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/) を使用して、Amazonのクラウドプラットフォームに[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node) をデプロイする手順を提供します。

!!! warning "**使用説明書の制限**"
    これらの手順書はロードバランシングとノードのオートスケーリングの設定をカバーしていません。これらのコンポーネントを自分で設定する場合は、[AWS指導](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/)の適切な部分のレビューをお勧めします。

## 必要条件

* **管理**権限を持つAWSアカウントとユーザー
* [インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)が適切に行われ、[設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)が完了しているAWS CLI 1またはAWS CLI 2
* Wallarm Consoleで**管理者**ロールを持つアカウントへのアクセス [US Cloud](https://us1.my.wallarm.com/) または [EU Cloud](https://my.wallarm.com/)

## WallarmノードDockerコンテナ設定のオプション

--8<-- "../include-ja/waf/installation/docker-running-options.md"

## 環境変数で設定されたWallarmノードDockerコンテナのデプロイ

AWS管理コンソールとAWS CLIを使用して、環境変数のみで設定されたコンテナ化されたWallarmフィルタリングノードをデプロイします。

--8<-- "../include-ja/waf/installation/get-api-or-node-token.md"

1. [AWS管理コンソール](https://console.aws.amazon.com/console/home)にサインイン → **サービス**リスト → **Elastic Container Service** に進みます。
1. **クラスター作成**ボタンをクリックしてクラスター作成を進めます:
      1. テンプレートとして **EC2 Linux + Networking** を選択します。
      2. クラスター名を指定します。例えば `wallarm-cluster` とします。
      3. 必要に応じて、[AWSの指示](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html)に従って他の設定を行います。
      4. クラスターを保存します。
1. Wallarm Cloudに接続するために必要なセンシティブなデータ（ノードトークン）を、[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)を使用して暗号化します。

   ここでは、センシティブなデータはAWS Secrets Managerに格納されます。

   !!! warning "センシティブなデータストレージへのアクセス"
       Dockerコンテナが暗号化されたセンシティブなデータを読み取ることができるようにするためには、以下の要件を満たすようAWSの設定を行ってください:
       
       * センシティブなデータは、Dockerコンテナを実行するリージョンに格納されていること。
       * IAMポリシー **SecretsManagerReadWrite** がタスク定義の `executionRoleArn` パラメータに指定されたユーザーに適用されていること。[IAMポリシー設定の詳細 →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. 次のローカルJSONファイルを作成します。これは[Docker Container task 定義](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) （タスク定義はDockerコンテナの動作シナリオを設定します）です。

   === "Wallarm US Cloudを使用する場合"
        ```json
        {
            "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
            "containerDefinitions": [
                {
                    "memory": 128,
                    "portMappings": [
                    {
                        "hostPort": 80,
                        "containerPort": 80,
                        "protocol": "tcp"
                    }
                ],
                "essential": true,
                "environment": [
                    {
                        "name": "WALLARM_API_HOST",
                        "value": "us1.api.wallarm.com"
                    },
                    {
                        "name": "NGINX_BACKEND",
                        "value": "<HOST_TO_PROTECT_WITH_WALLARM>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.6.2-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
        ```
   === "Wallarm EU Cloudを使用する場合"
        ```json
        {
            "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
            "containerDefinitions": [
                {
                    "memory": 128,
                    "portMappings": [
                    {
                        "hostPort": 80,
                        "containerPort": 80,
                        "protocol": "tcp"
                    }
                ],
                "essential": true,
                "environment": [
                    {
                        "name": "NGINX_BACKEND",
                        "value": "<HOST_TO_PROTECT_WITH_WALLARM>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.6.2-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
        ```

   * `<AWS_ACCOUNT_ID>`：[あなたのAWSアカウントID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)。
   * `environment` オブジェクトは、テキスト形式でDockerコンテナに渡すべき環境変数を設定します。利用可能な環境変数のセットは次の表で説明されています。変数 `WALLARM_API_TOKEN` は `secrets` オブジェクトで渡すことをお勧めします。
   * `secret` オブジェクトは、Dockerコンテナに渡すべき環境変数を、センシティブデータストレージへのリンクとして設定します。値の形式は、選択したストレージによります（詳細は、[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)や [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) のドキュメンテーションを参照してください）。

       変数 `WALLARM_API_TOKEN` は `secrets` オブジェクトで渡すことをお勧めします。

       --8<-- "../include-ja/waf/installation/nginx-docker-all-env-vars-latest.md"
   
   * すべての構成ファイルパラメータは[AWSドキュメンテーション](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)で説明されています。
1. 設定したJSONファイルを元にタスク定義を登録します。この操作を行うために、[`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) コマンドを使用します。:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`：ローカルマシン上のタスク定義を含むJSONファイルへのパス。
    * `<JSON_FILE_NAME>`：タスク定義を含むJSONファイルの名前と拡張子。
1. [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html) コマンドを使用してクラスター内のタスクを実行します:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`：最初のステップで作成したクラスターの名前。例えば、 `wallarm-cluster`。
    * `<FAMILY_PARAM_VALUE>`：作成したタスク定義の名前。この値は、タスク定義のJSONファイルで指定した `family` パラメータの値と一致している必要があります。例えば、 `wallarm-api-security-node`。
1. AWS管理コンソール → **Elastic Container Service** → 実行中のタスクが含まれるクラスタ → **タスク** を開き、タスクがリストに表示されていることを確認します。
1. [フィルタリングノードの動作のテスト](#フィルタリングノードの動作のテスト)を行います。

## マウントされたファイルを通じて設定されたWallarmノードDockerコンテナのデプロイ

環境変数とマウントされたファイルを通じて設定されたコンテナ化されたWallarmフィルタリングノードをデプロイするために、AWS管理コンソールとAWS CLIが使用されます。

これらの手順では、設定ファイルは[AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html) ファイルシステムからマウントされます。ファイルのマウント方法についての他の方法については、[AWSドキュメンテーション](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html)を参照してください。

環境変数とAWS EFSからマウントされた設定ファイルを持つコンテナをデプロイするには：

--8<-- "../include-ja/waf/installation/get-api-or-node-token.md"

1. [AWS管理コンソール](https://console.aws.amazon.com/console/home)にサインイン → **サービス**リスト → **Elastic Container Service** に進みます。
1. **クラスター作成**ボタンをクリックしてクラスター作成を進めます:

    * **テンプレート**： `EC2 Linux + Networking` 。
    * **クラスタ名**： `wallarm-cluster` （例）。
    * **プロビジョニングモデル**： `On-Demand Instance` 。
    * **EC2インスタンスタイプ**： `t2.micro` 。
    * **インスタンスの数**： `1` 。
    * **EC2 AMI ID**： `Amazon Linux 2 Amazon ECS-optimized AMI` 。
    * **キーペア**： インスタンスへのSSH接続のための[キーペア](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)。設定ファイルをストレージにアップロードするために、SSHでインスタンスに接続する必要があります。
   * その他の設定はデフォルトのままにしておくことができます。その他の設定を変更する場合には、[AWS EFS設定の手順](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html)に従うことを推奨します。
1. [AWSの説明書](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html)のステップ2-4に従ってAWS EFSストレージを設定します。
1. AWS指導の4番目のステップで、 `default` という設定ファイルを作成し、デフォルトでファイルをマウントするディレクトリに配置します。 `default` ファイルはフィルタリングノードの設定をカバーしている必要があります。必要最小限の設定を持つファイルの例：

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        #listen 443 ssl;

        server_name localhost;

        #ssl_certificate cert.pem;
        #ssl_certificate_key cert.key;

        root /usr/share/nginx/html;

        index index.html index.htm;

        wallarm_mode monitoring;
        # wallarm_application 1;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [設定ファイルで指定できるフィルタリングノードのディレクティブのセット →][nginx-waf-directives]
1. Wallarm Cloudに接続するために必要なセンシティブなデータ（ノードトークン）を、[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)を使用して暗号化します。

   この手順では、センシティブなデータがAWS Secrets Managerに格納されています。

   !!! warning "センシティブなデータストレージへのアクセス"
       Dockerコンテナが暗号化されたセンシティブなデータを読み取ることができるようにするためには、以下の要件を満たすようAWSの設定を行ってください:
       
       * センシティブなデータは、Dockerコンテナを実行するリージョンに格納されていること。
       * IAMポリシー **SecretsManagerReadWrite** がタスク定義の `executionRoleArn` パラメータに指定されたユーザーに適用されていること。[IAMポリシー設定の詳細 →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. 次のローカルJSONファイルを作成します。これは[Docker Container task 定義](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)（タスク定義はDockerコンテナの動作シナリオを設定します）です。

    === "If you use the Wallarm US Cloud"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                    {
                        "hostPort": 80,
                        "containerPort": 80,
                        "protocol": "tcp"
                    }
                    ],
                    "essential": true,
                    "mountPoints": [
                    {
                        "containerPath": "<PATH_FOR_MOUNTED_CONFIG>",
                        "sourceVolume": "<NAME_FROM_VOLUMES_OBJECT>"
                    }
                    ],
                    "environment": [
                    {
                        "name": "WALLARM_API_HOST",
                        "value": "us1.api.wallarm.com"
                    }
                    ],
                    "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                    ],
                    "name": "wallarm-container",
                    "image": "registry-1.docker.io/wallarm/node:4.6.2-1"
                }
                ],
            "volumes": [
                {
                    "name": "<VOLUME_NAME>",
                    "efsVolumeConfiguration": {
                        "fileSystemId": "<EFS_FILE_SYSTEM_ID>",
                        "transitEncryption": "ENABLED"
                    }
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```
    === "If you use the Wallarm EU Cloud"
         ```json
         {
             "executionRoleArn": "arn:aws:iam::<AWS_ACCOUNT_ID>:role/ecsTaskExecutionRole",
             "containerDefinitions": [
                 {
                     "memory": 128,
                     "portMappings": [
                    {
                        "hostPort": 80,
                        "containerPort": 80,
                        "protocol": "tcp"
                    }
                    ],
                    "essential": true,
                    "mountPoints": [
                    {
                        "containerPath": "/etc/nginx/sites-enabled",
                        "sourceVolume": "default"
                    }
                    ],
                    "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                    ],
                    "name": "wallarm-container",
                    "image": "registry-1.docker.io/wallarm/node:4.6.2-1"
                }
                ],
             "volumes": [
                {
                    "name": "default",
                    "efsVolumeConfiguration": {
                        "fileSystemId": "<EFS_FILE_SYSTEM_ID>",
                        "transitEncryption": "ENABLED"
                    }
                }
                ],
             "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`：[あなたのAWSアカウントID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)。
    * `<PATH_FOR_MOUNTED_CONFIG>`：設定ファイルをマウントするコンテナのディレクトリ。設定ファイルは、NGINXが使用する以下のコンテナディレクトリにマウントできます：

        * `/etc/nginx/conf.d` —一般的な設定
        * `/etc/nginx/sites-enabled` —仮想ホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは、`/etc/nginx/sites-enabled/default` ファイルに記述する必要があります。
    
    * `<NAME_FROM_VOLUMES_OBJECT>`： マウントされたファイルのAWS EFSストレージ設定を含む `volumes` オブジェクトの名前（この値は `<VOLUME_NAME>` と同じであるべきです）。
    * `<VOLUME_NAME>`：マウントされたファイルのAWS EFSストレージの設定を含む `volumes` オブジェクトの名前。
    * `<EFS_FILE_SYSTEM_ID>`： コンテナにマウントするファイルを格納するAWS EFSファイルシステムのID。IDはAWS管理コンソール → **サービス** → **EFS** → **ファイルシステム** で表示されます。
    * `environment` オブジェクトは、テキスト形式でDockerコンテナに渡すべき環境変数を設定します。利用可能な環境変数のセットは次の表で説明されています。変数 `WALLARM_API_TOKEN` は `secrets` オブジェクトで渡すことをお勧めします。
    * `secret` オブジェクトは、Dockerコンテナに渡すべき環境変数を、センシティブデータストレージへのリンクとして設定します。値の形式は選択したストレージによります（詳細は、[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)や [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) のドキュメンテーションを参照ください）。

       変数 `WALLARM_API_TOKEN` は `secrets` オブジェクトで渡すことをお勧めします。

       --8<-- "../include-ja/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
   
    * すべての構成ファイルパラメータは[AWSドキュメンテーション](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)で説明されています。
1. 設定したJSONファイルを元にタスク定義を登録します。この操作を行うために、[`aws ecs register-task-definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) コマンドを使用します。:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`：ローカルマシン上のタスク定義を含むJSONファイルへのパス。
    * `<JSON_FILE_NAME>`：タスク定義を含むJSONファイルの名前と拡張子。
1. [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html) コマンドを使用してクラスター内のタスクを実行します:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`：最初のステップで作成したクラスターの名前。例えば、 `wallarm-cluster`。
    * `<FAMILY_PARAM_VALUE>`：作成したタスク定義の名前。この値は、タスク定義のJSONファイルで指定した `family` パラメータの値と一致している必要があります。例えば、 `wallarm-api-security-node`。
1. AWS管理コンソール → **Elastic Container Service** → 実行中のタスクが含まれるクラスタ → **タスク** を開き、タスクがリストに表示されていることを確認します。
1. [フィルタリングノードの動作のテスト](#フィルタリングノードの動作のテスト)を実行します。

## フィルタリングノードの動作のテスト

1. AWS 管理コンソールで実行中のタスクを開き、フィールド **External Link** からコンテナIPアドレスをコピーします。

   ![Settig up container instance][aws-copy-container-ip-img]

   IPアドレスが空の場合は、コンテナが **RUNNING** ステータスにあることを確認してください。

2. テストの[パストラバーサル][ptrav-attack-docs]攻撃を含むリクエストを、コピーしたアドレスに送信します：

   ```
   curl http://<COPIED_IP>/etc/passwd
   ```
3. [US Cloud](https://us1.my.wallarm.com/search) のWallarm コンソール → **イベント** または [EU Cloud](https://my.wallarm.com/search) を開き、攻撃がリストに表示されていることを確認します。
   ![Attacks in UI][attacks-in-ui-image]

コンテナデプロイ中に生じたエラーの詳細はAWS管理コンソールのタスク詳細に表示されます。コンテナが利用できない場合は、必要なフィルタリングノードパラメータがコンテナに正しい値で渡されていることを確認してください。