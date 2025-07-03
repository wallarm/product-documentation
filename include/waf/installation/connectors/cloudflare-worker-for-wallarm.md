1. [Create a Cloudflare worker](https://developers.cloudflare.com/workers/get-started/dashboard/) using the downloaded code.
1. Set the Wallarm node URL in the `wallarm_node` parameter.
1. If using [asynchronous (out-of-band)](../oob/overview.md) mode, set the `wallarm_mode` parameter to `async`.
1. If required, modify [other parameters](cloudflare.md#configuration-options).

    ![Cloudflare worker](../../images/waf-installation/gateways/cloudflare/worker-deploy.png)
1. In **Website** → your domain, go to **Workers Routes** → **Add route**:

    * In **Route**, specify the paths to be routed to Wallarm for analysis (e.g., `*.example.com/*` for all paths).
    * In **Worker**, select the Wallarm worker you created.

    ![Cloudflare add route](../../images/waf-installation/gateways/cloudflare/add-route.png)
