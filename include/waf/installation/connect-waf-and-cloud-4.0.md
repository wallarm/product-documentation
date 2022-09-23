!!! info "If the postanalytics module is installed on a separate server"
    If the initial traffic processing and postanalytics modules are installed on separate servers, it is recommended to connect these modules to the Wallarm Cloud using the same node token. The Wallarm Console UI will display each module as a separate node instance, e.g.:

    ![!Node with several instances][img-node-with-several-instances]

    The Wallarm node has already been created during the [separate postanalytics module installation][install-postanalytics-instr]. To connect the initial traffic processing module to the Cloud using the same node credentials:

    1. Copy the node token generated during the separate postanalytics module installation.
    1. Proceed to the 4th step in the list below.

The Wallarm node interacts with the Wallarm Cloud. To connect the filtering node to the Cloud:

1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [US Cloud](https://us1.my.wallarm.com/settings/users) or [EU Cloud](https://my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation][img-create-wallarm-node]
1. Copy the generated token.
1. Run the `register-node` script in a system with the filtering node:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>` is the copied token value.

    !!! info "If the postanalytics module is installed on a separate server"
        If the postanalytics module is installed on a separate server, it is recommended to use the node token generated during the [separate postanalytics module installation][install-postanalytics-instr].