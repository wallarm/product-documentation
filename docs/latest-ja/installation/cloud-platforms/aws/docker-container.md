# AWSへのWallarm Dockerイメージのデプロイ

このクイックガイドでは、[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node)を、[Amazon Elastic Container Service(Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/)を使用してAmazonクラウドプラットフォームにデプロイする手順を説明します。

!!! warning "この手順の制限事項"
    この手順には、ロードバランシングおよびノードの自動スケーリングの構成は含まれていません。これらのコンポーネントを自身で設定する場合は、[AWSの手順](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/)の該当箇所を確認することをおすすめします。

!!! info "セキュリティに関する注意"
    このソリューションは、AWSのセキュリティベストプラクティスに従うように設計されています。デプロイにはAWSのルートアカウントの使用を避けることをおすすめします。代わりに、必要最小限の権限のみを持つIAMユーザーまたはロールを使用します。

    デプロイプロセスは最小権限の原則を前提としており、Wallarmコンポーネントのプロビジョニングと運用に必要な最小限のアクセスのみを付与します。

本デプロイに必要なAWSインフラストラクチャのコスト見積もりについては、[AWSにWallarmをデプロイする際のコストガイダンス][aws-costs]を参照してください。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/aws-ecs-use-cases.md"

## 要件

* **admin**権限を持つAWSアカウントとユーザー
* AWS CLI 1またはAWS CLI 2が正しく[インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)され、[設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)されていること
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleで**Administrator**ロールを持つアカウントへのアクセス
* 攻撃検出ルールおよび[API仕様][api-policy-enf-docs]の更新のダウンロード、ならびに[許可リスト、拒否リスト、グレーリスト][graylist-docs]に登録した国・地域・データセンターの正確なIPの取得のために、以下のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"

## WallarmノードのDockerコンテナ設定オプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数で構成されたWallarmノードのDockerコンテナのデプロイ

環境変数のみで構成されたコンテナ化Wallarmフィルタリングノードをデプロイするには、AWS Management ConsoleとAWS CLIを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [AWS Management Console](https://console.aws.amazon.com/console/home)にサインインし、**Services**一覧から**Elastic Container Service**を開きます。
1. **Create Cluster**ボタンからクラスター作成に進みます:
      1. テンプレートとして**EC2 Linux + Networking**を選択します。
      2. クラスター名を指定します。例: `wallarm-cluster`。
      3. 必要に応じて、[AWSの手順](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html)に従ってその他の設定を行います。
      4. クラスターを保存します。
1. Wallarm Cloudへの接続に必要な機密データ(ノードトークン)を[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)を使用して暗号化します。

    本手順では、機密データはAWS Secrets Managerに保存します。

    !!! warning "機密データストレージへのアクセス"
        Dockerコンテナが暗号化された機密データを読み取れるように、AWSの設定が次の要件を満たしていることを確認してください:
        
        * 機密データが、Dockerコンテナを実行するリージョンに保存されていること。
        * タスク定義の`executionRoleArn`パラメータで指定したユーザーにIAMポリシー**SecretsManagerReadWrite**がアタッチされていること。[IAMポリシー設定の詳細 →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. 次のタスク定義([task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)、タスク定義はDockerコンテナの動作シナリオを定義します)を記述したローカルJSONファイルを作成します:

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
                    },
                    {
                        "name": "WALLARM_LABELS",
                        "value": "group=<GROUP>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:6.4.1"
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
                    },
                    {
                        "name": "WALLARM_LABELS",
                        "value": "group=<GROUP>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:6.4.1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [あなたのAWSアカウントID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)。
    * `environment`オブジェクトは、Dockerコンテナにテキスト形式で渡す環境変数を設定します。使用可能な環境変数の一覧は以下の表に記載しています。`WALLARM_API_TOKEN`変数は`secrets`オブジェクトで渡すことを推奨します。
    * `secret`オブジェクトは、機密データストレージへのリンクとしてDockerコンテナに渡す環境変数を設定します。値の形式は選択したストレージによって異なります(詳細は[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)のドキュメントを参照してください)。

        `WALLARM_API_TOKEN`変数は`secrets`オブジェクトで渡すことを推奨します。

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * すべての設定ファイルパラメータは[AWSドキュメント](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)に記載されています。
1. JSON構成ファイルに基づいて、[`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html)コマンドでタスク定義を登録します:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: ローカルマシン上のタスク定義JSONファイルへのパス。
    * `<JSON_FILE_NAME>`: タスク定義JSONファイルの名前と拡張子。
1. [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html)コマンドでクラスター内にタスクを実行します:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: 最初の手順で作成したクラスター名。例: `wallarm-cluster`。
    * `<FAMILY_PARAM_VALUE>`: 作成したタスク定義の名前。JSONファイル内の`family`パラメータに指定した値と一致させます。例: `wallarm-api-security-node`。
1. AWS Management Console→**Elastic Container Service**→該当の実行中タスクがあるクラスター→**Tasks**を開き、タスクが一覧に表示されていることを確認します。
1. [フィルタリングノードの動作をテストします](#testing-the-filtering-node-operation)。

## マウントしたファイルで構成されたWallarmノードのDockerコンテナのデプロイ

環境変数とマウントしたファイルで構成されたコンテナ化Wallarmフィルタリングノードをデプロイするには、AWS Management ConsoleとAWS CLIを使用します。

本手順では、設定ファイルを[AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html)ファイルシステムからマウントします。その他のマウント方法については[AWSドキュメント](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html)を参照してください。

AWS EFSからマウントした設定ファイルと環境変数を使用してコンテナをデプロイする手順:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [AWS Management Console](https://console.aws.amazon.com/console/home)にサインインし、**Services**一覧から**Elastic Container Service**を開きます。
1. **Create Cluster**ボタンからクラスター作成に進みます:

    * **Template**: `EC2 Linux + Networking`。
    * **Cluster name**: `wallarm-cluster`(例)。
    * **Provisioning Model**: `On-Demand Instance`。
    * **EC2 instance type**: `t2.micro`。
    * **Number of instances**: `1`。
    * **EC2 AMI ID**: `Amazon Linux 2 Amazon ECS-optimized AMI`。
    * **Key pair**: インスタンスへのSSH接続用の[key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)。設定ファイルをストレージにアップロードするため、SSHでインスタンスに接続する必要があります。
   * その他の設定はデフォルトのままでもかまいません。他の設定を変更する場合は、[AWS EFSのセットアップ手順](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html)に従うことをおすすめします。
1. [AWSの手順](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html)のステップ2〜4に従ってAWS EFSストレージを構成します。
1. AWSの手順のステップ4で、設定ファイル`default`を作成し、デフォルトでマウント対象のファイルを格納するディレクトリに配置します。`default`ファイルにはフィルタリングノードの設定を記述します。最小設定の例:

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

    [設定ファイルで指定できるフィルタリングノードのディレクティブ一覧 →][nginx-waf-directives]
1. Wallarm Cloudへの接続に必要な機密データ(ノードトークン)を[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)を使用して暗号化します。

    本手順では、機密データはAWS Secrets Managerに保存します。

    !!! warning "機密データストレージへのアクセス"
        Dockerコンテナが暗号化された機密データを読み取れるように、AWSの設定が次の要件を満たしていることを確認してください:
        
        * 機密データが、Dockerコンテナを実行するリージョンに保存されていること。
        * タスク定義の`executionRoleArn`パラメータで指定したユーザーにIAMポリシー**SecretsManagerReadWrite**がアタッチされていること。[IAMポリシー設定の詳細 →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. 次のタスク定義([task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)、タスク定義はDockerコンテナの動作シナリオを定義します)を記述したローカルJSONファイルを作成します:

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
                    },
                    {
                        "name": "WALLARM_LABELS",
                        "value": "group=<GROUP>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:6.4.1"
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
                "mountPoints": [
                    {
                        "containerPath": "/etc/nginx/http.d",
                        "sourceVolume": "default"
                    }
                ],
                "environment": [
                    {
                        "name": "WALLARM_LABELS",
                        "value": "group=<GROUP>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:6.4.1"
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

    * `<AWS_ACCOUNT_ID>`: [あなたのAWSアカウントID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)。
    * `<PATH_FOR_MOUNTED_CONFIG>`: 設定ファイルをマウントするコンテナ内ディレクトリ。設定ファイルは、以下のNGINXで使用されるコンテナディレクトリにマウントできます:

        * `/etc/nginx/conf.d` — 共通設定
        * `/etc/nginx/http.d` — バーチャルホスト設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは`/etc/nginx/http.d/default.conf`ファイルに記述します。
    
    * `<NAME_FROM_VOLUMES_OBJECT>`: マウント対象のファイルを保存するAWS EFSストレージの構成を含む`volumes`オブジェクトの名前(値は`<VOLUME_NAME>`と同一にします)。
    * `<VOLUME_NAME>`: マウント対象のファイルを保存するAWS EFSストレージの構成を含む`volumes`オブジェクトの名前。
    * `<EFS_FILE_SYSTEM_ID>`: コンテナにマウントするファイルを含むAWS EFSファイルシステムのID。IDはAWS Management Console→**Services**→**EFS**→**File systems**に表示されます。
    * `environment`オブジェクトは、Dockerコンテナにテキスト形式で渡す環境変数を設定します。使用可能な環境変数の一覧は以下の表に記載しています。`WALLARM_API_TOKEN`変数は`secrets`オブジェクトで渡すことを推奨します。
    * `secret`オブジェクトは、機密データストレージへのリンクとしてDockerコンテナに渡す環境変数を設定します。値の形式は選択したストレージによって異なります(詳細は[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)のドキュメントを参照してください)。

        `WALLARM_API_TOKEN`変数は`secrets`オブジェクトで渡すことを推奨します。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * すべての設定ファイルパラメータは[AWSドキュメント](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)に記載されています。
1. JSON構成ファイルに基づいて、[`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html)コマンドでタスク定義を登録します:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: ローカルマシン上のタスク定義JSONファイルへのパス。
    * `<JSON_FILE_NAME>`: タスク定義JSONファイルの名前と拡張子。
1. [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html)コマンドでクラスター内にタスクを実行します:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: 最初の手順で作成したクラスター名。例: `wallarm-cluster`。
    * `<FAMILY_PARAM_VALUE>`: 作成したタスク定義の名前。JSONファイル内の`family`パラメータに指定した値と一致させます。例: `wallarm-api-security-node`。
1. AWS Management Console→**Elastic Container Service**→該当の実行中タスクがあるクラスター→**Tasks**を開き、タスクが一覧に表示されていることを確認します。
1. [フィルタリングノードの動作をテストします](#testing-the-filtering-node-operation)。

## フィルタリングノードの動作テスト

1. AWS Management Consoleで実行中のタスクを開き、**External Link**欄からコンテナのIPアドレスをコピーします。

    ![コンテナインスタンスの設定][aws-copy-container-ip-img]

    IPアドレスが空の場合は、コンテナが**RUNNING**ステータスであることを確認してください。

2. テスト用の[Path Traversal][ptrav-attack-docs]攻撃リクエストをコピーしたアドレスに送信します:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Console→**Attacks**を[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)で開き、攻撃が一覧に表示されていることを確認します。
    ![UIのAttacks][attacks-in-ui-image]
4. 必要に応じて、ノード動作の他の側面も[テスト][link-docs-check-operation]します。

コンテナのデプロイ中に発生したエラーの詳細は、AWS Management Consoleのタスク詳細に表示されます。コンテナにアクセスできない場合は、必要なフィルタリングノードのパラメータが正しい値でコンテナに渡されていることを確認してください。