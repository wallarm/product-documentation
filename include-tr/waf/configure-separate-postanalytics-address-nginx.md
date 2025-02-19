Add postanalytics sunucu adreslerini `/etc/nginx/conf.d/wallarm.conf` dosyasına ekleyin:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* Aşırı bağlantı oluşturulmasını önlemek için upstream Tarantool sunucularının her biri için `max_conns` değeri belirtilmelidir.
* `keepalive` değeri, Tarantool sunucularının sayısından daha düşük olmamalıdır.
* Varsayılan olarak yorum halindeki `# wallarm_tarantool_upstream wallarm_tarantool;` dizesindeki `#` karakteri kaldırılmalıdır.