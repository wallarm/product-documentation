[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Upgrading the EOL multi-tenant node

These instructions describe the steps to upgrade the end‑of‑life multi-tenant node (version 3.6 and lower) up to 5.0.

## Requirements

* Execution of further commands by the user with the **Global administrator** role added under the [technical tenant account](../../installation/multi-tenant/overview.md#tenant-accounts)
* Access to `https://us1.api.wallarm.com` if working with US Wallarm Cloud or to `https://api.wallarm.com` if working with EU Wallarm Cloud. Please ensure the access is not blocked by a firewall
* Access to the IP addresses below for downloading updates to attack detection rules and API specifications, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers.

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        35.235.66.155
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        34.90.110.226
        ```

## Step 1: Contact the Wallarm support team

Request the [Wallarm support team](mailto:support@wallarm.com) assistance to get the latest version of the [custom ruleset building](../../user-guides/rules/rules.md#ruleset-lifecycle) feature during multi-tenant node upgrade.

!!! info "Blocked upgrade"
    Using an incorrect version of the custom ruleset building feature may block the upgrade process.

The support team will also help you answer all questions related to the multi-tenant node upgrade and necessary reconfiguration.

## Step 2: Follow standard upgrade procedure

Standard procedures are the ones for:

* [Upgrading Wallarm NGINX modules](nginx-modules.md)
* [Upgrading the postanalytics module](separate-postanalytics.md)
* [Upgrading the Wallarm Docker NGINX-based image](docker-container.md)
* [Upgrading NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
* [Upgrading the cloud node image](cloud-image.md)

!!! warning "Creating the multi-tenant node"
    During the Wallarm node creation, please select the **Multi-tenant node** option:

    ![Multi-tenant node creation](../../images/user-guides/nodes/create-multi-tenant-node.png)

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

* The traffic targeting `tenant1.com` and `tenant1-1.com` is associated with client 1 via `20` and `23` values, linked to this client via the [API request](https://docs.wallarm.com/3.6/installation/multi-tenant/configure-accounts/#step-4-link-tenants-applications-to-the-appropriate-tenant-account).
* Alike API requests should have been sent to link other applications to the tenants.
* The tenants and the applications are separate entities, so it is logical to configure them with the different directives. Also, it would be convenient to avoid additional API requests. It would be logical to define relations between the tenants and applications via the configuration itself. All this is missing in the current configuration but will become available in the new 5.x approach described below.

### Study 5.x approach

In version 5.x, UUID is the way to define the tenant in the node configuration.

To rewrite the configuration, do the following:

1. Get the UUIDs of your tenants.
1. Include tenants and set their applications in the NGINX configuration file.

### Get UUIDs of your tenants

To get the list of tenants, send authenticated requests to Wallarm API. Authentication approach is the same as the one [used for tenant creation](../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api).

1. Get `clientid`(s) to later find UUIDs related to them:

    === "Via Wallarm Console"

        Copy `clientid`(s) from the **ID** column in the Wallarm Console user interface:
        
        ![Selector of tenants in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "By sending request to API"
        1. Send the GET request to the route `/v2/partner_client`:

            !!! info "Example of the request sent from your own client"
                === "US Cloud"
                    ``` bash
                    curl -X GET \
                    'https://us1.api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
                === "EU Cloud"
                    ``` bash
                    curl -X GET \
                    'https://api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
            
            Where `PARTNER_ID` is the one obtained at [**Step 2**](../../installation/multi-tenant/configure-accounts.md#step-1-sign-up-and-send-a-request-to-activate-the-multitenancy-feature) of the tenant creation procedure.

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
1. To get the UUID of each tenant, send the POST request to the route `v1/objects/client`:

    !!! info "Example of the request sent from your own client"
        === "US Cloud"
            ``` bash
            curl -X POST \
            https://us1.api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        
        === "EU Cloud"
            ``` bash
            curl -X POST \
            https://api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
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

In the NGINX configuration file:

1. Specify the tenant UUIDs received above in the [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) directives.
1. Set the protected application IDs in the [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) directives. 

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
* Relations between the tenants and applications are defined via the `wallarm_application` directives in the corresponding blocks of the NGINX configuration file.

## Step 4: Test Wallarm multi-tenant node operation

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"
