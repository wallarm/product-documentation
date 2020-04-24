# Wallarm API

Wallarm API provides interaction between components of the Wallarm system. You can use Wallarm API methods to create, get or update the following instances:
* vulnerabilities,
* attacks,
* incidents,
* users,
* clients,
* filter nodes, etc.

Description of API methods is given in the API Reference by the link:
* https://apiconsole.eu1.wallarm.com/ for the [EU cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
* https://apiconsole.us1.wallarm.com/ for the [US cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)

![!Wallarm API Reference](../images/wallarm-api-reference.png)

## API Endpoint

API requests are sent to the following URL:
* `https://api.wallarm.com/` for the [EU cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
* `https://us1.api.wallarm.com/` for the [US cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)

## Authentication of API Requests

The method of API requests authentication depends on the client sending the request:
* [API Reference UI](#api-reference-ui)
* [Your own client](#your-own-client)

### API Reference UI

A token is used for request authentication. The token is generated after successful authentication in your Wallarm account.

1. Sign in to your Wallarm account by the link:
    * https://my.wallarm.com/ for the EU cloud,
    * https://us1.my.wallarm.com/ for the US cloud.
2. Refresh the API Reference page by the link:
    * https://apiconsole.eu1.wallarm.com/ for the EU cloud,
    * https://apiconsole.us1.wallarm.com/ for the US cloud.
3. Go to the required API method > the **Try it out** section, input parameter values and **Execute** the request.

### Your Own Client

Your UUID and secret key are used.

1. Sign in to your Wallarm account by the link:
    * https://my.wallarm.com/ for the EU cloud,
    * https://us1.my.wallarm.com/ for the US cloud.
2. Refresh the API Reference page by the link:
    * https://apiconsole.eu1.wallarm.com/ for the EU cloud,
    * https://apiconsole.us1.wallarm.com/ for the US cloud.
3. Send the `POST /v1/user` request from the API Reference UI and copy the `uuid` value from the response.
4. Send the `POST /v1/user/renew_secret` request from the API Reference UI and copy the `secret` value from the response.
5. Send the required request from your client passing the following values:
    * `uuid` in the `X-WallarmAPI-UUID` header parameter,
    * `secret` in the `X-WallarmAPI-Secret` header parameter.

## API Restrictions

Wallarm limits the rate of API calls to 500 requests per second.

## API Request Examples

The following are some examples of Wallarm API use. You can also generate code examples via API Reference UI for the [EU cloud](https://apiconsole.eu1.wallarm.com/) or the [US cloud](https://apiconsole.us1.wallarm.com/). Experienced users can also use the browser’s Developer console (“Network” tab) to quickly learn which API endpoints and requests are used by the UI of your Wallarm account to fetch data from the public API. To find information about how to open the Developer console, you can use official browser documentation ([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/)).

* Get first 50 attacks detected in the last 24 hours

    Please replace `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-attacks-en.md"

* Get first 50 incidents confirmed in the last 24 hours

    The request is very similar to the previous example for a list of attacks; the `"!vulnid": null` term is added to this request. This term instructs the API to ignore all attacks without specified vulnerability ID, and this is how the system distinguishes between attacks and incidents.

    Please replace `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-incidents-en.md"

* Get first 50 vulnerabilities discovered in the last 24 hours

    Please replace `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

* Get all configured rules

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

* Get defined conditions for request blocking

--8<-- "../include/api-request-examples/get-conditions.md"

* Get rules attached to a specific condition

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"

* Create the rule to block all requests sent to `/my/api/*`

--8<-- "../include/api-request-examples/create-rule-en.md"

* Create the rule for a specific application instance ID to block all requests sent to `/my/api/*`

    An application ID is specified in the `action.value` parameter.

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"

* Delete rule by its ID

--8<-- "../include/api-request-examples/delete-rule-by-id.md"

!!! info "Wallarm approach to API development and documentation"
    Wallarm API Reference is a single page application (SPA), with all displayed data being dynamically fetched from the API. This design drives Wallarm to use the [API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/) approach when all new data and functionality is first made available in the public API and as the next step is described in the API Reference. Normally all new functionality is released in parallel in both public API and API Reference, but sometimes new API changes are released ahead of API Reference changes, and some functionality is available via the public API only.
    
    Wallarm API Reference is generated from the Swagger file using the [Swagger UI](https://swagger.io/tools/swagger-ui/) tool. API Reference provides an easy way to learn about available API endpoints, methods and data structures. It also provides a simple way to try all available endpoints.