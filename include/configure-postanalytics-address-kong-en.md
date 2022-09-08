Add the server address of postanalytics to `/etc/kong/nginx-wallarm.template`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
}

# omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

!!! warning "Required conditions"
    It is required that the following conditions are satisfied for the `max_conns` and the `keepalive` parameters:
    
    * The value of the `keepalive` parameter must not be lower than the number of the Tarantool servers.
    * The value of the `max_conns` parameter must be specified for each of the upstream Tarantool servers to prevent the creation of excessive connections.

    The `# wallarm_tarantool_upstream wallarm_tarantool;` string is commented by default - do not forget to delete `#`.
