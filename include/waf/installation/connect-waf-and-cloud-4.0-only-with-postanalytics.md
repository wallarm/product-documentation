The filtering node interacts with the Wallarm Cloud. To connect the node to the Cloud:

1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [EU Cloud](https://my.wallarm.com/settings/users) or [US Cloud](https://us1.my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [EU Cloud](https://my.wallarm.com/nodes) or [US Cloud](https://us1.my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation][img-create-wallarm-node]
1. Copy the generated token.
1. Run the `register-node` script in a system with the filtering node:
    
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    
    `<NODE_TOKEN>` is the copied token value.
