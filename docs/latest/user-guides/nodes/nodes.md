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

!!! warning "Removed regular and cloud types of nodes"
    Starting from the release 4.6, only the [**Wallarm node** type is available](../../updating-migrating/what-is-new.md#removal-of-the-email-password-based-node-registration).

    **Wallarm node** utilizes a unified approach to registering and configuring in [any supported environment](../../installation/supported-deployment-options.md).

## Creating a node

Wallarm filtering node creation includes:

1. Deploying new node itself
1. Connecting new node to Wallarm Cloud

Read below a brief description of each element and a procedure explaining how they can be differently done together.

### Deploying new node itself

Install your new node to the [convenient environment](../../admin-en/supported-platforms.md).

### Connecting new node to Wallarm Cloud

The Wallarm filtering node interacts with the Wallarm Cloud. To provide the node with access to Wallarm Cloud API, you need to generate a token on the Cloud side and use it on the machine with the node. Use **API tokens** (recommended) or **node tokens** for this purpose:

* [**API tokens**](../settings/api-tokens.md) with `Deploy` role when:

    * The Wallarm node will scale in your infrastructure, while the number of node groups is not known in advance (node groups will be constantly added/removed).
    * You need to control the lifecycle of the token (you can specify the expiration date or disable API tokens which makes them more secure).

* **Node tokens** when you know in advance what node groups will be presented. Use **Nodes** → **Create node** to create and name the node group, then use group's token for every node you want to include.

!!! info "Autoscaling support"
    Both token types support the node autoscaling feature available in some clouds/installation variants.

### Procedure

To create a Wallarm node:

=== "With API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Find or create API token with the `Deploy` source role.
    1. Copy this token.
    1. Deploy new node to the [convenient environment](../../admin-en/supported-platforms.md) using your API token.

=== "With node token"

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or  [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

        ![!Wallarm node creation](../../images/user-guides/nodes/create-cloud-node.png)

        !!! info "The multi-tenant option"
            The **multi-tenant** option allows using Wallarm to protect several independent company infrastructures or isolated environments simultaneously. [Read more](../../installation/multi-tenant/overview.md)

            You can switch a node to the multi-tenant mode either during its creation or from the existing node's menu.
    1. Copy the generated token.
    1. Deploy new node to the [convenient environment](../../admin-en/supported-platforms.md) using your node token.

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

In Wallarm, node instances are named as `hostname_NodeUUID`, where: 

* `hostname` is the name of the working machine on which the node instance is launched
* `NodeUUID` is the unique node identifier (UUID)

You can set `hostname` manually during node installation using the `-n` parameter in `register-node` script.

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
