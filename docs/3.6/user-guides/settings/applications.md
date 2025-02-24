# Setting Up Applications

If your company has several applications, you may find it convenient not only to view the statistics of the entire company's traffic but also to view the statistics separately for each application. To separate traffic by the applications, you can use the "application" entity in the Wallarm system.

!!! warning "Support of the application configuration for the CDN node"
    To configure applications for the [Wallarm CDN nodes](../../installation/cdn-node.md), request the [Wallarm support team](mailto:support@wallarm.com) to do so.

Using applications enables you to:

* [View](#viewing-events-and-statistics-by-application) events and statistics separately for each application
* [Configure](#configuring-wallarm-features-by-application) triggers, rules and other Wallarm features for certain applications
* Handle environments (production, testing, etc.) as separate applications

    !!! info "Isolated environments"
        Environments managed as applications are accessible to all users of the current Wallarm account. If you need to isolate their data so that only specific users have access to it, instead of applications, use the [multitenancy](../../installation/multi-tenant/overview.md) feature.

For Wallarm to identify your applications, it is required to assign them unique identifiers via the appropriate directive in the node configuration. Identifiers can be set for both the application domains and the domain paths.

By default, Wallarm considers each application to be the `default` application with the identifier (ID) `-1`.

## Adding applications

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

## Viewing events and statistics by application

Once you have your applications set up, you can view separately:

* [Attacks](../../user-guides/events/check-attack.md) and [incidents](../../user-guides/events/check-incident.md) only for the application of your interest
* [API sessions](../../api-sessions/overview.md) related only to the application of your interest
* Statistics on [dashboards](../../user-guides/dashboards/threat-prevention.md) related only to the application of your interest

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.23% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/njvywcvjddzd?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Configuring Wallarm features by application

Once you have your applications set up, you can configure Wallarm protection features separately for each application, including:

* [Rules](../rules/rules.md#conditions)
* [Triggers](../triggers/triggers.md#understanding-filters)
* [IP lists](../ip-lists/overview.md#limit-by-target-application)
* [API Abuse Prevention](../../api-abuse-prevention/setup.md#creating-profiles)

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.23% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/1dsy6claa8wb?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Assigning Wallarm's features to applications is an easiest way to specify conditions in which those features should be applied and to differentiate configurations for the different parts of your infrastructure.

## Deleting applications

To delete the application from the Wallarm system, delete an appropriate directive from the node configuration file. If the application is only deleted from the **Settings** → **Applications** section, it will be restored in the list.
