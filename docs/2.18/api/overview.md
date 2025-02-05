[user-roles-article]:    ../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:   ../images/api-tokens-edit.png

# Wallarm API overview

Wallarm API provides interaction between components of the Wallarm system. You can use Wallarm API methods to create, get, or update the following instances:

* vulnerabilities
* attacks
* incidents
* users
* clients
* filter nodes
* etc.

Description of API methods is given in the **Wallarm API Console** available from Wallarm Console → top right → `?` → **Wallarm API Console** or directly by the link:

* https://apiconsole.us1.wallarm.com/ for the [US cloud](../about-wallarm/overview.md#us-cloud)
* https://apiconsole.eu1.wallarm.com/ for the [EU cloud](../about-wallarm/overview.md#eu-cloud)

![Wallarm API Console](../images/wallarm-api-reference.png)

## API endpoint

API requests are sent to the following URL:

* `https://us1.api.wallarm.com/` for the [US cloud](../about-wallarm/overview.md#us-cloud)
* `https://api.wallarm.com/` for the [EU cloud](../about-wallarm/overview.md#eu-cloud)

## Authentication of API requests

You must be a verified user to make Wallarm API requests. The method of API requests authentication depends on the client sending the request:

* [API Reference UI](#api-reference-ui)
* [Your own API client](#your-own-client)

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
3. Go to the required API method → the **Try it out** section, input parameter values, and **Execute** the request.

### Your own client

!!! info "API credentials and SSO"
    When SSO is enabled for the user, authentication for requests to Wallarm API via UUID and secret key becomes unavailable for this user. Find detailed information in the [SSO configuration](../admin-en/configuration-guides/sso/setup.md) article.

Your UUID and secret key are used for request authentication.

1. Sign in to your Wallarm account in the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)  → **Settings** → **API credentials**.
2. Copy the **UUID** value.
3. Get the **Secret key** value:

    * If you know the secret key value, then you can continue using the known value. The Wallarm Console displays the encrypted value of your active secret key.
    * If you do not know the secret key value or it was lost, to generate the new secret key:
        1. Click **Renew secret key**.
        1. Confirm by entering your password. 
        1. As soon as the new key is generated, copy its value. The secret key value will not be shown again.

        !!! warning "Reusing the secret key value"
            The button **Renew secret key** generates the new value of the secret key and invalidates the previous value. To use the secret key securely:

            * Write down the key value in a secure place. The secret key value will not be shown again.
            * Reuse the stored key value in all requests to Wallarm API.
            * If you generated the new key value, make sure the previous value is not used in other API clients. If the previous value is in use, replace it with the newly generated secret value.
4. Send the required API request passing the following values:
    * **UUID** in the `X-WallarmAPI-UUID` header parameter
    * **Secret key** in the `X-WallarmAPI-Secret` header parameter

<!-- ## API restrictions

Wallarm limits the rate of API calls to 500 requests per second. -->

## Wallarm approach to API development and documentation

Wallarm API Reference is a single page application (SPA) with all displayed data being dynamically fetched from the API. This design drives Wallarm to use the [API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/) approach when new data and functionality is initially made available in the public API and as the next step is described in the API Reference. Normally all new functionality is released in parallel in both public API and API Reference, but sometimes new API changes are released ahead of API Reference changes, and some functionality is available via the public API only.
    
Wallarm API Reference is generated from the Swagger file using the [Swagger UI](https://swagger.io/tools/swagger-ui/) tool. API Reference provides an easy way to learn about available API endpoints, methods, and data structures. It also provides a simple way to try all available endpoints.
