[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# API Tokens

In Wallarm Console → **Settings** → **API tokens**, you can manage tokens for [API request authentication](../../api/overview.md).

![Wallarm API token][img-api-tokens-edit]

This section is available for the users of **[all roles][user-roles-article]** besides **Read Only** and **API developer**.

## Configuring tokens

Users can create own tokens and use them (which means, view token value and include it into API request to authenticate it). For each own token you can set permissions, but not wider than the ones your user has. Optionally, you can set expiration date for the token - if set, the token will be disabled after that date. Also, you can disable/enable your tokens manually.

You can renew the token value at any moment.

**Administrators** / **Global Administrators** can view and manage all tokens in the company account. Besides private tokens, they can create shared ones, that can be viewed/used by other administrators. When specifying permissions for the tokens, they can select to take these permissions from the selected role:

* Administrator
* Analyst
* API Developer
* Read only
* Deploy - API tokens with this role are used to [deploy Wallarm nodes](../../user-guides/nodes/nodes.md#creating-a-node)
* Сustom - switches back to the  manual permission selection

!!! info "Token privacy"
    No other users (even administrators) can use your private tokens (which means, view or copy token value). Besides, non-administrators will not even see your tokens.

Consider that:

* If the token owner has been [disabled](../../user-guides/settings/users.md#disabling-and-deleting-users), all one's tokens are automatically disabled as well.
* If the token owner has been reduced in permissions, corresponding permissions will be removed from all one's tokens.
* All disabled tokens are automatically removed in a week after disabling.
* To enable previously disabled token, save it with the new expiration date.

## Creating tokens with global role permissions

To create an API token with the permissions based on the global [roles](../../user-guides/settings/users.md#user-roles) like Global Administrator, Global Analyst or Global Read Only, do the following:

1. Log in to the [US](https://us1.my.wallarm.com/) or [EU](https://my.wallarm.com/) Wallarm Console under the [appropriate user](#configuring-tokens).
1. At the top right, select `?` → **Wallarm API Console**. Wallarm API console is opened:

    * https://apiconsole.us1.wallarm.com/ for the US Cloud
    * https://apiconsole.eu1.wallarm.com/ for the EU Cloud

    Note that Wallarm API Console retrieves authentication data from the Wallarm Console. If you change user in Wallarm Console, refresh the Wallarm API Console page for the new authentication.
 
1. Send the POST request to the `/v2/api_tokens` route with the following parameters:

    ```bash
    {
    "client_id": <CLIENT_ID>,
    "realname": "<NAME_FOR_YOUR_API_TOKEN>",
    "user_id": <USER_ID>,
    "enabled": true,
    "expire_at": "<TOKEN_EXPIRATION_DATE_AND_TIME>",
    "permissions": [
        "<REQUIRED_GLOBAL_ROLE>"
    ]
    }
    ```

    Where:

    * `<NAME_FOR_YOUR_API_TOKEN>` is recommended to explain the token purpose.
    * `<USER_ID>` defines the user who owns the token, and `<CLIENT_ID>` - the company account this user belongs to.
    
        Obtain these IDs by sending the POST request to the `/v1/user` route.

    * `<TOKEN_EXPIRATION_DATE_AND_TIME>` in [ISO 8601 format](https://www.cl.cam.ac.uk/~mgk25/iso-time.html), for example `2033-06-13T04:56:01.037Z`.
    * `<REQUIRED_GLOBAL_ROLE>` can be:
        
        * `partner_admin` for Global Administrator
        * `partner_analytic` for Global Analyst
        * `partner_auditor` for Global Read Only

    ??? info "Example"
        ```bash
        {
        "client_id": 1010,
        "realname": "Token for tenant creation",
        "user_id": 10101011,
        "enabled": true,
        "expire_at": "2033-06-13T04:56:01.037Z",
        "permissions": [
            "partner_admin"
        ]
        }
        ```

        This request creates an API token with Global Administrator's permissions that can be used for the [tenant creation](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

1. From the response, get the `id` of the created token and send the GET request to the `/v2/api_tokens/{id}/secret` route using this `id`.
1. Copy the `secret` value from the response and use it as the API token for request authentication.

    !!! info "Copying token from Wallarm Console"
        As created API token is displayed in Wallarm Console, you can also copy it from the token's menu in **Settings** → **API Tokens**.

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
