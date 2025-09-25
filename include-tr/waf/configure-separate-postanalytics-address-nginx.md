`/etc/nginx/conf.d/wallarm.conf` dosyasına postanalytics sunucu adreslerini ekleyin:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # atlandı

wallarm_tarantool_upstream wallarm_tarantool;
```

- `max_conns` değeri, aşırı bağlantı oluşturulmasını önlemek için her bir upstream Tarantool sunucusu için belirtilmelidir.
- `keepalive` değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
- Varsayılan olarak `# wallarm_tarantool_upstream wallarm_tarantool;` satırı yorumlanmış durumdadır — lütfen `#` karakterini silin.