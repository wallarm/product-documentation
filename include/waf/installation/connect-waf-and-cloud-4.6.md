The Wallarm filtering node interacts with the Wallarm Cloud. When connecting the filtering node to the Cloud, you can achieve the following:

* Provide filtering node with the access to the Wallarm Console's API.
* See the node in the Wallarm Console UI.
* Set the node name, under which it will be displayed in the Wallarm Console UI.
* Put the node into the appropriate **node group** (used to logically organize nodes in UI).

This can be done using one of the tokens:

* [API token][api-token] with `Deploy` role - use this token when:

    * The Wallarm node will scale in your infrastructure, while the number of node groups is not known in advance (node groups will be constantly added/removed).
    * You need to control the lifecycle of the token (you can specify the expiration date of API tokens).

* [Node token][node-token] - use this token when:

    * You do not plan to automatically scale the node (for example, DEB/ RPM).
    * You know in advance what node groups will be presented. Use **Nodes** → **Create node** to create and name the node group, then use group's token for every node you want to include.

    ![!API tokens vs node tokens][img-grouped-nodes]

To connect the filtering node to the Cloud:

1. If the [postanalytics module installed separately][install-postanalytics-instr]:

    1. Copy the node token generated during the separate postanalytics module installation.
    1. Proceed to the 5th step (node token variant) in the list below. It is **recommended** to use one token for the node processing initial traffic and for the node performing postanalysis.
1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [US Cloud](https://us1.my.wallarm.com/settings/users) or [EU Cloud](https://my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Register node using token of the appropriate type:

    === "API token"

        1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
        1. Find or create API token with the `Deploy` source role.
        1. Copy this token.
        1. Run the `register-node` script in a system with the filtering node:

            === "US Cloud"
                ``` bash
                    sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
                ```
            === "EU Cloud"
                ``` bash
                sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
                ```
            
        * `<TOKEN>` is the copied value of the API token with the `Deploy` role.
        * `--labels 'group=<GROUP>'` parameter puts your node to the `<GROUP>` node group (existing, or, if does not exist, it will be created).

    === "Node token"

        1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or  [EU Cloud](https://my.wallarm.com/nodes) and create the node of the **Wallarm node** type.
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
    
        * `<TOKEN>` is the copied value of the node token.

    * You may add `-n <HOST_NAME>` parameter to set a custom name for your node instance. Final instance name will be: `HOST_NAME_NodeUUID`.