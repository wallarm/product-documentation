# Handling Headers Considered Invalid by NGINX

By default, NGINX drops headers it considers invalid, such as those with `.` or `_` in their names. This prevents Wallarm from seeing and analyzing these headers, reducing security coverage. If such headers are considered valid in your environment, follow this article to allow them.

## Problem overview

Per [RFC 7230](https://www.rfc-editor.org/rfc/rfc7230?utm_source=chatgpt.com#section-3.2.6), characters such as `.` and `_` are valid in HTTP header field names. By default, however, NGINX drops such headers.

If your API legitimately uses these headers, their removal causes the following Wallarm limitations:

* [API Discovery](../../api-discovery/overview.md) cannot see the dropped headers and excludes them from the inventory
* [Attack detection](../../user-guides/events/check-attack.md) is not applied to these headers

To avoid these issues, configure NGINX to accept and forward them.

## Solution

Enable the following directives in NGINX:

* [`underscores_in_headers on;`](https://nginx.org/en/docs/http/ngx_http_core_module.html#underscores_in_headers)
* [`ignore_invalid_headers off;`](https://nginx.org/en/docs/http/ngx_http_core_module.html#ignore_invalid_headers)

These settings ensure NGINX preserves all headers, including those with `.` and `_`, so Wallarm can inspect them.

## How to apply in different deployment artifacts

### All-in-one installer, AWS AMI and GCP machine image

When you install Wallarm Node from the [all-in-one installer](../../installation/nginx/all-in-one.md), [AWS AMI](../../installation/packages/aws-ami.md) or [GCP machine image](../../installation/packages/gcp-machine-image.md):

1. Edit `/etc/nginx/nginx.conf`.
1. Inside the `http {}` block, add:

    ```
    underscores_in_headers on;
    ignore_invalid_headers off;
    ```
1. Reload NGINX:

    ```
    sudo nginx -s reload
    ```

### Docker image

When running [Wallarm Node in Docker](../installation-docker-en.md), mount a configuration file that includes the directives:

1. Create `/etc/nginx/nginx.conf` with your Node configuration.

    Below is the minimal file content required for Node operation:

    ```hl_lines="15-16"
    #user  wallarm;
    worker_processes  auto;
    pid        /run/nginx.pid;
    include /etc/nginx/modules/*.conf;

    events {
        worker_connections  768;
        # multi_accept on;
    }

    http {
        # Auto-inclusion of apifw into server blocks
        wallarm_srv_include /etc/nginx/wallarm-apifw-loc.conf;

        underscores_in_headers on;
        ignore_invalid_headers off;

        upstream wallarm_wstore {
            server localhost:3313 max_fails=0 fail_timeout=0 max_conns=1;
            keepalive 1;
        }
        wallarm_wstore_upstream wallarm_wstore;
        ##
        # Basic Settings
        ##

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
        # Virtual Host Configs - Wallarm
        ##

        include /etc/nginx/conf.d/*.conf;

        ##
        # Virtual Host Configs - User
        ##

        include /etc/nginx/http.d/*;
    }
    ```
1. Mount the `wallarm-apifw-loc.conf` file to the `/etc/nginx/wallarm-apifw-loc.conf` path. The content should be:

    ```
    location ~ ^/wallarm-apifw(.*)$ {
            wallarm_mode off;
            proxy_pass http://127.0.0.1:8088$1;
            error_page 404 431         = @wallarm-apifw-fallback;
            error_page 500 502 503 504 = @wallarm-apifw-fallback;
            allow 127.0.0.8/8;
            deny all;
    }

    location @wallarm-apifw-fallback {
            wallarm_mode off;
            return 500 "API FW fallback";
    }
    ```
1. Mount the `/etc/nginx/conf.d/wallarm-status.conf` file with the content below. It is crucial not to modify any lines from the provided configuration as this may interfere with the successful upload of node metrics to the Wallarm cloud.

    ```
    server {
        listen 127.0.0.8:80;

        server_name localhost;

        allow 127.0.0.0/8;
        deny all;

        wallarm_mode off;
        disable_acl "on";
        wallarm_enable_apifw off;
        access_log off;

        location ~/wallarm-status$ {
        wallarm_status on;
        }
    }
    ```
1. Within your NGINX configuration file, set up the following configuration for the `/wallarm-status` endpoint:

    ```
    location /wallarm-status {
        # Allowed addresses should match the WALLARM_STATUS_ALLOW variable value
        allow xxx.xxx.x.xxx;
        allow yyy.yyy.y.yyy;
        deny all;
        wallarm_status on format=prometheus;
        wallarm_mode off;
    }
    ```
1. [Run the container mounting these files into their expected paths](../installation-docker-en.md#run-the-container-mounting-the-configuration-file).

### NGINX Ingress Controller

For the [Wallarm NGINX-based Ingress controller](../installation-kubernetes-en.md), use the supported ConfigMap keys:

1. [Create the ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-files) with the following content:

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: nginx-configuration
      namespace: ingress-nginx
    data:
      enable-underscores-in-headers: "true"
      ignore-invalid-headers: "false"
    ```
1. Specify the ConfigMap path in your `values.yaml`.

### Sidecar Proxy

If using [Wallarm Sidecar Proxy](../../installation/kubernetes/sidecar-proxy/deployment.md), inject the directives on the required application pod level using an annotation:

```yaml hl_lines="8-10"
apiVersion: apps/v1
kind: Deployment
...
spec:
  template:
    metadata:
      annotations:
        sidecar.wallarm.io/nginx-http-snippet: |
          underscores_in_headers on;
          ignore_invalid_headers off;
```

### Security Edge

To enable support for headers containing `.` and `_` in [Wallarm Security Edge](../../installation/security-edge/overview.md), please contact [support@wallarm.com](mailto:support@wallarm.com).
