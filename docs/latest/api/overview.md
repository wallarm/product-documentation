# Wallarm API overview

Wallarm API provides interaction between components of the Wallarm system. You can use Wallarm API methods to create, get, or update the following instances:

* vulnerabilities
* attacks
* incidents
* users
* clients
* filter nodes
* etc.

Description of API methods is given in the API Reference by the link:

* https://apiconsole.us1.wallarm.com/ for the [US cloud](../about-wallarm/overview.md#us-cloud)
* https://apiconsole.eu1.wallarm.com/ for the [EU cloud](../about-wallarm/overview.md#eu-cloud)

![!Wallarm API Reference](../images/wallarm-api-reference.png)

## API endpoint

API requests are sent to the following URL:

* `https://us1.api.wallarm.com/` for the [US cloud](../about-wallarm/overview.md#us-cloud)
* `https://api.wallarm.com/` for the [EU cloud](../about-wallarm/overview.md#eu-cloud)

## Authentication of API requests

You must be a verified user to make Wallarm API requests. The method of API requests authentication depends on the client sending the request:

* [API Reference UI](#api-reference-ui)
* [Your own client](#your-own-client)

### API Reference UI

A token is used for request authentication. The token is generated after successful authentication in your Wallarm account.

1. Sign in to your Wallarm account using the link:
    * https://us1.my.wallarm.com/ for the US cloud
    * https://my.wallarm.com/ for the EU cloud
2. Refresh the API Reference page using the link:
    * https://apiconsole.us1.wallarm.com/ for the US cloud
    * https://apiconsole.eu1.wallarm.com/ for the EU cloud
3. Go to the required API method → the **Try it out** section, input parameter values, and **Execute** the request.

### Your own client

To authenticate your requests to Wallarm API:

1. Sign in to your Wallarm account in the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)  → **Settings** → **API tokens**.
1. [Open](#configuring-tokens) yours or shared token and copy value from the **Token** section.
1. Send the required API request passing the **Token** value in the `WallarmApi-Token` header parameter.

<!-- ## API restrictions

Wallarm limits the rate of API calls to 500 requests per second. -->

## Configuring tokens

Tokens are used for API request authentication. You can configure any number of tokens.

[All users](../user-guides/settings/users.md#user-roles) can:

* Create own tokens.
* See, edit, disable/enable or remove all tokens they own.
* Use shared tokens.
* For each own token:

    * Set permissions, but not wider than their own.
    * Set expiration date for the token. If set, the token will be disabled after that date.

!!! info "Automatic removal"
    All disabled tokens are automatically removed in a week after disabling.

Administrators can:

* See, edit, disable/enable or remove all tokens in the company account.
* Create private or shared tokens. Shared tokens can be used by any user in the company account.

    !!! info "Administrators cannot"
        Administrators cannot see or copy values of the tokens that they do not own.

![!Wallarm API token](../images/api-tokens-edit.png)

Consider that:

* If token owner is disabled, all one's tokens are automatically disabled as well.
* If token owner is reduced in permissions, corresponding permissions will be removed from all one's tokens.

Note that previously UUID and secret key were used for request authentication which is now replaced with tokens. The UUID and secret key your were using are automatically transformed to the **legacy** token, so that your requests authenticated with UUID and secret key will continue working. Permissions for the migrated legacy tokens are not displayed and cannot be changed.

!!! info "SSO users"
    Legacy tokens are not created for users using SSO to access the Wallarm Console. If SSO is enabled for the owner of some tokens, all these tokens are automatically disabled.

## Wallarm approach to API development and documentation

Wallarm API Reference is a single page application (SPA) with all displayed data being dynamically fetched from the API. This design drives Wallarm to use the [API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/) approach when new data and functionality is initially made available in the public API and as the next step is described in the API Reference. Normally all new functionality is released in parallel in both public API and API Reference, but sometimes new API changes are released ahead of API Reference changes, and some functionality is available via the public API only.
    
Wallarm API Reference is generated from the Swagger file using the [Swagger UI](https://swagger.io/tools/swagger-ui/) tool. API Reference provides an easy way to learn about available API endpoints, methods, and data structures. It also provides a simple way to try all available endpoints.
