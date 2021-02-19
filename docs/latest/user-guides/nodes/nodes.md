# WAF nodes overview

The **Nodes** section of Wallarm UI allows you to manage WAF nodes:

* View properties and metrics of installed WAF nodes
* Regenerate the token for cloud WAF nodes
* Delete WAF nodes
* Create new WAF nodes

![!WAF nodes](../../images/user-guides/nodes/table-nodes.png)

!!! info "Administrator access"
    The creating, deleting, and regenerating of WAF nodes/tokens is only available to users with the **Administrator** role. Viewing the details of installed WAF nodes is available to all users.

## WAF node types

The WAF node type depends on the platform:

* [Regular node](regular-node.md) is used in Linux‑based, Kubernetes sidecar, and Docker‑based deployments.
* [Cloud node](cloud-node.md) is used in cloud‑based deployments on Amazon AWS, Google Cloud Platform, and in Kubernetes Ingress controller deployments.

Detailed information regarding working with different WAF node types can be found in the instructions linked above. 

## Filtering WAF nodes

To filter displayed WAF nodes, you can enter the name, UUID, token, or IP address of the node in the search field or use the tabs:

* **All** with active and inactive regular and cloud nodes.
* **Regular** with active and inactive [regular nodes](regular-node.md).
* **Cloud** with active and inactive [cloud nodes](cloud-node.md).
* **Inactive** with inactive regular and cloud nodes. WAF node is inactive if it is installed for the inactive instance.