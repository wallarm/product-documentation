The filtering node interacts with the Wallarm Cloud. To connect the node to the Cloud:

1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation][img-create-wallarm-node]
1. Copy the generated token.
1. Run the `register-node` script on a machine where you install the filtering node:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>` is the copied token value.

    !!! info "Using one token for several installations"
        You can use one token in several installations regardless of the selected [platform][deployment-platform-docs]. It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.