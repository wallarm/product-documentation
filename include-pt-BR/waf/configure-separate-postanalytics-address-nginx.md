Adicione os endereços do servidor postanalytics ao arquivo `/etc/nginx/conf.d/wallarm.conf`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitido

wallarm_tarantool_upstream wallarm_tarantool;
```

* O valor de `max_conns` deve ser especificado para cada um dos servidores upstream Tarantool para evitar a criação de conexões excessivas.
* O valor de `keepalive` não deve ser menor do que o número de servidores Tarantool.
* A string `# wallarm_tarantool_upstream wallarm_tarantool;` está comentada por padrão - por favor, delete `#`.