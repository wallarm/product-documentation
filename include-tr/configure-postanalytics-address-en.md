Add the server address of postanalytics to `/etc/nginx-wallarm/conf.d/wallarm.conf`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! warning "Gerekli Koşullar"
    `max_conns` ve `keepalive` parametreleri için aşağıdaki koşulların sağlanması gerekmektedir:
    
    * `keepalive` parametresinin değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
    * Aşırı bağlantı oluşumunu önlemek için, her bir upstream Tarantool sunucusu için `max_conns` parametresinin değeri belirtilmelidir.

    Varsayılan olarak `# wallarm_tarantool_upstream wallarm_tarantool;` satırı yorum satırı halindedir - lütfen `#` işaretini kaldırın.