# GraphQL Policies

While offering flexibility and efficiency, GraphQL also introduces the unique security challenges such as DoS attacks and potential information disclosures. This document describes how to use Wallarm to protect your APIs from [GraphQL malicious exploitation](../../attacks-vulns-list.md#graphql-attack) by setting limits for the GraphQL requests.

Security professionals, whether they are officers overseeing overarching security protocols or analysts in SOC centers, may find themselves in a predicament. While they can recommend security policies for GraphQL servers, they often lack the direct server access to enforce or verify these measures. This gap leaves businesses vulnerable, especially when rapid response to threats like GraphQL DoS attacks is crucial. Coordinating with development teams for every security tweak is not only time-consuming but can also lead to delays in threat mitigation.

By default, Wallarm does not prevent GraphQL from malicious exploitation. To enable and configure GraphQL protection, set your organization's GraphQL policy in the **Detect GraphQL attacks** [rule](../../user-guides/rules/rules.md) (requires node 4.10.3 of higher). If requests break policies, the filtering node handles them as per the [filtration mode](../../admin-en/configure-wallarm-mode.md).

## Creating and applying the rule

To set and apply GraphQL policy:

1. Proceed to Wallarm Console → **Rules** → **Add rule**.
1. In **If request is**, [describe](rules.md#branch-description) the scope to apply the rule to.
1. In **Then**, choose **Detect GraphQL attacks** and set thresholds for GraphQL requests:

    * **Maximum total query size in bytes** - maximum allowed size for a complete GraphQL query.
    * **Maximum value size in bytes** - maximum size for any individual value (variable or query parameter) in a GraphQL query.
    * **Maximum query depth** - maximum allowed depth for a GraphQL query.
    * **Maximum number of aliases** - maximum number of aliases that can be used in a single GraphQL query.
    * **Maximum batched queries** - maximum number of batched queries that can be sent in a single request.
    * **Introspection queries** - if enabled, introspection requests that can reveal the structure of your GraphQL schema will be registered as attack.
    * **Debug mode** - if enabled, requests with debug mode parameter will be registered as attack. This is useful when developers left debug mode turned on and attackers can gather precious information from excessive error reporting messages.
        
        ![GraphQL thresholds](../../images/user-guides/rules/graphql-rule.png)

        If left empty/unselected, no limitation is applied by this criteria.

1. Wait for the [rule compilation to complete](rules.md#ruleset-lifecycle).

    When the rule is active, if any of threshold is exceeded by some request, the filtering node will [handle](#reaction-to-policy-violation) this request in accordance with the filtration mode.

## Reaction to policy violation

Reaction to the policy violation is defined by the [filtration mode](../../admin-en/configure-wallarm-mode.md) applied to the endpoints targeted by the rule.

If yor are not satisfied with the filtration mode inherited by your endpoints from parent endpoints/domains/applications, for your particular locations, you can switch between **Blocking** (`block`) and **Monitoring** (`monitoring`) modes using different [methods](../../admin-en/configure-wallarm-mode.md#methods-of-the-filtration-mode-configuration) of the filtration mode configuration.

For example, if the higher level filtration mode is `block` and you want to test GraphQL policy before applying it in blocking mode, you need to override it by setting filtration mode to `monitoring` specifically for your `/graphql` routes. Consider however that this mode will influence all attacks for this route including SQLi, XSS, RCE, etc.

## Exploring detected GraphQL attacks

You can explore GraphQL policy violations (GraphQL attacks) in Wallarm Console → **Attacks** section. Use `graphql_attacks` search key or select `GraphQL attacks` from the **Type** filter.

![GraphQL attacks](../../images/user-guides/rules/graphql-attacks.png)

<!--## Rule examples

TBD
-->