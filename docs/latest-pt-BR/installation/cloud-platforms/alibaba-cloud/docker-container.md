# Implantação da Imagem Docker Wallarm na Alibaba Cloud

Este guia rápido fornece os passos para implantar a [Imagem Docker do nó Wallarm baseado em NGINX](https://hub.docker.com/r/wallarm/node) na plataforma Alibaba Cloud usando o [Serviço de Computação Elástica (ECS) da Alibaba Cloud](https://www.alibabacloud.com/product/ecs).

!!! warning "Limitações das instruções"
    Estas instruções não cobrem a configuração de balanceamento de carga e autoescala de nó. Se você está configurando esses componentes por conta própria, recomendamos que leia a [documentação apropriada da Alibaba Cloud](https://www.alibabacloud.com/help/product/27537.htm?spm=a2c63.m28257.a1.82.dfbf5922VNtjka).

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/cloud-platforms/alibaba-ecs-use-cases.md"

## Requisitos

* Acesso ao [Console Alibaba Cloud](https://account.alibabacloud.com/login/login.htm)
* Acesso à conta com a função **Administrador** e autenticação de dois fatores desativada no Wallarm Console para a [Nuvem EUA](https://us1.my.wallarm.com/) ou [Nuvem UE](https://my.wallarm.com/)

## Opções para a configuração do contêiner Docker do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/docker-running-options.md"

## Implantando o contêiner Docker do nó Wallarm configurado através de variáveis de ambiente

Para implantar o nó de filtragem Wallarm contêinerizado configurado apenas através de variáveis de ambiente, você deve criar a instância da Alibaba Cloud e executar o contêiner Docker nesta instância. Você pode realizar esses passos através do Console Alibaba Cloud ou [CLI da Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/25499.htm). Nestas instruções, é usado o Console Alibaba Cloud.

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Abra o Console Alibaba Cloud → a lista de serviços → **Elastic Compute Service** → **Instâncias**.
1. Crie a instância seguindo as [instruções da Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) e as diretrizes abaixo:

    * A instância pode se basear na imagem de qualquer sistema operacional.
    * Como a instância deve estar disponível para recursos externos, o endereço IP público ou o domínio deve ser configurado nas configurações da instância.
    * As configurações da instância devem refletir o [método usado para se conectar à instância](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. Conecte-se à instância por um dos métodos descritos na [documentação da Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. Instale os pacotes Docker na instância seguindo as [instruções para um sistema operacional apropriado](https://docs.docker.com/engine/install/#server).
1. Defina a variável de ambiente da instância com o token Wallarm copiado para ser usado para conectar a instância à Nuvem Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Execute o contêiner Docker do nó Wallarm usando o comando `docker run` com variáveis de ambiente passadas e arquivo de configuração montado:

    === "Comando para a Nuvem Wallarm EUA"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e NGINX_BACKEND=<HOST_PARA_PROTEGER_COM_WALLARM> -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.8.0-1
        ```
    === "Comando para a Nuvem Wallarm UE"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e NGINX_BACKEND=<HOST_PARA_PROTEGER_COM_WALLARM> -p 80:80 wallarm/node:4.8.0-1
        ```
        
    * `-p`: porta que o nó de filtragem escuta. O valor deve ser o mesmo que a porta da instância.
    * `-e`: variáveis de ambiente com a configuração do nó de filtragem (variáveis disponíveis estão listadas na tabela abaixo). Observe que não é recomendado passar o valor de `WALLARM_API_TOKEN` explicitamente.

        --8<-- "../include-pt-BR/waf/installation/nginx-docker-all-env-vars-latest.md"
1. [Teste a operação do nó de filtragem](#testing-the-filtering-node-operation).

## Implantando o contêiner Docker do nó Wallarm configurado através do arquivo montado

Para implantar o nó de filtragem Wallarm contêinerizado configurado através de variáveis de ambiente e arquivo montado, você deve criar a instância da Alibaba Cloud, localizar o arquivo de configuração do nó de filtragem no sistema de arquivos desta instância e executar o contêiner Docker nesta instância. Você pode realizar esses passos através do Console Alibaba Cloud ou [CLI da Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/25499.htm). Nestas instruções, será usado o Console Alibaba Cloud.

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"
            
1. Abra o Console Alibaba Cloud → a lista de serviços → **Elastic Compute Service** → **Instâncias**.
1. Crie a instância seguindo as [instruções da Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/87190.htm?spm=a2c63.p38356.b99.137.77df24df7fJ2XX) e as diretrizes abaixo:

    * A instância pode se basear na imagem de qualquer sistema operacional.
    * Como a instância deve estar disponível para recursos externos, o endereço IP público ou domínio deve ser configurado nas configurações da instância.
    * As configurações da instância devem refletir o [método usado para se conectar à instância](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. Conecte-se à instância por um dos métodos descritos na [documentação da Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l).
1. Instale os pacotes Docker na instância seguindo as [instruções para um sistema operacional apropriado](https://docs.docker.com/engine/install/#server).
1. Defina a variável de ambiente da instância com o token Wallarm copiado para ser usado para conectar a instância à Nuvem Wallarm:

    ```bash
    export WALLARM_API_TOKEN='<WALLARM_API_TOKEN>'
    ```
1. Na instância, crie o diretório com o arquivo `default` que contém a configuração do nó de filtragem (por exemplo, o diretório pode ser chamado de `configs`). Um exemplo do arquivo com configurações mínimas:

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

    [Conjunto de diretivas de nó de filtragem que podem ser especificadas no arquivo de configuração →][nginx-waf-directives]
1. Execute o contêiner Docker do nó Wallarm usando o comando `docker run` com variáveis de ambiente passadas e arquivo de configuração montado:

    === "Comando para a Nuvem Wallarm EUA"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_API_HOST='us1.api.wallarm.com' -v <INSTANCE_PATH_TO_CONFIG>:<DIRECTORY_FOR_MOUNTING> -p 80:80 wallarm/node:4.8.0-1
        ```
    === "Comando para a Nuvem Wallarm UE"
        ```bash
        docker run -d -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -v <INSTANCE_PATH_TO_CONFIG>:<CONTAINER_PATH_FOR_MOUNTING> -p 80:80 wallarm/node:4.8.0-1
        ```

    * `<INSTANCE_PATH_TO_CONFIG>`: caminho para o arquivo de configuração criado na etapa anterior. Por exemplo, `configs`.
    * `<DIRECTORY_FOR_MOUNTING>`: diretório do contêiner para montar o arquivo de configuração. Arquivos de configuração podem ser montados nos seguintes diretórios de contêiner usados pelo NGINX:

        * `/etc/nginx/conf.d` — configurações comuns
        * `/etc/nginx/sites-enabled` — configurações de host virtual
        * `/var/www/html` — arquivos estáticos

        As diretivas de nó de filtragem devem ser descritas no arquivo `/etc/nginx/sites-enabled/default`.
    
    * `-p`: porta que o nó de filtragem escuta. O valor deve ser o mesmo que a porta da instância.
    * `-e`: variáveis de ambiente com a configuração do nó de filtragem (variáveis disponíveis estão listadas na tabela abaixo). Observe que não é recomendado passar o valor de `WALLARM_API_TOKEN` explicitamente.

        --8<-- "../include-pt-BR/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
1. [Teste a operação do nó de filtragem](#testing-the-filtering-node-operation).

## Testando a operação do nó de filtragem

1. Abra o Console Alibaba Cloud → a lista de serviços → **Elastic Compute Service** → **Instâncias** e copie o endereço IP público da instância na coluna **Endereço IP**.

    ![Configurando a instância do contêiner][copy-container-ip-alibaba-img]

    Se o endereço IP estiver vazio, certifique-se de que a instância está no status **Running**.

2. Envie a solicitação com o teste de ataque [Path Traversal][ptrav-attack-docs] ao endereço copiado:

    ```
    curl http://<COPIED_IP>/etc/passwd
    ```
3. Abra o Console Wallarm → **Eventos** na [Nuvem EUA](https://us1.my.wallarm.com/attacks) ou [Nuvem UE](https://my.wallarm.com/attacks) e certifique-se de que o ataque está exibido na lista.
    ![Ataques em UI][attacks-in-ui-image]

Para visualizar detalhes sobre erros ocorridos durante a implantação do contêiner, por favor, [conecte-se à instância por um dos métodos](https://www.alibabacloud.com/help/doc-detail/71529.htm?spm=a2c63.p38356.b99.143.22388e44kpTM1l) e reveja os [logs do contêiner][logging-docs]. Se a instância estiver indisponível, certifique-se de que os parâmetros necessários do nó de filtragem com valores corretos foram passados para o contêiner.