To deploy a self-hosted Wallarm node on bare metal or VMs without containers, use the all-in-one installer for Linux.

1. Set up a virtual machine for the Wallarm node that meets these requirements:

    * Linux OS
    * x86_64/ARM64 architecture
    * Inbound access from your API gateway or CDN where your APIs are running
    * Outbound access to:

        * `https://meganode.wallarm.com` to download the Wallarm installer
        * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
        * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

            === "US Cloud"
                ```
                34.96.64.17
                34.110.183.149
                ```
            === "EU Cloud"
                ```
                34.160.38.183
                34.144.227.90
                ```
1. Issue a **trusted** SSL/TLS certificate for the machine's domain and upload it to the machine along with the private key. Self-signed certificates are not allowed.
1. Open Wallarm Console → **Settings** → **API tokens** and create [API token][api-token] with the `Deploy` role.

    You will need this to connect the virtual machine with the node to the Wallarm Cloud. 
1. Download Wallarm installation script and make it executable:

    === "x86_64 version"
        ```bash
        curl -O https://meganode.wallarm.com/next/aionext-0.5.2.x86_64.sh
        chmod +x aionext-0.5.2.x86_64.sh
        ```
    === "ARM64 version"
        ```bash
        curl -O https://meganode.wallarm.com/next/aionext-0.5.2.aarch64.sh
        chmod +x aionext-0.5.2.aarch64.sh
        ```
1. Create the `wallarm-node-conf.yaml` file on the machine with the following minimal configuration:

    ```yaml
    version: 2

    mode: connector-server

    connector:
      address: ":5050"
      tls_cert: path/to/tls-cert.crt
      tls_key: path/to/tls-key.key
    ```

    [All configuration parameters][self-hosted-connector-node-aio-conf]
1. Run the Wallarm installer:

    === "x86_64 version"
        ```bash
        # US Cloud
        sudo env WALLARM_LABELS='group=<GROUP>' ./aionext-0.5.2.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

        # EU Cloud
        sudo env WALLARM_LABELS='group=<GROUP>' ./aionext-0.5.2.x86_64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
        ```
    === "ARM64 version"
        ```bash
        # US Cloud
        sudo env WALLARM_LABELS='group=<GROUP>' ./aionext-0.5.2.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host us1.api.wallarm.com

        # EU Cloud
        sudo env WALLARM_LABELS='group=<GROUP>' ./aionext-0.5.2.aarch64.sh -- --batch --token <API_TOKEN> --mode=connector-server --go-node-config=<PATH_TO_CONFIG> --host api.wallarm.com
        ```

    * The `WALLARM_LABELS` variable sets group into which the node will be added (used for logical grouping of nodes in the Wallarm Console UI).
    * `<API_TOKEN>` specifies the generated API token for the `Deploy` role.
    * `<PATH_TO_CONFIG>` specifies the path to the configuration file prepared before.

To verify if the filtering node operates correctly:

* Logs are written to `/opt/wallarm/var/log/wallarm/go-node.log` by default. You can read them there.
* Standard logs of the filtering node such as whether the data is sent to the Wallarm Cloud, detected attacks, etc. are located in the directory `/opt/wallarm/var/log/wallarm`.
