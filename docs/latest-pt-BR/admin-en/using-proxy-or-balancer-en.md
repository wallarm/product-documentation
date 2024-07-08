# Identificando um endereço IP do cliente original ao usar um proxy HTTP ou um balanceador de carga (NGINX)

Estas instruções descrevem a configuração do NGINX necessária para identificar um endereço IP de origem de um cliente que se conecta aos seus servidores por meio de um proxy HTTP ou balanceador de carga.

* Se o nó Wallarm for instalado a partir dos pacotes DEB / RPM, imagens AWS / GCP ou a imagem Docker baseada em NGINX, por favor utilize as **instruções atuais**.
* Se o nó Wallarm for implantado como o controlador de Ingress K8s, por favor use [estas instruções](configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md).

## Como o nó Wallarm identifica um endereço IP de uma requisição

O nó Wallarm lê um endereço IP de origem da requisição a partir da variável NGINX `$remote_addr`. Se a requisição passou por um servidor proxy ou balanceador de carga antes de ser enviada para o nó, a variável `$remote_addr` mantém o endereço IP do servidor proxy ou balanceador de carga.

![Utilizando balancer](../images/admin-guides/using-proxy-or-balancer/using-balancer-en.png)

O endereço IP de origem da requisição identificado pelo nó Wallarm é exibido nos [detalhes do ataque](../user-guides/events/check-attack.md#attacks) no Console Wallarm.

## Possíveis problemas ao usar um endereço IP do servidor proxy ou balanceador de carga como um endereço de origem da requisição

Se o nó Wallarm considerar o endereço IP do servidor proxy ou balanceador de carga como o endereço IP de origem da requisição, as seguintes funcionalidades do Wallarm podem funcionar de maneira incorreta:

* [Controlando o acesso a aplicativos por endereços IP](../user-guides/ip-lists/overview.md), por exemplo:

	Se os endereços IP do cliente original foram para a lista de negação, o nó Wallarm ainda não bloquearia as requisições originadas a partir deles, pois considera o endereço IP do balanceador de carga como o endereço IP de origem da requisição.
* [Proteção contra força bruta](configuration-guides/protecting-against-bruteforce.md), por exemplo:

	Se as requisições passadas pelo balanceador de carga apresentarem sinais de ataque de força bruta, a Wallarm colocará este endereço IP do balanceador de carga na lista de negação e, portanto, bloqueará todas as futuras requisições passadas por este balanceador de carga.
* O módulo [Verificação de ameaça ativa](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) e [Scanner de vulnerabilidades](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner), por exemplo:

	A Wallarm considerará o endereço IP do balanceador de carga como o [endereço IP originando ataques de teste](scanner-addresses.md) gerados pelo módulo de Verificação de ameaça ativa e pelo Scanner de vulnerabilidades. Assim, os ataques de teste serão exibidos no Console Wallarm como ataques originados a partir do endereço IP do balanceador de carga e serão adicionalmente verificados pela Wallarm, o que criará uma carga extra na aplicação.
* [Configurando o NGINX para ler o cabeçalho `X-Forwarded-For` (`X-Real-IP` ou similar](#configurando-o-nginx-para-ler-o-cabecalho-x-forwarded-for-x-real-ip-ou-similar)
* [Configurando o NGINX para ler o cabeçalho `PROXY`](#configurando-o-nginx-para-ler-o-cabecalho-proxy)

Se o nó Wallarm for conectado através de um [soquete IPC](https://en.wikipedia.org/wiki/Unix_domain_socket), então `0.0.0.0` será considerado como a origem da requisição.

## Configuração para identificação de um endereço IP do cliente original

Para configurar a identificação do endereço IP do cliente original, você pode usar o [módulo NGINX **ngx_http_realip_module**](https://nginx.org/en/docs/http/ngx_http_realip_module.html). Este módulo permite a redefinição do valor de `$remote_addr` [usado](#como-o-no-wallarm-identifica-um-endereco-ip-de-uma-requisicao) pelo nó Wallarm para obter um endereço IP do cliente.

Você pode usar o módulo NGINX **ngx_http_realip_module** de uma das seguintes maneiras:

* Para ler um endereço IP do cliente original de um cabeçalho específico (geralmente, [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For)) adicionado à requisição por um balanceador de carga ou servidor proxy.
* Se um balanceador de carga ou servidor proxy suporta o [protocolo PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt), para ler um endereço IP do cliente original do cabeçalho `PROXY`.

### Configurando NGINX para ler o cabeçalho `X-Forwarded-For` (`X-Real-IP` ou similar)

Se um balanceador de carga ou servidor proxy anexar um cabeçalho `X-Forwarded-For` (`X-Real-IP` ou similar) contendo um endereço IP do cliente original, configure o módulo NGINX **ngx_http_realip_module** para ler este cabeçalho conforme segue:

1. Abra o seguinte arquivo de configuração do NGINX instalado com o nó Wallarm:

    * `/etc/nginx/conf.d/default.conf` se o nó Wallarm for instalado a partir dos pacotes DEB / RPM.
    * `/etc/nginx/nginx.conf` se o nó Wallarm for implantado a partir da imagem AWS / GCP.
    * Se o nó Wallarm for implantado a partir da imagem Docker baseada em NGINX, você deve criar e editar o arquivo de configuração do NGINX localmente e montá-lo no contêiner Docker no caminho `/etc/nginx/sites-enabled/default`. Você pode copiar um arquivo de configuração NGINX inicial e obter as instruções sobre a montagem do arquivo para o contêiner a partir das [instruções no Wallarm Docker baseado em NGINX](installation-docker-en.md#run-the-container-mounting-the-configuration-file).
2. No contexto `location` do NGINX ou superior, adicione a diretiva `set_real_ip_from` com um endereço IP do servidor proxy ou do balanceador de carga. Se um servidor proxy ou balanceador de carga tiver vários endereços IP, adicione um número apropriado de diretivas separadas. Por exemplo:

   ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
    }
    ...
    ```
3. Na documentação sobre um balanceador de carga em uso, encontre o nome do cabeçalho anexado por este balanceador de carga para passar um endereço IP do cliente original. Mais frequentemente, o cabeçalho é chamado `X-Forwarded-For`.
4. No contexto `location` do NGINX ou superior, adicione a diretiva `real_ip_header` com o nome do cabeçalho encontrado na etapa anterior. Por exemplo:

    ```bash
    ...
    location / {
        wallarm_mode block;

        set_real_ip_from 1.2.3.4;
        set_real_ip_from 192.0.2.0/24;
        real_ip_header X-Forwarded-For;
    }
    ...
    ```
5. Reinicie o NGINX:

    --8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"

    O NGINX atribuirá o valor do cabeçalho especificado na diretiva `real_ip_header` à variável `$remote_addr`, então o nó Wallarm lerá os endereços IP do cliente original a partir desta variável.
6. [Teste a configuração](#testando-a-configuracao).

### Configurando NGINX para ler o cabeçalho `PROXY`

Se um balanceador de carga ou servidor proxy suporta o [protocolo PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt), você pode configurar o módulo NGINX **ngx_http_realip_module** para ler o cabeçalho `PROXY` como se segue:

1. Abra o seguinte arquivo de configuração do NGINX instalado com o nó Wallarm:

    * `/etc/nginx/conf.d/default.conf` se o nó Wallarm for instalado a partir dos pacotes DEB / RPM.
    * `/etc/nginx/nginx.conf` se o nó Wallarm for implantado a partir da imagem AWS / GCP.
    * Se o nó Wallarm for implantado a partir da imagem Docker baseada em NGINX, você deve criar e editar o arquivo de configuração do NGINX localmente e montá-lo no contêiner Docker no caminho `/etc/nginx/sites-enabled/default`. Você pode copiar um arquivo de configuração NGINX inicial e obter as instruções sobre a montagem do arquivo para o contêiner a partir das [instruções no Wallarm Docker baseado em NGINX](installation-docker-en.md#run-the-container-mounting-the-configuration-file).
2. No contexto `server` do NGINX, adicione o parâmetro `proxy_protocol` à diretiva `listen`.
3. No contexto `location` do NGINX ou superior, adicione a diretiva `set_real_ip_from` com um endereço IP do servidor proxy ou do balanceador de carga. Se um servidor proxy ou balanceador de carga tiver vários endereços IP, adicione um número apropriado de diretivas separadas. Por exemplo:
4. No contexto `location` do NGINX ou superior, adicione a diretiva `real_ip_header` com o valor de `proxy_protocol`.

   Um exemplo do arquivo de configuração NGINX com todas as diretivas adicionadas:

    ```bash
    server {
        listen 80 proxy_protocol;
        server_name localhost;

        set_real_ip_from <IP_ADDRESS_OF_YOUR_PROXY>;
        real_ip_header proxy_protocol;

        ...
    }
    ```

    * O NGINX está ouvindo conexões de entrada na porta 80.
    * Se o cabeçalho `PROXY` não for passado na requisição de entrada, o NGINX não aceitará esta requisição, pois é considerada inválida.
    * Para requisições originadas a partir do endereço `<IP_ADDRESS_OF_YOUR_PROXY>`, o NGINX atribui o endereço de origem passado no cabeçalho `PROXY` à variável `$remote_addr`, então o nó Wallarm lerá os endereços IP do cliente original a partir desta variável.
5. Reinicie o NGINX:

    --8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"
6. [Teste a configuração](#testando-a-configuracao).

Para incluir um endereço IP do cliente original nos logs, você deve adicionar a diretiva `proxy_set_header` e editar a lista de variáveis na diretiva `log_format` na configuração do NGINX, conforme descrito nas [instruções de log do NGINX](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#logging-the-original-ip-address).

Mais detalhes sobre a identificação de um endereço IP do cliente original com base no cabeçalho `PROXY` estão disponíveis na [documentação do NGINX](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#changing-the-load-balancers-ip-address-to-the-client-ip-address).

### Testando a configuração

1. Envie o ataque de teste para o endereço da aplicação protegida:

    === "Usando cURL"
        ```bash
        curl http://localhost/etc/passwd
        ```
    === "Usando printf e Netcat (para o cabeçalho `PROXY`)"
        ```bash
        printf "PROXY TCP4 <IP_ADDRESS_OF_YOUR_PROXY> <REAL_CLIENT_IP> 0 80\r\nGET /etc/passwd\r\n\r\n" | nc localhost 80
        ```
2. Abra o Console Wallarm e certifique-se de que o endereço IP original do cliente é exibido nos detalhes do ataque:

    ![Endereço IP originado da requisição](../images/request-ip-address.png)

    Se o NGINX leu o endereço original do cabeçalho `X-Forwarded-For` (`X-Real-IP` ou similar), o valor do cabeçalho também seria exibido no ataque bruto.

    ![Cabeçalho X-Forwarded-For](../images/x-forwarded-for-header.png)

## Exemplos de configuração

Abaixo você encontrará exemplos de configuração do NGINX necessários para identificar um endereço IP de origem de um cliente que se conecta aos seus servidores por meio de balanceadores de carga populares.

### Cloudflare CDN

Ao usar o Cloudflare CDN, você pode [configurar o módulo NGINX **ngx_http_realip_module**](#configurando-o-nginx-para-ler-o-cabecalho-x-forwarded-for-x-real-ip-ou-similar) para identificar endereços IP do cliente original.

```bash
...
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 104.16.0.0/12;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2c0f:f248::/32;
set_real_ip_from 2a06:98c0::/29;

real_ip_header CF-Connecting-IP;
#real_ip_header X-Forwarded-For;
real_ip_recursive on;
...
```

* Antes de salvar a configuração, verifique se os endereços IP do Cloudflare especificados na configuração acima correspondem aos da [documentação do Cloudflare](https://www.cloudflare.com/ips/). 
* No valor da diretiva `real_ip_header`, você pode especificar `CF-Connecting-IP` ou `X-Forwarded-For`. O CDN do Cloudflare anexa ambos os cabeçalhos e você pode configurar o NGINX para ler qualquer um deles. [Mais detalhes no CDN do Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200170786-Restoring-original-visitor-IPs)

### Fastly CDN

Ao usar o Fastly CDN, você pode [configurar o módulo NGINX **ngx_http_realip_module**](#configurando-o-nginx-para-ler-o-cabecalho-x-forwarded-for-x-real-ip-ou-similar) para identificar os endereços IP do cliente original.

```bash
...
set_real_ip_from 23.235.32.0/20;
set_real_ip_from 43.249.72.0/22;
set_real_ip_from 103.244.50.0/24;
set_real_ip_from 103.245.222.0/23;
set_real_ip_from 103.245.224.0/24;
set_real_ip_from 104.156.80.0/20;
set_real_ip_from 146.75.0.0/16;
set_real_ip_from 151.101.0.0/16;
set_real_ip_from 157.52.64.0/18;
set_real_ip_from 167.82.0.0/17;
set_real_ip_from 167.82.128.0/20;
set_real_ip_from 167.82.160.0/20;
set_real_ip_from 167.82.224.0/20;
set_real_ip_from 172.111.64.0/18;
set_real_ip_from 185.31.16.0/22;
set_real_ip_from 199.27.72.0/21;
set_real_ip_from 199.232.0.0/16;
set_real_ip_from 2a04:4e40::/32;
set_real_ip_from 2a04:4e42::/32;

real_ip_header X-Forwarded-For;
real_ip_recursive on;
...
```

Antes de salvar a configuração, certifique-se de que os endereços IP do Fastly especificados na configuração acima correspondem àqueles na [documentação do Fastly](https://api.fastly.com/public-ip-list). 

### HAProxy

Se estiver usando HAProxy, ambos os lados HAProxy e o nó Wallarm devem ser devidamente configurados para identificar endereços IP do cliente original:

* No arquivo de configuração `/etc/haproxy/haproxy.cfg`, insira a linha `option forwardfor header X-Client-IP` no bloco de diretiva `backend` responsável por conectar HAProxy ao nó Wallarm.

	A diretiva `option forwardfor` diz ao balanceador HAProxy que um cabeçalho com o endereço IP do cliente deve ser adicionado à requisição. [Mais detalhes na documentação do HAProxy](https://cbonte.github.io/haproxy-dconv/1.9/configuration.html#option%20forwardfor)

	Exemplo de configuração:

    ```
    ...
    # Endereço IP público para receber requisições
    frontend my_frontend
        bind <HAPROXY_IP>
        mode http
        default_backend my_backend

    # Backend com o nó Wallarm
    backend my_backend
        mode http
    option forwardfor header X-Client-IP
    server wallarm-node <WALLARM_NODE_IP>
    ...
    ```

    * `<HAPROXY_IP>` é o endereço IP do servidor HAProxy para receber requisições do cliente.
    * `<WALLARM_NODE_IP>` é o endereço IP do nó Wallarm para receber requisições do servidor HAProxy.
   
* No arquivo de configuração do NGINX instalado com o nó Wallarm, configure o [módulo **ngx_http_realip_module**](#configurando-o-nginx-para-ler-o-cabecalho-x-forwarded-for-x-real-ip-ou-similar) conforme segue:

   ```bash
    ...
    location / {
        wallarm_mode block;

        proxy_pass http://<APPLICATION_IP>;        
        set_real_ip_from <HAPROXY_IP1>;
        set_real_ip_from <HAPROXY_IP2>;
        real_ip_header X-Client-IP;
    }
    ...
    ```

    * `<APPLICATION_IP>` é o endereço IP da aplicação protegida para requisições vindas do nó Wallarm.
    * `<HAPROXY_IP1>` e `<HAPROXY_IP2>` são endereços IP dos balanceadores HAProxy que passam requisições para o nó Wallarm.