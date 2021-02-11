[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[scanner-whitelisting-instr]:       ../../admin-en/scanner-ips-whitelisting.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[enable-libdetection-docs]:         ../../admin-en/configure-parameters-en.md#wallarm_enable_libdetection

# Installing on Yandex.Cloud

These instructions describe how to configure a virtual machine with [Wallarm WAF](https://cloud.yandex.com/marketplace/products/f2emrc60s1nh9356v1rq) on Yandex.Cloud.

## Requirements

### Yandex.Cloud configuration

Before starting WAF node installation, please check that you meet all these requirements:

* Have access to the [Yandex.Cloud management console](https://console.cloud.yandex.com/)
* Have a payment account in the status of `ACTIVE` or `TRIAL_ACTIVE` displayed on the [billing page](https://console.cloud.yandex.com/billing)
* Created folder. By default, the folder `default` will be created. To create a new folder, please follow these [instructions](https://cloud.yandex.com/docs/resource-manager/operations/folder/create)
* Created 2048‑bit RSA key pair for SSH connection. To create a key pair, please follow these [instructions](https://cloud.yandex.com/docs/compute/operations/vm-connect/ssh#creating-ssh-keys)

### Wallarm WAF configuration

Before starting WAF node installation, please check that you meet all these requirements:

* Have access to the account with the **Administrator** role and two‑factor authentication disabled in Wallarm Console in the [EU Cloud](https://my.wallarm.com/) or [US Cloud](https://us1.my.wallarm.com/)
* Have access to `https://api.wallarm.com:444` when working with the EU Wallarm Cloud or `https://us1.api.wallarm.com:444` when working with the US Wallarm Cloud. Please ensure the access is not blocked by a firewall
* Execute all commands as a superuser (e.g. `root`)

## Installation

### 1. Create a virtual machine with the WAF node

1. Log in to the [management console](https://console.cloud.yandex.com/) and select the folder where the virtual machine will be created.
2. Select **Compute Cloud** from the list of services.
3. Click the **Create VM** button.
4. Select Wallarm WAF from the list of images in the **Image/boot disk selection** → **Cloud Marketplace** block.
5. Configure other virtual machine parameters following these [instructions](https://cloud.yandex.com/docs/compute/quickstart/quick-create-linux#create-vm).

![!Example of VM settings](../../images/admin-guides/yandex-cloud/vm-settings.png)

### 2. Connect to the virtual machine with the WAF node

1. Ensure the virtual machine is in the `RUNNING` status.
2. Connect to the virtual machine via SSH following these [instructions](https://cloud.yandex.com/docs/compute/quickstart/quick-create-linux#connect-to-vm).

### 3. Connect the WAF node to Wallarm Cloud

Connect the WAF node to the Wallarm Cloud using the **cloud WAF node token** or Wallarm Console account **login and password**.

#### Using the cloud WAF node token

1. Open the Wallarm Console → **Nodes** section and create a cloud WAF node.
2. Open the card of the created cloud WAF node and copy the **Node token**.
3. On the virtual machine, run the `addcloudnode` script: 

    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
4. Paste the copied token value.

The WAF node will now synchronize with the cloud every 2‑4 minutes according to the default synchronization configuration. [More details on the WAF node and Wallarm Cloud synchronization configuration →](../configure-cloud-node-synchronization-en.md#cloud-waf-node-and-wallarm-cloud-synchronization)

#### Using the administrator login and password

1. On the virtual machine, run the `addnode` script:
    
    === "EU Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    === "US Cloud"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```    
2. Provide your Wallarm administrator account's login and password.
3. Enter the name of the new WAF node or press Enter to use the virtual machine name.

The WAF node will now synchronize with the cloud every 2‑4 minutes according to the default synchronization configuration. [More details on the WAF node and Wallarm Cloud synchronization configuration →](../configure-cloud-node-synchronization-en.md#regular-waf-node-and-wallarm-cloud-synchronization)

### 4. Update Wallarm WAF configuration

Main configuration files of NGINX and Wallarm WAF node are located in the directories:

* `/etc/nginx/nginx.conf` with NGINX settings
* `/etc/nginx/conf.d/wallarm.conf` with global WAF node settings

    The file is used for settings applied to all domains. To apply different settings to different domain groups, use the file `nginx.conf` or create new configuration files for each domain group (for example, `example.com.conf` and `test.com.conf`). More detailed information about NGINX configuration files is available in the [official NGINX documentation](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm‑status.conf` with WAF node monitoring settings. A detailed description is available within this [link](../configure-statistics-service.md)
* `/etc/default/wallarm-tarantool` with the Tarantool database settings

#### Request filtering mode

By default, the WAF node is in the status `monitoring` and does not block requests. To block requests, change the filtering mode within the NGINX settings by following these instructions:

1. Open the file `/etc/nginx/conf.d/wallarm.conf`:

    ```bash
    sudo vim /etc/nginx/conf.d/wallarm.conf
    ```
2. Comment out the line `wallarm_mode monitoring;`.
3. Open the file `/etc/nginx/nginx.conf`:

    ```bash
    sudo vim /etc/nginx/nginx.conf
    ```
4. Add the line `wallarm_mode block;` to the `http` block:

??? "Example of the file `/etc/nginx/nginx.conf`"

    ```bash
    user www-data;
    worker_processes auto;
    pid /run/nginx.pid;
    include /etc/nginx/modules-enabled/*.conf;

    events {
        worker_connections 768;
        # multi_accept on;
    }

    http {
        wallarm_mode block;

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;

        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        ##
        # SSL Settings
        ##

        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # Logging Settings
        ##

        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Settings
        ##

        gzip on;

        # gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        # gzip_buffers 16 8k;
        # gzip_http_version 1.1;
        # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
    }
    ```

#### Memory

The WAF node uses the in-memory storage Tarantool. The recommended memory size for Tarantool is 75% of the total server memory. To allocate memory for Tarantool:

1. Open the Tarantool configuration file in the editing mode:

    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
2. Specify memory size in GB in the `SLAB_ALLOC_ARENA` directive. The value can be an integer or a float (a dot `.` is a decimal separator). For example, 24 GB:
    
    ```bash
    SLAB_ALLOC_ARENA=24
    ```
3. To apply changes, restart Tarantool:

    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

#### Other configurations

To update other NGINX and Wallarm WAF configurations, use the NGINX documentation and the list of [available Wallarm WAF directives](../configure-parameters-en.md).

### 5. Restart NGINX

To apply changes, restart NGINX:

```bash
sudo systemctl restart nginx
```

### 6. Test Wallarm WAF operation

1. Get the WAF node statistics:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    The request will return statistics about analyzed requests. The response format is provided below. A more detailed description of parameters is available [here](../configure-statistics-service.md).
    ```
    { "requests":0,"attacks":0,"blocked":0,"abnormal":0,"tnt_errors":0,"api_errors":0,
    "requests_lost":0,"segfaults":0,"memfaults":0,"softmemfaults":0,"time_detect":0,"db_id":46,
    "lom_id":16767,"proton_instances": { "total":1,"success":1,"fallback":0,"failed":0 },
    "stalled_workers_count":0,"stalled_workers":[] }
    ```
2. Send the request with test [SQLI](../../attacks-vulns-list.md#sql-injection) and [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the external IP address:

    ```
    curl http://84.201.148.210/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    If the WAF node mode is `block`, then the request will be blocked with the response `403 Forbidden` returned.
3. Send the request to `wallarm-status` and ensure the parameter values of `requests` and `attacks` has increased:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```
4. Open the Wallarm Console → **Events** section in the [EU Cloud](https://my.wallarm.com/search) or [US Cloud](https://us1.my.wallarm.com/search) and ensure attacks are displayed in the list.
    ![!Attacks in the interface](../../images/admin-guides/test-attacks.png)

## Settings customization

The WAF node with default settings is deployed in Yandex.Cloud. To customize Wallarm WAF settings, use the [available directives](../configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-216.md"
