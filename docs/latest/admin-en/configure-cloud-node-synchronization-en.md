# Configuring synchronization between Wallarm node and Cloud

The filtering node regularly synchronizes with the Wallarm Cloud to:

* Get updates for [traffic processing rules (LOM)](../about-wallarm/protecting-against-attacks.md#custom-rules-for-request-analysis)
* Get updates of [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)
* Send data on detected attacks and vulnerabilities
* Send metrics for processed traffic

These instructions describe parameters and methods used to configure filtering node and Wallarm Cloud synchronization.

## Access parameters

The `node.yaml` file contains the parameters providing the filtering node access to the Cloud.

This file is automatically created after running the `addnode` script and includes the filtering node name and UUID, and Wallarm API secret key. Default path to the file is `/etc/wallarm/node.yaml`. This path can be changed via the [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf) directive.

The `node.yaml` file may contain the following access parameters:

| Parameter         | Description                                                                                                                                                                                                                                                              |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hostname`       | Filtering node name. This variable is **required** to be set in the `node.yaml` file.                                                                                                                                                                                                       |
| `uuid`           | Filtering node UUID. This variable is **required** to be set in the `node.yaml` file.                                                                                                                                                                            |
| `secret`         | Secret key to access the Wallarm API. This variable is **required** to be set in the `node.yaml` file.                                                                                                                                                            |
| `api.host`       | Wallarm API endpoint. Can be:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>Default value is `api.wallarm.com`.           |
| `api.port`       | Wallarm API port. Default value is `443`.                                                                                                                                                                                                                   |
| `api.ca_verify`  | Whether to enable/disable Wallarm API server certificate verification. Can be:<ul><li>`true` to enable verification</li><li>`false` to disable verification</li></ul>Default value is `true`. |
| `api.local_host` | Local IP address of the network interface through which requests to Wallarm API are sent. This parameter is required if the network interface used by default restricts access to Wallarm API (for example, access to the Internet may be closed).
| `api.local_port` | Port of the network interface through which requests to Wallarm API are sent. This parameter is required if the network interface used by default restricts access to Wallarm API (for example, access to the Internet may be closed).

To change synchronization parameters, proceed with the following steps:

1. Make changes to the `node.yaml` file by adding the required parameters and assigning the desired values to them.
1. Restart NGINX to apply updated settings to the synchronization process:

    --8<-- "../include/waf/restart-nginx-3.6.md"

## Synchronization interval

By default, the filtering node synchronizes with the Wallarm Cloud every 120‑240 seconds (2‑4 minutes). You can change the synchronization interval via the system environment variable `WALLARM_SYNCNODE_INTERVAL`.

To change the interval between filtering node and Wallarm Cloud synchronizations:

1. Open the file `/etc/environment`.
2. Add the `WALLARM_SYNCNODE_INTERVAL` variable to the file and set a desired value to the variable in seconds. The value cannot be less than the default value (`120` seconds). For example:

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. Save the changed file `/etc/environment`. New interval value will be applied to the synchronization process automatically.

## Configuration example

Note that besides parameters providing the filtering node access to the Cloud (general and `api` sections, described in this article), the `node.yaml` file may also contain parameters providing different processes [the access to files](configure-access-to-files-needed-for-node.md) needed for the node operation (`syncnode` section).

--8<-- "../include/node-cloud-sync-configuration-example.md"
