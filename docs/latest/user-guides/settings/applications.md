# Setting up applications

If your company has several applications, you may find it convenient not only to view the statistics of the entire company's traffic but also to view the statistics separately for each application. To separate traffic by the applications, you can use the "application" entity in the Wallarm system.

!!! warning "Support of the application configuration for the CDN node"
    To configure applications for the [Wallarm CDN nodes](../../installation/cdn-node.md), request the [Wallarm support team](mailto:support@wallarm.com) to do so.

Using applications enables you to:

* View events and statistics separately for each application
* Configure [triggers](../triggers/triggers.md), [rules](../rules/rules.md) and other Wallarm features for certain applications
* [Configure Wallarm in separated environments](../../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md)

For Wallarm to identify your applications, it is required to assign them unique identifiers via the appropriate directive in the node configuration. Identifiers can be set for both the application domains and the domain paths.

By default, Wallarm considers each application to be the `default` application with the identifier (ID) `-1`.

## Adding an application

1. (Optional) Add an application in Wallarm Console → **Settings** → **Applications**.

    ![Adding an application](../../images/user-guides/settings/configure-app.png)

    !!! warning "Administrator access"
        Only users with the **Administrator** role can access the section **Settings** → **Applications**.
2. Assign an application the unique ID in the node configuration via:

    * The directive [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) if Wallarm is installed as NGINX module, cloud marketplace image, NGINX-based Docker container with a mounted configuration file, sidecar container.
    * The [environment variable](../../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) `WALLARM_APPLICATION` if Wallarm is installed as NGINX-based Docker container.
    * The [Ingress annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-application` if Wallarm is installed as the Ingress controller.
    * The parameter [`application`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) if Wallarm is installed as Envoy-based Docker container with a mounted configuration file.

    The value can be a positive integer except for `0`.

    If an application with a specified ID is not added in Wallarm Console → **Settings** → **Applications**, it will be added to the list automatically. The application name will be generated automatically based on the specified identifier (e.g. `Application #1` for the application with the ID `-1`). The name can be changed via Wallarm Console later.

If the application is properly configured, its name will be displayed in the details of attacks aimed at this application. To test the application configuration, you can send the [test attack](../../admin-en/installation-check-operation-en.md#2-run-a-test-attack) to the application address.

## Automatic application identification

You can configure an automatic application identification on the base of:

* Specific request headers
* Specific request header or part of URLs using `map` NGINX directive

!!! info "NGINX only"
    Listed approaches are applicable only for NGINX-based node deployments.

### Application identification on base of specific request headers

This approach includes two steps:

1. Configure your network so that the header with application ID is added to each request.
1. Use value of this header as value for the `wallarm_application` directive. See example below.

Example of the NGINX configuration file:

```
server {
    listen       80;
    server_name  example.com;
    wallarm_mode block;
    wallarm_application $http_custom_id;
    
    location / {
        proxy_pass      http://upstream1:8080;
    }
}    
```

Attack request example:

```
curl -H "Cookie: SESSID='UNION SELECT SLEEP(5)-- -" -H "CUSTOM-ID: 222" http://example.com
```

This request will:

* Be considered an attack and added to the **Attacks** section.
* Be associated with application with ID `222`.
* If the corresponding application does not exist, it will be added to the **Settings** → **Applications** and automatically named `Application #222`.

![Adding an application on the base of header request](../../images/user-guides/settings/configure-app-auto-header.png)

### Application identification on base of specific request header or part of URLs using `map` NGINX directive 

You can add the applications on the base of specific request header or part of endpoint URLs, using the `map` NGINX directive. See detailed description of the directive in the NGINX [documentation](https://nginx.org/en/docs/http/ngx_http_map_module.html#map).

## Deleting an application

To delete the application from the Wallarm system, delete an appropriate directive from the node configuration file. If the application is only deleted from the **Settings** → **Applications** section, it will be restored in the list.
