To grant access to its API, Wallarm provides tokens that can be used for request authorization. Wallarm provides tokens of two types: **API tokens** and **node tokens**.

To grant access for third party clients, use **API tokens**.

The Wallarm filtering node interacts with the Wallarm Cloud. To provide the node with access, you need to generate a token on the Cloud side and use it on the machine with the node. Use **API tokens** (recommended) or **node tokens** for this purpose:

* **API tokens** with `Deploy` role when:

    * The Wallarm node will scale in your infrastructure, while the number of node groups is not known in advance (node groups will be constantly added/removed).
    * You need to control the lifecycle of the token (you can specify the expiration date or disable API tokens which makes them more secure).

* **Node tokens** when you know in advance what node groups will be presented. Use **Nodes** → **Create node** to create and name the node group, then use group's token for every node you want to include.

!!! info "Autoscaling support"
    Both token types support the node autoscaling feature available in some clouds/installation variants.