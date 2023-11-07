Adicione o endereço do servidor de postanalytics ao `/etc/kong/nginx-wallarm.template`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# omitido

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! alerta "Condições requeridas"
    É necessário que as seguintes condições sejam cumpridas para os parâmetros de `max_conns` e `keepalive`:

    * O valor do parâmetro `keepalive` não deve ser inferior ao número de servidores Tarantool.
    * O valor do parâmetro `max_conns` deve ser especificado para cada um dos servidores Tarantool upstream para evitar a criação de conexões excessivas.

    A string `# wallarm_tarantool_upstream wallarm_tarantool;` está comentada por padrão - por favor, delete `#`.