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

* https://apiconsole.us1.wallarm.com/ for the [US cloud](../about-wallarm/overview.md#cloud)
* https://apiconsole.eu1.wallarm.com/ for the [EU cloud](../about-wallarm/overview.md#cloud)

![Wallarm API Console](../images/wallarm-api-reference.png)

## API endpoint

API requests are sent to the following URL:

* `https://us1.api.wallarm.com/` for the [US cloud](../about-wallarm/overview.md#cloud)
* `https://api.wallarm.com/` for the [EU cloud](../about-wallarm/overview.md#cloud)

## Authentication of API requests

You must be a verified user to make Wallarm API requests. The method of API requests authentication depends on the client sending the request:

* [API Reference UI](#wallarm-api-console)
* [Your own API client](#your-own-api-client)

### Wallarm API Console

A token is used for request authentication. The token is generated after successful authentication in your Wallarm account.

1. Sign in to your Wallarm Console using the link:
    * https://us1.my.wallarm.com/ for the US cloud
    * https://my.wallarm.com/ for the EU cloud
2. Refresh the Wallarm API Console page using the link:
    * https://apiconsole.us1.wallarm.com/ for the US cloud
    * https://apiconsole.eu1.wallarm.com/ for the EU cloud
3. Go to the required API method → the **Try it out** section, input parameter values, and **Execute** the request.

### Your own API client

To authenticate requests from your own API client to Wallarm API:

1. Sign in to your Wallarm account in the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)  → **Settings** → **API tokens**.
1. [Create](../user-guides/settings/api-tokens.md#configuring-tokens) token to access the Wallarm API.
1. Open your token and copy value from the **Token** section.
1. Send the required API request passing the **Token** value in the `X-WallarmApi-Token` header parameter.

[More details on API tokens →](../user-guides/settings/api-tokens.md)

<!-- ## API restrictions

Wallarm limits the rate of API calls to 500 requests per second. -->

## Wallarm approach to API development and documentation

Wallarm API Reference is a single page application (SPA) with all displayed data being dynamically fetched from the API. This design drives Wallarm to use the [API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/) approach when new data and functionality is initially made available in the public API and as the next step is described in the API Reference. Normally all new functionality is released in parallel in both public API and API Reference, but sometimes new API changes are released ahead of API Reference changes, and some functionality is available via the public API only.
    
Wallarm API Reference is generated from the Swagger file using the [Swagger UI](https://swagger.io/tools/swagger-ui/) tool. API Reference provides an easy way to learn about available API endpoints, methods, and data structures. It also provides a simple way to try all available endpoints.
