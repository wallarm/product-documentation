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

* https://apiconsole.eu1.wallarm.com/ for the [EU cloud](../about-wallarm-waf/overview.md#eu-cloud)
* https://apiconsole.us1.wallarm.com/ for the [US cloud](../about-wallarm-waf/overview.md#us-cloud)

![!Wallarm API Reference](../images/wallarm-api-reference.png)

## API endpoint

API requests are sent to the following URL:

* `https://api.wallarm.com/` for the [EU cloud](../about-wallarm-waf/overview.md#eu-cloud)
* `https://us1.api.wallarm.com/` for the [US cloud](../about-wallarm-waf/overview.md#us-cloud)

## Authentication of API requests

The method of API requests authentication depends on the client sending the request:
* [API Reference UI](#api-reference-ui)
* [Your own client](#your-own-client)

### API Reference UI

A token is used for request authentication. The token is generated after successful authentication in your Wallarm account.

1. Sign in to your Wallarm account using the link:
    * https://my.wallarm.com/ for the EU cloud,
    * https://us1.my.wallarm.com/ for the US cloud.
2. Refresh the API Reference page using the link:
    * https://apiconsole.eu1.wallarm.com/ for the EU cloud,
    * https://apiconsole.us1.wallarm.com/ for the US cloud.
3. Go to the required API method > the **Try it out** section, input parameter values, and **Execute** the request.

### Your own client

Your UUID and secret key are used.

1. Sign in to your Wallarm account using the link:
    * https://my.wallarm.com/ for the EU cloud,
    * https://us1.my.wallarm.com/ for the US cloud.
2. Refresh the API Reference page using the link:
    * https://apiconsole.eu1.wallarm.com/ for the EU cloud,
    * https://apiconsole.us1.wallarm.com/ for the US cloud.
3. Send the `POST /v1/user` request without the parameters from the API Reference UI and copy the `uuid` value from the response.
4. Send the `POST /v1/user/renew_secret` request without the parameters from the API Reference UI and copy the `secret` value from the response.

    !!! warning "Reusing the `secret` value"
        The request `POST /v1/user/renew_secret` generates a new value of the secret key and invalidates the previous value. To use the secret key securely:

        * Write down the `secret` value from the first `POST /v1/user/renew_secret` call in a secure place. The secret key value will not be shown again.
        * Reuse the stored `secret` value in all requests to Wallarm API.
        * If you generated a new `secret` value, make sure the previous value is not used in other API clients. If the previous value is in use, replace it with the newly generated secret value.
5. Send the required request from your client passing the following values:
    * `uuid` in the `X‑WallarmAPI‑UUID` header parameter.
    * `secret` in the `X‑WallarmAPI‑Secret` header parameter.

<!-- ## API restrictions

Wallarm limits the rate of API calls to 500 requests per second. -->

## Wallarm approach to API development and documentation

Wallarm API Reference is a single page application (SPA) with all displayed data being dynamically fetched from the API. This design drives Wallarm to use the [API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/) approach when new data and functionality is initially made available in the public API and as the next step is described in the API Reference. Normally all new functionality is released in parallel in both public API and API Reference, but sometimes new API changes are released ahead of API Reference changes, and some functionality is available via the public API only.
    
Wallarm API Reference is generated from the Swagger file using the [Swagger UI](https://swagger.io/tools/swagger-ui/) tool. API Reference provides an easy way to learn about available API endpoints, methods, and data structures. It also provides a simple way to try all available endpoints.
