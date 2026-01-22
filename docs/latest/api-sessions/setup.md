# API Sessions Setup <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Sessions](overview.md) include the built-in rules for the session identification and requires only enabled Wallarm [node](../about-wallarm/overview.md#how-wallarm-works) to start working. Optionally, you can fine-tune API Sessions under your needs as described in this article.

## Requirements

* API Sessions require [NGINX Wallarm node](../installation/nginx-native-node-internals.md#nginx-node) 5.1.0 or [Native Wallarm Node](../installation/nginx-native-node-internals.md#native-node) 0.8.0.
* Response parsing - NGINX Wallarm node 5.3.0 or native node 0.12.0.

## Session grouping

Wallarm groups requests of your applications' traffic into user sessions based on the **equal values** of the selected headers/parameters of the requests and/or responses. In configuration, these are parameters marked to be grouping keys. See how grouping keys work in the [example](#example-of-how-grouping-keys-work).    

By default, sessions are identified with the **built-in set** of such parameters (not displayed in Wallarm Console). Its logic is to try most common identification parameters, such as `PHPSESSID` or `SESSION-ID` headers, and if they do not work - form session based on the combination of `request source IP and user-agent` (or at least IP if user-agent is not presented).

You can add several grouping keys, they are tried in [specified order](#example-of-how-grouping-keys-work) - next is tried only if previous did not work. Drag to change the order. You own keys are always tried before the built-in ones.

![!API Sessions - Configuration](../images/api-sessions/api-sessions-settings.png)

Consider the following:

* **Multi-part sessions**: For effective analysis, [long sessions](exploring.md#multi-day-sessions) are separated in one-day parts. Also, no parts older than 7 days are stored and displayed.
* **Impact to bot detection by `API Abuse prevention`**: Wallarm's API Abuse Prevention uses sessions for the malicious bot detection. Adding your own session identification parameters based on your applications' logic makes both session detection and API Abuse Prevention's bot detection more precise. See [details](overview.md#api-sessions-and-api-abuse-prevention).
* **Impact from `Mask sensitive data` rule**: For the parameter to work as a grouping key, it should not be affected by the the [Mask sensitive data](../user-guides/rules/sensitive-data-rule.md) rule

### Adding grouping keys

You can add your own identification parameters based on your applications' logic:

* From **Recommendations** (requires [API Discovery](../api-discovery/overview.md))
* Manually

#### Adding keys from recommendations

!!! tip ""
    Requires [API Discovery](../api-discovery/overview.md)

Based on your traffic, Wallarm suggests parameters you might want to use as session grouping keys:

* The suggestions are LLM-based and rely on API Discovery data.
* The suggestions are accompanied by explanatory text, from which you can understand why these particular parameters were suggested for identifying sessions of your different [applications](../user-guides/settings/applications.md).
* The appearance of [new data](../api-discovery/track-changes.md) in API Discovery may result in the new suggestions, so it is recommended to re-check the **Suggestions** section periodically.
* When accepted, suggestions are added without logic in their order - you should define that order yourself.

To add grouping keys from recommendations:

1. go to Wallarm Console → **API Sessions** → **Session context parameters**.
1. Check the **Recommendations** section.
1. Apply all or selected parameters. The parameters are added to the **Configured export parameters** parameters. Note that **Group sessions by this key** should remain selected for all of them.
1. Drag and drop to define order (priority) - see [example](#example-of-how-grouping-keys-work).
1. **Save** changes.

![!API Sessions - Recommendations](../images/api-sessions/api-sessions-settings-recommendations.png)

#### Adding from API Discovery

Wallarm's [API Discovery](../api-discovery/overview.md) automatically finds your endpoints and their parameters - you can instruct Wallarm to use any of these parameters as session grouping keys right from API Discovery:

1. In **API Discovery**, go to your endpoint.
1. Scroll to its request/response parameters.
1. For the desired parameter, in the **Context parameters** column, click **Add**.

    The API Discovery configuration dialog is displayed with your parameter added as a grouping key.

    ![!API Discovery - adding grouping keys to API Sessions](../images/api-sessions/api-sessions-grouping-keys-add-from-apid.png)

1. If necessary, adjust grouping key order ([changes priority](#example-of-how-grouping-keys-work)).
1. Save changes.

    Wallarm goes back to **API Discovery** while **API Sessions** now have added grouping key.

#### Adding keys manually

To add session grouping keys manually, go to Wallarm Console → **API Sessions** → **Session context parameters**, add your request or response parameter and select **Group sessions by this key** for it.

See also: [simplified selection](#simplified-selection).

### Example of how grouping keys work

Let us say you have a route login which returns a specific `<TOKEN>` in `RESPONSE →` `BODY JSON → PROPERTY → token` parameter of the response. In the further requests, this `<TOKEN>` is used somewhere in `REQUEST → QUERY → token` or `REQUEST →` `BODY → JSON → PROPERTY → token`.

You can configure 3 parameters to be used as grouping keys (for response body, get and post requests). They will be tried in the following order (next is tried only if previous did not work):

1. `RESPONSE → BODY → JSON → PROPERTY → token`
2. `REQUEST → QUERY → token`
3. `REQUEST → BODY → JSON → PROPERTY → token`
4. (built-in set, will be used if none of previous work)

![!API Sessions - example of grouping keys in work](../images/api-sessions/api-sessions-grouping-keys.png)

Requests:

* curl `example.com -d '{in: 'bbb'}'` with response `'{token: aaa}'` → session "A" (**grouping key #1 worked**)
* curl `example.com -d '{in: 'ccc'}' '{token: 'aaa'}'` with response without token → session "A" (**grouping key #3 worked**)

The same parameter value `aaa` groups these requests into one session.

## Session context

Context in API sessions is information that enriches session information to provide deeper insights into activities within session. Configuring context allows you to specify which aspects or additional data should be tracked and associated with each session.

Set session context by adding extra request and response parameters, associating sessions with sensitive business flows and highlighting parameters that can be used for user and user role identification.

!!! info "Allowed number of session context parameters"
    You can add up to 20 session context parameters to use them for session context and [grouping](#session-grouping).

### Extra parameters

In **API Sessions**, within session, the request details by default include: 

* Parameter of request or response that worked for [session grouping](#session-grouping) - yours or the one from the built-in set (highlighted in the **API session ID parameters** group).
* Parameters (if any) [added](#mitigation-controls) by mitigation controls.
* For malicious requests - full request content.

You can add any additional (context) [parameters](../user-guides/rules/request-processing.md) both for requests and for their related responses, that you need to understand the session content: what and in what order the actor did and what the response was. To do so, add these parameters in Wallarm Console → **API Sessions** → **Session context parameters**. Once added, Wallarm will export them to the Wallarm Cloud and [display](#data-protection) in Wallarm Console, in details of your session requests (in the **API session parameters** group).

![!API Sessions - context parameters](../images/api-sessions/api-sessions-context-parameters.png)

Here are some examples:

Getting the username out of the `jwt_payload` of the request:

```
{
  "token_type": "access",
  "exp": 1741774186,
  "iat": 1741773706,
  "jti": "jti_value",
  "user_id": 932,
  "details": {
    "username": "john-doe@company-001.com",
    "rnd": "some_data",
    "contact": {
      "contactId": 438,
      "contactUUID": "contact_UUID_value",
      "firstName": "John",
      "lastName": "Doe",
      "portalSecurityLevel": 3,
      "companyId": 255,
      "companyName": "Company 001",
      "companyUUID": "company_UUID_value"
    }
  }
}
```

... looks like:

![!API Sessions - context parameters - example - JWT](../images/api-sessions/api-sessions-context-parameters-example-jwt.png)

Getting the `email` parameter from the request body:

![!API Sessions - context parameters - example - request](../images/api-sessions/api-sessions-context-parameters-example-request.png)

Getting the `product_id` parameter form the response body:

![!API Sessions - context parameters - example - response](../images/api-sessions/api-sessions-context-parameters-example-response.png)

Getting JWT token from the request header:

![!API Sessions - context parameters - example - header](../images/api-sessions/api-sessions-context-parameters-example-header.png)

<!--### Sensitive business flows

You can associate sessions with sensitive business flows. To do so, in Wallarm Console → **API Sessions** → **Session context parameters**, add your parameter and select **Context** for it.

![!API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-select.png)
-->

### Simplified selection

In API Sessions, selecting parameters is simplified compared to how they are selected in [Rules](../user-guides/rules/rules.md):

* You always start with selecting `Request` or `Response`
* Instead of the `post` tag to mark body, you directly select `Body`
* Instead of `hush` tag for values (as opposite to arrays), you select `Property`
* API Sessions provide "live" request preview to the right structure you specified

For example, what in Rules would be:

![!Rules - parameter selection as opposed to API Sessions](../images/api-sessions/rules-parameters-example-request.png)

...in API Sessions will be:

![!API Sessions - context parameters - example - request](../images/api-sessions/api-sessions-context-parameters-example-request.png)

### Users and roles

You can highlight session parameters, that should be used for naming the session user and its role. To do so, in Wallarm Console → **API Sessions** → **Session context parameters**, add your parameter, then from **Type**, select `User` or `Role`.

![!API Sessions - user and user role setup](../images/api-sessions/api-sessions-user-role-select.png)

Once you configured parameters to be used for user and his/her role identification, these parameters are started to be filled for the sessions. You can filter sessions by users and roles.

![!API Sessions - user and user role display](../images/api-sessions/api-sessions-user-role-display.png)

### Mitigation controls

[Mitigation controls](../about-wallarm/mitigation-controls-overview.md) are capable of adding more parameters to session context, for example, the **BOLA protection** mitigation control may want to use the `object_id` parameter as [tracked for enumeration](../api-protection/enumeration-attack-protection.md#enumerated-parameters) or as [filter for scope](../api-protection/enumeration-attack-protection.md#scope-filters); if such parameter is not added in **API Sessions** → **Session context parameters**, it can be added directly in mitigation control configuration: in API Session, it will be added hidden, meaning you will see these parameters in session details if they are presented in requests, but you will not see them in **Session context parameters** configuration.

Hidden parameters do not take anything from 20 parameter quota. Parameters are hidden to avoid their deletion as such deletion can lead to ceasing protection provided by mitigation control.

## Enabling JA3 fingerprinting

It is recommended to enable [JA3 fingerprinting](../admin-en/enabling-ja3.md#overview) for better identification of the unauthenticated traffic.

## Data protection

For API Sessions, from node to the Cloud, Wallarm only exports parameters selected by you. If they contain sensitive data, be sure to hash it before exporting. Note that hashing will transform the actual value into unreadable - the presence of parameter and particular but unknown value will provide the limited information for the analysis.

To hash the sensitive parameters, once they are added in Wallarm Console → **API Sessions** → **Session context parameters**, select the **Hashing (secret)** option for them.

Wallarm hashes the selected parameters before export.

## Analyzed traffic

API Sessions analyze all traffic that Wallarm node is enabled to secure to organize it into sessions. You can contact the [Wallarm support team](mailto:support@wallarm.com) to request limiting analysis to the selected applications/hosts.

## Storage period

The **API Sessions** section stores and displays sessions for the last week. The older sessions are deleted to provide an optimal performance and resource consumption.
