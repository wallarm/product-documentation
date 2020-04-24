**Allocate the operating memory size for Tarantool**

The amount of memory determines the quality of work of the statistical algorithms.

The recommended value is 75% of the total server memory. For example, if the server has 32 GB of memory, the recommended allocation size is 24 GB.

Open for editing the configuration file of Tarantool:

=== "Debian 8.x (jessie)"
    ```bash
    vi /etc/default/wallarm-tarantool
    ```
=== "Debian 9.x (stretch)"
    ```bash
    vi /etc/default/wallarm-tarantool
    ```
=== "Debian 10.x (buster)"
    ```bash
    vi /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 14.04 LTS (trusty)"
    ```bash
    vi /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 16.04 LTS (xenial)"
    ```bash
    vi /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    vi /etc/default/wallarm-tarantool
    ```
=== "CentOS 6.x"
    ```bash
    vi /etc/sysconfig/wallarm-tarantool
    ```
=== "CentOS 7.x"
    ```bash
    vi /etc/sysconfig/wallarm-tarantool
    ```
=== "Amazon Linux 2"
    ```bash
    vi /etc/sysconfig/wallarm-tarantool
    ```

Set the allocated memory size in the configuration file of Tarantool via the
`SLAB_ALLOC_ARENA` directive.

For example:

```
SLAB_ALLOC_ARENA=24
```

**Configure the server addresses of postanalytics**

Uncomment HOST and PORT variables and set them the following values:

``` bash
# address and port for bind
HOST='0.0.0.0'
PORT=3313
```

**Restart Tarantool**

=== "Debian 8.x (jessie)"
    ```bash
    service wallarm-tarantool restart
    ```
=== "Debian 9.x (stretch)"
    ```bash
    systemctl restart wallarm-tarantool
    ```
=== "Debian 10.x (buster)"
    ```bash
    systemctl restart wallarm-tarantool
    ```
=== "Ubuntu 14.04 LTS (trusty)"
    ```bash
    service wallarm-tarantool restart
    ```
=== "Ubuntu 16.04 LTS (xenial)"
    ```bash
    systemctl restart wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    systemctl restart wallarm-tarantool
    ```
=== "CentOS 6.x"
    ```bash
    service wallarm-tarantool restart
    ```
=== "CentOS 7.x"
    ```bash
    systemctl restart wallarm-tarantool
    ```
=== "Amazon Linux 2"
    ```bash
    systemctl restart wallarm-tarantool
    ```
