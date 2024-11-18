# Attacks are not uploaded to the Wallarm Cloud

If you suspect that attacks from the traffic are not uploaded to the Wallarm Cloud and, as a result, do not appear in the Wallarm Console UI, use this article to debug the issue.

To debug the problem, sequentially perform the following steps:

1. Generate some malicious traffic to perform further debugging.
1. Check the filtering node operation mode.
1. Capture logs and share them with the Wallarm support team.

## 1. Generate some malicious traffic

To perform further debugging of the Wallarm modules:

1. Send the following malicious traffic:

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    Replace `<FILTERING_NODE_IP>` with a filtering node IP you want to check. If required, add the `Host:` header to the command.
1. Wait up to 2 minutes for the attacks to appear in Wallarm Console → **Attacks**. If all 100 requests appear, the filtering node operates OK.
1. Connect to the server with the installed filtering node and get [node metrics](../admin-en/monitoring/intro.md):

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Further, we will refer to the `wallarm-status` output.

## 2. Check the filtering node operation mode

Check the filtering node operation mode as follows:

1. Make sure that the filtering node [mode](../admin-en/configure-wallarm-mode.md) is different from `off`. The node does not process incoming traffic in the `off` mode.

    The `off` mode is a common reason for the `wallarm-status` metrics not to increase.
1. If the node is NGINX-based, restart NGINX to be sure that settings have been applied:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. [Generate](#1-generate-some-malicious-traffic) malicious traffic once again to be sure that attacks are still not uploaded to the Cloud.

## 3. Capture logs and share them with the Wallarm support team

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
