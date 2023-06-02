The Wallarm node interacts with the Wallarm Cloud. To connect the filtering node to the Cloud:

1. If the [postanalytics module installed separately][install-postanalytics-instr]:

    1. Copy the node token generated during the separate postanalytics module installation.
    1. Proceed to the 5th step in the list below. It is **recommended** to use one token for the node processing initial traffic and for the node performing postanalysis.
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
    
    * `<NODE_TOKEN>` is the copied token value.
    * You may add `-n <HOST_NAME>` parameter to set a custom name for your node instance. Final instance name will be: `HOST_NAME_NodeUUID`.

!!! info "Using one token for several installations"
    You can connect several Wallarm nodes to the Cloud using one token regardless of the selected deployment option. This option allows logical grouping of node instances in the Wallarm Console UI:

    ![!Node with several instances][img-node-with-several-instances]
    
    Below are some examples when you can choose to use one token for several installations:

    * You deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer
    * The nodes for initial traffic processing and postanalytics modules are installed on separate servers - it is **recommended** to connect these modules to the Wallarm Cloud using the same node token
