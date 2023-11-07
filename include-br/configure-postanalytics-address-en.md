Adicione o endereço do servidor do postanalytics ao `/etc/nginx-wallarm/conf.d/wallarm.conf`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# omitido

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! Aviso "Condições necessárias"
    É requerido que as seguintes condições sejam satisfeitas para os parâmetros `max_conns` e `keepalive`:
    
    * O valor do parâmetro `keepalive` não deve ser inferior ao número de servidores Tarantool.
    * O valor do parâmetro `max_conns` deve ser especificado para cada um dos servidores upstream Tarantool para evitar a criação de conexões excessivas.

    A String `# wallarm_tarantool_upstream wallarm_tarantool;` está comentada por padrão - por favor, delete `#`.