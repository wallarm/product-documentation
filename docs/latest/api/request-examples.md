# Wallarm API request examples

The following are some examples of Wallarm API use. You can also generate code examples via the API Reference UI for the [US cloud](https://apiconsole.us1.wallarm.com/) or [EU cloud](https://apiconsole.eu1.wallarm.com/). Experienced users can also use the browser’s Developer console (“Network” tab) to quickly learn which API endpoints and requests are used by the UI of your Wallarm account to fetch data from the public API. To find information about how to open the Developer console, you can use the official browser documentation ([Safari](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac), [Chrome](https://developers.google.com/web/tools/chrome-devtools/), [Firefox](https://developer.mozilla.org/en-US/docs/Tools), [Vivaldi](https://help.vivaldi.com/article/developer-tools/)).

## Get the first 50 attacks detected in the last 24 hours

Please replace `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-attacks-en.md"

## Get the first 50 incidents confirmed in the last 24 hours

The request is very similar to the previous example for a list of attacks; the `"!vulnid": null` term is added to this request. This term instructs the API to ignore all attacks without specified vulnerability ID, and this is how the system distinguishes between attacks and incidents.

Please replace `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

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

## Delete rule by its ID

You can copy the rule ID to be deleted when [getting all configured rules](#get-all-configured-rules). Also, a rule ID has been returned in response to the rule creation request, in the `id` response parameter.

--8<-- "../include/api-request-examples/delete-rule-by-id.md"
