The Wallarm filtering node interacts with the Wallarm Cloud. You need to connect the node to the Cloud.

When connecting node to the Cloud, you can set the node name, under which it will be displayed in the Wallarm Console UI and put the node into the appropriate **node group** (used to logically organize nodes in UI).

![Grouped nodes][img-grouped-nodes]

To connect the node to the Cloud, use a Wallarm token of the [appropriate type][wallarm-token-types]:

=== "API token"

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Node deployment/Deployment` usage type.
    1. Copy this token.
    1. Run the `register-node` script on a machine where you install the filtering node:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>' -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> --labels 'group=<GROUP>'
            ```
        
        * `<TOKEN>` is the copied value of the API token with the `Deploy` role.
        * `--labels 'group=<GROUP>'` parameter puts your node to the `<GROUP>` node group (existing, or, if does not exist, it will be created). If you are installing filtering and postanalytics modules [separately][install-postanalytics-instr], it is recommended to put them into the same group.

=== "Node token"

    1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Do one of the following: 
        * Create the node of the **Wallarm node** type and copy the generated token.
        * Use existing node group - copy token using node's menu → **Copy token**.
    1. Run the `register-node` script on a machine where you install the filtering node:

        === "US Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN> -H us1.api.wallarm.com
            ```
        === "EU Cloud"
            ``` bash
            sudo /usr/share/wallarm-common/register-node -t <TOKEN>
            ```

    * `<TOKEN>` is the copied value of the node token. If you are installing filtering and postanalytics modules [separately][install-postanalytics-instr], it is recommended to put them into the same group using the same node token.

* You may add `-n <HOST_NAME>` parameter to set a custom name for your node instance. Final instance name will be: `HOST_NAME_NodeUUID`.