# MuleSoft Flex for wizard

The Wallarm Edge node can be connected to your MuleSoft Flex Gateway in either [synchronous](../inline/overview.md) and [asynchronous](../oob/overview.md) mode - without blocking any requests.

Follow the steps below to set up the connection.

**1. Upload the Wallarm policy to MuleSoft Exchange**

1. Download the provided code bundle for your platform.
1. Extract the policy archive.
1. Ensure the machine you will use to publish the policy meets [all necessary requirements](mulesoft-flex.md#requirements).
1. Navigate to MuleSoft Anypoint Platform → **Access Management** → **Business Groups** → choose your organization → copy its **business group ID**.
1. In the extracted policy directory → `Cargo.toml` → `[package.metadata.anypoint]` → `group_id`, specify the copied group ID:

    ```toml
    ...
    [package.metadata.anypoint]
    group_id = "<BUSINESS_GROUP_ID>"
    definition_asset_id = "wallarm-custom-policy"
    implementation_asset_id = "wallarm-custom-policy-flex"
    ...
    ```
1. [Authenticate with Anypoint CLI](https://docs.mulesoft.com/anypoint-cli/latest/auth) in the same terminal session where you are working with the policy:

    ```
    anypoint-cli-v4 conf username <USERNAME>
    anypoint-cli-v4 conf password '<PASSWORD>'
    ```
1. Build and publish the policy:

    ```bash
    make setup      # Installs dependencies and PDK CLI
    make build      # Builds the policy
    make release    # Publishes a new production version of the policy to Anypoint
    ```

Your custom policy is now available in your MuleSoft Anypoint Platform Exchange.

**2. Attach the Wallarm policy to your API**

You can attach the Wallarm policy to either an individual API or all APIs.

1. To apply the policy to an individual API, navigate to Anypoint Platform → **API Manager** → select the desired API → **Policies** → **Add policy**.
1. To apply the policy to all APIs, go to Anypoint Platform → **API Manager** → **Automated Policies** → **Add automated policy**.
1. Choose the Wallarm policy from Exchange.
1. Specify the Wallarm node URL including `http://` or `https://` in the `wallarm_node` parameter.
1. If necessary, modify [other parameters](mulesoft-flex.md#configuration-options).
1. Apply the policy.

[More details](mulesoft-flex.md)

<style>
  h1#mulesoft-flex-for-wizard {
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

  .md-tabs {
    display: none;
  }

  [id^="inkeep-widget-"] {
    display: none
  }
</style>