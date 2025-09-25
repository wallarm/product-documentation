NGINX-Wallarm modülünün bulunduğu makinede, NGINX [yapılandırma dosyasında](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) postanalytics modülünün sunucu adresini belirtin:

```
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # atlandı

wallarm_tarantool_upstream wallarm_tarantool;
```

* `max_conns` değeri, aşırı bağlantı oluşturulmasını önlemek için upstream Tarantool sunucularının her biri için belirtilmelidir.
* `keepalive` değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
* `# wallarm_tarantool_upstream wallarm_tarantool;` satırı varsayılan olarak yorum satırıdır - lütfen `#` işaretini silin.

Yapılandırma dosyası değiştirildikten sonra, NGINX-Wallarm modülü sunucusunda NGINX/NGINX Plus'ı yeniden başlatın:

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
=== "AlmaLinux, Rocky Linux veya Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```