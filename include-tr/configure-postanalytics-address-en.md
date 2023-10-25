Postanalytics'in sunucu adresini `/etc/nginx-wallarm/conf.d/wallarm.conf` dosyasına ekleyin:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# atlandı

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! uyarı "Gerekli Koşullar"
    `max_conns` ve `keepalive` parametreleri için aşağıdaki koşulların yerine getirilmesi gerekmektedir:
    
    * `keepalive` parametresinin değeri, Tarantool sunucularının sayısından daha düşük olmamalıdır.
    * Fazla bağlantıların oluşturulmasını önlemek için her bir upstream Tarantool sunucusu için `max_conns` parametresinin değeri belirtilmiş olmalıdır.

    `# wallarm_tarantool_upstream wallarm_tarantool;` dizisi varsayılan olarak yorumlanmıştır - lütfen `#` işaretini silin.
