# Cloud WAF nodes

The cloud WAF node is used in cloud‑based deployments on Amazon AWS, Google Cloud Platform, Heroku, and in Kubernetes Ingress controller deployments.

## Creating WAF node

You can create a cloud node while setting up integration with the platform or using the following instructions:

1. Open Wallarm UI → **Nodes**.
2. Click **Create node** and select **Cloud node**.
3. Enter node name and click **Create WAF node**.

    ![!Creating cloud node](../../images/user-guides/nodes/create-cloud-node.png)
4. Copy the token of the created cloud node. You can also copy the token from the node card.
    ![!Copying cloud node](../../images/user-guides/nodes/copy-cloud-node-token.png)
5. To complete the node installation, follow the instructions for your respective platfrom:
    * [Amazon AWS](../../admin-en/installation-ami-en.md)
    * [Google Cloud Platfrom](../../admin-en/installation-gcp-en.md)
    * [Heroku](../../admin-en/installation-heroku-en.md)
    * [NGINX Ingress controller](../../admin-en/installation-kubernetes-en.md)
    * [NGINX Plus Ingress controller](../../admin-en/installation-guides/ingress-plus/introduction.md)

## Viewing details of WAF node

Details of installed the WAF node are displayed in the table and card of each WAF node. To open the card, click the appropriate table record.

The following node properties and metrics are available:

* Node name that was given to the node upon creation
* The average number of requests per second (RPS)
* Node IP address
* Unique node identifier (UUID)
* Token of the cloud WAF node
* Time of the last synchronization of the WAF node and Wallarm cloud
* Date of the WAF node creation
* Number of requests processed by the node in the current month

![!Cloud WAF node card](../../images/user-guides/nodes/view-cloud-node.png)

If one cloud WAF node is installed for multiple instances, then the corresponding number of WAF nodes is grouped into one record in the table. Properties and metrics will be available for each instance.

## Regenerating the token for cloud WAF node

Token regeneration creates a new token for the node. 

1. Open Wallarm UI → **Nodes**.
2. Click **Regenerate token** in the cloud node menu or card.
3. If the cloud node is already installed in your infrastructure, copy the new token value and specify it within the installed node settings.

![!Regenerating cloud node token](../../images/user-guides/nodes/generate-new-token.png)

## Deleting WAF node

When the WAF node is deleted, filtration of requests to your application will be stopped. Deleting the WAF node cannot be undone. The WAF node will be deleted from the list of nodes permanently.

1. Open Wallarm UI → **Nodes**.
2. Select one or more WAF nodes and click **Delete**. You can also delete the WAF node by selecting a button off the node menu or node card.
3. Confirm the action.

![!Deleting the node](../../images/user-guides/nodes/delete-node.png)