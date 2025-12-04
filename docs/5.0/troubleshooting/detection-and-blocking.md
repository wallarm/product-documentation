# Attack Detection and Blocking Troubleshooting

## Attacks are not displayed

If the following occurs:

* You send a test attack and it is not displayed in **Attacks** in Wallarm Console
* You notice attacks did not appear in **Attacks** in Wallarm Console for some time

... this can be total or partial loss of attacks due to different reasons:

* No connectivity between Node and Cloud → total loss
* Filtering mode is `off` or Wallarm scripts/services are not running → total loss
* Node (postanalytics module, tarantool-based) does not handle everything it receives (insufficient memory, etc.) → partial loss, `gauge-export_drops_flag` is `1`
* Node (postanalytics module, tarantool-based) does not receive all requests from web server (e.g., NGINX) → partial loss, `tnt_errors` increases significantly
* Node (postanalytics module, tarantool-based) handles what it received with errors → partial loss, `tnt_errors` increases significantly

See details in child sections.

### Total loss

If attacks are not displayed the Cloud:

1. Make sure that the filtering node [mode](../admin-en/configure-wallarm-mode.md) is different from `off`. The node does not process incoming traffic in the `off` mode.

    The `off` mode is a common reason for the `wallarm-status` metrics not to increase.

1. Check whether the script for uploading data to the analytical cluster has been run:

    ```
    ps aux | grep wcli
    ```

1. If the process is not running, start the `supervisord` service.
1. Make sure in the `/opt/wallarm/etc/supervisord.conf` or `/opt/wallarm/etc/supervisord.conf.postanalytics` the `wcli` script is configured properly (mode is should be NOT specified - by default it is `all` or should be `-mode post_analytic`).
1. Check logs:

    ```
    grep reqexp /opt/wallarm/var/log/wallarm/wcli-out.log
    ```

1. Check whether the `wallarm` and `tarantool` services are running:

    ```
    ps aux | grep wallarm-tarantool
    ```

1. If it is not, run it:

    ```
    systemctl start wallarm
    ```

1. If this did not help, check `IP:port` on which `tarantool` is running in the `/opt/wallarm/env.list` file, section #tarantool, `HOST` and `PORT` parameters. Set:

    1. `HOST=127.0.0.1`
    1. `PORT=3313`

    If the postanalytics module is installed at a separate server, check and configure the same data in `/opt/wallarm/etc/wallarm/node.yaml`.

1. Restart the wallarm service:

    ```
    systemctl restart wallarm
    ```

1. If this did not help, check request timeouts in `wcli-out.log`:

    ```
    grep reqexp /opt/wallarm/var/log/wallarm/wcli-out.log
    ```

1. If request timeout errors are presented, check the availability of Wallarm's API, grant access to it, it it is not granted yet.

1. If some other errors are presented in `wcli-out.log`, contact the Wallarm support team.

### Partial loss - `gauge-export_drops_flag` is `1`

If some attacks are not displayed the Cloud and the [`gauge-export_drops_flag`](../admin-en/monitoring/available-metrics.md) metric gets the `1` value, this means that requests with attacks have been deleted from the postanalytics module but not sent to the Cloud. Usually this happens due to the insufficient memory allocated form the postanalytics module. Follow the steps to check and and fix this:

1. Check logs:

    ```
    grep reqexp /opt/wallarm/var/log/wallarm/wcli-out.log
    ```

1. If there are errors in the log, act as described [here](#attacks-are-not-displayed).
1. If this did not help, check the [`timeframe_size`](../admin-en/monitoring/available-metrics.md) metric value:

    ```
    /opt/wallarm/usr/bin/collectdctl -s /opt/wallarm/var/run/wallarm-collectd-unixsock getval "$(/opt/wallarm/usr/bin/collectdctl -s /opt/wallarm/var/run/wallarm-collectd-unixsock listval | awk -F "/" '{ print $1 }' | head -n1)"/wallarm-tarantool/gauge-timeframe_size
    ```

    If the value is < 300, in `/opt/wallarm/env.list`, increase the value of `SLAB_ALLOC_ARENA` and then restart the `wallarm` service.

1. If this did not help, check the [`export_delay`](../admin-en/monitoring/available-metrics.md) metric value:

    ```
    /opt/wallarm/usr/bin/collectdctl -s /opt/wallarm/var/run/wallarm-collectd-unixsock getval "$(/opt/wallarm/usr/bin/collectdctl -s /opt/wallarm/var/run/wallarm-collectd-unixsock listval | awk -F "/" '{ print $1 }' | head -n1)"/wallarm-tarantool/gauge-export_delay
    ```

    If the value is > 10, then check the stability of connection to Wallarm API.

1. Restart `wallarm` and `wcli`:

    ```
    systemctl restart wallarm
    ```

### Partial loss - `tnt_errors` increases

If the [`tnt_errors`](../admin-en/configure-statistics-service.md) metric gets `+1` at each processed request, this means some problems in Wallarm's [postanalytics](../admin-en/installation-postanalytics-en.md) module functioning occur (caused by interaction with web server (e.g., NGINX) or postanalytics itself). Follow the steps to check and and fix this:

1. Problem can be caused by web server. If the node is NGINX-based, try restarting NGINX to check whether the problems are gone:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

1. Check if `wallarm-tarantool` service is running:

    ```
    systemctl status wallarm
    ```
1. If it is not running, run it:

    ```
    start wallarm
    ```

1. Additionally, check the tarantool process managed by `supervisord`:

    ```
    ps aux | grep wallarm-tarantool
    ```

1. Restart tarantool:

    ```
    systemctl restart wallarm
    ```

1. If this did not solve the problem, proceed to the next steps.
1. Check `/opt/wallarm/var/log/wallarm/tarantool-out.log`, if there are errors like "Index 'primary' already exists" or "can't initialize storage", delete all files from `/opt/wallarm/var/lib/wallarm-tarantool` and restart Wallarm:

    ```
    systemctl restart wallarm
    ```

1. If this did not solve the problem, collect the debug information:

    ```
    sudo /opt/wallarm/collect-info.sh
    ```

1. Create ticket in Wallarm support system, providing the collected information.

## Filtering node RPS and APS values are not exported to Cloud

If filtering node information about RPS (requests per second) and APS (attacks per second) are not exported to Wallarm Cloud, the possible reasons are: 

* (often met) Altering the default configuration of Wallarm's statistics service
* (due to autoconfiguration, rarely met) SELinux.

**Broken statistics service**

While it is strongly advised not to alter any of the existing lines of the default configuration of Wallarm's [statistics service](../admin-en/configure-statistics-service.md) (`wallarm_status`) as it may corrupt the process of metric data upload to the Wallarm Cloud, the following may occur:

* Configuration file was not created or was deleted
* Configuration file was changed (default lines)

All these reasons will lead to RPS/APS (along with other metrics) are not obtained by the Cloud from the statistics service. The following errors will occur in [`wcli-out.log`](../admin-en/configure-logging.md):

```
 {"level" :"error", "component": "metricsexp", "error": "metricsexp: GetMetrics: unexpected HTTP response status code "time":"2025-10-30T11:25:262" "time":"2025-10-30T11:25:262", "message": "metrics export done with error'"}
```

And in NGINX logs:

```
wallarm | {"hostname": "wallarm", "host": "127.0.0.8", "request_uri":"/wallarm-status", "server_protocol": "HTTP/1.1", "status": "404", ...}
```

To solve the problem:

* Restore the default configuration (example is [here](../admin-en/configure-statistics-service.md#default-configuration))
* For your own monitoring purposes, use a separate server on address/port different from `wallarm_status`

**SeLinux**

[SELinux](https://www.redhat.com/en/topics/linux/what-is-selinux) is installed and enabled by default on RedHat‑based Linux distributions (e.g., CentOS or Amazon Linux 2.0.2021x and lower). SELinux can also be installed on other Linux distributions, such as Debian or Ubuntu.

Check SELinux presence and status by executing the following command:

``` bash
sestatus
```

If the SELinux mechanism is enabled on a host with a filtering node, during node installation or upgrade, the [all-in-one installer](../installation/inline/compute-instances/linux/all-in-one.md) performs its automatic configuration for the node not to interfere with it.

If after automatic configuration you still experience the problems that can be caused by SeLinux, do the following:

1. Temporarily disable SELinux by executing the `setenforce 0` command.

    SELinux will be disabled until the next reboot.

1. Check whether the problem(s) disappeared.
1. [Contact](mailto:support@wallarm.com) Wallarm's technical support for help.

    !!! warning "SELinux permanent disabling not recommended"
        It is not recommended to disable SELinux permanently due to the security issues.

## Filtering node does not block attacks when operating in blocking mode (`wallarm_mode block`)

Using the `wallarm_mode` directive is only one of several methods of traffic filtration mode configuration. Some of these configuration methods have a higher priority than the `wallarm_mode` directive value.

If you have configured blocking mode via `wallarm_mode block` but Wallarm filtering node does not block attacks, please ensure that filtration mode is not overridden using other configuration methods:

* IP is in the [Allowlist](../user-guides/ip-lists/overview.md)
* Mode is set in the [**General** section of Wallarm Console](../admin-en/configure-wallarm-mode.md#general-filtration-mode)
* Mode is set using the [rule **Set filtration mode**](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)

[More details on filtration mode configuration methods →](../admin-en/configure-parameters-en.md)

## User gets blocking page after legitimate request

If your user reports a legitimate request being blocked despite the Wallarm measures, you can review and evaluate their requests as this articles explains.

To resolve the issue of a legitimate request being blocked by Wallarm, follow these steps:

1. Request the user to provide **as text** (not screenshot) the information related to the blocked request, which is one of the following:

    * Information provided by the Wallarm [blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) if it is configured (may include user’s IP address, request UUID and other pre-configured elements).

        ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

        !!! warning "Blocking page usage"
            If you do not use the default or customized Wallarm blocking page, it is highly recommended to [configure](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) it to get the appropriate info from user. Remember that even a sample page collects and allows easy copying of meaningful information related to the blocked request. Additionally, you can customize or fully rebuild such page to return users the informative blocking message.
    
    * Copy of user's client request and response. Browser page source code or terminal client textual input and output suits well.

1. In Wallarm Console → [**Attacks**](../user-guides/events/check-attack.md) or [**Incidents**](../user-guides/events/check-incident.md) section, [search](../user-guides/search-and-filters/use-search.md) for the event related to the blocked request. For example, [search by request ID](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    attacks incidents request_id:<requestId>
    ```

1. Examine the event to determine if it indicates a wrong or legitimate blocking.
1. If it is a wrong blocking, solve the issue by applying one or a combination of measures: 

    * Measures against [false positives](../user-guides/events/check-attack.md#false-positives)
    * Re-configuring [rules](../user-guides/rules/rules.md)
    * Re-configuring [triggers](../user-guides/triggers/triggers.md)
    * Modifying [IP lists](../user-guides/ip-lists/overview.md)

1. If the information initially provided by the user is incomplete or you are not sure about measures that can be safely applied, share the details with [Wallarm support](mailto:support@wallarm.com) for further assistance and investigation.

## Filtering node not processing requests

If the [`segfaults`](../admin-en/configure-statistics-service.md) metric gets value different from `0` and increases, there are problems with filtering node processing requests.  Follow the steps to check and and fix this:

1. Check whether other filtering nodes (if any) work properly.
1. Restart nginx:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

1. If this did not help, for the machine with problematic node, start collecting core files:

    1. Create folder to store core files `mkdir /tmp/cores/`.
    1. Make sure NGINX can save files to the folder:

        ```
        sudo chown root:root /tmp/cores
        sudo chmod 1777 /tmp/cores
        ```
    
    1. To `/etc/nginx/nginx.conf`, add the strings:

        ```
        ...
        working_directory /tmp/cores/;
        worker_rlimit_core 500M;
        ```
    
    1. Restart NGINX.

1. If `segfaults` continues to increase, collect core files, output of `dpkg -l` and files by the `/var/log/nginx/*error*.log` mask.
1. If problem affects significantly the application normal functioning, set filtering node to the `off` mode temporarily.
1. Send the collected data to Wallarm support team.
1. Get a fix data from Wallarm support team.
1. Check NGINX configuration correctness with `nginx -t`.
1. Re-enable Wallarm node by setting mode different from `off`.
1. Restart NGINX.

## Requests are not proxied to applications

If one of the following happens:

* Requests reach filtering node but do not reach target applications
* Filtering node does not process requests

This may mean problems with proxying requests from node to applications. Follow the steps to check and and fix this:

1. Check NGINX status and restart it if necessary:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

1. If this did not help, check NGINX logs for incoming requests, if they are absent: 

    1. Check connection between the load balancer and the node.
    1. Check the load balancer configuration.

1. If requests reach filtering node, but do not reach the target application, check connection between node and application.
1. If you have timeout errors, increase NGINX's `proxy_read_timeout` and `proxy_connect_timeout` in `/etc/nginx/nginx.conf`.
