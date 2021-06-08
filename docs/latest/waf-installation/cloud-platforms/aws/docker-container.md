[default-ip-blocking-settings]:     ../../../admin-en/configure-ip-blocking-nginx-en.md
[wallarm-acl-directive]:            ../../../admin-en/configure-parameters-en.md#wallarm_acl
[allocating-memory-guide]:          ../../../admin-en/configuration-guides/allocate-resources-for-waf-node.md
[mount-config-instr]:               #deploying-the-waf-node-docker-container-configured-through-the-mounted-file
[nginx-waf-directives]:             ../../../admin-en/configure-parameters-en.md

# Deployment of the WAF node Docker image to AWS

This quick guide provides the steps to deploy the [Docker image of the NGINX-based WAF node](https://hub.docker.com/r/wallarm/node) to the Amazon cloud platform using the [Amazon Elastic Container Service (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/).

!!! warning "The instructions limitations"
    These instructions do not cover the configuration of load balancing and WAF node autoscaling. If setting up these components yourself, we recommend that you review an appropriate part of the [AWS instructions](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/).

## Requirements

* AWS account and user with the **admin** permissions
* AWS CLI 1 or AWS CLI 2 properly [installed](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) and [configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
* Access to the account with the **Administrator** or **Deploy** role and two‑factor authentication disabled in the Wallarm Console for the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)

## Options for the WAF node Docker container configuration

--8<-- "../include/waf/installation/docker-running-options.md"

## Deploying the WAF node Docker container configured through environment variables

To deploy the containerized WAF node configured only through environment variables, the AWS Management Console and AWS CLI are used.

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/console/home) → the **Services** list → **Elastic Container Service**.
2. Proceed to cluster creation by the button **Create Cluster**:
      1. Select the template **EC2 Linux + Networking**.
      2. Specify the cluster name, for example: `waf-cluster`.
      3. If required, set other settings following the [AWS instructions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html).
      4. Save the cluster.
3. Save the sensitive data used for the WAF node and Wallarm Cloud connection setup in the [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) or [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html). Sensitive data includes the following environment variables:

    * `<DEPLOY_USER>`: email to the **Deploy** or **Administrator** user account in the Wallarm Console.
    * `<DEPLOY_PASSWORD>`: password to the **Deploy** or **Administrator** user account in the Wallarm Console.

    In these instructions, sensitive data is stored in the AWS Secrets Manager.

    !!! warning "Access to the sensitive data storage"
        To allow the Docker container to read the encrypted sensitive data, please ensure the AWS settings meet the following requirements:
        
        * Sensitive data is stored in the region used to run the Docker container.
        * The IAM policy **SecretsManagerReadWrite** is attached to the user specified in the `executionRoleArn` parameter of the task definition. [More details on the IAM policies setup →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
4. Create the following local JSON file with the [task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) (task definition sets the Docker container operating scenario):

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
                        "value": "<HOST_TO_PROTECT_WITH_WAF>"
                    }
                ],
                "secrets": [
                    {
                        "name": "DEPLOY_PASSWORD",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<DEPLOY_PASSWORD_PARAMETER_NAME>::"
                    },
                    {
                        "name": "DEPLOY_USER",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<DEPLOY_USER_PARAMETER_NAME>::"
                    }
                ],
                "name": "waf-container",
                "image": "registry-1.docker.io/wallarm/node:2.18.1-2"
                }
            ],
            "family": "wallarm-waf-node"
            }
         ```
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
                        "value": "<HOST_TO_PROTECT_WITH_WAF>"
                    }
                ],
                "secrets": [
                    {
                        "name": "DEPLOY_PASSWORD",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<DEPLOY_PASSWORD_PARAMETER_NAME>::"
                    },
                    {
                        "name": "DEPLOY_USER",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<DEPLOY_USER_PARAMETER_NAME>::"
                    }
                ],
                "name": "waf-container",
                "image": "registry-1.docker.io/wallarm/node:2.18.1-2"
                }
            ],
            "family": "wallarm-waf-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [your AWS account ID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * The `environment` object sets the environment variables that should be passed to the Docker container in a text format. The set of available environment variables is described in the table below. It is recommended to pass the variables `DEPLOY_USER` and `DEPLOY_PASSWORD` in the `secrets` object.
    * The `secret` object sets the environment variables that should be passed to the Docker container as the links to the sensitive data storage. The format of values depends on the selected storage (see more details in the [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) or [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) documentation).

        It is recommended to pass the variables `DEPLOY_USER` and `DEPLOY_PASSWORD` in the `secrets` object.

        --8<-- "../include/waf/installation/nginx-docker-all-env-vars.md"
    
    * All configuration file parameters are described in the [AWS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html).
5. Register the task definition based on the JSON configuration file by using the [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) command:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: path to the JSON file with the task definition on the local machine.
    * `<JSON_FILE_NAME>`: name and extension of the JSON file with the task definition.
6. Run the task in the cluster by using the [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html) command:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: name of the cluster created in the first step. For example, `waf-cluster`.
    * `<FAMILY_PARAM_VALUE>`: name of the created task definition. The value should correspond to the `family` parameter value specified in the JSON file with the task definition. For example, `wallarm-waf-node`.
7. Open the AWS Management Console → **Elastic Container Service** → cluster with the running task → **Tasks** and ensure the task is displayed in the list.
8. [Test the WAF node operation](#testing-the-waf-node-operation).

## Deploying the WAF node Docker container configured through the mounted file

To deploy the containerized WAF node configured through environment variables and mounted file, the AWS Management Console and AWS CLI are used.

In these instructions, the configuration file is mounted from the [AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html) file system. You can review other methods for mounting the file in the [AWS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html).

To deploy the container with environment variables and configuration file mounted from AWS EFS:

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/console/home) → the **Services** list → **Elastic Container Service**.
2. Proceed to cluster creation by the button **Create Cluster**:

    * **Template**: `EC2 Linux + Networking`.
    * **Cluster name**: `waf-cluster` (as an example).
    * **Provisioning Model**: `On-Demand Instance`.
    * **EC2 instance type**: `t2.micro`.
    * **Number of instances**: `1`.
    * **EC2 AMI ID**: `Amazon Linux 2 Amazon ECS-optimized AMI`.
    * **Key pair**: [key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) for SSH connection to the instance. You will need to connect to the instance via SSH to upload the configuration file to the storage.
   * Other settings can be left as default. When changing other settings, it is recommended to follow the [instructions on AWS EFS setup](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html).
3. Configure the AWS EFS storage following steps 2-4 of the [AWS instructions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html).
4. In the 4th step of AWS instructions, create the configuration file `default` and place the file in the directory that stores the files for mounting by default. The file `default` should cover the WAF node configuration. An example of the file with minimal settings:

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
        # wallarm_instance 1;
        # wallarm_acl default;

        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    [Set of WAF node directives that can be specified in the configuration file →](../../../admin-en/configure-parameters-en.md)
5. Save the sensitive data used for the WAF node and Wallarm Cloud connection setup in the [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) or [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html). Sensitive data includes the following environment variables:

    * `<DEPLOY_USER>`: email to the **Deploy** or **Administrator** user account in the Wallarm Console.
    * `<DEPLOY_PASSWORD>`: password to the **Deploy** or **Administrator** user account in the Wallarm Console.

    In these instructions, sensitive data is stored in the AWS Secrets Manager.

    !!! warning "Access to the sensitive data storage"
        To allow the Docker container to read the encrypted sensitive data, please ensure the AWS settings meet the following requirements:
        
        * Sensitive data is stored in the region used to run the Docker container.
        * The IAM policy **SecretsManagerReadWrite** is attached to the user specified in the `executionRoleArn` parameter of the task definition. [More details on the IAM policies setup →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
6. Create the following local JSON file with the [task definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) (task definition sets the Docker container operating scenario):

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
                        "name": "DEPLOY_PASSWORD",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<DEPLOY_PASSWORD_PARAMETER_NAME>::"
                    },
                    {
                        "name": "DEPLOY_USER",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<DEPLOY_USER_PARAMETER_NAME>::"
                    }
                ],
                "name": "waf-container",
                "image": "registry-1.docker.io/wallarm/node:2.18.1-2"
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
            "family": "wallarm-waf-node"
            }
         ```
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
                        "name": "DEPLOY_PASSWORD",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<DEPLOY_PASSWORD_PARAMETER_NAME>::"
                    },
                    {
                        "name": "DEPLOY_USER",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<DEPLOY_USER_PARAMETER_NAME>::"
                    }
                ],
                "name": "waf-container",
                "image": "registry-1.docker.io/wallarm/node:2.18.1-2"
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
            "family": "wallarm-waf-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [your AWS account ID](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * `<PATH_FOR_MOUNTED_CONFIG>`: directory of the container to mount the configuration file to. Configuration files can be mounted to the following container directories used by NGINX:

        * `/etc/nginx/conf.d` — common settings
        * `/etc/nginx/sites-enabled` — virtual host settings
        * `/var/www/html` — static files

        The WAF node directives should be described in the `/etc/nginx/sites-enabled/default` file.
    
    * `<NAME_FROM_VOLUMES_OBJECT>`: name of the `volumes` object containing the configuration of the mounted file AWS EFS storage (the value should be the same as `<VOLUME_NAME>`).
    * `<VOLUME_NAME>`: name of the `volumes` object that contains the configuration of the mounted file AWS EFS storage.
    * `<EFS_FILE_SYSTEM_ID>`: ID of the AWS EFS file system containing the file that should be mounted to the container. ID is displayed in the AWS Management Console → **Services** → **EFS** → **File systems**.
    * The `environment` object sets the environment variables that should be passed to the Docker container in a text format. The set of available environment variables is described in the table below. It is recommended to pass the variables `DEPLOY_USER` and `DEPLOY_PASSWORD` in the `secrets` object.
    * The `secret` object sets the environment variables that should be passed to the Docker container as the links to the sensitive data storage. The format of values depends on the selected storage (see more details in the [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) or [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html) documentation).

        It is recommended to pass the variables `DEPLOY_USER` and `DEPLOY_PASSWORD` in the `secrets` object.

        --8<-- "../include/waf/installation/nginx-docker-env-vars-to-mount.md"
    
    * All configuration file parameters are described in the [AWS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html).
7. Register the task definition based on the JSON configuration file by using the [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html) command:

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: path to the JSON file with the task definition on the local machine.
    * `<JSON_FILE_NAME>`: name and extension of the JSON file with the task definition.
8. Run the task in the cluster by using the [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html) command:

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: name of the cluster created in the first step. For example, `waf-cluster`.
    * `<FAMILY_PARAM_VALUE>`: name of the created task definition. The value should correspond to the `family` parameter value specified in the JSON file with the task definition. For example, `wallarm-waf-node`.
9. Open the AWS Management Console → **Elastic Container Service** → cluster with the running task → **Tasks** and ensure the task is displayed in the list.
10. [Test the WAF node operation](#testing-the-waf-node-operation).

## Testing the WAF node operation

1. In the AWS Management Console, open the running task and copy the container IP address from the field **External Link**.

    ![!Settig up container instance](../../../images/waf-installation/aws/container-copy-ip.png)

    If the IP address is empty, please ensure the container is in the **RUNNING** status.

2. Send the request with test [SQLI](../../../attacks-vulns-list.md#sql-injection) and [XSS](../../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the copied address:

    ```
    curl http://<COPIED_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
3. Open the Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in UI](../../../images/admin-guides/test-attacks.png)

Details on errors that occurred during the container deployment are displayed in the task details in the AWS Management Console. If the container is unavailable, please ensure required WAF node parameters with correct values are passed to the container.
