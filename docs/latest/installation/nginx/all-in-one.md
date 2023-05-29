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
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
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

# Installing Wallarm with All-in-One Binary

These instructions describe the steps to install Wallarm filtering node as a dynamic module for different NGINX versions and on a number of different Linux OS versions using **all-in-one Wallarm binary**.

The all-in-one installation script:

1. Checks your OS and NGINX version.
1. Adds Wallarm repositories for the detected OS and NGINX version.
1. Installs Wallarm packages from these repositories.
1. Connects the installed Wallarm module to your NGINX.
1. Connects the filtering node to Wallarm Cloud using the provided token.

Thus it automates a lot of activities that should be performed manually when using other installation methods, the script is recommended as the **best way to install a filtering node**.

## Requirements

* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Supported OS on the machine with the node: Debian 10.x or 11.x, Ubuntu, CentOS 7.x, AlmaLinux, Rocky Linux or Oracle Linux 8.x
* SELinux disabled or configured upon the [instructions](../../admin-en/configure-selinux.md)
* Access to `https://meganode.wallarm.com` to download all-in-one Wallarm binary. Ensure the access is not blocked by a firewall
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud. If access can be configured only via the proxy server, then use the [instructions][configure-proxy-balancer-instr]
* Executing all commands as a superuser (e.g. `root`)

## 1. Install NGINX and dependencies

Install the supported NGINX variant:

* [NGINX 1.22.1 `stable` →](dynamic-module.md#1-install-nginx-stable-and-dependencies)
* [NGINX Plus R28 →](../nginx-plus.md#1-install-nginx-plus-and-dependencies)

## 2. Prepare Wallarm token

--8<-- "../include/waf/installation/connect-waf-and-cloud-4.6.md"

## 3. Run all-in-one Wallarm binary

### Script parameters

As soon as you have the all-in one script downloaded, you can get help on it with:

```
sudo sh ./wallarm-4.6.10.x86_64-glibc.sh -- -h
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

### Script mode

The all-in-one installation script can work in **interactive mode** (default), when it asks several questions, and **batch (non-interactive) mode** when all is done completely automatically.

In interactive mode the following is asked by the script:

* Connect to cloud?
* To which cloud: [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)?
* Wallarm token

Also interactive mode includes a reminder that you need to configure the installed node.

### x86_64 version

Wallarm suggests installations for x86_64 version of the processor of your machine with the node and for [ARM64 version](#arm64-version). This procedure describes the x86_64 version installation.

1. Download all-in-one Wallarm installation script.

    ```bash
    sudo curl -O https://meganode.wallarm.com/4.6/wallarm-4.6.10.x86_64-glibc.sh
    ```

1. Run script in the selected mode.

    === "Interactive mode"
        1. Run:

            ```bash
            sudo sh wallarm-4.6.10.x86_64-glibc.sh
            ```

        1. Confirm you want to connect the node to Wallarm Cloud.
        1. Select [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/).
        1. Enter Wallarm token.

    === "Batch (non-interactive) mode"
        1. Run depending on the [selected token type](../../user-guides/nodes/nodes.md#connecting-new-node-to-wallarm-cloud):

            ```bash
            sudo env WALLARM_LABELS="group=GROUP" sh wallarm-4.6.10.x86_64-glibc.sh -- -b -t <API TOKEN> -c <US/EU/EU2>
            ```

            or:

            ```bash
            sudo sh wallarm-4.6.10.x86_64-glibc.sh -- -b -t <NODE TOKEN> -с <US/EU/EU2>
            ```

1. Confirm that installation is finished.
1. As script notifies you that you need to configure the installed node, perform this configuration via `/etc/nginx/nginx.conf`.

### Separate postanalytics module installation

The all-in-one script supports [separate postanalytics module installation](../../admin-en/installation-postanalytics-en.md). To install filtering part separately, use:

```
sudo sh ./wallarm-4.6.10.x86_64-glibc.sh filtering
```

To install postanalytics separately, use:

```
sudo sh ./wallarm-4.6.10.x86_64-glibc.sh postanalytics
```

Without argument filtering and postanalytics part are installed altogether.

### ARM64 version

To install node on machine with the ARM64 processor architecture, download the following all-in-one script:

```bash
sudo curl -O https://meganode.wallarm.com/4.6/wallarm-4.6.10.aarch64-glibc.sh
```

The script uses all the same options.

## 4. Enable Wallarm to analyze the traffic

--8<-- "../include/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 5. Restart NGINX

--8<-- "../include/waf/root_perm_info.md"

--8<-- "../include/waf/restart-nginx-3.6.md"

## 6. Configure sending traffic to the Wallarm instance

--8<-- "../include/waf/installation/sending-traffic-to-node-inline-oob.md"

## 7. Test Wallarm node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## 8. Fine-tune the deployed solution

The dynamic Wallarm module with default settings is installed for NGINX `stable`. The filtering node may require some additional configuration after deployment.

Wallarm settings are defined using the [NGINX directives](../../admin-en/configure-parameters-en.md) or the Wallarm Console UI. Directives should be set in the following files on the machine with the Wallarm node:

* `/etc/nginx/nginx.conf` with NGINX settings
* `/etc/nginx/wallarm.conf` with global filtering node settings

    The file is used for settings applied to all domains. To apply different settings to different domain groups, use the file `nginx.conf` or create new configuration files for each domain group (for example, `example.com.conf` and `test.com.conf`). More detailed information about NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/wallarm-status.conf` with Wallarm node monitoring settings. Detailed description is available within the [link][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` with the Tarantool database settings

Below there are a few of the typical settings that you can apply if needed:

* [Configuration of the filtration mode][waf-mode-instr]
* [Allocating resources for Wallarm nodes][memory-instr]
* [Logging Wallarm node variables][logging-instr]
* [Using the balancer of the proxy server behind the filtering node][proxy-balancer-instr]
* [Limiting the single request processing time in the directive `wallarm_process_time_limit`][process-time-limit-instr]
* [Limiting the server reply waiting time in the NGINX directive `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limiting the maximum request size in the NGINX directive `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Configuring dynamic DNS resolution in NGINX][dynamic-dns-resolution-nginx]
