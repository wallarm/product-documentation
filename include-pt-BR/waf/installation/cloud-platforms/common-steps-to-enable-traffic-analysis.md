Por padrão, o nó Wallarm implantado não analisa o tráfego de entrada.

Dependendo da abordagem de implementação Wallarm selecionada ([in-line][inline-docs] ou [Out-of-Band][oob-docs]), configure o Wallarm para fazer proxy do tráfego ou processar o espelho do tráfego.

Realize a seguinte configuração no arquivo `/etc/nginx/sites-enabled/default` na instância Wallarm:

=== "In-line"
    1. Defina um endereço IP para o Wallarm fazer proxy do tráfego legítimo. Pode ser um IP de uma instância de aplicativo, balanceador de carga, ou nome DNS, etc., dependendo da sua arquitetura.
    
        Para isso, edite o valor `proxy_pass`, por ex., o Wallarm deve enviar solicitações legítimas para `http://10.80.0.5`:

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
    1. Para o nó Wallarm analisar o tráfego de entrada, defina a diretiva `wallarm_mode` para `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```
    
        O modo de monitoramento é recomendado para a primeira implementação e teste de solução. O Wallarm também fornece modos de bloqueio seguro e de bloqueio, [leia mais][wallarm-mode].
=== "Out-of-Band"
    1. Para o nó Wallarm aceitar tráfego espelhado, defina a seguinte configuração no bloco `server` NGINX:

        ```
        wallarm_force server_addr $http_x_server_addr;
        wallarm_force server_port $http_x_server_port;
        # Altere 222.222.222.22 para o endereço do servidor de espelhamento
        set_real_ip_from  222.222.222.22;
        real_ip_header    X-Forwarded-For;
        real_ip_recursive on;
        wallarm_force response_status 0;
        wallarm_force response_time 0;
        wallarm_force response_size 0;
        ```

        * As diretivas `set_real_ip_from` e `real_ip_header` são necessárias para que o Console Wallarm [exiba os endereços IP dos atacantes][real-ip-docs].
        * As diretivas `wallarm_force_response_*` são necessárias para desativar a análise de todas as solicitações, exceto para cópias recebidas do tráfego espelhado.
    1. Para o nó Wallarm analisar o tráfego espelhado, defina a diretiva `wallarm_mode` para `monitoring`:

        ```
        server {
            listen 80;
            listen [::]:80 ipv6only=on;
            wallarm_mode monitoring;

            ...
        }
        ```

        Como as solicitações maliciosas [não podem][oob-advantages-limitations] ser bloqueadas, o único [modo][wallarm-mode] que o Wallarm aceita é o monitoramento. Para a implementação in-line, existem também modos de bloqueio seguro e de bloqueio, mas mesmo que você defina a diretiva `wallarm_mode` para um valor diferente de monitoramento, o nó continua monitorando o tráfego e apenas registra o tráfego malicioso (além do modo definido para desligado).