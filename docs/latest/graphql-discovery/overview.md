# GraphQL Discovery Overview

Wallarm's **GraphQL Discovery** builds your application GraphQL API inventory based on the actual API usage. GraphQL Discovery continuously analyzes the real traffic requests and builds the API inventory based on the analysis results.

Requires [API Discovery](../api-discovery/setup.md) and [NGINX node 5.3.0 and higher](../updating-migrating/node-artifact-versions.md) or [Native node 0.12.0 and higher](../updating-migrating/native-node/node-artifact-versions.md).

## Overview

The built GraphQL API inventory includes the following elements:

* GraphQL services and their API endpoints
* Endpoints' operations (queries, mutations, subscriptions)
* For each operation:

    * Parameters of requests and responses
    * GraphQL schema

![GraphQL Discovery](../images/about-wallarm-waf/graphql-discovery/graphql-discovery.png)

## Addressed issues

**Building an actual and complete inventory of GraphQL APIs** is the main issue GraphQL Discovery addresses.

Since the GraphQL Discovery uses the real traffic as a data source, it helps to get up-to-date and complete GraphQL API documentation by registering all endpoints that are actually processing the requests.

**As you have your GraphQL API inventory discovered by Wallarm, you can**:

* Have a full visibility into the whole  GraphQL API estate.
* Filter GraphQL APIs that consume and carry [sensitive data](#sensitive-data).
* Position your GraphQL APIs in time:

    * Track APIs discovered recently (from today to last 3 months).
    * Track when listed APIs were last seen in action
    * [Track changes](#tracking-changes) in GraphQL API that took place within the selected period.

## Sensitive data

GraphQL Discovery automatically detects and highlights sensitive data consumed and carried by your GraphQL APIs:

* Technical data like IP and MAC addresses
* Login credentials like secret keys and passwords
* Financial data like bank card numbers
* Medical data like medical license number
* Personally identifiable information (PII) like full name, passport number or SSN

## Tracking changes

If changes occur in your API, GraphQL Discovery updates the built GraphQL API inventory, highlights the changes and gives you information on when and what has changed.

Each time you open the **GraphQL Discovery** section, the **Changes since** filter goes to the `Last week` state, which means the changes occurred within the last week are highlighted. To change the time period, redefine the filter dates.

In the operation list, the following marks highlight the changes in API:

* **New** for the operations added to the list within the period.
* **Changed** for the operations that have newly discovered request or response parameters or parameters that obtained the `Unused` status within the period. In the details of the endpoint such parameters will have a corresponding mark.

    * A parameter gets the `New` status if is is discovered within the period.
    * A parameter gets the `Unused` status if it does not pass any data for 7 days. 
    * If later the parameter in the `Unused` status passes data again it will lose the `Unused` status.

* **Unused** for the operations that obtained the `Unused` status within the period.

    * An operation gets the `Unused` status if it is not requested (with the code 200 in response) for 7 days.
    * If later the operation in the `Unused` status is requested (with the code 200 in response) again it will lose the `Unused` status.

* **Unchanged** means no changes within the period.

## Enabling

To start using GraphQL Discovery, contact the [Wallarm support team](https://support.wallarm.com).
