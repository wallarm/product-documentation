# Fastly for wizard

The Wallarm Edge node can be connected to Fastly running your APIs in either [synchronous](../inline/overview.md) or [asynchronous](../oob/overview.md) mode - without blocking any requests.

Follow the steps below to set up the connection.

**Deploy Wallarm code on Fastly**

1. Download the provided code bundle for your platform.

--8<-- "../include/waf/installation/connectors/fastly-deploy-code.md"

**Specify Wallarm Node's and backend's hosts**

--8<-- "../include/waf/installation/connectors/fastly-hosts.md"

**Create the Wallarm config store**

--8<-- "../include/waf/installation/connectors/fastly-config-store.md"

[Read more](fastly.md)

<style>
  h1#fastly-for-wizard {
    display: none;
  }
</style>