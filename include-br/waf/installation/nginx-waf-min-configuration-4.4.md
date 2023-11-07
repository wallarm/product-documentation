Os principais arquivos de configuração do NGINX e do nó de filtragem Wallarm estão localizados nos diretórios:

* `/etc/nginx/conf.d/default.conf` com as configurações do NGINX
* `/etc/nginx/conf.d/wallarm.conf` com as configurações gerais do nó de filtragem

    O arquivo é usado para configurações aplicadas a todos os domínios. Para aplicar diferentes configurações a diferentes grupos de domínios, use o arquivo `default.conf` ou crie novos arquivos de configuração para cada grupo de domínio (por exemplo, `example.com.conf` e `test.com.conf`). Informações mais detalhadas sobre os arquivos de configuração do NGINX estão disponíveis na [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` com as configurações de monitoramento do nó Wallarm. A descrição detalhada está disponível no [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` ou `/etc/sysconfig/wallarm-tarantool` com as configurações do banco de dados Tarantool

#### Modo de filtragem de solicitações

Por padrão, o nó de filtragem está no status `off` e não analisa as solicitações recebidas. Para habilitar a análise de solicitações, siga as etapas:

1. Abra o arquivo `/etc/nginx/conf.d/default.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/default.conf
    ```
2. Adicione a linha `wallarm_mode monitoring;` ao bloco `https`, `server` ou `location`:

??? note "Exemplo do arquivo `/etc/nginx/conf.d/default.conf`"

    ```bash
    server {
        # porta para a qual as solicitações são filtradas
        listen       80;
        # domínio para o qual as solicitações são filtradas
        server_name  localhost;
        # Modo de nó de filtragem
        wallarm_mode monitoring;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    ```

Ao operar no modo `monitoring`, o nó de filtragem procura sinais de ataque nas solicitações, mas não bloqueia os ataques detectados. Recomendamos manter o tráfego fluindo por meio do nó de filtragem no modo `monitoring` por vários dias após a implantação do nó de filtragem e apenas depois ativar o modo `block`. [Aprenda recomendações para a configuração do modo de operação do nó de filtragem →][waf-mode-recommendations]

#### Memória

!!! info "Módulo de pós-análise em servidor separado"
    Se você instalou o módulo de pós-análise em um servidor separado, então pule esta etapa, pois você já tem o módulo configurado.

O nó Wallarm usa o armazenamento em memória do Tarantool. Saiba mais sobre a quantidade de recursos necessários [aqui][memory-instr]. Observe que para ambientes de teste, você pode alocar menos recursos do que para os ambientes de produção.

Para alocar memória para o Tarantool:

1. Abra o arquivo de configuração do Tarantool no modo de edição:

    === "Debian"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "Ubuntu"
        ``` bash
        sudo vim /etc/default/wallarm-tarantool
        ```
    === "CentOS ou Amazon Linux 2.0.2021x e inferior"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
    === "RHEL 8.x"
        ``` bash
        sudo vim /etc/sysconfig/wallarm-tarantool
        ```
2. Especifique o tamanho da memória em GB na diretiva `SLAB_ALLOC_ARENA`. O valor pode ser um número inteiro ou um float (um ponto `.` é um separador decimal).

    Recomendações detalhadas sobre como alocar memória para o Tarantool são descritas nestas [instruções][memory-instr]. 
3. Para aplicar as mudanças, reinicie o Tarantool:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Endereço do servidor de pós-análise separado

!!! info "NGINX-Wallarm e pós-análise no mesmo servidor"
    Se os módulos NGINX-Wallarm e de pós-análise estiverem instalados no mesmo servidor, então pule esta etapa.

--8<-- "../include/waf/configure-separate-postanalytics-address-nginx.md"

#### Outras configurações

Para atualizar outras configurações do NGINX e do nó Wallarm, use a documentação do NGINX e a lista de [diretivas do nó Wallarm disponíveis][waf-directives-instr].
