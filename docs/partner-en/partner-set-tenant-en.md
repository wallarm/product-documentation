# Configuring Traffic Processing

## Prerequisites

Ensure the following:

* You have created and tied the tenant as described in [Creating a tenant](partner-create-tenant-en.md).
* You have the tenant ID that you copied at the very end of [Creating a tenant](partner-create-tenant-en.md).
* [Wallarm support](mailto:support@wallarm.com) has switched your filter node status to "vendor".

To set up the tenant, you must:

1. Put the tenant ID in the tenant's configuration file.
2. Configure traffic processing in the tenant's configuration file.

## 1. Put the Tenant ID in the Tenant's Configuration File

1. Open for editing the tenant's NGINX configuration file that processes the tenant's traffic.

2. Add the `wallarm_instance` string and set the tenant ID.

   An edited configuration file sample with the tenant ID set to 78:

   ```
   Wallarm module specific parameters
   ...
   wallarm_fallback on;
   wallarm_cache_path /var/cache/nginx/wallarm

   wallarm_instance 78;
   ```
You have now set the tenant ID in the configuration file.

## 2. Configure Traffic Processing in the Tenant's Configuration File

1. Open for editing the tenant's NGINX configuration file that processes the tenant's traffic and has the `wallarm_instance` string.

2. Configure traffic processing as described in the [NGINX official documentation](https://nginx.org/en/docs/http/request_processing.html).

An edited configuration file sample:

```
location / {
                proxy_pass http://78.78.78.78;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto https;
                include proxy_params;
                wallarm_instance 78;
        }
```

You have now completed the tenant setup.