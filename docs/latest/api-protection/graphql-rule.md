[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# GraphQL API Protection <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm detects regular attacks (SQLi, RCE, [etc.](../attacks-vulns-list.md)) in GraphQL [by default](../user-guides/rules/request-processing.md#gql) even under the basic [WAAP](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription plan. However, some aspects of the protocol allow implementing [GraphQL-specific](../attacks-vulns-list.md#graphql-attacks) attacks related to excessive information exposure and DoS. This document describes how to use Wallarm to protect your APIs from these attacks by setting **GraphQL policy** - a set of limits for the GraphQL requests.

Being the extended protection, GraphQL API Protection is the part of the advanced [API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription plan. When plan is purchased, start protection by setting your organization's GraphQL policy in the **Detect GraphQL attacks** [rule](../user-guides/rules/rules.md) (requires node 4.10.4 of higher).

## Supported GraphQL formats

GraphQL queries are typically sent as HTTP POST requests to a GraphQL server endpoint. The request includes a `CONTENT-TYPE` header to specify the media type of the body sent to the server. For `CONTENT-TYPE`, Wallarm supports:

* commonly used options: `application/json` and `application/graphql` 
* options that can also occur: `text/plain` and `multipart/form-data`

GraphQL queries can be also sent as HTTP GET requests. In such case, the query is included as a query parameter in the URL. While GET requests can be used for GraphQL queries, it's less common than the POST requests, especially for the more complex queries. The cause of that is that GET requests are typically used for idempotent operations (i.e., operations that can be repeated without different outcomes), and they have length restrictions that can be problematic for longer queries.

Wallarm supports both POST and GET HTTP methods for GraphQL requests.

## Creating and applying the rule

GraphQL rule is recommended to be created for the GraphQL specific endpoints. Creating it as a [default](../user-guides/rules/rules.md#default-rules) rule for the entire system is not recommended.

To set and apply GraphQL policy:

--8<-- "../include/rule-creation-initial-step.md"
1. Choose **Mitigation controls** → **GraphQL API protection**.
1. In **If request is**, [describe](../user-guides/rules/rules.md#rule-branches) endpoint URI to apply the rule to and other conditions:

    * URI of your GraphQL endpoint (in the route, usually contains `/graphql`)
    * POST or GET method - see [Supported GraphQL formats](#supported-graphql-formats); leave method unspecified if you want the rule to set the same limitations both for POST and GET requests
    * Set the `CONTENT-TYPE` header value - see [Supported GraphQL formats](#supported-graphql-formats)

        Note that you can set when the rule must be applied using different condition combinations, for example, you can use URI and leave other conditions unspecified or set `CONTENT-TYPE` header to `application/graphql` without specifying any endpoint. You can also create several rules with different conditions and set different limits and reactions in them.

1. Set thresholds for GraphQL requests in accordance with your traffic metrics (if left empty/unselected, no limitation is applied by this criteria):

    * **Maximum total query size in kilobytes** - sets the upper limit for the size of an entire GraphQL query. It's crucial for preventing Denial of Service (DoS) attacks that exploit server resources by submitting excessively large queries.
    * **Maximum value size in kilobytes** - sets the maximum size for any individual value (whether a variable or query parameter) within a GraphQL query. This limit helps mitigate attacks that attempt to overwhelm the server through Excessive Value Length, where attackers send requests with overly long string values for variables or arguments.
    * **Maximum query depth** - determines the maximum allowed depth for a GraphQL query. By limiting query depth, the server can avoid performance issues or resource exhaustion from maliciously crafted, deeply nested queries.
    * **Maximum number of aliases** - sets the limit on the number of aliases that can be used in a single GraphQL query. Restricting the number of aliases prevents Resource Exhaustion and DoS attacks that exploit alias functionality to create overly complex queries.
    * **Maximum batched queries** - caps the number of batched queries that can be sent in a single request. This parameter is essential for thwarting batching attacks, where attackers combine multiple operations into a single request to bypass security measures like rate limiting.
    * **Block/register introspection queries** - when enabled, the server will treat introspection requests—which can reveal the structure of your GraphQL schema—as potential attacks. Disabling or monitoring introspection queries is a crucial measure for protecting the schema from being exposed to attackers.
    * **Block/register debug requests** - enabling this option means that requests containing the debug mode parameter will be considered potential attacks. This setting is useful for catching instances where debug mode is inadvertently left enabled in production, preventing attackers from accessing excessive error reporting messages that could reveal sensitive information about the backend.

    By default, a policy sets maximum POST request query size to 100 KB, value size to 10 KB, query depth and batched query limits to 10, aliases to 5, plus deny introspection and debug queries as displayed on the screenshot (note that you can change default values to your own considering statistics of your common legitimate GraphQL queries):
        
    ![GraphQL thresholds](../images/user-guides/rules/graphql-rule.png)

Once created, the rule may be at any moment temporarily disabled and later re-enabled again using the **Mode** parameter of the rule.

## Reaction to policy violation

Reaction to the policy violation is defined by the [filtration mode](../admin-en/configure-wallarm-mode.md) applied to the endpoints targeted by the rule.

If you are using Wallarm in blocking mode and want to safely test GraphQL rules, you can easily enable monitoring mode for `/graphql` routes by creating a **Set filtration mode** rule [specifically](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console) for your GraphQL route. Note that this rule will apply to all attacks, including SQLi, XSS, etc., so it is not recommended to leave it for a long time.

![GraphQL policy blocking action](../images/user-guides/rules/graphql-rule-2-action.png)

Consider that you node configuration via the [`wallarm_mode_allow_override` directive](../admin-en/configure-wallarm-mode.md#prioritization-of-methods) may be set to ignore rules created in Wallarm Console. If this is a case, [explore](../admin-en/configure-wallarm-mode.md#configuration-methods) and use other ways to change the filtration mode.

## Exploring GraphQL attacks

You can explore GraphQL policy violations (GraphQL attacks) in Wallarm Console → **Attacks** section. Use the GraphQL specific [search keys](../user-guides/search-and-filters/use-search.md#graphql-tags) or corresponding filters:

![GraphQL attacks](../images/user-guides/rules/graphql-attacks.png)

### Setting policy for your GraphQL endpoints to block attacks

Let us say you want to set limits for the requests to your application GraphQL endpoints located under `example.com/graphql` to block all potential [GraphQL specific](../attacks-vulns-list.md#graphql-attacks) attacks to them. Filtration mode for `example.com` is `monitoring`.

To do so:

1. Set the **Detect GraphQL attacks** rule as displayed on the screenshot (note that these are the example values - for the real-life rules you should define your own values considering statistics of your common legitimate GraphQL queries):

    ![GraphQL Policy for your endpoints](../images/user-guides/rules/graphql-rule-1.png)

1. As filtration mode for `example.com` is `monitoring` and you want `block` for its GraphQL endpoints, configure the **Set filtration mode** rule as displayed on the screenshot:

    ![GraphQL policy blocking action](../images/user-guides/rules/graphql-rule-1-action.png)

### Altering policy for specific endpoints

Continuing the [previous](#setting-policy-for-your-graphql-endpoints-to-block-attacks) example, let us say you want to set stricter limits for `example.com/graphql/v2` child endpoint. As limits are stricter, before blocking anything, they should be tested in the `monitoring` mode.

To do so:

1. Set the **Detect GraphQL attacks** rule as displayed on the screenshot (note that these are the example values - for the real-life rules you should define your own values considering statistics of your common legitimate GraphQL queries):

    ![GraphQL stricter policy for child endpoint](/../images/user-guides/rules/graphql-rule-2.png)

1. As filtration mode for `example.com/graphql` is `block` and you want `monitoring` for `example.com/graphql/v2`, configure the **Set filtration mode** rule as displayed on the screenshot:

    ![GraphQL policy blocking action](../images/user-guides/rules/graphql-rule-2-action.png)
