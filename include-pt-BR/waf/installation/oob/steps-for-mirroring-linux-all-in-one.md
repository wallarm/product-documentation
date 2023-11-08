Por padrão, o nó do Wallarm implantado não analisa o tráfego de entrada.

Realize a seguinte configuração no arquivo de [configuração](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) do NGINX na máquina com o nó instalado para configurar o Wallarm para processar o espelho de tráfego:

1. Para que o nó Wallarm aceite o tráfego espelhado, defina a seguinte configuração no bloco `server` do NGINX:

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

    * As diretrizes `set_real_ip_from` e `real_ip_header` são necessárias para que o Console Wallarm [exiba os endereços IP dos invasores][proxy-balancer-instr].
    * As diretrizes `wallarm_force_response_*` são necessárias para desativar a análise de todas as solicitações, exceto para cópias recebidas do tráfego espelhado.
2. Para que o nó Wallarm analise o tráfego espelhado, defina a diretiva `wallarm_mode` como `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    Como as solicitações maliciosas [não podem][oob-advantages-limitations] ser bloqueadas, o único [modo][waf-mode-instr] que o Wallarm aceita é o monitoramento. Para a implantação em linha, também existem os modos de bloqueio seguro e bloqueio, mas mesmo que você defina a diretiva `wallarm_mode` para um valor diferente de monitoramento, o nó continua a monitorar o tráfego e registrar apenas o tráfego malicioso (além do modo definido como desligado).