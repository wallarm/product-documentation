# Regular filtering nodes

The regular filtering node is used in Linux‑based, Kubernetes sidecar and Docker‑based deployments.

## Creating a node

The regular filtering node is created while setting up integration with the platform:

* [NGINX](../../installation/nginx/dynamic-module.md)
* [NGINX Plus](../../installation/nginx-plus.md)
* [Docker](../../admin-en/installation-docker-en.md)
* [Kubernetes sidecar container](../../admin-en/installation-guides/kubernetes/wallarm-sidecar-container.md)
* [Kong](../../admin-en/installation-kong-en.md)

If the integration is successfully finished, then the created node will be displayed in the list of nodes in Wallarm UI.

## Viewing details of a node

To get the regular node list, please use the **node type** filter.

The details of the installed node are displayed in the table and card of each node. To open the card, click the appropriate table record.

The following node properties and metrics are available:

* Node name that was given to the node upon creation
* The average number of requests per second (RPS)
* Node IP address
* Unique node identifier (UUID)
* Time of the last synchronization of the filtering node and Wallarm cloud
* Date of the filtering node creation
* Number of requests processed by the node in the current month
* Versions of used LOM and proton.db
* Versions of installed Wallarm packages, NGINX, and Envoy (if any)
* Indicator of available component updates

![Regular node card](../../images/user-guides/nodes/view-regular-node-comp-vers.png)

## Deleting a node

When the filtering node is deleted, filtration of requests to your application will be stopped. The deleting of the filtering node cannot be undone. The Wallarm node will be deleted from the list of nodes permanently.

1. Open Wallarm UI → **Nodes**.
2. Select one or more nodes and click **Delete**. You can also delete the filtering node by selecting a button off the node menu or node card.
3. Confirm the action.
