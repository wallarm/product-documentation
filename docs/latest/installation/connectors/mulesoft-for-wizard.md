# MuleSoft for wizard

The Wallarm Edge node can be connected to your MuleSoft APIs in [synchronous](../inline/overview.md) mode to inspect traffic before it reaches the APIs - without blocking any requests.

Follow the steps below to set up the connection.

**Upload the Wallarm policy to MuleSoft Exchange**

1. Download the provided code bundle for your platform.

--8<-- "../include/waf/installation/connectors/mulesoft-upload-policy.md"

**Attach the Wallarm policy to your API**

--8<-- "../include/waf/installation/connectors/mulesoft-attach-policy.md"

![Wallarm policy](../../images/waf-installation/gateways/mulesoft/policy-setup.png)

[Read more](mulesoft.md)

<style>
  h1#mulesoft-for-wizard {
    display: none;
  }
</style>