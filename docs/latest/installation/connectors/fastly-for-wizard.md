# Fastly for wizard

The Wallarm Edge node can be connected to Fastly running your APIs in either [synchronous](../inline/overview.md) or [asynchronous](../oob/overview.md) mode - without blocking any requests.

Follow the steps below to set up the connection.

**Deploy Wallarm code on Fastly**

1. Download the provided code bundle for your platform.
1. Go to **Fastly** UI → **Account** → **API tokens** → **Personal tokens** → **Create token**:

    * Type: Automation token
    * Scope: Global API access
    * Leave other settings at their default unless specific changes are required
1. Go to **Fastly** UI → **Compute** → **Compute services** → **Create service** → **Use a local project** and create an instance for Wallarm.
1. Once created, copy the generated `--service-id`.
1. Go to the local directory containing the Wallarm package and deploy it:

    ```
    fastly compute deploy --service-id=<SERVICE_ID> --package=wallarm-api-security.tar.gz --token=<FASTLY_TOKEN>
    ```

    The success message:

    ```
    SUCCESS: Deployed package (service service_id, version 1)
    ```

**Specify Wallarm Node's and backend's hosts**

For proper traffic routing for analysis and forwarding, you need to define the Wallarm Node and backend hosts in the Fastly service configuration:

1. Go to **Fastly** UI → **Compute** → **Compute services** → Wallarm service → **Edit configuration**.
1. Go to **Origins** and **Create hosts**:

    * Add the Wallarm node URL as the `wallarm-node` host to route traffic to the Wallarm node for analysis.
    * Add your backend address as another host (e.g., `backend`) to forward traffic from the node to your origin backend.
1. **Activate** the new service version.

**Create the Wallarm config store**

Create the `wallarm_config` config defining Wallarm-specific settings:

1. Go to **Fastly** UI → **Resources** → **Config stores** → **Create a config store** and create the `wallarm_config` store with the following key-value items:

    * `WALLARM_BACKEND`: Host name for the Wallarm Node instance specified in Compute service settings.
    * `ORIGIN_BACKEND`: Host name for the backend specified in Compute service settings.
    * `WALLARM_MODE_ASYNC`: Enables traffic [copy](../oob/overview.md) analysis without affecting the original flow (`true`) or inline analysis (`false`, default).

    [More parameters](fastly.md#configuration-options)
1. **Link** the config store to the Wallarm Compute service.

[More details](fastly.md)

<style>
  h1#fastly-for-wizard {
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
</style>