[allocating-memory-guide]:          ../../../admin-ja/configuration-guides/allocate-resources-for-node.md
[mount-config-instr]:               #deploying-the-wallarm-node-docker-container-configured-through-the-mounted-file
[nginx-waf-directives]:             ../../../admin-ja/configure-parameters-ja.md
[graylist-docs]:                    ../../../user-guides/ip-lists/graylist.md
[filtration-modes-docs]:            ../../../admin-ja/configure-wallarm-mode.md
[application-configuration]:        ../../../user-guides/settings/applications.md
[node-status-docs]:                 ../../../admin-ja/configure-statistics-service.md

# Wallarm ノード Docker イメージを AWS にデプロイする

このクイックガイドでは、[NGINX ベースの Wallarm ノードのDocker イメージ](https://hub.docker.com/r/wallarm/node) を [Amazon Elastic Container Service (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/) を使用して Amazon クラウドプラットフォームにデプロイする手順を提供しています。

!!! warning "使用上の制限事項"
    これらの手順では、負荷分散とノードの自動スケーリングの設定はカバーされていません。これらのコンポーネントを自分で設定する場合は、適切な部分を含む [AWS インストラクション](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/) を確認することをお勧めします。

## 要件

* **admin** 権限を持つ AWS アカウントとユーザー
* AWS CLI 1 もしくは AWS CLI 2 が適切に [インストール](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) および [設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) されていること
* [US クラウド](https://us1.my.wallarm.com/) または [EU クラウド](https://my.wallarm.com/) で **管理者** ロールを持つ Wallarm Console へのアカウントアクセス

## Wallarm ノード Docker コンテナの設定オプション

--8<-- "../include-ja/waf/installation/docker-running-options.md"環境変数を介して設定されたWallarmノードDockerコンテナのデプロイ

環境変数のみで構成されたコンテナ化されたWallarmフィルタリングノードをデプロイするには、AWS Management ConsoleとAWS CLIが使用されます。

1. [USクラウド](https://us1.my.wallarm.com/nodes)または[EUクラウド](https://my.wallarm.com/nodes)のWallarm Console → **Nodes**を開いて、**Wallarmノード**タイプのノードを作成します。

    ![!Wallarmノードの作成](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. [AWS Management Console](https://console.aws.amazon.com/console/home)にサインイン → **Services**リスト → **Elastic Container Service**。
1. **Create Cluster**ボタンでクラスタ作成に進みます：
      1. テンプレート**EC2 Linux + Networking**を選択します。
      2. クラスタ名を指定します（例：`wallarm-cluster`）。
      3. 必要に応じて、[AWSの手順](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html)に従って他の設定を行います。
      4. クラスタを保存します。
1. Wallarm Cloudに接続するために必要な機密データ（ノードトークン）を[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWSシステムマネージャー → パラメーターストア](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)を使用して暗号化します。

    これらの手順では、機密データはAWS Secrets Managerに保存されています。

    !!! warning "機密データ保管へのアクセス"
        Dockerコンテナが暗号化された機密データを読み取ることができるようにするためには、AWS設定が以下の要件を満たすことを確認してください：
        
        * 機密データは、Dockerコンテナを実行するために使用されるリージョンに保存されています。
        * IAMポリシー**SecretsManagerReadWrite**が、タスク定義の`executionRoleArn`パラメータで指定されたユーザーアカウントにアタッチされています。[IAMポリシーの設定方法についての詳細→](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. [タスク定義](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)を使用して、Dockerコンテナの動作シナリオを設定する次のローカルJSONファイルを作成します。

    === "Wallarm USクラウドを使用している場合"
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
                "image": "registry-1.docker.io/wallarm/node:4.4.5-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```
    === "Wallarm EUクラウドを使用している場合"
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
                "image": "registry-1.docker.io/wallarm/node:4.4.5-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [お使いのAWSアカウントID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html)。
    * `environment`オブジェクトは、Dockerコンテナにテキスト形式で渡す必要がある環境変数を設定します。利用可能な環境変数のセットは、以下の表で説明されています。変数`WALLARM_API_TOKEN`は、`secrets`オブジェクトで渡すことをお勧めします。
    * `secret`オブジェクトは、Dockerコンテナに機密データのストレージへのリンクとして渡す必要がある環境変数を設定します。値の形式は、選択したストレージに依存します（[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWSシステムマネージャー → パラメーターストア](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)のドキュメントで詳細を確認してください）。

        変数`WALLARM_API_TOKEN`は、`secrets`オブジェクトで渡すことをお勧めします。

        --8<-- "../include-ja/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * すべての設定ファイルパラメータは、[AWSドキュメント](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)で説明されています。
1. [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html)コマンドを使用して、JSON設定ファイルに基づいたタスク定義を登録します:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: ローカルマシン上のタスク定義を含むJSONファイルへのパス。
    * `<JSON_FILE_NAME>`: タスク定義を含むJSONファイルの名前と拡張子。
1. [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html)コマンドを使用して、クラスタでタスクを実行します:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: 最初のステップで作成したクラスタの名前。例：`wallarm-cluster`。
    * `<FAMILY_PARAM_VALUE>`: 作成されたタスク定義の名前。値は、タスク定義のJSONファイルに指定された`family`パラメータの値と一致する必要があります。例：`wallarm-api-security-node`。
1. AWS Management Console → **Elastic Container Service** → 実行中のタスクを持つクラスタ → **Tasks**を開いて、タスクがリストに表示されていることを確認します。
1. [フィルタリングノードの操作をテストする](#testing-the-filtering-node-operation)。AWS Management ConsoleとAWS CLIを使って、環境変数とマウントされたファイルで設定されたコンテナ化されたWallarmフィルタリングノードをデプロイする方法について説明しています。

これらの手順では、設定ファイルが[AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html)ファイルシステムからマウントされます。ファイルのマウント方法について他の方法を検討するには、[AWSドキュメント](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html)を参照してください。

AWS EFSから環境変数と設定ファイルをマウントしてコンテナをデプロイするには、次の手順を実行します。

1. [US Cloud](https://us1.my.wallarm.com/nodes)または[EU Cloud](https://my.wallarm.com/nodes)で**Wallarm Console** → **Nodes**を開き、**Wallarm node**タイプのノードを作成します。

    ![!Wallarm node creation](../../../images/user-guides/nodes/create-cloud-node.png)
1. 生成されたトークンをコピーします。
1. [AWS Management Console](https://console.aws.amazon.com/console/home)にサインインします。→ **Services**リスト → **Elastic Container Service**。
1. **Create Cluster**ボタンでクラスタ作成に進みます。

    * **Template**：`EC2 Linux + Networking`。
    * **Cluster name**：`wallarm-cluster`(例)。
    * **Provisioning Model**：`On-Demand Instance`。
    * **EC2 instance type**：`t2.micro`。
    * **Number of instances**：`1`。
    * **EC2 AMI ID**：`Amazon Linux 2 Amazon ECS-optimized AMI`。
    * **Key pair**：インスタンスへのSSH接続用の[key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)。ストレージに設定ファイルをアップロードするために、インスタンスにSSHで接続する必要があります。
   * 他の設定はデフォルトのままにしておいても構いません。他の設定を変更する場合は、[AWS EFSセットアップに関する手順](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html)に従うことをお勧めします。
1. [AWS教材](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html)のステップ2-4に従って、AWS EFSストレージを設定します。
1. AWSの手順のステップ4で、`default`という名前の設定ファイルを作成し、デフォルトでマウント用のファイルが格納されているディレクトリに配置します。`default`ファイルは、フィルタリングノードの設定をカバーする必要があります。最小限の設定でのファイルの例は次のとおりです。

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

    [設定ファイルで指定できるフィルタリングノードのディレクティブのセット →](../../../admin-en/configure-parameters-en.md)
1. [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)や[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)を使って、Wallarm Cloudに接続するために必要な機密情報（ノードトークン）を暗号化します。

    これらの手順では、機密データはAWS Secrets Managerに保存されています。

    !!! warning "機密データストレージへのアクセス"
        Dockerコンテナが暗号化された機密データを読み取ることができるようにするために、AWSの設定が以下の要件を満たしていることを確認してください:
        
        * ドッカーコンテナを実行するリージョンで、機密データが保存されている。
        * タスク定義の`executionRoleArn`パラメータに指定されているユーザに、IAMポリシー**SecretsManagerReadWrite**が関連付けられている。[IAMポリシーのセットアップに関する詳細はこちら→](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. [タスク定義](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)のある次のローカルJSONファイルを作成してください（タスク定義はDockerコンテナの動作シナリオを設定します）:

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
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.4.5-1"
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
                "image": "registry-1.docker.io/wallarm/node:4.4.5-1"
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
    * `<PATH_FOR_MOUNTED_CONFIG>`: 設定ファイルをマウントするコンテナのディレクトリ。設定ファイルは、NGINXが使用する次のコンテナディレクトリにマウントできます。

        * `/etc/nginx/conf.d` — 一般的な設定
        * `/etc/nginx/sites-enabled` — 仮想ホストの設定
        * `/var/www/html` — 静的ファイル

        フィルタリングノードの指令は、`/etc/nginx/sites-enabled/default`ファイルに記述する必要があります。
    
    * `<NAME_FROM_VOLUMES_OBJECT>`: マウントされたファイルのAWS EFSストレージ設定が含まれている`volumes`オブジェクトの名前（値は`<VOLUME_NAME>`と同じでなければなりません）。
    * `<VOLUME_NAME>`: マウントされたファイルのAWS EFSストレージ設定が含まれている`volumes`オブジェクトの名前。
    * `<EFS_FILE_SYSTEM_ID>`: コンテナにマウントするべきファイルを含むAWS EFSファイルシステムのID。IDは、AWS Management Console → **Services** → **EFS** → **File systems**で表示されます。
    * `environment`オブジェクトは、テキスト形式でDockerコンテナに渡すべき環境変数を設定します。利用可能な環境変数のセットは、下表に記載されています。`WALLARM_API_TOKEN`変数は、`secrets`オブジェクトで渡すことをお勧めします。
    * `secret`オブジェクトは、機密データストレージへのリンクとしてDockerコンテナに渡すべき環境変数を設定します。値の形式は、選択されたストレージによって異なります（[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)または[AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)のドキュメントで詳細を参照してください）。

        `WALLARM_API_TOKEN`変数は、`secrets`オブジェクトで渡すことをお勧めします。

        --8<-- "../include-ja/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * すべての設定ファイルのパラメータは、[AWSドキュメント](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)で説明されています。
1. JSON設定ファイルに基づいてタスク定義を登録します。コマンドは[`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html)を使用してください。

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: ローカルマシン上のタスク定義があるJSONファイルへのパス。
    * `<JSON_FILE_NAME>`: タスク定義があるJSONファイルの名前と拡張子。
1. クラスタでタスクを実行します。コマンドは[`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html)を使用してください。

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: 最初のステップで作成されたクラスタの名前。たとえば、`wallarm-cluster`。
    * `<FAMILY_PARAM_VALUE>`: 作成されたタスク定義の名前。値は、タスク定義のJSONファイルに指定された`family`パラメータの値と同じでなければなりません。例：`wallarm-api-security-node`。
1. AWS Management Console → **Elastic Container Service** → 実行中のタスクがあるクラスタ → **Tasks**を開き、タスクがリストに表示されていることを確認します。
1. [フィルタリングノードの動作をテストします](#testing-the-filtering-node-operation)。## フィルタリングノードの動作のテスト

1. AWS管理コンソールで実行中のタスクを開き、**External Link**のフィールドからコンテナIPアドレスをコピーします。

    ![!コンテナインスタンスの設定](../../../images/waf-installation/aws/container-copy-ip.png)

    IPアドレスが空の場合は、コンテナが**RUNNING**ステータスにあることを確認してください。

2. テスト用の [パストラバーサル](../../../attacks-vulns-list.md#path-traversal) 攻撃をコピーしたアドレスにリクエストを送信します。

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. [USクラウド](https://us1.my.wallarm.com/search) または [EUクラウド](https://my.wallarm.com/search) のWallarm Console → **イベント**を開き、攻撃がリストに表示されていることを確認します。

    ![!UIの攻撃](../../../images/admin-guides/test-attacks-quickstart.png)

コンテナのデプロイ中に発生したエラーの詳細は、AWS管理コンソールのタスク詳細に表示されます。コンテナが利用できない場合は、必要なフィルタリングノードパラメータが正しい値でコンテナに渡されていることを確認してください。