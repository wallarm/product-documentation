[sqli-attack-desc]:                 ../attacks-vulns-list.md#sql-injection
[xss-attack-desc]:                  ../attacks-vulns-list.md#crosssite-scripting-xss
[img-test-attacks-in-ui]:           ../images/admin-guides/test-attacks-quickstart.png

# Upgrading the multi-tenant node

These instructions describe the steps to upgrade the multi-tenant node 3.6 or lower up to 4.0.

## Step 1: Upgrade Wallarm multi-tenant node

Follow the standard procedure for your deployment form with one addition: rewrite the configuration of how traffic is associated with your tenants and their applications.

### Standard procedures

Standard procedures are the ones for:

* [Upgrading Wallarm NGINX modules](../updating-migrating/nginx-modules.md)
* [Upgrading the postanalytics module](../updating-migrating/separate-postanalytics.md)
* [Upgrading the Wallarm Docker NGINX- or Envoy-based image](../updating-migrating/docker-container.md)
* [Upgrading NGINX Ingress controller with integrated Wallarm modules](../updating-migrating/ingress-controller.md)
* [Upgrading the cloud node image](../updating-migrating/cloud-image.md)

### Multitenancy reconfiguration

Rewrite the configuration of how traffic is associated with your tenants and their applications. Consider the example below. In the example:

* Tenant stands for partner's client. The partner has two clients.
* The traffic targeting `tenant1.com` and `tenant1-1.com` should be associated with the client 1.
* The traffic targeting `tenant2.com` should be associated with the client 2.
* The client 1 also has 3 applications:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`

    The traffic targeting these 3 paths should be associated with the corresponding application; the remaining should be considered to be the generic traffic of the client 1.

**In 3.6, this could be configured as follows:**

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

* The `wallarm_application` directive is used for defining both tenants themselves and their applications:
    * The traffic targeting `tenant1.com` and `tenant1-1.com` is associated with the client 1 via `20` and `23` values, linked to this client via the [api request](https://docs.wallarm.com/3.6/waf-installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account).
    * Alike api requests should have been sent to link other applications to the tenants.

**In version 4.0, to rewrite the configuration, do the following:**

1. Get the UUIDs of your tenants.
1. Include tenants and set their applications in the NGINX configuration file.

**Get the UUIDs of your tenants**

To get the list of tenants, send authenticated requests to Wallarm API. Authentication approach is the same as the one [used for tenant creation](../waf-installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

1. Send the GET request to the route `/v2/partner_client`.

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

    ??? info "Alternative way: obtaining clientid(s) via Console"
        Alternatively to sending a request, you can find the `clientid`(s) via the Wallarm Console user interface:
        
        ![!Selector of tenants in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console.png)

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

1. From the response, copy `clientid`(s).
1. To get the UUID of each tenant, send the POST request to the route: `v1/objects/client`:

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

**Include tenants and set their applications in the NGINX configuration file**

The tenants and the applications are the separate entities so they are now logically configured with the different directives and no API requests are required to set relations between the tenants and applications. Instead these relations are easily defined via the configuration itself.

Use the [`wallarm_partner_client_uuid`](../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) and [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application) directives in the NGINX configuration file. For example:

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

* Tenant stands for partner's client. The partner has 2 clients. 
* The traffic targeting `tenant1.com` and `tenant1-1.com` will be associated with the client `11111111-1111-1111-1111-111111111111`.
* The traffic targeting `tenant2.com` will be associated with the client `22222222-2222-2222-2222-222222222222`.
* The first client also has 3 applications, specified via the [`wallarm_application`](../admin-en/configure-parameters-en.md#wallarm_application) directive:
    * `tenant1.com/login` – `wallarm_application 21`
    * `tenant1.com/users` – `wallarm_application 22`
    * `tenant1-1.com` – `wallarm_application 23`

    The traffic targeting these 3 paths will be associated with the corresponding application; the remaining will be the generic traffic of the first client.

## Step 2: Test Wallarm multi-tenant node operation

--8<-- "../include/waf/installation/test-waf-operation.md"
