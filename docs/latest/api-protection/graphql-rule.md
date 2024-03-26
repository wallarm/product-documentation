# GraphQL Policy <a href="../subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm detects regular attacks (SQLi, RCE, [etc.](../attacks-vulns-list.md)) in GraphQL by default even under the basic [WAAP](../about-wallarm/subscription-plans.md) subscription plan. However, the protocol has peculiarities that allow implementing [GraphQL specific](../attacks-vulns-list.md#graphql-attack) attacks related to excessive information exposure and DoS. This document describes how to use Wallarm to protect your APIs from these attacks by setting **GraphQL Policy** - a set of limits for the GraphQL requests.

Being the extended protection, GraphQL Policy is the part of the advanced [API Security](../about-wallarm/subscription-plans.md) subscription plan. When plan is purchased, start protection by setting your organization's GraphQL Policy in the **Detect GraphQL attacks** [rule](../user-guides/rules/rules.md) (requires node 4.10.3 of higher).

Wallarm supports all available GraphQL formats:

* Both `GET` and `POST` methods
* For the `POST` method, `Content-Type`:
    * `application/json` and `application/graphql` that are common
    * `text/plain` and `multipart/form-data` that can occur

When policy is configured, the filtering node will [handle](#reaction-to-policy-violation) GraphQL requests exceeding  limits in accordance with the filtration mode.

## Creating and applying the rule

To set and apply GraphQL policy:

1. Proceed to Wallarm Console → **Rules** → **Add rule**.
1. In **If request is**, [describe](../user-guides/rules/rules.md#rule-branches) endpoint URI to apply the rule to and other conditions.
1. In **Then**, choose **Detect GraphQL attacks** and set thresholds for GraphQL requests in accordance with your traffic peculiarities:

    * **Maximum total query size in kilobytes** - an attacker may attempt to perform a Denial of Service (DoS) or cause other issues by exploiting how the server handles excessively large inputs.
    * **Maximum value size in kilobytes** - an attacker may send request with an excessively long string value for a variable or argument to overwhelm the server's resources (Excessive Value Length attack).
    * **Maximum query depth** - queries can be nested, which allows requesting complex data structures in one go; however, this flexibility can be exploited to create a deeply nested query that could potentially overwhelm the server.
    * **Maximum number of aliases** - aliases offer the capability to rename the result fields to prevent conflicts and enable better data organization; however, an attacker may exploit this feature to launch a Resource Exhaustion or Denial of Service (DoS) attack.
    * **Maximum batched queries** - multiple queries (operations) can be batched together in a single HTTP-request; by combining multiple operations into a single request, an attacker organize batching attack and try to bypass security measures such as rate limiting.
    * **Block/register introspection queries** - an attacker may leverage the introspection system to uncover details about the schema of the GraphQL API; by querying the system, an attacker may potentially gain knowledge about all types, queries, mutations, and fields that are available in the API, and use this data to construct more precise and damaging queries. Select the option to deny the introspection queries.
    * **Block/register debug requests** - when debug mode is left turned on by developers, an attacker may gather precious information from excessive error reporting messages such as entire stack traces or tracebacks. Select the option to deny requests with the `debug=1` parameter in URI.

        For example, a policy may set maximum POST request query size to 3 KB, value size to 2 KB, query depth, aliases and batched query limits to 5 plus deny introspection and debug queries as displayed on the screenshot (note that these are the example values - you should define your own values considering statistics of your common legitimate GraphQL queries):
        
        ![GraphQL thresholds](../images/user-guides/rules/graphql-rule.png)

        If left empty/unselected, no limitation is applied by this criteria.

1. Wait for the [rule compilation to complete](../user-guides/rules/rules.md#ruleset-lifecycle).

You can configure several **Detect GraphQL attacks** rules for different [branches](../user-guides/rules/rules.md#rule-branches) or endpoints.

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
