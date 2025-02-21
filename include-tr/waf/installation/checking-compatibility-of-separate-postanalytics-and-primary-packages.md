```markdown
!!! info "The `wallarm-node-tarantool` package version"
    `wallarm-node-tarantool` paketi, ayrı bir sunucuda kurulu olan birincil NGINX-Wallarm modül paketleri ile aynı veya daha yüksek bir sürüme sahip olmalıdır.

    Sürümleri kontrol etmek için:

    === "Debian"
        ```bash
        # run from the server with primary NGINX-Wallarm module
        apt list wallarm-node-nginx
        # run from the server with the postanalytics module
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # run from the server with primary NGINX-Wallarm module
        apt list wallarm-node-nginx
        # run from the server with the postanalytics module
        apt list wallarm-node-tarantool
        ```
    === "CentOS or Amazon Linux 2.0.2021x and lower"
        ```bash
        # run from the server with primary NGINX-Wallarm module
        yum list wallarm-node-nginx
        # run from the server with the postanalytics module
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
        ```bash
        # run from the server with primary NGINX-Wallarm module
        yum list wallarm-node-nginx
        # run from the server with the postanalytics module
        yum list wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        # run from the server with primary NGINX-Wallarm module
        yum list wallarm-node-nginx
        # run from the server with the postanalytics module
        yum list wallarm-node-tarantool
        ```
```