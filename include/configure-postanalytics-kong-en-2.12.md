The amount of memory determines the quality of work of the statistical algorithms.

The recommended value is 75% of the total server memory. For example, if the server has 32 GB of memory, the recommended allocation size is 24 GB.

**Allocate the operating memory size for Tarantool:**

Open for editing the configuration file of Tarantool:

=== "Debian 8.x (jessie)"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Debian 9.x (stretch)"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 14.04 LTS (trusty)"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 16.04 LTS (xenial)"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ``` bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS 6.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "CentOS 7.x"
    ``` bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

Set the allocated memory size in the configuration file of Tarantool via the `SLAB_ALLOC_ARENA` directive. The value can be an integer or a float (a dot `.` is a decimal separator).

For example:

```
SLAB_ALLOC_ARENA=24
```

**Restart Tarantool:**

=== "Debian 8.x (jessie)"
    ``` bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Debian 9.x (stretch)"
    ``` bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu 14.04 LTS (trusty)"
    ``` bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 16.04 LTS (xenial)"
    ``` bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ``` bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 6.x"
    ``` bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x"
    ``` bash
    sudo systemctl restart wallarm-tarantool
    ```
