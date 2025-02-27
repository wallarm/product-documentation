[doc-wallarm-mode]:           ../../../admin-en/configure-parameters-en.md#wallarm_mode
[doc-config-params]:          ../../../admin-en/configure-parameters-en.md
[waf-mode-instr]:             ../../../admin-en/configure-wallarm-mode.md
[logging-instr]:              ../../../admin-en/configure-logging.md
[proxy-balancer-instr]:       ../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:   ../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[allocating-memory-guide]:    ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[nginx-waf-directives]:       ../../../admin-en/configure-parameters-en.md
[graylist-docs]:              ../../../user-guides/ip-lists/graylist.md
[filtration-modes-docs]:      ../../../admin-en/configure-wallarm-mode.md
[application-configuration]:  ../../../user-guides/settings/applications.md
[ptrav-attack-docs]:          ../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:        ../../../images/admin-guides/test-attacks-quickstart.png
[versioning-policy]:          ../../../updating-migrating/versioning-policy.md#version-list
[node-status-docs]:           ../../../admin-en/configure-statistics-service.md
[node-token]:                 ../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                  ../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:        ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                   ../../supported-deployment-options.md
[oob-advantages-limitations]: ../overview.md#advantages-and-limitations
[web-server-mirroring-examples]:  overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[memory-instr]:               ../../../admin-en/configuration-guides/allocate-resources-for-node.md
[aws-ecs-docs]:               ../../cloud-platforms/aws/docker-container.md
[gcp-gce-docs]:               ../../cloud-platforms/gcp/docker-container.md
[azure-container-docs]:       ../../cloud-platforms/azure/docker-container.md
[alibaba-ecs-docs]:           ../../cloud-platforms/alibaba-cloud/docker-container.md

# Implantando Wallarm OOB a partir da Imagem Docker

Este artigo fornece instruções para implantar [Wallarm OOB](overview.md) usando a [imagem Docker baseada em NGINX](https://hub.docker.com/r/wallarm/node). A solução descrita aqui é projetada para analisar o tráfego espelhado por um servidor web ou proxy.

--8<-- "../include-pt-BR/waf/installation/info-about-nginx-version-in-docker-container.md"

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/docker-images/nginx-based-use-cases.md"

## Requisitos

--8<-- "../include-pt-BR/waf/installation/requirements-docker-nginx-4.0.md"

## 1. Configurar espelhamento de tráfego

--8<-- "../include-pt-BR/waf/installation/sending-traffic-to-node-oob.md"

## 2. Prepare um arquivo de configuração para análise de tráfego espelhado e mais

Para permitir que os nós Wallarm analisem o tráfego espelhado, você precisa configurar configurações adicionais em um arquivo separado e montá-lo no contêiner Docker. O arquivo de configuração padrão que precisa ser modificado está localizado em `/etc/nginx/sites-enabled/default` dentro da imagem Docker.

Neste arquivo, você precisa especificar a configuração do nó Wallarm para processar o tráfego espelhado e quaisquer outras configurações necessárias. Siga estas instruções para fazer isso:

1. Crie o arquivo de configuração local do NGINX denominado `default` com o seguinte conteúdo:

    ```
    server {
            listen 80 default_server;
            listen [::]:80 default_server ipv6only=on;
            #listen 443 ssl;

            server_name localhost;

            #ssl_certificate cert.pem;
            #ssl_certificate_key cert.key;

            root /usr/share/nginx/html;

            index index.html index.htm;

            wallarm_force server_addr $http_x_server_addr;
            wallarm_force server_port $http_x_server_port;
            # Change 222.222.222.22 to the address of the mirroring server
            set_real_ip_from  222.222.222.22;
            real_ip_header    X-Forwarded-For;
            real_ip_recursive on;
            wallarm_force response_status 0;
            wallarm_force response_time 0;
            wallarm_force response_size 0;

            wallarm_mode monitoring;
            # wallarm_application 1;

            location / {
                    proxy_pass http://127.0.0.1:8080;
                    include proxy_params;
            }
    }
    ```

    * As diretivas `set_real_ip_from` e `real_ip_header` são necessárias para que o Wallarm Console [exiba os endereços IP dos invasores][proxy-balancer-instr].
    * As diretivas `wallarm_force_response_*` são necessárias para desativar a análise de todas as solicitações, exceto as cópias recebidas do tráfego espelhado.
    * A diretiva `wallarm_mode` é o [modo][waf-mode-instr] de análise de tráfego. Como solicitações maliciosas [não][oob-advantages-limitations] podem ser bloqueadas, o único modo aceito pelo Wallarm é o monitoramento. Para implantação em linha, também existem modos de bloqueio seguro e bloqueio, mas mesmo que você defina a diretiva `wallarm_mode` para um valor diferente de monitoramento, o nó continua a monitorar o tráfego e a registrar apenas o tráfego malicioso (além do modo definido para desligado).
1. Especifique quaisquer outras diretivas Wallarm necessárias. Você pode consultar a documentação [Parâmetros de configuração do Wallarm](../../../admin-en/configure-parameters-en.md) e os [casos de uso da configuração](#configuring-the-use-cases) para entender quais configurações seriam úteis para você.
1. Se necessário, modifique outras configurações do NGINX para personalizar seu comportamento. Consulte a [documentação do NGINX](https://nginx.org/en/docs/beginners_guide.html) para obter assistência.

Você também pode montar outros arquivos nos seguintes diretórios de contêineres, se necessário:

* `/etc/nginx/conf.d` — configurações comuns
* `/etc/nginx/sites-enabled` — configurações de host virtual
* `/var/www/html` — arquivos estáticos

## 3. Obtenha um token para conectar o nó à nuvem

Obtenha o token Wallarm do [tipo apropriado][wallarm-token-types]:

=== "Token API"

    1. Abra Wallarm Console → **Configurações** → **Tokens da API** no [Nuvem dos EUA](https://us1.my.wallarm.com/settings/api-tokens) ou [Nuvem da UE](https://my.wallarm.com/settings/api-tokens).
    1. Encontre ou crie um token API com a função de fonte `Implantar`.
    1. Copie este token.

=== "Token de nó"

    1. Abra Wallarm Console → **Nós** na [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Faça uma das seguintes ações: 
        * Crie o nó do tipo **Nó Wallarm** e copie o token gerado.
        * Use o grupo de nós existente - copie o token usando o menu do nó → **Copiar token**.

## 4. Execute o contêiner Docker com o nó

Execute o contêiner Docker com o nó [montando](https://docs.docker.com/storage/volumes/) o arquivo de configuração que você acabou de criar.

=== "Nuvem dos EUA"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_API_HOST='us1.api.wallarm.com' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.8.0-1
    ```
=== "Nuvem da UE"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -v /configs/default:/etc/nginx/sites-enabled/default -p 80:80 wallarm/node:4.8.0-1
    ```

As seguintes variáveis de ambiente devem ser passadas para o contêiner:

--8<-- "../include-pt-BR/waf/installation/nginx-docker-env-vars-to-mount-latest.md"

## 5. Testando a operação do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

## Configuração de log

O log está ativado por padrão. Os diretórios de log são:

* `/var/log/nginx` — Logs do NGINX
* `/var/log/wallarm` — Logs do nó Wallarm

Para configurar o log estendido das variáveis do nó de filtragem, use estas [instruções](../../../admin-en/configure-logging.md).

Por padrão, os logs rotacionam uma vez a cada 24 horas. Para configurar a rotação do log, altere os arquivos de configuração em `/etc/logrotate.d/`. Alterar os parâmetros de rotação por meio de variáveis de ambiente não é possível. 

## Configurando os casos de uso

O arquivo de configuração montado no contêiner Docker deve descrever a configuração do nó de filtragem nas [diretivas disponíveis](../../../admin-en/configure-parameters-en.md). Abaixo estão algumas opções de configuração do nó de filtragem comumente usadas:

--8<-- "../include-pt-BR/waf/installation/linux-packages/common-customization-options.md"