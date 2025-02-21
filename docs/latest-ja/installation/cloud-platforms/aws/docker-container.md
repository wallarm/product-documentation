# AWSへのWallarm Dockerイメージのデプロイ

このクイックガイドでは、[NGINXベースのWallarmノードのDockerイメージ](https://hub.docker.com/r/wallarm/node)を[Amazon Elastic Container Service (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/)を使用してAmazonクラウドプラットフォームへデプロイする手順を示します。

!!! warning "手順の制限"
    これらの手順は、ロードバランシングやノードのオートスケーリングの設定についてはカバーしておりません。これらのコンポーネントを自分で設定する場合は、[AWSの手順](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/)の該当部分を確認することを推奨します。

## ユースケース

--8<-- "../include/waf/installation/cloud-platforms/aws-ecs-use-cases.md"

## 必要条件

* **admin** 権限を持つAWSアカウントおよびユーザー
* AWS CLI 1またはAWS CLI 2が正しく[インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)および[設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)されていること
* [US Cloud](https://us1.my.wallarm.com/)または[EU Cloud](https://my.wallarm.com/)のWallarm Consoleにおいて、**Administrator**ロールで二要素認証が無効のアカウントへのアクセス
* 攻撃検出ルールの更新ダウンロードや[API仕様書][api-policy-enf-docs]の取得、[allowlisted, denylisted, or graylisted][graylist-docs]国、地域、またはデータセンターの正確なIP取得用に、下記のIPアドレスへのアクセス

    --8<-- "../include/wallarm-cloud-ips.md"

## WallarmノードDockerコンテナの設定オプション

--8<-- "../include/waf/installation/docker-running-options.md"

## 環境変数による設定のみで構成されたWallarmノードDockerコンテナのデプロイ

環境変数のみで設定されたコンテナ化されたWallarmフィルタリングノードをデプロイするために、AWS Management ConsoleおよびAWS CLIを使用します。

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [AWS Management Console](https://console.aws.amazon.com/console/home) にサインインし、**Services**リストから**Elastic Container Service**を選択します。
1. **Create Cluster**ボタンをクリックしてクラスター作成に進みます：
      1. テンプレートとして**EC2 Linux + Networking**を選択します。
      2. クラスター名を指定します（例：`wallarm-cluster`）。
      3. 必要に応じて、[AWSの手順](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html)に従いその他の設定を行います。
      4. クラスターを保存します。
1. Wallarm Cloudに接続するために必要な機微なデータ（ノードトークン）を、[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)を使用して暗号化します。

    本手順では、機微なデータはAWS Secrets Managerに保存されます。

    !!! warning "機微なデータストレージへのアクセス"
        Dockerコンテナが暗号化された機微なデータを読み取れるようにするため、AWSの設定が以下の要件を満たしていることを確認してください:
        
        * 機微なデータはDockerコンテナ実行に使用するリージョンに保存されていること。
        * タスク定義の`executionRoleArn`パラメータに指定されたユーザーに、IAMポリシー**SecretsManagerReadWrite**がアタッチされていること。[IAMポリシーの設定の詳細 →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. [タスク定義](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)（タスク定義はDockerコンテナの動作シナリオを設定します）の内容を記述した以下のローカルJSONファイルを作成します:

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
                "image": "registry-1.docker.io/wallarm/node:5.3.0"
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
                "image": "registry-1.docker.io/wallarm/node:5.3.0"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [あなたのAWSアカウントID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)。
    * `environment`オブジェクトは、テキスト形式でDockerコンテナに渡す環境変数を設定します。利用可能な環境変数の一覧は以下の表に記載されています。変数`WALLARM_API_TOKEN`は`secrets`オブジェクトで渡すことを推奨します。
    * `secrets`オブジェクトは、機微なデータストレージへのリンクとしてDockerコンテナに渡す環境変数を設定します。値のフォーマットは選択したストレージに依存します（詳細は[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)のドキュメントを参照してください）。

        変数`WALLARM_API_TOKEN`は`secrets`オブジェクトで渡すことを推奨します。

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * 全ての設定ファイルパラメータは[AWSのドキュメント](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)に記載されています。
1. ローカルのJSON構成ファイルを使用して、[`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html)コマンドによりタスク定義を登録します:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: タスク定義が記載されたJSONファイルのローカルマシン上のパス。
    * `<JSON_FILE_NAME>`: タスク定義が記載されたJSONファイルのファイル名および拡張子。
1. [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html)コマンドを使用して、クラスター内でタスクを実行します:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: 1番目のステップで作成したクラスター名（例：`wallarm-cluster`）。
    * `<FAMILY_PARAM_VALUE>`: 作成したタスク定義の名前。JSONファイル内で指定された`family`パラメータの値に対応する必要があります（例：`wallarm-api-security-node`）。
1. AWS Management Consoleで**Elastic Container Service**→実行中のタスクがあるクラスター→**Tasks**を開き、タスクが一覧に表示されていることを確認します。
1. [フィルタリングノードの動作をテスト](#testing-the-filtering-node-operation)します。

## マウントファイルによる設定が適用されたWallarmノードDockerコンテナのデプロイ

環境変数とマウントされたファイルによって構成されたコンテナ化されたWallarmフィルタリングノードをデプロイするために、AWS Management ConsoleおよびAWS CLIを使用します。

本手順では、設定ファイルは[AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html)ファイルシステムからマウントされます。ファイルのマウントその他の方法については、[AWSのドキュメント](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html)を確認してください。

環境変数およびAWS EFSからマウントされた設定ファイルでコンテナをデプロイするには:

--8<-- "../include/waf/installation/get-api-or-node-token.md"

1. [AWS Management Console](https://console.aws.amazon.com/console/home) にサインインし、**Services**リストから**Elastic Container Service**を選択します。
1. **Create Cluster**ボタンをクリックしてクラスター作成に進みます:

    * **Template**: `EC2 Linux + Networking`
    * **Cluster name**: 例として`wallarm-cluster`
    * **Provisioning Model**: `On-Demand Instance`
    * **EC2 instance type**: `t2.micro`
    * **Number of instances**: `1`
    * **EC2 AMI ID**: `Amazon Linux 2 Amazon ECS-optimized AMI`
    * **Key pair**: SSH接続用の[key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)（設定ファイルをストレージへアップロードするために、SSHでインスタンスに接続する必要があります）
   * その他の設定はデフォルトのままで構いません。他の設定を変更する場合は、[AWS EFSの設定手順](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html)に従うことを推奨します。
1. AWSの手順のステップ2～4に従い、AWS EFSストレージを設定します。
1. AWSの手順4において、設定ファイル`default`を作成し、デフォルトでマウントするディレクトリに配置します。ファイル`default`にはフィルタリングノードの設定が記述されます。最小の設定例は以下です:

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

    [設定ファイルに指定可能なフィルタリングノードディレクティブのセット →][nginx-waf-directives]
1. Wallarm Cloudに接続するために必要な機微なデータ（ノードトークン）を、[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)を使用して暗号化します。

    本手順では、機微なデータはAWS Secrets Managerに保存されます。

    !!! warning "機微なデータストレージへのアクセス"
        Dockerコンテナが暗号化された機微なデータを読み取れるようにするため、AWSの設定が以下の要件を満たしていることを確認してください:
        
        * 機微なデータはDockerコンテナ実行に使用するリージョンに保存されていること。
        * タスク定義の`executionRoleArn`パラメータに指定されたユーザーに、IAMポリシー**SecretsManagerReadWrite**がアタッチされていること。[IAMポリシーの設定の詳細 →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. 以下のローカルJSONファイルを作成し、[タスク定義](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)（タスク定義はDockerコンテナの動作シナリオを設定します）を記述します:

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
                "image": "registry-1.docker.io/wallarm/node:5.3.0"
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
                "image": "registry-1.docker.io/wallarm/node:5.3.0"
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
    * `<PATH_FOR_MOUNTED_CONFIG>`: コンテナ内で設定ファイルをマウントするディレクトリ。設定ファイルはNGINXで以下のディレクトリにマウント可能です:

        * `/etc/nginx/conf.d` — 共通設定
        * `/etc/nginx/sites-enabled` — バーチャルホストの設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードのディレクティブは`/etc/nginx/sites-enabled/default`ファイルに記述されるべきです。
    
    * `<NAME_FROM_VOLUMES_OBJECT>`: マウントされた設定ファイルのAWS EFSストレージの構成が記述された`volumes`オブジェクトの名称（値は`<VOLUME_NAME>`と一致させる必要があります）。
    * `<VOLUME_NAME>`: マウントされた設定ファイルのAWS EFSストレージの構成が記述された`volumes`オブジェクトの名称。
    * `<EFS_FILE_SYSTEM_ID>`: コンテナにマウントするファイルが存在するAWS EFSファイルシステムのID。IDはAWS Management Consoleの**Services**→**EFS**→**File systems**に表示されます。
    * `environment`オブジェクトは、テキスト形式でDockerコンテナに渡す環境変数を設定します。利用可能な環境変数の一覧は以下の表に記載されています。変数`WALLARM_API_TOKEN`は`secrets`オブジェクトで渡すことを推奨します。
    * `secrets`オブジェクトは、機微なデータストレージへのリンクとしてDockerコンテナに渡す環境変数を設定します。値のフォーマットは選択したストレージに依存します（詳細は[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)のドキュメントを参照してください）。

        変数`WALLARM_API_TOKEN`は`secrets`オブジェクトで渡すことを推奨します。

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * 全ての設定ファイルパラメータは、[AWSのドキュメント](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)に記載されています。
1. ローカルのJSON構成ファイルを使用して、[`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html)コマンドによりタスク定義を登録します:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: タスク定義が記載されたJSONファイルのローカルマシン上のパス。
    * `<JSON_FILE_NAME>`: タスク定義が記載されたJSONファイルのファイル名および拡張子。
1. [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html)コマンドを使用して、クラスター内でタスクを実行します:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: 1番目のステップで作成したクラスター名（例：`wallarm-cluster`）。
    * `<FAMILY_PARAM_VALUE>`: 作成したタスク定義の名前。JSONファイル内で指定された`family`パラメータの値に対応する必要があります（例：`wallarm-api-security-node`）。
1. AWS Management Consoleで**Elastic Container Service**→実行中のタスクがあるクラスター→**Tasks**を開き、タスクが一覧に表示されていることを確認します。
1. [フィルタリングノードの動作をテスト](#testing-the-filtering-node-operation)します。

## フィルタリングノードの動作テスト

1. AWS Management Consoleで実行中のタスクを開き、**External Link**フィールドからコンテナのIPアドレスをコピーします。

    ![Settig up container instance][aws-copy-container-ip-img]

    IPアドレスが空の場合は、コンテナが**RUNNING**状態になっているか確認してください。

2. コピーしたアドレスに対して、テスト[Path Traversal][ptrav-attack-docs]攻撃のリクエストを送信します:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Wallarm Consoleで[US Cloud](https://us1.my.wallarm.com/attacks)または[EU Cloud](https://my.wallarm.com/attacks)の**Attacks**を開き、攻撃が一覧に表示されていることを確認します。
    ![Attacks in UI][attacks-in-ui-image]

コンテナデプロイ時に発生したエラーの詳細は、AWS Management Consoleのタスク詳細に表示されます。コンテナが利用できない場合は、必要なフィルタリングノードパラメータが正しい値でコンテナに渡されていることを確認してください。