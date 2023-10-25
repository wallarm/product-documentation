Postanalytics sunucu adresini `/etc/kong/nginx-wallarm.template`'e ekleyin:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# çıkartıldı

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! uyarı "Gerekli koşullar"
    `max_conns` ve `keepalive` parametreleri için aşağıdaki koşulların sağlanması gereklidir:
    
    * `keepalive` parametresinin değeri, Tarantool sunucularının sayısından düşük olmamalıdır.
    * Aşırı bağlantıların oluşturulmasını önlemek için `max_conns` parametresinin değeri, her bir upstream Tarantool sunucusu için belirtilmelidir.

    `# wallarm_tarantool_upstream wallarm_tarantool;` ifadesi varsayılan olarak yorumlanmıştır, lütfen `#`'yi silin.