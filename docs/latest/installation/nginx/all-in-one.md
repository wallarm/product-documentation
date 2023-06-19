[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[platform]:                         ../../admin-en/supported-platforms.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation


# Installing Wallarm with All-in-One Binary

These instructions describe the steps to install Wallarm filtering node as a dynamic module for different NGINX versions and on a number of different Linux OS versions using **all-in-one Wallarm binary**.

In comparison to the individual Linux packages offered by Wallarm for [NGINX](dynamic-module.md), [NGINX Plus](../nginx-plus.md), and [distributive NGINX](dynamic-module-from-distr.md), the **all-in-one binary** simplifies the process by automatically performing the following actions:

1. Checking your OS and NGINX version.
1. Adding Wallarm repositories for the detected OS and NGINX version.
1. Installing Wallarm packages from these repositories.
1. Connecting the installed Wallarm module to your NGINX.
1. Connecting the filtering node to Wallarm Cloud using the provided token.

![!All-in-one compared to manual](../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Requirements

* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Supported OS: Debian 10, 11 and 12.x, Ubuntu LTS 18.04, 20.04, 22.04, CentOS 7, 8 Stream, 9 Stream, Alma/Rocky Linux 9, Oracle Linux 8.x, Redos, SuSe Linux, and other popular Linux variants.
* Access to `https://meganode.wallarm.com` to download all-in-one Wallarm binary. Ensure the access is not blocked by a firewall
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Executing all commands as a superuser (e.g. `root`)

## 1. Install NGINX and dependencies

Install the latest NGINX version of:

* **NGINX `stable`** - see how to install it in the NGINX [documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/).
* **NGINX Plus** - see how to install it in the NGINX [documentation](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-plus/).
* **NGINX Distro** - see how to install in the Wallarm [documentation](../../installation/nginx/dynamic-module-from-distr.md).

## 2. Prepare Wallarm token

To install node, you will need a Wallarm token of the [appropriate type][wallarm-token-types]. To prepare a token:

=== "API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Deploy` source role.
    1. Copy this token.

=== "Node token"

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Do one of the following: 
        * Create the node of the **Wallarm node** type and copy the generated token.
        * Use existing node group - copy token using node's menu → **Copy token**.

## 3. Download all-in-one Wallarm binary

Wallarm suggests all-in-one installations for the following processors of node machine:

* x86_64
* ARM64

To download all-in-one Wallarm [installation script](#script-parameters), execute the command:

=== "x86_64 version"

    ```bash
    curl -O https://meganode.wallarm.com/4.6/wallarm-4.6.11.x86_64-glibc.sh
    ```

=== "ARM64 version"

    ```bash
    curl -O https://meganode.wallarm.com/4.6/wallarm-4.6.11.aarch64-glibc.sh
    ```

The steps below describe the x86_64 version installation. The ARM64 script uses all the same options.

## 4. Run all-in-one Wallarm binary

1. Run downloaded script:

    === "API token"
        ```bash
        sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.11.x86_64-glibc.sh
        ```

        Where `WALLARM_LABELS` variable sets group into which the node will be added. (used for logical grouping of nodes in the Wallarm Console UI).

    === "Node token"
        ```bash
        sudo sh wallarm-4.6.11.x86_64-glibc.sh
        ```

1. Select [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
1. Enter Wallarm token.

    The script finishes installation and reminds about necessity to configure the installed node via `/etc/nginx/nginx.conf`.

## 5. Enable Wallarm to analyze the traffic

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 6. Restart NGINX

Restart NGINX using the following command:

```bash
sudo systemctl restart nginx
```

## 7. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 8. Fine-tune the deployed solution

The dynamic Wallarm module with default settings is installed. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives](../../admin-en/configure-parameters-en.md) or the Wallarm Console UI. Directives should be set in the following files on the machine with the Wallarm node:

* `/etc/nginx/nginx.conf` with NGINX settings
* `/etc/nginx/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` with the settings for the `collectd` plugin that collects statistics from Tarantool

Below there are a few of the typical settings that you can apply if needed:

* [Configuration of the filtration mode][waf-mode-instr]
* [Allocating resources for Wallarm nodes][memory-instr]
* [Logging Wallarm node variables][logging-instr]
* [Using the balancer of the proxy server behind the filtering node][proxy-balancer-instr]
* [Limiting the single request processing time in the directive `wallarm_process_time_limit`][process-time-limit-instr]
* [Limiting the server reply waiting time in the NGINX directive `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limiting the maximum request size in the NGINX directive `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Configuring dynamic DNS resolution in NGINX][dynamic-dns-resolution-nginx]

## Appendix

### Script parameters

As soon as you have the all-in one script downloaded, you can get help on it with:

```
sudo sh ./wallarm-4.6.11.x86_64-glibc.sh -- -h
```

Which returns:

```
...
Usage: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPTION                      DESCRIPTION
-b, --batch                 batch mode, non-interactive installation
-t, --token TOKEN           Node token. only used in batch mode
-c, --cloud CLOUD           Wallarm Cloud, one of US/EU/EU2, default EU, only used in batch mode
-H, --host HOST             Wallarm API address, fore example api.wallarm.com or us1.api.wallarm.com, only used in batch mode
-P, --port PORT             Wallarm API pot, fore example 443
    --no-ssl                disable SSL for Wallarm API access
    --no-verify             disable SSL certificates verification
-f, --force                 always create a new instance in Cloud
-h, --help
    --version
```

Note that the `filtering/postanalytics` argument allows installing [separately](../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script) the postanalytics module. Without the argument filtering and postanalytics part are installed altogether.

### Script mode

The all-in-one installation script can work in **interactive mode** (default), when it asks several questions, and **batch (non-interactive) mode** when the node is installed into the EU cloud completely automatically.

In interactive mode the following is asked by the script:

* Connect to cloud?
* To which cloud: [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)?
* Wallarm token

Also interactive mode includes a reminder that you need to configure the installed node.
