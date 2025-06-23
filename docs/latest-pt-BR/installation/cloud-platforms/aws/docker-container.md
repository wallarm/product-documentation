# Implantando a Imagem Docker do Wallarm na AWS

Este guia rápido fornece as etapas para implantar a [imagem Docker do nó Wallarm baseado em NGINX](https://hub.docker.com/r/wallarm/node) na plataforma em nuvem da Amazon usando o [Amazon Elastic Container Service (Amazon ECS)](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/).

!!! aviso "Limitações das instruções"
    Essas instruções não abrangem a configuração de balanceamento de carga e escalonamento automático do nó. Se estiver configurando esses componentes sozinho, recomendamos que você reveja a parte apropriada das [instruções da AWS](https://aws.amazon.com/getting-started/hands-on/deploy-docker-containers/).

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/aws-ecs-use-cases.md"

## Requisitos

* Conta e usuário da AWS com permissões **admin**
* AWS CLI 1 ou AWS CLI 2 devidamente [instalada](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) e [configurada](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
* Acesso à conta com a função **Administrador** e autenticação de dois fatores desativada no Console Wallarm para o [US Cloud](https://us1.my.wallarm.com/) ou [EU Cloud](https://my.wallarm.com/)

## Opções para a configuração do contêiner Docker do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/docker-running-options.md"

## Implantando o contêiner Docker do nó Wallarm configurado através de variáveis de ambiente

Para implantar o nó de filtragem Wallarm contêinerizado configurado apenas por meio de variáveis de ambiente, são usados o Console de Gerenciamento da AWS e o AWS CLI.

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Faça login no [AWS Management Console](https://console.aws.amazon.com/console/home) → lista de **Serviços** → **Elastic Container Service**.
1. Prossiga para a criação do cluster pelo botão **Criar Cluster**:
      1. Selecione o modelo **EC2 Linux + Networking**.
      2. Especifique o nome do cluster, por exemplo: `wallarm-cluster`.
      3. Se necessário, defina outras configurações de acordo com as [instruções da AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html).
      4. Salve o cluster.
1. Criptografe os dados sensíveis necessários para conectar ao Wallarm Cloud (token do nó) usando o [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) ou [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html).

    Nestas instruções, os dados sensíveis são armazenados no AWS Secrets Manager.

    !!! aviso "Acesso ao armazenamento de dados sensíveis"
        Para permitir que o contêiner Docker leia os dados sensíveis criptografados, certifique-se de que as configurações da AWS atendem aos seguintes requisitos:
        
        * Os dados sensíveis são armazenados na região usada para executar o contêiner Docker.
        * A política IAM **SecretsManagerReadWrite** está anexada ao usuário especificado no parâmetro `executionRoleArn` da definição de tarefa. [Mais detalhes sobre a configuração das políticas IAM →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. Crie o seguinte arquivo JSON local com a [definição de tarefa](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) (a definição de tarefa define o cenário operacional do contêiner Docker):

    === "Se você usa o Wallarm US Cloud"
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
                        "value": "<HOST_PARA_PROTEGER_COM_WALLARM>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.8.0-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```
    === "Se você usa o Wallarm EU Cloud"
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
                        "value": "<HOST_PARA_PROTEGER_COM_WALLARM>"
                    }
                ],
                "secrets": [
                    {
                        "name": "WALLARM_API_TOKEN",
                        "valueFrom": "arn:aws:secretsmanager:<SECRETS_MANAGER_AWS_REGION>:<AWS_ACCOUNT_ID>:secret:<SECRET_NAME>:<WALLARM_API_TOKEN_PARAMETER_NAME>::"
                    }
                ],
                "name": "wallarm-container",
                "image": "registry-1.docker.io/wallarm/node:4.8.0-1"
                }
            ],
            "family": "wallarm-api-security-node"
            }
         ```

    * `<AWS_ACCOUNT_ID>`: [seu ID da conta AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * O objeto `environment` estabelece as variáveis de ambiente que devem ser passadas para o contêiner Docker em formato de texto. O conjunto de variáveis de ambiente disponíveis é descrito na tabela abaixo. Recomenda-se passar a variável `WALLARM_API_TOKEN` no objeto `secrets`.
    * O objeto `secret` estabelece as variáveis de ambiente que devem ser passadas para o contêiner Docker como os links para o armazenamento de dados sensíveis. O formato dos valores depende do armazenamento selecionado (veja mais detalhes na documentação do [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) ou [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)).

        É recomendado passar a variável `WALLARM_API_TOKEN` no objeto `secrets`.

        --8<-- "../include-pt-BR/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * Todos os parâmetros do arquivo de configuração são descritos na [documentação da AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html).
1. Registre a definição de tarefa com base no arquivo de configuração JSON usando o comando [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html):

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: caminho para o arquivo JSON com a definição de tarefa na máquina local.
    * `<JSON_FILE_NAME>`: nome e extensão do arquivo JSON com a definição de tarefa.
1. Execute a tarefa no cluster usando o comando [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html):

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: nome do cluster criado na primeira etapa. Por exemplo, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: nome da definição de tarefa criada. O valor deve corresponder ao valor do parâmetro `family` especificado no arquivo JSON com a definição de tarefa. Por exemplo, `wallarm-api-security-node`.
1. Abra o AWS Management Console → **Elastic Container Service** → cluster com a tarefa em execução → **Tasks** e certifique-se de que a tarefa está exibida na lista.
1. [Teste a operação do nó de filtragem](#testing-the-filtering-node-operation).

## Implantando o contêiner Docker do nó Wallarm configurado através do arquivo montado

Para implantar o nó de filtragem Wallarm contêinerizado configurado por meio de variáveis de ambiente e arquivo montado, são usados o Console de Gerenciamento da AWS e o AWS CLI.

Nestas instruções, o arquivo de configuração é montado a partir do sistema de arquivos [AWS EFS](https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html). Você pode revisar outros métodos para montar o arquivo na [documentação da AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html).

Para implantar o contêiner com variáveis de ambiente e arquivo de configuração montado a partir da AWS EFS:

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Faça login no [AWS Management Console](https://console.aws.amazon.com/console/home) → lista de **Serviços** → **Elastic Container Service**.
1. Prossiga para a criação do cluster pelo botão **Criar Cluster**:

    * **Modelo**: `EC2 Linux + Networking`.
    * **Nome do cluster**: `wallarm-cluster` (como exemplo).
    * **Modelo de provisionamento**: `On-Demand Instance`.
    * **Tipo de instância EC2**: `t2.micro`.
    * **Número de instâncias**: `1`.
    * **EC2 AMI ID**: `Amazon Linux 2 Amazon ECS-optimized AMI`.
    * **Par de chaves**: [par de chaves](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) para conexão SSH com a instância. Você precisará se conectar à instância via SSH para enviar o arquivo de configuração para o armazenamento.
   * As outras configurações podem ser mantidas padrão. Ao alterar outras configurações, é recomendável seguir as [instruções de configuração do AWS EFS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html).
1. Configure o armazenamento AWS EFS seguindo as etapas 2-4 das [instruções da AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html).
1. Na 4ª etapa das instruções da AWS, crie o arquivo de configuração `default` e coloque o arquivo no diretório que armazena os arquivos para montagem por padrão. O arquivo `default` deve cobrir a configuração do nó de filtragem. Um exemplo do arquivo com configurações mínimas:

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

    [Conjunto de diretivas do nó de filtragem que podem ser especificadas no arquivo de configuração → ][nginx-waf-directives]
1. Criptografe os dados sensíveis necessários para conectar ao Wallarm Cloud (token do nó) usando o [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) ou [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html).

    Nestas instruções, os dados sensíveis são armazenados no AWS Secrets Manager.

    !!! aviso "Acesso ao armazenamento de dados sensíveis"
        Para permitir que o contêiner Docker leia os dados sensíveis criptografados, certifique-se de que as configurações da AWS atendem aos seguintes requisitos:
        
        * Os dados sensíveis são armazenados na região usada para executar o contêiner Docker.
        * A política IAM **SecretsManagerReadWrite** está anexada ao usuário especificado no parâmetro `executionRoleArn` da definição de tarefa. [Mais detalhes sobre a configuração das políticas IAM →](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_identity-based-policies.html)
1. Crie o seguinte arquivo JSON local com a [definição de tarefa](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html) (a definição de tarefa define o cenário operacional do contêiner Docker):

    === "Se você usa o Wallarm US Cloud"
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
                "image": "registry-1.docker.io/wallarm/node:4.8.0-1"
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
    === "Se você usa o Wallarm EU Cloud"
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
                "image": "registry-1.docker.io/wallarm/node:4.8.0-1"
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

    * `<AWS_ACCOUNT_ID>`: [seu ID da conta AWS](https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html).
    * `<PATH_FOR_MOUNTED_CONFIG>`: diretório do contêiner para o qual o arquivo de configuração deve ser montado. Os arquivos de configuração podem ser montados nos seguintes diretórios de contêineres usados pelo NGINX:

        * `/etc/nginx/conf.d` — configurações comuns
        * `/etc/nginx/sites-enabled` — configurações do host virtual
        * `/var/www/html` — arquivos estáticos

        As diretivas do nó de filtragem devem ser descritas no arquivo `/etc/nginx/sites-enabled/default`.
    
    * `<NAME_FROM_VOLUMES_OBJECT>`: nome do objeto `volumes` que contém a configuração do armazenamento AWS EFS do arquivo montado (o valor deve ser o mesmo que `<VOLUME_NAME>`).
    * `<VOLUME_NAME>`: nome do objeto `volumes` que contém a configuração do armazenamento AWS EFS do arquivo montado.
    * `<EFS_FILE_SYSTEM_ID>`: ID do sistema de arquivos AWS EFS que contém o arquivo que deve ser montado no contêiner. ID é exibido no AWS Management Console → **Serviços** → **EFS** → **Sistemas de arquivos**.
    * O objeto `environment` estabelece as variáveis de ambiente que devem ser passadas para o contêiner Docker em formato de texto. O conjunto de variáveis de ambiente disponíveis é descrito na tabela abaixo. Recomenda-se passar a variável `WALLARM_API_TOKEN` no objeto `secrets`.
    * O objeto `secret` estabelece as variáveis de ambiente que devem ser passadas para o contêiner Docker como os links para o armazenamento de dados sensíveis. O formato dos valores depende do armazenamento selecionado (veja mais detalhes na documentação do [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) ou [AWS Systems Manager → Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-su-create.html)).

        É recomendado passar a variável `WALLARM_API_TOKEN` no objeto `secrets`.

        --8<-- "../include-pt-BR/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * Todos os parâmetros do arquivo de configuração são descritos na [documentação da AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html).
1. Registre a definição de tarefa com base no arquivo de configuração JSON usando o comando [`aws ecs register‑task‑definition`](https://docs.aws.amazon.com/cli/latest/reference/ecs/register-task-definition.html):

    ```bash
    aws ecs register-task-definition --cli-input-json file://<PATH_TO_JSON_FILE>/<JSON_FILE_NAME>
    ```

    * `<PATH_TO_JSON_FILE>`: caminho para o arquivo JSON com a definição de tarefa na máquina local.
    * `<JSON_FILE_NAME>`: nome e extensão do arquivo JSON com a definição de tarefa.
1. Execute a tarefa no cluster usando o comando [`aws ecs run-task`](https://docs.aws.amazon.com/cli/latest/reference/ecs/run-task.html):

    ```bash
    aws ecs run-task --cluster <CLUSTER_NAME> --launch-type EC2 --task-definition <FAMILY_PARAM_VALUE>
    ```

    * `<CLUSTER_NAME>`: nome do cluster criado na primeira etapa. Por exemplo, `wallarm-cluster`.
    * `<FAMILY_PARAM_VALUE>`: nome da definição de tarefa criada. O valor deve corresponder ao valor do parâmetro `family` especificado no arquivo JSON com a definição de tarefa. Por exemplo, `wallarm-api-security-node`.
1. Abra o AWS Management Console → **Elastic Container Service** → cluster com a tarefa em execução → **Tasks** e certifique-se de que a tarefa está exibida na lista.
1. [Teste a operação do nó de filtragem](#testing-the-filtering-node-operation).

## Testando a operação do nó de filtragem

1. No AWS Management Console, abra a tarefa em execução e copie o endereço IP do contêiner do campo **Link Externo**.

    ![Configurando a instância do contêiner][aws-copy-container-ip-img]

    Se o endereço IP estiver vazio, certifique-se de que o contêiner está no status **RUNNING**.

2. Envie a solicitação com o teste [Path Traversal][ptrav-attack-docs] para o endereço copiado:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Abra o Wallarm Console → **Events** na [US Cloud](https://us1.my.wallarm.com/attacks) ou [EU Cloud](https://my.wallarm.com/attacks) e certifique-se de que o ataque está exibido na lista.
    ![Ataques na UI][attacks-in-ui-image]

Os detalhes sobre erros que ocorreram durante a implantação do contêiner são exibidos nos detalhes da tarefa no AWS Management Console. Se o contêiner estiver indisponível, certifique-se de que os parâmetros necessários do nó de filtragem com valores corretos são passados para o contêiner.
