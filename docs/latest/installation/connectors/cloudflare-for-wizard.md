# Cloudflare for wizard

You can connect the Wallarm Edge node to Cloudflare to inspect traffic in either [synchronous](../inline/overview.md) or [asynchronous](../oob/overview.md) mode - without blocking any requests.

Follow the steps below to set up the connection.

1. Download the provided code bundle for your platform.
1. [Create a Cloudflare worker](https://developers.cloudflare.com/workers/get-started/dashboard/) using the downloaded code.
1. Set the Wallarm node URL in the `wallarm_node` parameter.
1. If using [asynchronous (out-of-band)](../oob/overview.md) mode, set the `wallarm_mode` parameter to `async`.
1. If required, modify [other parameters](cloudflare.md#configuration-options).
1. In **Website** → your domain, go to **Workers Routes** → **Add route**:

    * In **Route**, specify the paths to be routed to Wallarm for analysis (e.g., `*.example.com/*` for all paths).
    * In **Worker**, select the Wallarm worker you created.

[More details](cloudflare.md)

<style>
  h1#cloudflare-for-wizard {
    display: none;
  }

  .md-footer {
    display: none;
  }

  .md-header {
    display: none;
  }

  .md-content__button {
    display: none;
  }

  .md-main {
    background-color: unset;
  }

  .md-grid {
    margin: unset;
  }

  button.md-top.md-icon {
    display: none;
  }

  .md-consent {
    display: none;
  }
</style>