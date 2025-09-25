postanalytics'in sunucu adresini `/etc/kong/nginx-wallarm.template` dosyasına ekleyin:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# atlandı

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! warning "Gerekli koşullar"
    `max_conns` ve `keepalive` parametreleri için aşağıdaki koşulların sağlanması gerekir:
    
    * `keepalive` parametresinin değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
    * Aşırı bağlantı oluşturulmasını önlemek için her bir upstream Tarantool sunucusu için `max_conns` parametresinin değeri belirtilmelidir.

    `# wallarm_tarantool_upstream wallarm_tarantool;` satırı varsayılan olarak yorum satırı hâlindedir - lütfen `#` işaretini silin.