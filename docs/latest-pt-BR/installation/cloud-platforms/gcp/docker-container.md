# Implantação da Imagem Docker do Wallarm no GCP

Este guia rápido fornece as etapas para implantar a [imagem Docker do nó Wallarm baseado em NGINX](https://hub.docker.com/r/wallarm/node) na Google Cloud Platform usando o [componente Google Compute Engine (GCE)](https://cloud.google.com/compute).

!!! aviso "Limitações das instruções"
    Estas instruções não cobrem a configuração do balanceamento de carga e do auto escalonamento de nós. Se você está configurando esses componentes por conta própria, recomendamos que você leia a [documentação do GCP](https://cloud.google.com/compute/docs/load-balancing-and-autoscaling) apropriada.

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/google-gce-use-cases.md"

## Requisitos

* Conta GCP ativa
* [Projeto GCP criado](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
* [API do Compute Engine](https://console.cloud.google.com/apis/library/compute.googleapis.com?q=compute%20eng&id=a08439d8-80d6-43f1-af2e-6878251f018d) habilitada
* [Google Cloud SDK (gcloud CLI) instalado e configurado](https://cloud.google.com/sdk/docs/quickstart)
* Acesso à conta com a função **Administrador** e autenticação de dois fatores desativada no Console Wallarm para o [Cloud dos EUA](https://us1.my.wallarm.com/) ou [Cloud da UE](https://my.wallarm.com/)

## Opções para a configuração do container Docker do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/docker-running-options.md"

## Implantando o container Docker do nó Wallarm configurado por meio de variáveis de ambiente

Para implantar o nó de filtragem do Wallarm em um container, configurado apenas por meio de variáveis de ambiente, você pode usar o [Console GCP ou gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). Nestas instruções, o gcloud CLI é usado.

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Defina a variável de ambiente local com o token do nó Wallarm a ser usado para conectar a instância ao Cloud Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Crie a instância com o container Docker em execução usando o comando [`gcloud compute instances create-with-container`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container):

    === "Comando para o Cloud Wallarm dos EUA"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:4.8.0-1
        ```
    === "Comando para o Cloud Wallarm da UE"
        ```bash
        gcloud compute instances create-with-container <INSTANCE_NAME> \
            --zone <DEPLOYMENT_ZONE> \
            --tags http-server \
            --container-env WALLARM_API_TOKEN=${WALLARM_API_TOKEN} \
            --container-env NGINX_BACKEND=<HOST_TO_PROTECT_WITH_WALLARM> \
            --container-env WALLARM_API_HOST=us1.api.wallarm.com \
            --container-image registry-1.docker.io/wallarm/node:4.8.0-1
        ```

    * `<INSTANCE_NAME>`: nome da instância, por exemplo: `wallarm-node`.
    * `--zone`: [zona](https://cloud.google.com/compute/docs/regions-zones) que hospedará a instância.
    * `--tags`: tags da instância. Tags são usadas para configurar a disponibilidade da instância para outros recursos. No presente caso, a tag `http-server` abrindo a porta 80 é atribuída à instância.
    * `--container-image`: link para a imagem Docker do nó de filtragem.
    * `--container-env`: variáveis de ambiente com a configuração do nó de filtragem (variáveis disponíveis estão listadas na tabela abaixo). Por favor, observe que não é recomendado passar o valor de `WALLARM_API_TOKEN` explicitamente.

        --8<-- "../include-pt-BR/waf/installation/nginx-docker-all-env-vars-latest.md"
    
    * Todos os parâmetros do comando `gcloud compute instances create-with-container` são descritos na [documentação do GCP](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create-with-container).
1. Abra o [Console GCP → **Compute Engine** → Instâncias VM](https://console.cloud.google.com/compute/instances) e garanta que a instância seja exibida na lista.
1. [Teste a operação do nó de filtragem](#teste-da-operação-do-nó-de-filtragem).

## Implantando o container Docker do nó Wallarm configurado pelo arquivo montado

Para implantar o nó de filtragem do Wallarm em um container, configurado por meio de variáveis de ambiente e arquivo montado, você deve criar a instância, localizar o arquivo de configuração do nó de filtragem no sistema de arquivos desta instância e executar o container Docker nesta instância. Você pode executar estas etapas via [Console GCP ou gcloud CLI](https://cloud.google.com/compute/docs/containers/deploying-containers). Nestas instruções, o gcloud CLI é usado.

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Crie a instância baseada em qualquer imagem de sistema operacional do registro do Compute Engine usando o comando [`gcloud compute instances create`](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create):

    ```bash
    gcloud compute instances create <INSTANCE_NAME> \
        --image <PUBLIC_IMAGE_NAME> \
        --zone <DEPLOYMENT_ZONE> \
        --tags http-server
    ```

    * `<INSTANCE_NAME>`: nome da instância.
    * `--image`: nome da imagem do sistema operacional do registro do Compute Engine. A instância criada será baseada nesta imagem e será usada para executar o container Docker posteriormente. Se este parâmetro for omitido, a instância será baseada na imagem do Debian 10.
    * `--zone`: [zona](https://cloud.google.com/compute/docs/regions-zones) que hospedará a instância.
    * `--tags`: tags da instância. Tags são usadas para configurar a disponibilidade da instância para outros recursos. No presente caso, a tag `http-server` abrindo a porta 80 é atribuída à instância.
    * Todos os parâmetros do comando `gcloud compute instances create` são descritos na [documentação do GCP](https://cloud.google.com/sdk/gcloud/reference/compute/instances/create).
1. Abra o [Console GCP → **Compute Engine** → Instâncias VM](https://console.cloud.google.com/compute/instances) e garanta que a instância seja exibida na lista e esteja no status **RUNNING**.
1. Conecte-se à instância via SSH seguindo as [instruções do GCP](https://cloud.google.com/compute/docs/instances/ssh).
1. Instale os pacotes do Docker na instância seguindo as [instruções para um sistema operacional adequado](https://docs.docker.com/engine/install/#server).
1. Defina a variável de ambiente local com o token do nó Wallarm a ser usado para conectar a instância ao Cloud Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Na instância, crie o diretório com o arquivo `default` contendo a configuração do nó de filtragem (por exemplo, o diretório pode ser nomeado como `configs`). Um exemplo do arquivo com configurações mínimas:

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

    [Conjunto de diretivas do nó de filtragem que podem ser especificadas no arquivo de configuração →][nginx-waf-directives]
1. Execute o container Docker do nó Wallarm usando o comando `docker run` com variáveis de ambiente passadas e arquivo de configuração montado:

    === "Comando para o Cloud Wallarm dos EUA"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.8.0-1
        ```
    === "Comando para o Cloud Wallarm da UE"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.8.0-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: caminho para o arquivo de configuração criado na etapa anterior. Por exemplo, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: diretório do container para montar o arquivo de configuração. Os arquivos de configuração podem ser montados nos seguintes diretórios do container usados pelo NGINX:

        * `/etc/nginx/conf.d` — configurações comuns
        * `/etc/nginx/sites-enabled` — configurações do host virtual
        * `/var/www/html` — arquivos estáticos

        As diretivas do nó de filtragem devem ser descritas no arquivo `/etc/nginx/sites-enabled/default`.
    
    * `-p`: porta que o nó de filtragem escuta. O valor deve ser o mesmo da porta da instância.
    * `-e`: variáveis de ambiente com a configuração do nó de filtragem (variáveis disponíveis estão listadas na tabela abaixo). Note que não é recomendado passar o valor de `WALLARM_API_TOKEN` explicitamente.

        --8<-- "../include-pt-BR/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Teste a operação do nó de filtragem](#teste-da-operação-do-nó-de-filtragem).

## Teste da operação do nó de filtragem

1. Abra o [Console GCP → **Compute Engine** → Instâncias VM](https://console.cloud.google.com/compute/instances) e copie o endereço IP da instância da coluna **External IP**.

    ![Configuração da instância do container][copy-container-ip-gcp-img]

    Se o endereço IP estiver vazio, verifique se a instância está no status **RUNNING**.

2. Envie a solicitação com o teste [Path Traversal][ptrav-attack-docs] até o endereço copiado:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Abra o Console Wallarm → **Events** no [Cloud dos EUA](https://us1.my.wallarm.com/attacks) ou [Cloud da UE](https://my.wallarm.com/attacks) e certifique-se de que o ataque está exibido na lista.
    ![Ataques na UI][attacks-in-ui-image]

Detalhes de erros que ocorreram durante a implantação do container são exibidos no menu de instância **View logs**. Se a instância estiver indisponível, verifique se os parâmetros do nó de filtragem necessários com os valores corretos são passados para o container.