# Attack Detection and Blocking Troubleshooting

## Attacks are not displayed

If you suspect that attacks from the traffic are not uploaded to the Wallarm Cloud and, as a result, do not appear in the Wallarm Console UI, use this article to debug the issue.

To debug the problem, sequentially perform the following steps:

1. Generate some malicious traffic to perform further debugging.
1. Check the filtering node operation mode.
1. Capture logs and share them with the Wallarm support team.

**Generate some malicious traffic**

To perform further debugging of the Wallarm modules:

1. Send the following malicious traffic:

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    Replace `<FILTERING_NODE_IP>` with a filtering node IP you want to check. If required, add the `Host:` header to the command.
1. Wait up to 2 minutes for the attacks to appear in Wallarm Console → **Attacks**. If all 100 requests appear, the filtering node operates OK.
1. Connect to the server with the installed filtering node and get [node metrics](../admin-en/configure-statistics-service.md):

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Further, we will refer to the `wallarm-status` output.

**Check the filtering node operation mode**

Check the filtering node operation mode as follows:

1. Make sure that the filtering node [mode](../admin-en/configure-wallarm-mode.md) is different from `off`. The node does not process incoming traffic in the `off` mode.

    The `off` mode is a common reason for the `wallarm-status` metrics not to increase.
1. If the node is NGINX-based, restart NGINX to be sure that settings have been applied:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. Generate malicious traffic once again to be sure that attacks are still not uploaded to the Cloud.

**Capture logs and share them with the Wallarm support team**

If the steps above do not help to resolve the issue, please capture the node logs and share them with the Wallarm support team as follows:

1. Connect to the server with the installed Wallarm node.
1. Get the `wallarm-status` output as follows:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Copy an output.
1. Run the Wallarm diagnostic script:

    ```bash
    /opt/wallarm/collect-info.sh
    ```

    Get the generated file with logs.
1. Send all collected data to the [Wallarm support team](mailto:support@wallarm.com) for further investigation.

## Filtering node RPS and APS values are not exported to Cloud

If filtering node information about RPS (requests per second) and APS (attacks per second) are not exported to Wallarm cloud, the possible reason is SELinux.

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

* Using the [rule **Set filtration mode**](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
* In the [**General** section of Wallarm Console](../admin-en/configure-wallarm-mode.md#general-filtration-mode)

[More details on filtration mode configuration methods →](../admin-en/configure-parameters-en.md)

## User gets blocking page after legitimate request

If your user reports a legitimate request being blocked despite the Wallarm measures, you can review and evaluate their requests as this articles explains.

To resolve the issue of a legitimate request being blocked by Wallarm, follow these steps:

1. Request the user to provide **as text** (not screenshot) the information related to the blocked request, which is one of the following:

    * Information provided by the Wallarm [blocking page](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) if it is configured (may include user’s IP address, request UUID and other pre-configured elements).

        ![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-6.x.png)

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
