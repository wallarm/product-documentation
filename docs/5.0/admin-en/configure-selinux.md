[link-selinux]:     https://www.redhat.com/en/topics/linux/what-is-selinux
[doc-monitoring]:   monitoring/intro.md

# SELinux Troubleshooting

[SELinux][link-selinux] is installed and enabled by default on RedHat‑based Linux distributions (e.g., CentOS or Amazon Linux 2.0.2021x and lower). SELinux can also be installed on other Linux distributions, such as Debian or Ubuntu.

Check SELinux presence and status by executing the following command:

``` bash
sestatus
```

## Automatic configuration

If the SELinux mechanism is enabled on a host with a filtering node, during node installation or upgrade, the [all-in-one installer](../installation/nginx/all-in-one.md) performs its automatic configuration for the node not to interfere with it.

This means, in most cases there will be no problems caused by SELinux.

## Troubleshooting

If after [automatic configuration](#automatic-configuration) you still experience the problems that can be caused by SeLinux:

* The filter node's RPS (requests per second) and APS (attacks per second) values will not be exported to the Wallarm cloud.
* It will not be possible to export filter node metrics to monitoring systems via the TCP protocol (see [“Monitoring the Filter Node”][doc-monitoring]).
* Other possible problems.

Do the following:

1. Temporarily disable SELinux by executing the `setenforce 0` command.

    SELinux will be disabled until the next reboot.

1. Check whether the problem(s) disappeared.
1. [Contact](mailto:support@wallarm.com) Wallarm's technical support for help.

    !!! warning "SELinux permanent disabling not recommended"
        It is not recommended to disable SELinux permanently due to the security issues.
