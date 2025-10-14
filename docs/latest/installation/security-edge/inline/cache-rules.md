# Cache Rules in Security Edge Inline <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>

Cache rules are settings that define how the Security Edge node stores and reuses responses from specific hosts and locations.

When cache rules are configured, the system stores and reuses responses to frequent requests instead of reprocessing them. This reduces load on your backend servers, lowers response times, and improves user experience — especially for endpoints that return the same data repeatedly (e.g., configuration files or static content).

Cache rules give you fine-grained control over caching by defining:

* Which hosts and locations to cache
* How long responses stay in the cache (TTL)
* Memory limits and size estimates for better resource management

## Requirements

Cache rules are supported starting from Edge Node version 6.6.1.

## Creating a cache rule

You can add cache rules during or after Edge Node deployment.

1. Go to Wallarm Console → **Security Edge** → **Inline** → **Configure** → **Cache rules** and click **Add cache rule**.
1. In the dropdown lists, select the host and location the rule will apply to.
1. Under **TTL (seconds)**, specify how long to store each cached response (e.g., `3600`).

    Use shorter TTLs for locations with frequently changing data and longer TTLs for static or rarely updated content.

1. Under **Max size (MiB)**, specify the maximum size of cached data for the rule (e.g., `1024`).

    When this limit is reached, older cached responses are automatically removed to make room for new ones.

1. Under **Avg item size (KiB)**, specify the estimated average size of a single cached response.

    This value helps the system estimate memory usage. It does not limit actual item size or affect caching if responses are larger. If unsure, use 64 KiB as the default.

1. Click **Add cache rule**.   

![Add a cache rule](../../../images/configuration-guides/cache-rules/add-cache-rule.png)

The added rule appears in the list of cache rules and is automatically activated.

## Clearing a cache rule

Clearing a cache rule removes all cached responses for this rule without deleting or deactivating it.

It be useful in the following situations:

* Backend data has changed, and users need to immediately receive fresh responses instead of outdated cached ones.
* Host or location behavior has changed (e.g., a new API version or an updated response format).
* You need to temporarily free up cache memory without changing rule settings.

After clearing, new responses are cached again automatically as matching requests arrive.

1. Go to Wallarm Console → **Security Edge** → **Inline** → **Configure** → **Cache rules**.
1. Click the ![Clear cache rule](../../../images/configuration-guides/cache-rules/clear-cache-icon.png) icon next to the rule you want to clear, and then click **Clear**.

## Deactivating a cache rule

If you no longer need a cache rule, you can deactivate it temporarily and activate it again later.

1. Go to Wallarm Console → **Security Edge** → **Inline** → **Configure** → **Cache rules**.
1. Under **Active**, toggle off the rule you want to deactivate.

## Deleting a cache rule

If you no longer need a cache rule permanently, you can delete it. To use the same configuration later, you will need to recreate the rule.

1. Go to Wallarm Console → **Security Edge** → **Inline** → **Configure** → **Cache rules**.
1. Click the ![Delete cache rule](../../../images/configuration-guides/cache-rules/delete-cache-rule-icon.png) icon next to the rule you want to delete, and then click **Delete**.
