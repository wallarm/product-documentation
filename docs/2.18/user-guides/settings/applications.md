# Setting Up Applications

If your company has several applications, you may find it convenient not only to view the statistics of the entire company's traffic but also to view the statistics separately for each application. To separate traffic by the applications, you can use the "application" entity in the Wallarm system.

Using applications enables you to:

* View events and statistics separately for each application
* Configure triggers, rules and other Wallarm features for certain applications
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

    * The directive [`wallarm_instance`](../../admin-en/configure-parameters-en.md#wallarm_instance) if Wallarm is installed as NGINX module, cloud marketplace image, NGINX-based Docker container with a mounted configuration file, sidecar container, Kong module.
    * The [Ingress annotation](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `wallarm-instance` if Wallarm is installed as the Ingress controller.
    * The parameter [`instance`](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) if Wallarm is installed as Envoy-based Docker container with a mounted configuration file.

    The value can be a positive integer except for `0`.

    If an application with a specified ID is not added in Wallarm Console → **Settings** → **Applications**, it will be added to the list automatically. The application name will be generated automatically based on the specified identifier (e.g. `Application #1` for the application with the ID `-1`). The name can be changed via Wallarm Console later.

If the application is properly configured, its name will be displayed in the details of attacks aimed at this application. To test the application configuration, you can send the [test attack](../../admin-en/installation-check-operation-en.md#2-run-a-test-attack) to the application address.

## Deleting an application

To delete the application from the Wallarm system, delete an appropriate directive from the node configuration file. If the application is only deleted from the **Settings** → **Applications** section, it will be restored in the list.