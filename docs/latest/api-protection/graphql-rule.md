# GraphQL API Protection <a href="../subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm detects regular attacks (SQLi, RCE, [etc.](../attacks-vulns-list.md)) in GraphQL by default even under the basic [WAAP](../about-wallarm/subscription-plans.md) subscription plan. However, some aspects of the protocol allow implementing [GraphQL specific](../attacks-vulns-list.md#graphql-attack) attacks related to excessive information exposure and DoS. This document describes how to use Wallarm to protect your APIs from these attacks by setting **GraphQL policy** - a set of limits for the GraphQL requests.

Being the extended protection, GraphQL API Protection is the part of the advanced [API Security](../about-wallarm/subscription-plans.md) subscription plan. When plan is purchased, start protection by setting your organization's GraphQL policy in the **Detect GraphQL attacks** [rule](../user-guides/rules/rules.md) (requires node 4.10.3 of higher).

When policy is configured, the filtering node will [handle](#reaction-to-policy-violation) GraphQL requests exceeding  limits in accordance with the filtration mode.

## Supported GraphQL formats

GraphQL queries are typically sent as HTTP POST requests to a GraphQL server endpoint. The request includes a `CONTENT-TYPE` header to specify the media type of the body sent to the server. For `CONTENT-TYPE`, the `application/json` and `application/graphql` are two commonly used options, but `text/plain` and `multipart/form-data` can also occur.

GraphQL queries can be also sent as HTTP GET requests. In such case, the query is included as a query parameter in the URL. While GET requests can be used for GraphQL queries, it's less common than the POST requests, especially for the more complex queries. The cause of that is that GET requests are typically used for idempotent operations (i.e., operations that can be repeated without different outcomes), and they have length restrictions that can be problematic for longer queries. Also, encoding a complex query as a URL might be challenging due to the URL's character limitations.

Wallarm supports both POST and GET HTTP methods for GraphQL requests.

## Creating and applying the rule

To set and apply GraphQL policy:

1. Proceed to Wallarm Console → **Rules** → **Add rule**.
1. In **If request is**, [describe](../user-guides/rules/rules.md#rule-branches) endpoint URI to apply the rule to and other conditions:

    * URI of your GraphQL endpoint
    * POST or GET method - see [Supported GraphQL formats](#supported-graphql-formats); leave method unspecified if your want the rule to set the same limitations both for POST and GET requests
    * Set the `CONTENT-TYPE` header value - see [Supported GraphQL formats](#supported-graphql-formats)

        Note that you can set when the rule must be applied using different condition combinations, for example, you can use URI and leave other conditions unspecified or set `CONTENT-TYPE` header to `application/graphql` without specifying any endpoint. You can also create several rules with different conditions and set different limits and reactions in them.

1. In **Then**, choose **Detect GraphQL attacks** and set thresholds for GraphQL requests in accordance with your traffic metrics:

    * **Maximum total query size in kilobytes** - sets the upper limit for the size of an entire GraphQL query. It's crucial for preventing Denial of Service (DoS) attacks that exploit server resources by submitting excessively large queries.
    * **Maximum value size in kilobytes** - sets the maximum size for any individual value (whether a variable or query parameter) within a GraphQL query. This limit helps mitigate attacks that attempt to overwhelm the server through Excessive Value Length, where attackers send requests with overly long string values for variables or arguments.
    * **Maximum query depth** - determines the maximum allowed depth for a GraphQL query. By limiting query depth, the server can avoid performance issues or resource exhaustion from maliciously crafted, deeply nested queries.
    * **Maximum number of aliases** - sets the limit on the number of aliases that can be used in a single GraphQL query. Restricting the number of aliases prevents Resource Exhaustion and DoS attacks that exploit alias functionality to create overly complex queries.
    * **Maximum batched queries** - caps the number of batched queries that can be sent in a single request. This parameter is essential for thwarting batching attacks, where attackers combine multiple operations into a single request to bypass security measures like rate limiting.
    * **Block/register introspection queries** - when enabled, the server will treat introspection requests—which can reveal the structure of your GraphQL schema—as potential attacks. Disabling or monitoring introspection queries is a crucial measure for protecting the schema from being exposed to attackers.
    * **Block/register debug requests** - enabling this option means that requests containing the debug mode parameter will be considered potential attacks. This setting is useful for catching instances where debug mode is inadvertently left enabled in production, preventing attackers from accessing excessive error reporting messages that could reveal sensitive information about the backend.

        For example, a policy may set maximum POST request query size to 100 KB, value size to 10 KB, query depth and batched query limits to 10, aliases to 5, plus deny introspection and debug queries as displayed on the screenshot (note that these are the example values - you should define your own values considering statistics of your common legitimate GraphQL queries):
        
        ![GraphQL thresholds](../images/user-guides/rules/graphql-rule.png)

        If left empty/unselected, no limitation is applied by this criteria.

1. Wait for the [rule compilation and uploading to the filtering node to complete](../user-guides/rules/rules.md#ruleset-lifecycle).

## Reaction to policy violation

Reaction to the policy violation is defined by the [filtration mode](../admin-en/configure-wallarm-mode.md) applied to the endpoints targeted by the rule.

Sometimes you may be not satisfied with the filtration mode inherited from parent endpoints. In that case, for your particular locations, you can switch between **Blocking** (`block`) and **Monitoring** (`monitoring`) modes using different [methods](../admin-en/configure-wallarm-mode.md#methods-of-the-filtration-mode-configuration) of the filtration mode configuration.

For example, if the higher level filtration mode is `block` and you want to test GraphQL policy before applying it in blocking mode, you need to override it by setting filtration mode to `monitoring` specifically for your `/graphql` routes.

!!! warning "Risk of setting milder mode"
    Consider that `monitoring` mode affects not only GraphQL, but all attacks for this route including SQLi, XSS, RCE, etc. It is not recommended to keep a [milder mode](../admin-en/configure-wallarm-mode.md#available-filtration-modes) for a long time.


## Exploring GraphQL attacks

You can explore GraphQL policy violations (GraphQL attacks) in Wallarm Console → **Attacks** section. Use the following [search keys](../user-guides/search-and-filters/use-search.md#search-by-attack-type) / filters:

| Type | Search key | Filter |
| ------- | ----------------- | --------------------- |
| All GraphQL attacks | `graphql_attacks` | `GraphQL attacks` |
| Total query size exceeded | `gql_doc_size` | `GraphQL query size` |
| Value size exceeded | `gql_value_size` | `GraphQL value size` |
| Query depth exceeded | `gql_depth` | `GraphQL query depth` |
| Number of aliases exceeded | `gql_aliases`| `GraphQL aliases` |
| Number of batched queries exceeded | `gql_docs_per_batch` | `GraphQL batching` |
| Forbidden introspection query | `gql_introspection` | `GraphQL introspection` |
| Forbidden debug mode query | `gql_debug` | `GraphQL debug` |


![GraphQL attacks](../images/user-guides/rules/graphql-attacks.png)

## Rule examples

### Setting policy for your GraphQL endpoints to block attacks

Let us say you want to set limits for the requests to your application GraphQL endpoints located under `example.com/graphql` to block all potential [GraphQL specific](../attacks-vulns-list.md#graphql-attack) attacks to them. Filtration mode for `example.com` is `monitoring`.

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
