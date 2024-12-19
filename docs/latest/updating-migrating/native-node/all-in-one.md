[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Upgrading Wallarm Native Node with All-in-One Installer

These instructions describe the steps to upgrade the [Native Node installed using all-in-one installer](../../installation/native-node/all-in-one.md).

[View all-in-one installer releases](node-artifact-versions.md)

## Requirements

* Linux OS.
* x86_64/ARM64 architecture.
* Executing all commands as a superuser (e.g. `root`).
* Outbound access to:

    * `https://meganode.wallarm.com` to download the Wallarm installer
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* In addition to the above, you should have the **Administrator** role assigned in Wallarm Console.

## 1. Download the new installer version

Download the latest installer version on the machine where your current Native Node is running:

=== "x86_64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.10.0.x86_64.sh
    chmod +x aio-native-0.10.0.x86_64.sh
    ```
=== "ARM64 version"
    ```bash
    curl -O https://meganode.wallarm.com/native/aio-native-0.10.0.aarch64.sh
    chmod +x aio-native-0.10.0.aarch64.sh
    ```

## 2. Run the new installer

Run the new installer as shown below. It will stop the currently running Wallarm services and then automatically start the services of the new version.

You can reuse the previously generated [API token for the `Deploy` role](../../user-guides/settings/api-tokens.md) and the node group name.

For the configuration file, you can reuse the one used during the initial installation. Only add new parameters or modify existing ones if necessary - see the [supported configuration options](../../installation/native-node/all-in-one-conf.md).

=== "connector-server"
    The `connector-server` mode is used when you deployed the self-hosted node with [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), or [Cloudflare](../../installation/connectors/cloudflare.md) connector.

    For the x86_64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.10.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.10.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    For the ARM64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.10.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.10.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
=== "tcp-capture"
    The `tcp-capture` mode is used when you deployed the self-hosted node for [TCP traffic analysis](../../installation/oob/tcp-traffic-mirror/deployment.md).

    For the x86_64 installer version:
        
    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.10.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.10.0.x86_64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```
    
    For the ARM64 installer version:

    ```bash
    # US Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.10.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com --preserve false

    # EU Cloud
    sudo env WALLARM_LABELS='group=<GROUP>' ./aio-native-0.10.0.aarch64.sh -- --batch --token <API_TOKEN> --mode=tcp-capture --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com --preserve false
    ```

* The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).
* `<API_TOKEN>` specifies the generated API token for the `Deploy` role.
* `<PATH_TO_CONFIG>` specifies the path to the configuration file.

Your current `/opt/wallarm/etc/wallarm/go-node.yaml`, `/opt/wallarm/etc/wallarm/node.yaml` and log files will be backed up to the directory `/opt/wallarm/aio-backups/<timestamp>`.

## 3. Verify the upgrade

To verify that the node is functioning correctly:

1. Check the logs for any errors:

    * Logs are written to `/opt/wallarm/var/log/wallarm/go-node.log` by default. You can read them there.
    * [Standard logs](../../admin-en/configure-logging.md) of the filtering node such as whether the data is sent to the Wallarm Cloud, detected attacks, etc. are located in the directory `/opt/wallarm/var/log/wallarm`.
1. Send the request with test [Path Traversal][ptrav-attack-docs] attack to a protected resource address:

    ```
    curl http://localhost/etc/passwd
    ```

    If traffic is configured to be proxied to `example.com`, include the `-H "Host: example.com"` header in the request.
1. Verify that the upgraded node operates as expected compared to the previous version.

## If you encounter a problem

If there is a problem with the upgrade or reinstallation process:

1. Remove the current installation:

    ```
    sudo systemctl stop wallarm && sudo rm -rf /opt/wallarm
    ```
1. Reinstall the node as usual for [TCP traffic analysis](../../installation/oob/tcp-traffic-mirror/deployment.md) or the [MuleSoft](../../installation/connectors/mulesoft.md), [CloudFront](../../installation/connectors/aws-lambda.md), or [Cloudflare](../../installation/connectors/cloudflare.md) connectors.

    Or follow the upgrade procedure described above.
