[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# API Tokens

In Wallarm Console → **Settings** → **API tokens**, you can manage tokens for [API request authentication](../../api/overview.md) and for [filtering node deployment](../../installation/supported-deployment-options.md).

Wallarm API tokens offer flexible management options. You can choose the token's type, such as personal or shared, set its expiration date, and specify permissions.

![Wallarm API token][img-api-tokens-edit]

## Personal and shared tokens

You can generate either personal or shared API tokens:

* Personal tokens are designated for individual use, according to the permissions assigned to them. Only [Administrators and Analysts](users.md#user-roles) can create and use personal tokens.

    The value of a personal token can be copied and utilized solely by its owner. However, administrators can view the list of user tokens within the company account.
* Shared tokens are designed for use by multiple users or systems. They provide access to resources or functionalities collectively, without being linked to any individual personal account.

    Only Administrators and Global Administrators can generate these tokens, and only other administrators within the company can use them.

## Token expiration

You have the option to set an expiration date for each token. Once set, the token will be deactivated after the specified date.

We issue an email notification 3 days prior to a token's expiration date. For short-term tokens with an expiration period of less than 3 days, no notification is sent.

For personal tokens, the email is sent directly to the token owner, and for shared tokens, all administrators receive the notification.

## Token permissions

For each token, you can set permissions that do not exceed the scope of permissions associated with your user role.

You can assign token permissions based on predefined user roles or customize them:

* Administrator, Analyst, API Develover, Read Only and the equivalent Global roles - a token assigned one of these roles will inherit the permissions detailed in our [user role system](users.md#user-roles).
* Deploy - API tokens with this role are used to [deploy Wallarm nodes](../../installation/supported-deployment-options.md).
* Сustom permissions - switches to the manual permission selection.

If the permissions of a personal token owner are reduced, the persmissions of their tokens will be adjusted correspondingly.

## Disabling and re-enabling tokens

You can manually disable or enable your tokens. Once disabled, a token immediately stops functioning.

Disabled tokens are automatically deleted one week after deactivation.

To re-enable a previously disabled token, assign it a new expiration date.

If a token owner is [disabled](../../user-guides/settings/users.md#disabling-and-deleting-users), their tokens are also automatically disabled.

## Backward-compatible tokens

Previously UUID and secret key were used for request authentication which is now replaced with tokens. The UUID and secret key your were using are automatically transformed to the **backward-compatible** token. With this token requests authenticated with UUID and secret key will continue working.

!!! warning "Renew token or enable SSO"
    If you renew the value of the backward-compatible token or enable [SSO/strict SSO](../../admin-en/configuration-guides/sso/employ-user-auth.md) for this token's owner, the backward compatibility ends - all requests authenticated with old UUID and secret key will stop working.

You can also use the generated value of the backward-compatible token passing it in the `X-WallarmApi-Token` header parameter of your requests.

Backward-compatible token has the same permissions as the user role does, these permissions are not displayed in the token window and cannot be changed. If you want to control permissions, you need to remove a backward-compatible token and create a new one.

## API tokens vs. node tokens

You can use API tokens described in this article for Wallarm Cloud API [request authentication](../../api/overview.md) from any client and with any set of permissions.

One of the clients accessing Wallarm Cloud API is Wallarm filtering node itself. To grant a filtering node with the access to API of Wallarm Cloud, besides API tokens, you can use node tokens. [Know the difference and what to prefer →](../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)

!!! info "API tokens are not supported by some deployment options"
    API tokens currently cannot be used for [Kong Ingress controllers](../../installation/kubernetes/kong-ingress-controller/deployment.md) and [Sidecar](../../installation/kubernetes/sidecar-proxy/deployment.md) deployments, as well as for AWS deployments based on [Terraform module](../../installation/cloud-platforms/aws/terraform-module/overview.md). Use node tokens instead.
