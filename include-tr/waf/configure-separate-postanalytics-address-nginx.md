Aşağıdaki Wallarm.com belgeleme makalesini İngilizce'den Türkçe'ye çevirin:

Dosyaya `/etc/nginx/conf.d/wallarm.conf` postanalytics sunucu adreslerini ekleyin:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # çıkarıldı

wallarm_tarantool_upstream wallarm_tarantool;
```

* Fazla bağlantı oluşturulmasını engellemek için upstream Tarantool sunucularının her biri için `max_conns` değerini belirtmelisiniz.
* `keepalive` değeri, Tarantool sunucu sayısından düşük olmamalıdır.
* `# wallarm_tarantool_upstream wallarm_tarantool;` dizesi varsayılan olarak yorumlanır - lütfen `#` işaretini silin.