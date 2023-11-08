Por padrão, o nó Wallarm implantado não analisa o tráfego recebido. Para iniciar a análise, configure o Wallarm para proxy de tráfego através do arquivo `/etc/nginx/conf.d/default.conf` na máquina com o nó instalado:

1. Defina um endereço IP para o Wallarm ser proxy do tráfego legítimo. Pode ser um IP de uma instância de aplicativo, balanceador de carga, nome DNS, etc., dependendo da sua arquitetura.

    Para isso, edite o valor `proxy_pass`, por exemplo, o Wallarm deve enviar solicitações legítimas para `http://10.80.0.5`:

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

1. Para o nó Wallarm analisar o tráfego recebido, defina a diretiva `wallarm_mode` para `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    O modo de monitoramento é o recomendado para a primeira implantação e teste de solução. Wallarm oferece também modos seguros de bloqueio, [leia mais][waf-mode-instr].
