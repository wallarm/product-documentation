[link-selinux]:     https://www.redhat.com/en/topics/linux/what-is-selinux
[doc-monitoring]:   monitoring/intro.md

# Configuring SELinux

If the [SELinux][link-selinux] mechanism is enabled on a host with a filter node, it may interfere with the filter node, rendering it inoperable:
* The filter node's RPS (requests per second) and APS (attacks per second) values will not be exported to the Wallarm cloud.
* It will not be possible to export filter node metrics to monitoring systems via the TCP protocol (see [“Monitoring the Filter Node”][doc-monitoring]).  


SELinux is installed and enabled by default on RedHat‑based Linux distributions (e.g., CentOS or Amazon Linux 2.0.2021x and lower). SELinux can also be installed on other Linux distributions, such as Debian or Ubuntu.  

It is mandatory to either disable SELinux or configure SELinux so it does not disrupt the filter node operation.

## Check SELinux Status

Execute the following command:

``` bash
sestatus
```

Examine the output:
* `SELinux status: enabled`
* `SELinux status: disabled`

## Configure SELinux

Allow the `collectd` utility to use a TCP socket to make the filter node operable with SELinux enabled. To do so, execute the following command:

``` bash
setsebool -P collectd_tcp_network_connect 1
```

Check if the aforementioned command executed successfully by running the following command:

``` bash
semanage export | grep collectd_tcp_network_connect
```

The output should contain this string:
```
boolean -m -1 collectd_tcp_network_connect
```

## Disable SELinux 

To set SELinux to a disabled state
*   either execute the `setenforce 0` command (SELinux will be disabled until the next reboot) or
*   set the value of the `SELINUX` variable to `disabled` in the `/etc/selinux/config` file, then reboot (SELinux will be disabled permanently).