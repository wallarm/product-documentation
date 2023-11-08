Por padrão, o nó Wallarm implantado não analisa o tráfego de entrada.

Para iniciar a análise de tráfego, altere o arquivo `/etc/nginx/sites-enabled/default` na instância Wallarm da seguinte maneira:

1. Para o nó Wallarm aceitar o tráfego espelhado, configure o seguinte na NGINX `server` block:

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
    * As diretivas `wallarm_force_response _*` são necessárias para desativar a análise de todas as solicitações, exceto as cópias recebidas do tráfego espelhado.
1. Para o nó Wallarm analisar o tráfego espelhado, defina a diretiva `wallarm_mode` para `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Como as solicitações maliciosas [não][oob-advantages-limitations] podem ser bloqueadas, o único [modo][wallarm-mode] que Wallarm aceita é o monitoramento. Para implantação em linha, também existem os modos de bloqueio seguro e bloqueio, mas mesmo que você defina a diretiva `wallarm_mode` para um valor diferente de monitoramento, o nó continua monitorando o tráfego e apenas registra tráfego malicioso (além do modo definido para desligado).