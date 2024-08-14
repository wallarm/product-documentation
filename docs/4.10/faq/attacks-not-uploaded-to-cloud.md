# Attacks are not uploaded to the Wallarm Cloud

If you suspect that attacks from the traffic are not uploaded to the Wallarm Cloud and, as a result, do not appear in the Wallarm Console UI, use this article to debug the issue.

To debug the problem, sequentially perform the following steps:

1. Generate some malicious traffic to perform further debugging.
1. Check the filtering node operation mode.
1. Check that Tarantool has enough resources to process requests.
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
1. Restart NGINX to be sure that Wallarm node settings have been applied (if the node has been installed from DEB/RPM packages):

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. [Generate](#1-generate-some-malicious-traffic) malicious traffic once again to be sure that attacks are still not uploaded to the Cloud.

## 3. Check that Tarantool has enough resources to process requests

The following Tarantool's basic metrics point to Tarantool problems connected with attack export:

* `wallarm.stat.export_delay` is a delay in uploading attacks to the Wallarm Cloud (in seconds)
* `wallarm.stat.timeframe_size` is the time interval Tarantool stores requests (in seconds)
* `wallarm.stat.dropped_before_export` is the number of hits that did not have enough time to be uploaded to the Wallarm Cloud

To view the metrics:

1. Connect to the server with the installed postanalytics module (Tarantool).
1. Execute the following commands:

    ```bash
    wtarantool
    require('console').connect('127.0.0.1:3313')
    wallarm.stat.export_delay()
    wallarm.stat.timeframe_size()
    wallarm.stat.dropped_before_export()
    ```

If the `wallarm.stat.dropped_before_export` value is different from `0`:

* [Increase](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) the memory amount allocated for Tarantool (if `wallarm.stat.timeframe_size` is less than 10 minutes).

    !!! info "Recommended memory"
        It is recommended to adjust the memory allocated for Tarantool so that the `wallarm.stat.timeframe_size` metric does not drop below `300` seconds during the peak loads.

* Increase the number of `export_attacks` handlers in `node.yaml` → `export_attacks` (`/opt/wallarm/etc/wallarm/node.yaml` → `export_attacks` for Docker NGINX-based image, cloud images and all-in-one installer - use search to locate files in other installations), e.g.:

    ```yaml
    export_attacks:
      threads: 5
      api_chunk: 20
    ```

    The `export_attacks` settings are the following by default:

    * `threads: 2`
    * `api_chunk: 10`

## 4. Capture logs and share them with the Wallarm support team

If the steps above do not help to resolve the issue, please capture the node logs and share them with the Wallarm support team as follows:

1. Connect to the server with the installed Wallarm node.
1. Get the `wallarm-status` output as follows:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    Copy an output.
1. Run the Wallarm diagnostic script:

    === "All-in-one installer, AMI or GCP image, NGINX-based Docker image"
        ```bash
        sudo /opt/wallarm/usr/share/wallarm-common/collect-info.sh
        ```
    === "Other deployment options"
        ```bash
        sudo /usr/share/wallarm-common/collect-info.sh
        ```

    Get the generated file with logs.
1. Send all collected data to the [Wallarm support team](mailto:support@wallarm.com) for further investigation.
