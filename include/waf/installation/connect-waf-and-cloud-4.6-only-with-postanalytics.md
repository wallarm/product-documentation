The filtering node interacts with the Wallarm Cloud. To connect the node to the Cloud:

1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [US Cloud](https://us1.my.wallarm.com/settings/users) or [EU Cloud](https://my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.

    ![!Wallarm node creation][img-create-wallarm-node]
1. Copy the generated token.
1. Run the `register-node` script in a system with the filtering node:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN>
        ```
    
    `<TOKEN>` is the copied value of the node token or API token with the `Deploy` role.

    !!! info "Using one token for several installations"
        You have two options for using one token for several installations:

        * **For all node versions**, you can use one [**node token**][node-token] in several installations regardless of the selected [platform][platform]. It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.
        * **Starting from node 4.6**, for nodes grouping, you can use one [**API token**][api-token] with the `Deploy` role together with the `--labels 'group=<GROUP>'` flag, for example:
        
            `sudo /usr/share/wallarm-common/register-node -t <API TOKEN WITH DEPLOY ROLE> --labels 'group=<GROUP>'`