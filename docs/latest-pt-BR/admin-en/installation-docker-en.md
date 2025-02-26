# Executando Imagem Docker baseada em NGINX

O nó de filtragem baseado em NGINX da Wallarm pode ser implantado como um contêiner Docker. O contêiner Docker é grande e contém todos os subsistemas do nó de filtragem.

A funcionalidade do nó de filtragem instalado dentro do contêiner Docker é completamente idêntica à funcionalidade das outras opções de implantação.

--8<-- "../include-pt-BR/waf/installation/info-about-nginx-version-in-docker-container.md"

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/docker-images/nginx-based-use-cases.md"

## Requisitos

--8<-- "../include-pt-BR/waf/installation/requirements-docker-nginx-4.0.md"

## Opções para executar o contêiner

--8<-- "../include-pt-BR/waf/installation/docker-running-options.md"

## Execute o contêiner passando as variáveis de ambiente

Para executar o contêiner:

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Execute o contêiner com o nó:

    === "Nuvem dos EUA"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -p 80:80 wallarm/node:4.8.0-1
        ```
    === "Nuvem da UE"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e NGINX_BACKEND='example.com' -p 80:80 wallarm/node:4.8.0-1
        ```

Você pode passar as seguintes configurações básicas do nó de filtragem para o contêiner via a opção `-e`:

--8<-- "../include-pt-BR/waf/installation/nginx-docker-all-env-vars-latest.md"

O comando faz o seguinte:

* Cria o arquivo `default` com configuração mínima do NGINX e passa a configuração do nó de filtragem no diretório do contêiner `/etc/nginx/sites-enabled`.
* Cria arquivos com as credenciais do nó de filtragem para acessar a Wallarm Cloud no diretório do contêiner `/etc/wallarm`:
    * `node.yaml` com UUID do nó de filtragem e chave secreta
    * `private.key` com a chave privada da Wallarm
* Protege o recurso `http://NGINX_BACKEND:80`.

## Execute o contêiner montando o arquivo de configuração

Você pode montar o arquivo de configuração preparado no contêiner Docker por meio da opção `-v`. O arquivo deve conter as seguintes configurações:

* [Diretivas do nó de filtragem][nginx-directives-docs]
* [Configurações do NGINX](https://nginx.org/en/docs/beginners_guide.html)

Para executar o contêiner:

--8<-- "../include-pt-BR/waf/installation/get-api-or-node-token.md"

1. Execute o contêiner com o nó:

    === "Nuvem dos EUA"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.8.0-1
        ```
    === "Nuvem da UE"
        ```bash
        docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.8.0-1
        ```

    * A opção `-e` passa as seguintes variáveis de ambiente necessárias para o contêiner:

        --8<-- "../include-pt-BR/waf/installation/nginx-docker-env-vars-to-mount-latest.md"
    
    * A opção `-v` monta o diretório com o arquivo de configuração `default` no diretório do contêiner `/etc/nginx/sites-enabled`.

        ??? info "Veja um exemplo do arquivo montado com configurações mínimas"
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

        !!! info "Montando outros arquivos de configuração"
            Os diretórios do contêiner usados pelo NGINX:

            * `/etc/nginx/conf.d` — configurações comuns
            * `/etc/nginx/sites-enabled` — configurações do host virtual
            * `/var/www/html` — arquivos estáticos

            Se necessário, você pode montar quaisquer arquivos nos diretórios do contêiner listados. As diretivas do nó de filtragem devem ser descritas no arquivo `/etc/nginx/sites-enabled/default`.

O comando faz o seguinte:

* Monta o arquivo `default` no diretório do contêiner `/etc/nginx/sites-enabled`.
* Cria arquivos com as credenciais do nó de filtragem para acessar a Cloud da Wallarm no diretório do contêiner `/etc/wallarm`:
    * `node.yaml` com UUID do nó de filtragem e chave secreta
    * `private.key` com a chave privada da Wallarm
* Protege o recurso `http://example.com`.

## Configuração de log

O log é habilitado por padrão. Os diretórios de log são:

* `/var/log/nginx` — Logs do NGINX
* `/var/log/wallarm` — Logs do nó Wallarm

Para configurar a geração estendida de logs das variáveis do nó de filtragem, use estas [instruções][logging-instr].

Por padrão, os logs giram a cada 24 horas. Para configurar a rotação de log, altere os arquivos de configuração em `/etc/logrotate.d/`. A alteração dos parâmetros de rotação por meio de variáveis de ambiente não é possível.

## Testando a operação do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

## Configurando os casos de uso

O arquivo de configuração montado no contêiner Docker deve descrever a configuração do nó de filtragem na [diretiva disponível][nginx-directives-docs]. Abaixo estão algumas opções de configuração do nó de filtragem comumente usadas:

--8<-- "../include-pt-BR/waf/installation/common-customization-options-docker-4.4.md"
