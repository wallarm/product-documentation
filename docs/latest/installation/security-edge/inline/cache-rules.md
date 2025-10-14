# Cache Rules in Security Edge Inline <a href="../../../../about-wallarm/subscription-plans/#security-edge-paid-plan"><img src="../../../../images/security-edge-tag.svg" style="border: none;"></a>


Cache rules help improve the performance, reliability, and efficiency of your APIs protected by Wallarm Security Edge Inline.

By storing responses to frequent requests, cache rules reduce load on your backend servers, lower response times, and improve user experience — especially for endpoints that return the same data repeatedly (like configuration files, product catalogs, or public resources).

With caching managed at the edge, you also reduce bandwidth usage and avoid unnecessary processing of identical requests by your application layer. This allows your infrastructure to stay more responsive under high load or during traffic spikes.

Wallarm gives you fine-grained control over caching behavior through cache rules, letting you define:

Which hosts and endpoints to cache

How long responses stay in the cache (TTL)

Memory limits and size estimates for better resource management

Use cache rules to offload repetitive traffic and make your protected APIs faster and more efficient — without compromising on security.








You can add cache rules during or after Edge Node deployment.

1. Go to Wallarm Console → **Security Edge** → **Inline** → **Configure** → **Cache rules** and click **Add cache rule**.
1. In the dropdown lists, select the host and location the rule will be applied to.
1. Under "TTL (seconds)", specify how long to store each cached response (e.g., `3600`).

    Use shorter TTLs for locations with frequently changing data, and longer TTLs for static or rarely updated content.

1. Under "Max size (MiB)", specify the maximum size of cached data for the rule (e.g., `1024`).

    When this limit is reached, older cached responses are automatically removed to make room for new ones.

1. Under "Avg item size (KiB), specify the estimated average size of a single cached response.

    This value helps the system estimate memory use. It does not limit actual item size or affect caching behavior if responses are larger. If unsure, use a typical response size (e.g. 5–10 KiB for API responses).

1. Click **Add cache rule**.   

The added rule appears in the list of cache rules and is automatically active.



To deactivate a rule without deleting it, toggle it off.
