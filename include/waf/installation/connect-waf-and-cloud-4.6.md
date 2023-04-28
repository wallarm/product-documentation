The Wallarm filtering node interacts with the Wallarm Cloud. You need to connect the node to the Cloud. When connecting, you can set the node name, under which it will be displayed in the Wallarm Console UI and put the node into the appropriate **node group** (used to logically organize nodes in UI).

![!Grouped nodes][img-grouped-nodes]

To provide the node with access, you need to generate a token on the Cloud side and specify it on the machine with the node packages.

There are the following token types available:

* [API token][api-token] with `Deploy` role - use this token when:

    * The Wallarm node will scale in your infrastructure, while the number of node groups is not known in advance (node groups will be constantly added/removed).
    * You need to control the lifecycle of the token (you can specify the expiration date or disable API tokens which makes them more secure).

* [Node token][node-token] - use this token when you know in advance what node groups will be presented. Use **Nodes** → **Create node** to create and name the node group, then use group's token for every node you want to include.

!!! info "Autoscaling support"
    Both token types support the node autoscaling feature available in some clouds/installation variants.

To generate a token and connect the node to the Cloud:

1. If the [postanalytics module installed separately][install-postanalytics-instr]:

    1. Copy the node token generated during the separate postanalytics module installation.
    1. Proceed to the 3rd step (node token variant) in the list below. It is **recommended** to use one token for the node processing initial traffic and for the node performing postanalysis.
1. Make sure that your Wallarm account has the **Administrator** role enabled in Wallarm Console.
     
    You can check mentioned settings by navigating to the users list in the [US Cloud](https://us1.my.wallarm.com/settings/users) or [EU Cloud](https://my.wallarm.com/settings/users).

    ![!User list in Wallarm console][img-wl-console-users]
1. Connect node using token of the appropriate type:

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