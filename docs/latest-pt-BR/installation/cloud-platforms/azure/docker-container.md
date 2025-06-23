# Implantação da Imagem Docker da Wallarm no Azure

Este guia rápido fornece as etapas para implantar a [Imagem Docker do nó Wallarm baseado em NGINX](https://hub.docker.com/r/wallarm/node) na plataforma de nuvem Microsoft Azure usando o serviço [**Container Instances do Azure**](https://docs.microsoft.com/en-us/azure/container-instances/).

!!! aviso "Limitações das instruções"
    Estas instruções não cobrem a configuração do balanceamento de carga e do dimensionamento automático de nós. Se estiver configurando esses componentes por conta própria, recomendamos que você leia a documentação sobre o [Gateway de Aplicativos Azure](https://docs.microsoft.com/en-us/azure/application-gateway/overview).

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/azure-container-instances-use-cases.md"

## Requisitos

* Assinatura ativa do Azure
* [CLI Azure instalado](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
* Acesso à conta com a função de **Administrador** e autenticação de dois fatores desativada no Console Wallarm para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou a [Nuvem da UE](https://my.wallarm.com/)

## Opções para a configuração do contêiner Docker do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/docker-running-options.md"

## Implantando o contêiner Docker do nó Wallarm configurado através de variáveis de ambiente

Para implantar o nó de filtragem em contêiner Wallarm configurado apenas por meio de variáveis de ambiente, você pode usar as seguintes ferramentas:

* [CLI Azure](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart)
* [Portal Azure](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-portal)
* [PowerShell Azure](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-powershell)
* [Modelo ARM](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-quickstart-template)
* [CLI Docker](https://docs.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli)

Nestas instruções, o contêiner é implantado usando a CLI Azure.

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Entre na CLI Azure usando o comando [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login):

    ```bash
    az login
    ```
1. Crie um grupo de recursos usando o comando [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create). Por exemplo, crie o grupo `meuGrupoDeRecursos` na região Leste dos EUA com o seguinte comando:

    ```bash
    az group create --name meuGrupoDeRecursos --location eastus
    ```
1. Defina a variável de ambiente local com o token do nó Wallarm a ser usado para conectar a instância à Nuvem Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Crie um recurso Azure a partir do contêiner Docker do nó Wallarm usando o comando [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create):

    === "Comando para a Nuvem Wallarm dos EUA"
         ```bash
         az container create \
            --resource-group meuGrupoDeRecursos \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.8.0-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com' WALLARM_API_HOST='us1.api.wallarm.com'
         ```
    === "Comando para a Nuvem Wallarm da UE"
         ```bash
         az container create \
            --resource-group meuGrupoDeRecursos \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.8.0-1 \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} NGINX_BACKEND='example.com'
         ```
        
    * `--resource-group`: nome do grupo de recursos criado na segunda etapa.
    * `--name`: nome do contêiner.
    * `--dns-name-label`: etiqueta de nome DNS para o contêiner.
    * `--ports`: porta em que o nó de filtragem está ouvindo.
    * `--image`: nome da imagem Docker do nó Wallarm.
    * `--environment-variables`: variáveis de ambiente com a configuração do nó de filtragem (variáveis disponíveis estão listadas na tabela abaixo). Por favor, observe que não é recomendado passar o valor de `WALLARM_API_TOKEN` explicitamente.

        --8<-- "../include-pt-BR/waf/installation/nginx-docker-all-env-vars-latest.md"
1. Abra o [Portal Azure](https://portal.azure.com/) e verifique se o recurso criado é exibido na lista de recursos.
1. [Teste a operação do nó de filtragem](#testando-a-operação-do-nó-de-filtragem).

## Implantando o contêiner Docker do nó Wallarm configurado através do arquivo montado

Para implantar o nó de filtragem em contêiner Wallarm configurado por meio de variáveis de ambiente e arquivo montado, apenas o [CLI Azure](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) pode ser usado.

Para implantar o contêiner com variáveis de ambiente e arquivo de configuração montado:

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Entre na CLI Azure usando o comando [`az login`](https://docs.microsoft.com/en-us/cli/azure/reference-index?view=azure-cli-latest#az_login):

    ```bash
    az login
    ```
1. Crie um grupo de recursos usando o comando [`az group create`](https://docs.microsoft.com/en-us/cli/azure/group?view=azure-cli-latest#az_group_create). Por exemplo, crie o grupo `meuGrupoDeRecursos` na região Leste dos EUA com o seguinte comando:

    ```bash
    az group create --name meuGrupoDeRecursos --location eastus
    ```
1. Crie um arquivo de configuração localmente com as configurações do nó de filtragem. Um exemplo do arquivo com as configurações mínimas:

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
1. Localize o arquivo de configuração de uma das maneiras adequadas para montar volumes de dados no Azure. Todos os métodos são descritos na [seção **Mount data volumes** da documentação do Azure](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-volume-azure-files).

    Nestas instruções, o arquivo de configuração é montado a partir do repositório Git.
1. Defina a variável de ambiente local com o token do nó Wallarm a ser usado para conectar a instância à Nuvem Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Crie um recurso Azure a partir do contêiner Docker do nó Wallarm usando o comando [`az container create`](https://docs.microsoft.com/en-us/cli/azure/container?view=azure-cli-latest#az_container_create):

    === "Comando para a Nuvem Wallarm dos EUA"
         ```bash
         az container create \
            --resource-group meuGrupoDeRecursos \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.8.0-1 \
            --gitrepo-url <URL_DO_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN} WALLARM_API_HOST='us1.api.wallarm.com'
         ```
    === "Comando para a Nuvem Wallarm da UE"
         ```bash
         az container create \
            --resource-group meuGrupoDeRecursos \
            --name wallarm-node \
            --dns-name-label wallarm \
            --ports 80 \
            --image registry-1.docker.io/wallarm/node:4.8.0-1 \
            --gitrepo-url <URL_DO_GITREPO> \
            --gitrepo-mount-path /etc/nginx/sites-enabled \
            --environment-variables WALLARM_API_TOKEN=${WALLARM_API_TOKEN}
         ```

    * `--resource-group`: nome do grupo de recursos criado na segunda etapa.
    * `--name`: nome do contêiner.
    * `--dns-name-label`: etiqueta de nome DNS para o contêiner.
    * `--ports`: porta em que o nó de filtragem está ouvindo.
    * `--image`: nome da imagem Docker do nó Wallarm.
    * `--gitrepo-url`: URL do repositório Git que contém o arquivo de configuração. Se o arquivo estiver localizado na raíz do repositório, você precisará passar apenas este parâmetro. Se o arquivo estiver localizado em um diretório de repositório Git separado, por favor, passe também o caminho para o diretório no parâmetro `--gitrepo-dir` (por exemplo,<br>`--gitrepo-dir ./dir1`).
    * `--gitrepo-mount-path`: diretório do contêiner para montar o arquivo de configuração. Os arquivos de configuração podem ser montados nos seguintes diretórios de contêiner usados pelo NGINX:

        * `/etc/nginx/conf.d` — configurações comuns
        * `/etc/nginx/sites-enabled` — configurações do host virtual
        * `/var/www/html` — arquivos estáticos

        As diretivas do nó de filtragem devem ser descritas no arquivo `/etc/nginx/sites-enabled/default`.
    
    * `--environment-variables`: variáveis de ambiente contendo configurações para o nó de filtragem e conexão com a Nuvem Wallarm (variáveis disponíveis estão listadas na tabela abaixo). Por favor, observe que não é recomendado passar explicitamente o valor de `WALLARM_API_TOKEN`.

        --8<-- "../include-pt-BR/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. Abra o [Portal Azure](https://portal.azure.com/) e verifique se o recurso criado é exibido na lista de recursos.
1. [Teste a operação do nó de filtragem](#testando-a-operação-do-nó-de-filtragem).

## Testando a operação do nó de filtragem

1. Abra o recurso criado no Portal Azure e copie o valor **FQDN**.

    ![Configurando a instância do contêiner][copy-container-ip-azure-img]

    Se o campo **FQDN** estiver vazio, verifique se o contêiner está no status **Running**.

2. Envie a solicitação com o teste de ataque [Path Traversal][ptrav-attack-docs] para o domínio copiado:

    ```
    curl http://<DOMINIO_COPIADO>/etc/passwd
    ```
3. Abra o Console Wallarm → **Events** na [Nuvem dos EUA](https://us1.my.wallarm.com/attacks) ou na [Nuvem da UE](https://my.wallarm.com/attacks) e verifique se o ataque aparece na lista.
    ![Ataques na Interface do Usuário][attacks-in-ui-image]

Os detalhes sobre erros ocorridos durante a implantação do contêiner são exibidos na guia **Containers** → **Logs** dos detalhes do recurso no Portal Azure. Se o recurso não estiver disponível, verifique se os parâmetros necessários do nó de filtragem com valores corretos são passados para o contêiner.