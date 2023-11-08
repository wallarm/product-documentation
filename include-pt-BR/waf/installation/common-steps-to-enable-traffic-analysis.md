Por padrão, o nó Wallarm implantado não analisa o tráfego de entrada.

Dependendo da abordagem de implantação Wallarm selecionada ([in-line][inline-docs] ou [Out-of-Band][oob-docs]), configure o Wallarm para intermediar o tráfego ou processar o espelho de tráfego.

Realize a seguinte configuração no arquivo `/etc/nginx/conf.d/default.conf` na máquina com o nó instalado:

=== "In-line"
    1. Defina um endereço IP para o Wallarm intermediar o tráfego legítimo. Pode ser um IP de uma instância de aplicativo, balanceador de carga, nome DNS, etc., dependendo da sua arquitetura.
    
        Para fazer isso, edite o valor `proxy_pass`, por exemplo, o Wallarm deve enviar solicitações legítimas para `http://10.80.0.5`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;

            ...

            location / {
                proxy_pass http://10.80.0.5; 
                ...
            }
        }
        ```
    1. Para que o nó Wallarm analise o tráfego de entrada, defina a diretiva `wallarm_mode` como `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        O modo de monitoramento é o recomendado para a primeira implantação e teste de solução. O Wallarm também fornece modos de bloqueio seguro e bloqueio, [leia mais][waf-mode-instr].
=== "Out-of-Band"
    1. Para que o nó Wallarm aceite tráfego espelhado, defina a seguinte configuração no bloco `server` do NGINX:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # Alterar 222.222.222.22 para o endereço do servidor de espelhamento
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * As diretivas `set_real_ip_from` e `real_ip_header` são necessárias para que o Console Wallarm [exiba os endereços IP dos atacantes][proxy-balancer-instr].
        * As diretivas `wallarm_force_response_*` são necessárias para desativar a análise de todas as solicitações, exceto as cópias recebidas do tráfego espelhado.
    1. Para o nó Wallarm analisar o tráfego espelhado, defina a diretiva `wallarm_mode` para `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Como as solicitações maliciosas [não podem][oob-advantages-limitations] ser bloqueadas, o único [modo][waf-mode-instr] que o Wallarm aceita é o de monitoramento. Para implantação in-line, também existem modos seguros de bloqueio e bloqueio, mas mesmo que você defina a diretiva `wallarm_mode` para um valor diferente de monitoramento, o nó continua a monitorar o tráfego e apenas registrar o tráfego malicioso (exceto o modo definido como off).