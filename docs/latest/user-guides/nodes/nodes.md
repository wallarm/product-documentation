# Wallarm nodes

The **Nodes** section of the Wallarm Console UI allows you to manage the nodes of the **Wallarm node** and [**CDN node**](cdn-node.md) types. This article is about Wallarm nodes.

Wallarm node modules should be deployed to the customer's environment for Wallarm to mitigate the malicious traffic. Wallarm node operates as a proxy by mitigating malicious requests and forwarding legitimate requests to the protected resource.

Wallarm node UI management options:

* Create new nodes
* View properties and metrics of installed nodes
* Regenerate node tokens
* Rename nodes
* Delete nodes

![!Nodes](../../images/user-guides/nodes/table-nodes.png)

!!! info "Administrator access"
    The creating, deleting, and regenerating of Wallarm nodes/tokens is only available to users with the **Administrator** role. Viewing the details of installed nodes is available to all users.

!!! warning "Regular and cloud node types"
    Before the release of version 4.0, the Wallarm node could be either of the regular or cloud type. Starting from the new release, the [regular type was deprecated and the cloud type was renamed to **Wallarm node**](../../updating-migrating/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens).

    **Wallarm node** utilizes a unified approach to registering and configuring in [any supported environment](../../admin-en/supported-platforms.md).

## Creating a node

To create a Wallarm node:

1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation](../../images/user-guides/nodes/create-cloud-node.png)
1. Copy the generated token.
1. Deploy the created node to the [convenient environment](../../admin-en/supported-platforms.md) using the generated token.

## Viewing details of a node

Details of installed the filtering node are displayed in the table and card of each filtering node. To open the card, click the appropriate table record.

The following node properties and metrics are available:

* Node name that was given to the node upon creation
* The average number of requests per second (RPS)
* Node IP address
* Unique node identifier (UUID)
* Token of the Wallarm node
* Time of the last synchronization of the filtering node and Wallarm Cloud
* Date of the filtering node creation
* Number of requests processed by the node in the current month
* Versions of used LOM and proton.db
* Versions of installed Wallarm packages, NGINX, and Envoy (if any)

![!Node card](../../images/user-guides/nodes/view-wallarm-node.png)

If one Wallarm node is installed for multiple instances (e.g. for the initial traffic processing and request postanalytics performed by different server instances), then the corresponding number of filtering nodes is grouped into one record in the table. Properties and metrics will be available for each instance.

## Regenerating the node token

Token regeneration creates a new token for the node. 

1. Open Wallarm Console → **Nodes**.
2. Click **Regenerate token** in the node menu or card.
3. If the node is already installed in your infrastructure, copy the new token value and specify it within the installed node settings.

![!Regenerating node token](../../images/user-guides/nodes/generate-new-token.png)

## Deleting a node

When the node is deleted, filtration of requests to your application will be stopped. Deleting the filtering node cannot be undone. The node will be deleted from the list of nodes permanently.

1. Open Wallarm Console → **Nodes**.
2. Select one or more nodes and click **Delete**. You can also delete the filtering node by selecting a button of the node menu or node card.
3. Confirm the action.
