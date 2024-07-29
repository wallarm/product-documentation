# Wallarm nodes

The **Nodes** section of the Wallarm Console UI allows you to manage the nodes of the **Wallarm node** and [**CDN node**](cdn-node.md) types. This article is about Wallarm nodes.

Wallarm node modules should be deployed to the customer's environment for Wallarm to mitigate the malicious traffic. Wallarm node operates as a proxy by mitigating malicious requests and forwarding legitimate requests to the protected resource.

Wallarm node UI management options:

* Create new nodes
* View properties and metrics of installed nodes
* Regenerate node tokens
* Rename nodes
* Delete nodes

![Nodes](../../images/user-guides/nodes/table-nodes.png)

!!! info "Administrator access"
    The creating, deleting, and regenerating of Wallarm nodes/tokens is only available to users with the **Administrator** or **Global Administrator** role. Viewing the details of installed nodes is available to all users.

!!! warning "Removed regular and cloud types of nodes"
    Starting from the release 4.6, only the [**Wallarm node** type is available](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens).

    **Wallarm node** utilizes a unified approach to registering and configuring in [any supported environment](../../installation/supported-deployment-options.md).

## Creating a node

To create a Wallarm node using the [appropriate token](#api-and-node-tokens-for-node-creation):

=== "With API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Deploy` source role.
    1. Copy this token.
    1. Deploy new node to the [convenient environment](../../installation/supported-deployment-options.md) using your API token. After node registering, it will automatically appear in the **Nodes** section of Wallarm Console.

=== "With node token"

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

        ![Wallarm node creation](../../images/user-guides/nodes/create-cloud-node.png)
    
    1. Copy the generated token.
    1. Deploy new node to the [convenient environment](../../installation/supported-deployment-options.md) using your node token.

!!! info "The multi-tenant option"
    The **multi-tenant** option allows using Wallarm to protect several independent company infrastructures or isolated environments simultaneously. [Read more](../../installation/multi-tenant/overview.md)

    === "API token installation"

        You can switch a node to the multi-tenant mode after installation from the existing node's menu.

    === "Node token installation"
    
        You can switch a node to the multi-tenant mode either during its creation or from the existing node's menu.

## Viewing details of a node

Details of installed the filtering node are displayed in the table and card of each filtering node. To open the card, click the appropriate table record.

The following node properties and metrics are available:

* Node name that was given to the node upon creation
* The average number of requests per second (RPS)
* Node IP address
* Unique node identifier (UUID)
* Token of the Wallarm node (visible only for users with the **Administrator** or **Global Administrator** [role](../settings/users.md))
* Time of the last synchronization of the filtering node and Wallarm Cloud
* Date of the filtering node creation
* Number of requests processed by the node in the current month, you can also **View events from this node for the day** (switches to the **Attacks** section)
* Versions of used LOM and proton.db
* Versions of installed Wallarm packages, NGINX, and Envoy (if any)

![Node card](../../images/user-guides/nodes/view-wallarm-node.png)

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

![Regenerating node token](../../images/user-guides/nodes/generate-new-token.png)

## Deleting a node

When the node is deleted, filtration of requests to your application will be stopped. Deleting the filtering node cannot be undone. The node will be deleted from the list of nodes permanently.

1. Open Wallarm Console → **Nodes**.
1. Select one or more nodes and click **Delete**. You can also delete the filtering node by selecting a button of the node menu or node card.
1. Confirm the action.

## API and node tokens for node creation

The Wallarm filtering node interacts with the Wallarm Cloud. To provide the node with access to Wallarm Cloud API, you need to generate a token on the Cloud side and use it on the machine with the node. Use **API tokens** (recommended) or **node tokens** for this purpose:

* [**API tokens**](../settings/api-tokens.md) with the `Deploy` role when:

    * The number of node groups used to logically organize nodes in UI is not known in advance (node groups will be constantly added/removed - with API tokens you will be able to easily manage these groups with the `WALLARM_LABELS` variable setting the `group` label value).
    * You need to control the lifecycle of the token (you can specify the expiration date or disable API tokens which makes them more secure).

        !!! info "API tokens are not supported by some deployment options"
            API tokens currently cannot be used for [Kong Ingress controllers](../../installation/kubernetes/kong-ingress-controller/deployment.md) and AWS deployments based on [Terraform module](../../installation/cloud-platforms/aws/terraform-module/overview.md). Use node tokens instead.

* **Node tokens** when you know in advance what node groups will be presented. Use **Nodes** → **Create node** to create and name the node group. During node deployment, use group's token for every node you want to include into the group.

!!! info "Autoscaling support"
    Both token types support the node autoscaling feature available in some clouds/installation variants.
