Add postanalytics server addresses to the file `/etc/nginx/conf.d/wallarm.conf`:

```bash
upstream wallarm_tarantool {
    server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
    
    keepalive 2;
    }

    # omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

* `max_conns` value must be specified for each of the upstream Tarantool servers to prevent the creation of excessive connections.
* `keepalive` value must not be lower than the number of the Tarantool servers.
