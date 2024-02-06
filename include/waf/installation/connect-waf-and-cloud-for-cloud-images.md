Depending on the selected Wallarm deployment approach ([in-line][inline-docs] or [Out-of-Band][oob-docs]), different commands are used to register the instance with the Wallarm Cloud.

=== "In-line"
    The cloud instance's node connects to the Cloud via the [cloud-init.py][cloud-init-spec] script. This script registers the node with the Wallarm Cloud using a provided token, globally sets it to the monitoring [mode][wallarm-mode], and sets up the node to forward legitimate traffic based on the `--proxy-pass` flag. Restarting NGINX finalizes the setup.

    Run the `cloud-init.py` script on the instance created from the cloud image as follows:

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring --proxy-pass <PROXY_ADDRESS>
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` sets a node group name (existing, or, if does not exist, it will be created). It is only applied if using an API token.
    * `<TOKEN>` is the copied value of the token.
    * `<PROXY_ADDRESS>` is an address for Wallarm node to proxy legitimate traffic to. It can be an IP of an application instance, load balancer, or DNS name, etc., depending on your architecture.
=== "Out-of-Band"
    The cloud instance's node connects to the Cloud via the [cloud-init.py][cloud-init-spec] script. This script registers the node with the Wallarm Cloud using a provided token, globally sets it to the monitoring [mode][wallarm-mode], and sets the [`wallarm_force`][wallarm_force_directive] directives in NGINX's `location /` block to only analyze mirrored traffic copies. Restarting NGINX finalizes the setup.

    Run the `cloud-init.py` script on the instance created from the cloud image as follows:

    === "US Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo env WALLARM_LABELS='group=<GROUP>' /opt/wallarm/usr/share/wallarm-common/cloud-init.py -t <TOKEN> -m monitoring -p mirror
        ```
    
    * `WALLARM_LABELS='group=<GROUP>'` sets a node group name (existing, or, if does not exist, it will be created). It is only applied if using an API token.
    * `<TOKEN>` is the copied value of the token.
