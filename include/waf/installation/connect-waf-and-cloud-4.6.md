The Wallarm node interacts with the Wallarm Cloud. To connect the filtering node to the Cloud:

1. If the [postanalytics module installed separately][install-postanalytics-instr]:

    1. Copy the node token generated during the separate postanalytics module installation.
    1. Proceed to the 5th step in the list below. It is **recommended** to use one token for the node processing initial traffic and for the node performing postanalysis.
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
    
    * `<TOKEN>` is the copied value of the node token or API token with the `Deploy` role.
    * You may add `-n <HOST_NAME>` parameter to set a custom name for your node instance. Final instance name will be: `HOST_NAME_NodeUUID`.

    <div class="admonition info"> <p class="admonition-title">Using one token for several installations</p> <p>You have two options for using one token for several installations:</p> <ul><li>**For all node versions**, you can use one [**node token**][node-token] in several installations regardless of the selected [platform][platform]. It allows logical grouping of node instances in the Wallarm Console UI. Example: you deploy several Wallarm nodes to a development environment, each node is on its own machine owned by a certain developer.</li><li><p>**Starting from node 4.6**, for nodes grouping, you can use one [**API token**][api-token] with the `Deploy` role together with the `--labels 'group=<GROUP>'` flag, for example:</p>
    ```
    sudo /usr/share/wallarm-common/register-node -t <API TOKEN WITH DEPLOY ROLE> --labels 'group=<GROUP>'
    ```
    </p></li></div>