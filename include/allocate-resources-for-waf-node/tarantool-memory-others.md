The sizing of Tarantool memory is controlled using the `SLAB_ALLOC_ARENA` attribute in the `/etc/default/wallarm-tarantool` configuration file. To allocate memory:

<ol start="1"><li>Open for editing the configuration file of Tarantool:</li></ol>

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

<ol start="2"><li>Set the <code>SLAB_ALLOC_ARENA</code> attribute to memory size. For example:</li></ol>

```
SLAB_ALLOC_ARENA=10.4
```

<ol start="3"><li>Restart Tarantool:</li></ol>

=== "Debian 8.x (jessie)"
    ```bash
    systemctl restart wallarm-tarantool
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
    service wallarm-tarantool restart
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    service wallarm-tarantool restart
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

To learn how long a Tarantool instance is capable of keeping traffic details with the current level of WAF node load, you can use the [`wallarm-tarantool/gauge-timeframe_size`](https://docs.wallarm.com/admin-en/monitoring/available-metrics#time-of-storing-requests-in-the-postanalytics-module-in-seconds) monitoring metric.
