1. Get Wallarm token of the [appropriate type][wallarm-token-types]:

    === "API token"

        1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
        1. Find or create API token with the `Node deployment/Deployment` usage type.
        1. Copy this token.

    === "Node token"

        1. Open Wallarm Console → **Nodes** in the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
        1. Do one of the following: 
            * Create the node of the **Wallarm node** type and copy the generated token.
            * Use existing node group - copy token using node's menu → **Copy token**.