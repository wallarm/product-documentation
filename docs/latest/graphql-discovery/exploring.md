# Exploring GraphQL API Inventory

As soon as [GraphQL Discovery](overview.md) has built the catalog of your GraphQL endpoints (your GraphQL API inventory), you can explore it in Wallarm Console. Learn from this article how to go through the discovered data.

## Endpoints

Explore your discovered GraphQL API inventory (services, endpoints and their operations) using the **GraphQL Discovery** section in the [US](https://us1.my.wallarm.com/api-discovery) or [EU](https://my.wallarm.com/api-discovery) Cloud.

![Endpoints discovered by GraphQL Discovery](../images/about-wallarm-waf/graphql-discovery/graphql-discovery.png)

Each time you open the **GraphQL Discovery** section, you see all discovered GraphQL endpoints and [changes](overview.md#tracking-changes) among their operations for the last week. With **Changes since** filter, you can change `Last week` to any other period.

## Operation details

Under each GraphQL endpoint, the set of its discovered operations (queries, mutations, subscriptions) is displayed. By clicking the operation, you can find its details, including parameters of requests and responses, and GraphQL schema:

![GraphQL Discovery - operation details](../images/about-wallarm-waf/graphql-discovery/graphql-discovery-operation-details.png)

Each request/response parameter information includes:

* Parameter name
* Type (string, etc.)
* Presence and type of [sensitive data](overview.md#sensitive-data) transmitted by this parameter
* Information about parameter changes (new, unused, etc.)
* Date and time when parameter was last seen in action
