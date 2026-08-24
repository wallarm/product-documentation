[access-wallarm-api-docs]: overview.md#your-own-api-client
[application-docs]:        ../user-guides/settings/applications.md

# Wallarm API request examples

The following are some examples of Wallarm API use. You can also generate code examples via the API Reference UI for the [US cloud](https://apiconsole.us1.wallarm.com/) or [EU cloud](https://apiconsole.eu1.wallarm.com/). Experienced users can also use the browser’s Developer console (“Network” tab) to quickly learn which API endpoints and requests are used by the UI of your Wallarm account to fetch data from the public API.

## Getting Your Client ID for Wallarm API Calls

To make API calls to Wallarm's endpoints, you need to know your client ID (also called clientid). This is a unique identifier for your Wallarm account/tenant that must be included in most API requests. You can obtain your client ID by calling the `/v1/user` endpoint with your API token. Here's an example:

=== "EU Cloud"
    ```bash
    
    curl -X POST "https://api.wallarm.com/v1/user" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{}"
    ```
=== "US Cloud"
    ```bash
    
    curl -X POST "https://us1.api.wallarm.com/v1/user" \
      -H "X-WallarmAPI-Token: YOUR_API_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{}"
    ```

This returns your user information including the client_id field. For instance, the response might look like:

```
{
  "status": 200,
  "body": {
    "id": 6874940,
    "client_id": 5,
    "client_name": "My Company",
    "enabled": true,
    ...
  }
}
```

Once you have the client ID (in this example, 5), you can use it to fetch discovered APIs with endpoints like `/v4/clients/{client_id}/rules/endpoints`. The client ID is essential because Wallarm's API is multi-tenant, and this identifier tells the system which account's data you want to access.

## Get attacks

Besides the **Attacks** section of Wallarm Console, you can read attacks programmatically through the [Attacks API](../api-sessions/attacks-api.md) — an aggregation-first API that runs grouped queries over your attack data, drills into any group down to the raw requests, and also builds dashboard widgets, marks analyst verdicts, exports results, and manages saved views.

For example, to return individual (ungrouped) attacks from the last 24 hours:

--8<-- "../include/api-request-examples/get-attacks-en.md"

For the full endpoint reference, authentication, filtering, pagination, and migration from the legacy `/v1/objects/attack` and `/v1/objects/hit` endpoints, see the [Attacks API guide](../api-sessions/attacks-api.md).

## Get the first 50 incidents detected in the last 24 hours

Incidents are attacks that exploited a [security issue](../user-guides/vulnerabilities.md). Retrieve them from the `/v1/objects/attack` endpoint with the `"!vulnid": null` term, which keeps only attacks that have a vulnerability ID. Replace `TIMESTAMP` with the date 24 hours ago in [Unix time](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-incidents-en.md"

## Get the first 50 vulnerabilities in the status "active" within the last 24 hours

Please replace `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

## Get all configured rules

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

## Get only conditions of all rules

--8<-- "../include/api-request-examples/get-conditions.md"

## Get rules attached to a specific condition

To point to a specific condition, use its ID - you can get it when requesting conditions of all rules (see above).

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"

## Create the virtual patch to block all requests sent to `/my/api/*`

--8<-- "../include/api-request-examples/create-rule-en.md"

## Create the virtual patch for a specific application instance ID to block all requests sent to `/my/api/*`

An application should be [configured](../user-guides/settings/applications.md) before sending this request. Specify an ID of an existing application in `action.point[instance].value`.

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"

## Create a rule to consider the requests with specific value of the `X-FORWARDED-FOR` header as attacks

The following request will create the [custom attack indicator based on the regexp](../user-guides/rules/regex-rule.md) `^(~(44[.]33[.]22[.]11))$`.

If requests to domain `MY.DOMAIN.COM` have the `X-FORWARDED-FOR: 44.33.22.11` HTTP header, the Wallarm node will consider them to be scanner attacks and block attacks if the corresponding [filtration mode](../admin-en/configure-wallarm-mode.md) has been set.

--8<-- "../include/api-request-examples/create-rule-scanner.md"

## Create the rule setting filtration mode to monitoring for the specific application

The following request will create the [rule setting the node to filter traffic](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode) going to the [application](../user-guides/settings/applications.md) with ID `3` in the monitoring mode.

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

## Delete rule by its ID

You can copy the rule ID to be deleted when [getting all configured rules](#get-all-configured-rules). Also, a rule ID has been returned in response to the rule creation request, in the `id` response parameter.

--8<-- "../include/api-request-examples/delete-rule-by-id.md"

## API calls to get, populate and delete IP list objects

Below are some examples of the API calls to get, populate and delete [IP list](../user-guides/ip-lists/overview.md) objects.

### API request parameters

Parameters to be passed in the API requests to read and change IP lists:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### Getting content of IP lists

To get the detailed information about the current state of IP lists:

--8<-- "../include/api-request-examples/get-ip-lists.md"

### Add to the list the entries from the `.csv` file

To add to the list the IPs or subnets from the `.csv` file, use the following bash script:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### Add to the list a single IP or subnet

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### Add to the list multiple countries

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### Add to the list multiple proxy services

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### Delete an object from the IP list

Objects are deleted from IP lists by their IDs.

To get an object ID, request the IP list contents and copy `objects.id` of the required object from a response:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Having the object ID, send the following request to delete it from the list:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

You can delete multiple objects at once passing their IDs as an array in the deletion request.
