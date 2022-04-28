# Upgrading the multi-tenant node

These instructions describe the steps to upgrade the multi-tenant node 3.6 up to 4.0.

## Step 1: Upgrade Wallarm multi-tenant node

Follow the standard procedure for your deployment form with one addition: re-write configuration of how traffic is associated with your tenants and their applications.

### Standard procedures

Standard procedures are the ones for:

* [Upgrading Wallarm NGINX modules](../updating-migrating/nginx-modules.md)
* [Upgrading the postanalytics module](../updating-migrating/separate-postanalytics.md)
* [Upgrading the Wallarm Docker NGINX- or Envoy-based image](../updating-migrating/docker-container.md)
* [Upgrading NGINX Ingress controller with integrated Wallarm modules](../updating-migrating/ingress-controller.md)
* [Upgrading the cloud node image](../updating-migrating/cloud-image.md)

### Multitenancy reconfiguration

Re-write configuration of how traffic is associated with your tenants and their applications. Consider the example below. In the example:

* Tenant stands for partner's client. The partner has 2 clients.
* The traffic targeting `tenant1.com` and `tenant1-1.com` should be associated with the client 1.
* The traffic targeting `tenant2.com` should be associated with the client 2.
* The client 1 also has 3 applications:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`
* The traffic targeting these 3 paths should be associated with the corresponding application, the remaining should be considered to be the generic traffic of the client 1.

**In 3.6 this could be configured as follows:**

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

* The `wallarm_application` directive is used for defining both tenants themselves and their applications.

**In the 4.0 this should be rewritten as follows:**

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

Notes on the configuration above:

* Tenants and their applications are defined by separate directives - `wallarm_partner_client_uuid` and `wallarm_application` correspondingly.

## Step 2: Test Wallarm multi-tenant node operation

--8<-- "../include/waf/installation/test-waf-operation.md"
