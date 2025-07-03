Create the `wallarm_config` config defining Wallarm-specific settings:

1. Go to **Fastly** UI → **Resources** → **Config stores** → **Create a config store** and create the `wallarm_config` store with the following key-value items:

    | Parameter | Description | Required? |
    | --------- | ----------- | --------- |
    | `WALLARM_BACKEND` | Host name for the Wallarm Node instance specified in Compute service settings. | Yes |
    | `ORIGIN_BACKEND` | Host name for the backend specified in Compute service settings. | Yes |
    | `WALLARM_MODE_ASYNC` | Enables traffic [copy](../oob/overview.md) analysis without affecting the original flow (`true`) or inline analysis (`false`, default). | No |

    [More parameters](fastly.md#configuration-options)
1. **Link** the config store to the Wallarm Compute service.

![](../../images/waf-installation/gateways/fastly/config-store.png)
