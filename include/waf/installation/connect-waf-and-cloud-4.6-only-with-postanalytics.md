The Wallarm node interacts with the Wallarm Cloud. To connect the filtering node to the Cloud, you need to provide access of the node to the Wallarm Cloud API. This can be done using one of the tokens:

* [API token][api-token] with `Deploy` role  - use this token when:
    * The Wallarm node will scale in your infrastructure, while the number of groups is not known in advance (groups will be constantly added/removed).
    * You need to control the lifecycle of the token (you can specify the expiration date of API tokens).
* [Node token][node-token] - use this token when you do not plan to automatically scale the node (for example, DEB/ RPM), or if you know in advance what groups of nodes will be and you can create them manually via **Nodes** → **Create node**.

To connect the filtering node to the Cloud:

1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [US Cloud](https://us1.my.wallarm.com/settings/users) or [EU Cloud](https://my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Obtain token of the appropriate type:

    === "API token"
        1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
        1. Find or create API token with the `Deploy` source role.
        1. Copy this token.
    === "Node token"
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
    
    * `<TOKEN>` is the copied value of the node token or API token with the `Deploy` role.
    * You may add `-n <HOST_NAME>` parameter to set a custom name for your node instance. Final instance name will be: `HOST_NAME_NodeUUID`.

    <div class="admonition info"> <p class="admonition-title">Using one token for several installations</p> <p>You have two options for using one token for several installations:</p> <ul><li>**For all node versions**, you can use one [**node token**][node-token] in several installations regardless of the selected [platform][platform]. It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</li><li><p>**Starting from node 4.6**, for nodes grouping, you can use one [**API token**][api-token] with the `Deploy` role together with the `--labels 'group=<GROUP>'` flag, for example:</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <API TOKEN WITH DEPLOY ROLE> --labels 'group=<GROUP>'
    ```
    </p></li></div>