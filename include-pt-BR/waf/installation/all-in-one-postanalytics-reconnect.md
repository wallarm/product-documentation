Na máquina com o módulo NGINX-Wallarm, no [arquivo de configuração](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) do NGINX, especifique o endereço do servidor do módulo postanalytics:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitido

wallarm_tarantool_upstream wallarm_tarantool;
```

* O valor de `max_conns` deve ser especificado para cada um dos servidores upstream do Tarantool para evitar a criação de conexões excessivas.
* O valor de `keepalive` não deve ser inferior ao número de servidores Tarantool.
* A string `# wallarm_tarantool_upstream wallarm_tarantool;` vem comentada por padrão - por favor, delete `#`.

Uma vez alterado o arquivo de configuração, reinicie o NGINX/NGINX Plus no servidor do módulo NGINX-Wallarm:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```