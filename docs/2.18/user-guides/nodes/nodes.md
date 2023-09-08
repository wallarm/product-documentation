# Filtering nodes overview

The **Nodes** section of Wallarm UI allows you to manage filtering nodes:

* View properties and metrics of installed nodes
* Regenerate the token for nodes
* Rename nodes
* Delete nodes
* Create new nodes

![Nodes](../../images/user-guides/nodes/table-nodes.png)

!!! info "Administrator access"
    The creating, deleting, and regenerating of Wallarm nodes/tokens is only available to users with the **Administrator** role. Viewing the details of installed nodes is available to all users.

## Filtering node types

The Wallarm node type depends on the platform:

* [Wallarm node](cloud-node.md) (earlier - **cloud node**) is used in cloud‑based deployments on Amazon AWS, Google Cloud Platform, and in Kubernetes Ingress controller deployments.
* [Regular node](regular-node.md) is used in Linux‑based, Kubernetes sidecar, and Docker‑based deployments.

Detailed information regarding working with different node types can be found in the instructions linked above. 

## Filtering the nodes

To filter displayed nodes, you can enter the name, UUID, token, or IP address of the node in the search field or use the tabs:

* **Regular nodes** with active and inactive [regular nodes](regular-node.md).
* **Wallarm nodes** with active and inactive [Wallarm nodes](cloud-node.md).
* **Inactive** with inactive regular nodes and Wallarm nodes. Filtering node is inactive if it is installed for the inactive instance.
