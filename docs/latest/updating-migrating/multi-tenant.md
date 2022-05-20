[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks-quickstart.png

# Upgrading the multi-tenant node

These instructions describe the steps to upgrade the multi-tenant node 3.6 or lower up to 4.0.

## Step 1: Contact the Wallarm support team

Currently, to get the latest version of the [custom ruleset building](../user-guides/rules/compiling.md) feature during multi-tenant node upgrade, request the [Wallarm support team](mailto:support@wallarm.com) assistance.

!!! info "Blocked upgrade"
    Using an incorrect version of the custom ruleset building feature may block the upgrade process.

The support team will also help you answer all questions related to the multi-tenant node upgrade and necessary reconfiguration.

## Step 2: Follow standard upgrade procedure

Standard procedures are the ones for:

* [Upgrading Wallarm NGINX modules](../updating-migrating/nginx-modules.md)
* [Upgrading the postanalytics module](../updating-migrating/separate-postanalytics.md)
* [Upgrading the Wallarm Docker NGINX- or Envoy-based image](../updating-migrating/docker-container.md)
* [Upgrading NGINX Ingress controller with integrated Wallarm modules](../updating-migrating/ingress-controller.md)
* [Upgrading the cloud node image](../updating-migrating/cloud-image.md)

## Step 3: Reconfigure multitenancy

Rewrite the configuration of how traffic is associated with your tenants and their applications. Consider the example below. In the example:

* Tenant stands for partner's client. The partner has two clients.
* The traffic targeting `tenant1.com` and `tenant1-1.com` should be associated with client 1.
* The traffic targeting `tenant2.com` should be associated with client 2.
* Client 1 also has three applications:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    The traffic targeting these 3 paths should be associated with the corresponding application; the remaining should be considered to be the generic traffic of client 1.

### Study your previous version configuration

In 3.6, this could be configured as follows:

```
server {
  server_name  tenant1.com;
  wallarm_application 20;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_application 24;
  ...
}
...
}
```

Notes on the configuration above:

* The traffic targeting `tenant1.com` and `tenant1-1.com` is associated with client 1 via `20` and `23` values, linked to this client via the [API request](https://docs.wallarm.com/3.6/waf-installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account).
* Alike API requests should have been sent to link other applications to the tenants.
* The tenants and the applications are separate entities, so it is logical to configure them with the different directives. Also, it would be convenient to avoid additional API requests. It would be logical to define relations between the tenants and applications via the configuration itself. All this is missing in the current configuration but will become available in the new 4.0 approach described below.

### Study 4.0 approach

In version 4.0, UUID is the way to define the tenant in the node configuration.

To rewrite the configuration, do the following:

1. Get the UUIDs of your tenants.
1. Include tenants and set their applications in the NGINX configuration file.

### Get UUIDs of your tenants

To get the list of tenants, send authenticated requests to Wallarm API. Authentication approach is the same as the one [used for tenant creation](../waf-installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

1. Get `clientid`(s) to later find UUIDs related to them:

    === "By sending request to API"
        1. Send the GET request to the route `/v2/partner_client`:

            !!! info "Example of the request sent from your own client"
                === "EU Cloud"
                    ``` bash
                    curl -X GET \
                    'https://api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H 'x-wallarmapi-secret: YOUR_SECRET_KEY' \
                    -H 'x-wallarmapi-uuid: YOUR_UUID'
                    ```
                === "US Cloud"
                    ``` bash
                    curl -X GET \
                    'https://us1.api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H 'x-wallarmapi-secret: YOUR_SECRET_KEY' \
                    -H 'x-wallarmapi-uuid: YOUR_UUID'
                    ```
            Where `PARTNER_ID` is the one obtained at [**Step 2**](../waf-installation/multi-tenant/configure-accounts.md#step-2-get-access-to-the-tenant-account-creation) of the tenant creation procedure.

            Response example:

            ```
            {
            "body": [
                {
                    "id": 1,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_1_ID>,
                    "params": null
                },
                {
                    "id": 3,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_2_ID>,
                    "params": null
                }
            ]
            }
            ```

        1. Copy `clientid`(s) from the response.
    
    === "Via Wallarm Console"

        1. Find the `clientid`(s) via the Wallarm Console user interface:
        
            ![!Selector of tenants in Wallarm Console](../images/partner-waf-node/clients-selector-in-console-ann.png)
        1. Copy `clientid`(s) from the **ID** column.

1. To get the UUID of each tenant, send the POST request to the route `v1/objects/client`:

    !!! info "Example of the request sent from your own client"
        === "EU Cloud"
            ``` bash
            curl -X POST \
            https://api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'x-wallarmapi-secret: YOUR_SECRET_KEY' \
            -H 'x-wallarmapi-uuid: YOUR_UUID' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        
        === "US Cloud"
            ``` bash
            curl -X POST \
            https://us1.api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'x-wallarmapi-secret: YOUR_SECRET_KEY' \
            -H 'x-wallarmapi-uuid: YOUR_UUID' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        

    Response example:

    ```
    {
    "status": 200,
    "body": [
        {
            "id": <CLIENT_1_ID>,
            "name": "<CLIENT_1_NAME>",
            ...
            "uuid": "11111111-1111-1111-1111-111111111111",
            ...
        },
        {
            "id": <CLIENT_2_ID>,
            "name": "<CLIENT_2_NAME>",
            ...
            "uuid": "22222222-2222-2222-2222-222222222222",
            ...
        }
    ]
    }
    ```

1. From the response, copy `uuid`(s).

### Include tenants and set their applications in the NGINX configuration file

Specify the tenant UUIDs received above in the [`wallarm_partner_client_uuid`](../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) and the protected application IDs in the [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application) directives in the NGINX configuration file. 

If the NGINX configuration used for the node 3.6 or lower involves application configuration, only specify tenant UUIDs and keep application configuration unchanged.

Example:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
  ...
}
...
}
```

In the configuration above:

* Tenants and applications are configured with different directives.
* Relations between the tenants and applications are defined via configuration structure and clearly visible in it.

## Step 4: Test Wallarm multi-tenant node operation

--8<-- "../include/waf/installation/test-waf-operation.md"
