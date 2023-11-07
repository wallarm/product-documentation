Por padrão, o nó Wallarm implantado não analisa o tráfego de entrada. Para iniciar a análise de tráfego, configure o Wallarm para proxy o tráfego através do arquivo `/etc/nginx/sites-enabled/default` na instância Wallarm:

1. Defina um endereço IP para o Wallarm fazer proxy do tráfego legítimo. Pode ser um IP de uma instância de aplicativo, balanceador de carga ou nome DNS, etc., dependendo da sua arquitetura.

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
1. Para que o nó Wallarm analise o tráfego de entrada, defina a diretiva `wallarm_mode` para `monitoring`:

    ```
    server {
        listen 80;
        listen [::]:80 ipv6only=on;
        wallarm_mode monitoring;

        ...
    }
    ```

    O modo de monitoramento é o recomendado para o primeiro deployment e teste da solução. Wallarm fornece modos seguros de bloqueio e bloqueio, [leia mais][wallarm-mode].