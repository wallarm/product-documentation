[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Upgrading Wallarm Native Node with Docker Image

These instructions describe the steps to upgrade the [Native Node deployed from the Docker image](../../installation/native-node/docker-image.md).

[View Docker image releases](node-artifact-versions.md)

## Requirements

* [Docker](https://docs.docker.com/engine/install/) installed on your host system
* Inbound access to your containerized environment from your API management platform
* Outbound access from your containerized environment to:

    * `https://hub.docker.com/r/wallarm` to download the Docker images required for the deployment
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses and their corresponding hostnames (if any) listed below. This is needed for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* In addition to the above, you should have the **Administrator** role assigned in Wallarm Console

## 1. Download the new Docker image version

```
docker pull wallarm/node-native-aio:0.19.0
```

## 2. Stop the running container

```bash
docker stop <RUNNING_CONTAINER_NAME>
```

## 3. Run the container using the new image

!!! info "If upgrading from Node version 0.12.x or lower"
    If upgrading from Node version 0.12.x or lower, ensure that the `version` value is updated in the initial configuration file (`wallarm-node-conf.yaml`, as per the default installation instructions) and that the section `tarantool_exporter` is renamed to `postanalytics_exporter` (if explicitly specified):

    ```diff
    -version: 2
    +version: 4

    -tarantool_exporter:
    +postanalytics_exporter:
        address: 127.0.0.1:3313
        enabled: true
    
    ...
    ```

=== "US Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='us1.api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.19.0
    ```
=== "EU Cloud"
    ```bash
    docker run -d -e WALLARM_API_TOKEN='XXXXXXX' -e WALLARM_LABELS='group=<GROUP>' -e WALLARM_API_HOST='api.wallarm.com' -v ./wallarm-node-conf.yaml:/opt/wallarm/etc/wallarm/go-node.yaml -p 80:5050 wallarm/node-native-aio:0.19.0
    ```

Environment variable | Description| Required
--- | ---- | ----
`WALLARM_API_TOKEN` | API token with the `Node deployment/Deployment` usage type. | Yes
`WALLARM_LABELS` | Sets the `group` label for node instance grouping, for example:<br>`WALLARM_LABELS="group=<GROUP>"` will place node instance into the `<GROUP>` instance group (existing, or, if does not exist, it will be created). | Yes
`WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>By default: `api.wallarm.com`. | No

* The `-p` option maps host and container ports:

    * The first value (`80`) is the host's port, exposed to external traffic.
    * The second value (`5050`) is the container's port, which should match the `connector.address` setting in the `wallarm-node-conf.yaml` file.
* The configuration file must be mounted as `/opt/wallarm/etc/wallarm/go-node.yaml` inside the container.

    For the configuration file, you can reuse the one used during the initial installation. Only add new parameters or modify existing ones if necessary - see the [supported configuration options](../../installation/native-node/all-in-one-conf.md).

## 4. Verify the upgrade

To verify that the node is functioning correctly:

1. Check the logs for any errors:

    * Logs are written to `/opt/wallarm/var/log/wallarm/go-node.log` by default, with additional output available in stdout.
    * [Standard logs](../../admin-en/configure-logging.md) of the filtering node such as whether the data is sent to the Wallarm Cloud, detected attacks, etc. are located in the directory `/opt/wallarm/var/log/wallarm` inside the container.
1. Send the request with test [Path Traversal][ptrav-attack-docs] attack to a protected resource address:

    ```
    curl http://localhost/etc/passwd
    ```
    
    If traffic is configured to be proxied to `example.com`, include the `-H "Host: example.com"` header in the request.
1. Verify that the upgraded node operates as expected compared to the previous version.
