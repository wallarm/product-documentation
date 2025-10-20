* When deploying the Wallarm service with the `LoadBalancer` type using the [Helm chart][helm-chart-native-node], a **trusted** SSL/TLS certificate is required for the domain. Self-signed certificates are not yet supported.
* [Custom blocking page and blocking code][custom-blocking-page] configurations are not yet supported.
    
    All [blocked](../../admin-en/configure-wallarm-mode.md) malicious traffic is returned with status code `403` and the default block page.
* [Rate limiting][rate-limiting] by Wallarm rules is not supported.
    
    Rate limiting cannot be enforced on the Wallarm side for this connector. If you need rate limiting, use the features built into your API gateway or cloud platform.
* [Multitenancy][multi-tenancy] is not supported on Security Edge hosting, but it is supported for a self-hosted node deployed with the connector.
