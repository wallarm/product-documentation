NGINX-Wallarm modülünün bulunduğu makinede, NGINX [yapılandırma dosyasında](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) (genellikle `/etc/nginx/nginx.conf` konumunda), postanalytics modülü sunucu adresini belirtin:

```
http {
    # atlandı
    upstream wallarm_wstore {
        server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
        server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
        
        keepalive 2;
    }

    wallarm_wstore_upstream wallarm_wstore;

    # atlandı
}
```

- Aşırı bağlantıların oluşturulmasını önlemek için her bir upstream wstore sunucusu için `max_conns` değeri belirtilmelidir.
- `keepalive` değeri wstore sunucularının sayısından düşük olmamalıdır.
- `# wallarm_wstore_upstream wallarm_wstore;` dizesi varsayılan olarak yorum satırı olarak işaretlidir - lütfen `#` işaretini silin.

Yapılandırma dosyası değiştirildikten sonra, NGINX-Wallarm modülünün bulunduğu sunucuda NGINX/NGINX Plus'ı yeniden başlatın:

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