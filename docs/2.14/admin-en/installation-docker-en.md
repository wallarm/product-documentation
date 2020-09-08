[doc-ip-blocking]:            configure-ip-blocking-en.md
[doc-wallarm-mode]:           configure-parameters-en.md#wallarm_mode
[doc-config-params]:          configure-parameters-en.md
[doc-monitoring]:             monitoring/intro.md

# Installing with Docker (Using the NGINX‑Based Docker Image)

The filter node can be deployed as a Docker container. The Docker container is a fat one and contains all subsystems of the filter node.

The functionality of the filter node installed inside the Docker container is completely identical to the functionality of the other deployment options.

!!! info "If the Wallarm WAF image is already deployed in your environment"
    If you deploy Wallarm WAF image instead of already deployed image or need to duplicate the deployment, please keep the same WAF version as currently used or update the version of all images to the latest.

    To check the installed version, run the following command in the container:

    ```bash
    apt list wallarm-node
    ```

    * If the version `2.14.x` is installed, follow the current instruction.
    * If the version `2.12.x` is installed, follow the [instructions for 2.12](../../2.12/admin-en/installation-docker-en/) or [update the packages to 2.14](../updating-migrating/docker-container.md) in all deployments.
    * If the deprecated version is installed (`2.10.x` or lower), please [update the packages to 2.14](../updating-migrating/docker-container.md) in all deployments.

    More information about version support is available in the [WAF node versioning policy](../updating-migrating/versioning-policy.md).

!!! warning "Known limitations"
    * Most [Wallarm directives][doc-config-params] cannot be changed through environment variables; these directives must be written in configuration files inside the container.

## 1. Deploy the Filter Node

Run one of the `docker run` commands depending on the [cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#cloud) in use: 

=== "EU cloud"
    ``` bash
    docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e NGINX_BACKEND=example.com -e TARANTOOL_MEMORY_GB=memvalue -p 80:80 wallarm/node:2.14
    ```
=== "US cloud"
    ``` bash
    docker run -d -e WALLARM_API_HOST=us1.api.wallarm.com -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e NGINX_BACKEND=example.com -e TARANTOOL_MEMORY_GB=memvalue -p 80:80 wallarm/node:2.14
    ```

where:

* `example.com` — the protected resource.
* `deploy@example.com` — login to the Wallarm portal in the [EU](https://my.wallarm.com) or [US](https://us1.my.wallarm.com) cloud.

* `very_secret` — password for the Wallarm portal in the [EU](https://my.wallarm.com) or [US](https://us1.my.wallarm.com) cloud.
* `memvalue` – amount of memory allocated to Tarantool.

After running the command, you will have:

* The protected resource on port 80.
* The filter node registered in the Wallarm portal in the [EU](https://my.wallarm.com) or [US](https://us1.my.wallarm.com) cloud; the filter node displayed in the Wallarm interface.

You can also fine-tune the deployment by putting additional configuration files
inside the container.

## 2. Connect the Filter Node to the Wallarm Cloud

The filter node interacts with the Wallarm cloud located on a remote server.

To connect the filter node to the Wallarm cloud, you have the following options:

* Automatic registration.
* Using credentials.
* Using a prepared configuration file.

### Automatic Registration

Transfer the environment variables `DEPLOY_USER`, `DEPLOY_PASSWORD` with the access credentials to the Wallarm portal in the [EU](https://my.wallarm.com) or [US](https://us1.my.wallarm.com) cloud.

The filter node will try to automatically register itself in the Wallarm cloud on the first start.

If a filter node with the same name as the node's container identifier is already registered in the cloud, then the registration process will fail.

To avoid this, pass the `DEPLOY_FORCE=true` environment variable to the container.

``` bash
docker run -d -e DEPLOY_USER="deploy@example.com" -e DEPLOY_PASSWORD="very_secret" -e NGINX_BACKEND="IP address or FQDN" wallarm/node:2.14
```

If the registration process finishes successfully, then the container's `/etc/wallarm` directory will be populated with the license file (`license.key`), a file with the credentials for the filter node to access the cloud (`node.yaml`), and other files required for proper node operation.

On the next start of the same filter node, registration will not be required. The filter node communicates with the cloud using the following artifacts acquired during the automatic registration:
* The `uuid` and `secret` values (they are placed in the `/etc/wallarm/node.yaml` file).
* The Wallarm license key (it is placed in the `/etc/wallarm/license.key` file).

To connect the already registered filter node to the cloud, pass to its container
* either the `uuid` and `secret` values via the environment variables and the `license.key` file
* or the `node.yaml` and `license.key` files.

### Use of Prepared Credentials

Pass to the filter node's container
* the `uuid` and `secret` values via the corresponding `NODE_UUID` and `NODE_SECRET` environment variables, and
* the `license.key` file via Docker volumes.

Run one of the `docker run` commands depending on the [cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#cloud) in use: 

=== "EU cloud"
    ``` bash
    docker run -d "NODE_UUID=00000000-0000-0000-0000-000000000000" -e NODE_SECRET="0000000000000000000000000000000000000000000000000000000000000000" -v /path/to/license.key:/etc/wallarm/license.key -e NGINX_BACKEND=192.168.xxx.1 wallarm/node:2.14
    ```
=== "US cloud"
    ``` bash
    docker run -d -e WALLARM_API_HOST=us1.api.wallarm.com -e "NODE_UUID=00000000-0000-0000-0000-000000000000" -e NODE_SECRET="0000000000000000000000000000000000000000000000000000000000000000" -v /path/to/license.key:/etc/wallarm/license.key -e NGINX_BACKEND=192.168.xxx.1 wallarm/node:2.14
    ```

### Use of a Prepared Configuration File Containing Credentials

Pass the following files to the filter node's container via Docker volumes:
* the `node.yaml` file, containing the credentials for the filter node to access the Wallarm cloud, and
* the `license.key` file.

``` bash
docker run -d -v /path/to/node.yaml:/etc/wallarm/node.yaml -v /path/to/license.key:/etc/wallarm/license.key -e NGINX_BACKEND=192.168.xxx.1 wallarm/node:2.14
```

## 3. Configure NGINX-Wallarm

The filter node configuration is done via the NGINX configuration file.

The use of container lets you go through a simplified configuration process
by using the environment variables. The simplified process is enabled by
transferring the `NGINX_BACKEND` environment variable.

### Simplified Process

*  `NGINX_BACKEND` — The backend address to which all incoming requests must be transferred. If the address does not have the `http://` or `https://`, prefix, then `http://` is used by default. See details in [proxy_pass](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass).

    Do not use the `NGINX_BACKEND` variable if you do need the simplified configuration process and if you use your own configuration files.
   
    Note that without the `NGINX_BACKEND` variable, Wallarm will not start automatically. To start Wallarm, configure `wallarm_mode monitoring`. See details in the `wallarm_mode` directive [description][doc-wallarm-mode].
*  `WALLARM_MODE`: The NGINX-Wallarm module operation mode. See details in the `wallarm_mode` directive [description][doc-wallarm-mode].

### Configuration Files

The directories used by NGINX:

* `/etc/nginx-wallarm/conf.d` — common settings.
* `/etc/nginx-wallarm/sites-enabled` — virtual host settings.
* `/var/www/html` — static files.

## 4. Configure Logging

The logging is enabled by default.

The log directories are:

* `/var/log/nginx-wallarm/` — NGINX logs.
* `/var/log/wallarm/` — Wallarm logs.

### Configure Extended Logging

--8<-- "../include/installation-step-logging.md"

### Configure Log Rotation

By default, the logs rotate once every 24 hours.

Changing the rotation parameters through environment variables is not possible. To set up the log rotation, change the configuration files in `/etc/logrotate.d/`.

## 5. Configure Monitoring

To monitor the filter node, there are Nagios‑compatible scripts inside the container. See details in [Monitor the filter node][doc-monitoring].

Example of running the scripts:

``` bash
docker exec -it wallarm-node /usr/lib/nagios-plugins/check_wallarm_tarantool_timeframe -w 1800 -c 900
```

``` bash
docker exec -it wallarm-node /usr/lib/nagios-plugins/check_wallarm_export_delay -w 120 -c 300
```

## The Installation Is Complete

--8<-- "../include/check-setup-installation-en.md"

--8<-- "../include/filter-node-defaults.md"

--8<-- "../include/installation-extra-steps.md"

### Blocking Requests by IP Address

The IP blocking functionality provides the following additional features:

* If the WAF detects at least three different attack vectors from an IP address, the address will be automatically added to the blacklist and blocked for 1 hour. If similar behavior from the same IP address is detected again, the IP will be blocked for 2 hours, and so on.

* Ability to use Wallarm to protect against behavior‑based attacks such as [brute-force](../attacks-vulns-list.md#bruteforce-attack), [path traversal attacks](../attacks-vulns-list.md#path-traversal) or [forced browsing](../attacks-vulns-list.md#forced-browsing).

To enable IP blocking functionality, please select the configuration method at the [Methods of Blocking by IP Address](configure-ip-blocking-en.md) page and follow the appropriate instructions.
