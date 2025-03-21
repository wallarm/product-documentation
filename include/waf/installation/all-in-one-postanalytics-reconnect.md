On the machine with the NGINX-Wallarm module, in the NGINX [configuration file](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/) (typically located at `/etc/nginx/nginx.conf`), specify the postanalytics module server address:

```
http {
    # omitted
    upstream wallarm_wstore {
        server <ip1>:3313 max_fails=0 fail_timeout=0 max_conns=1;
        server <ip2>:3313 max_fails=0 fail_timeout=0 max_conns=1;
        
        keepalive 2;
    }

    wallarm_wstore_upstream wallarm_wstore;

    # omitted
}
```

* `max_conns` value must be specified for each of the upstream wstore servers to prevent the creation of excessive connections.
* `keepalive` value must not be lower than the number of the wstore servers.
* The `# wallarm_wstore_upstream wallarm_wstore;` string is commented by default - please delete `#`.

Once the configuration file changed, restart NGINX/NGINX Plus on the NGINX-Wallarm module server:

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "Ubuntu"
    ```bash
    sudo service nginx restart
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```