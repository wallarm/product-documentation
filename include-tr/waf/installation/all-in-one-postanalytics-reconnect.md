NGINX-Wallarm modülünün bulunduğu makinede, NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) içerisinde, postanalytics modül sunucu adresini belirtin:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* `max_conns` değeri, gereksiz bağlantı oluşumunu önlemek için her bir upstream Tarantool sunucusu için belirtilmelidir.
* `keepalive` değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
* `# wallarm_tarantool_upstream wallarm_tarantool;` dizesi varsayılan olarak yorumlanmıştır - lütfen `#` karakterini silin.

Yapılandırma dosyası değiştirildikten sonra, NGINX-Wallarm modül sunucusundaki NGINX/NGINX Plus'ı yeniden başlatın:

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
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```