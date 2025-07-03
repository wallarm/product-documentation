# IBM API Connect for wizard

The Wallarm Edge node can be connected to your IBM DataPower in [synchronous](../inline/overview.md) mode to inspect traffic before it reaches the managed APIs - without blocking any requests.

Follow the steps below to set up the connection.

**Apply the Wallarm policies to APIs in IBM API Connect**

1. Download the provided code bundle for your platform.

--8<-- "../include/waf/installation/connectors/ibm-apply-policies.md"

**Integrate Wallarm inspection steps into the assembly pipeline**

--8<-- "../include/waf/installation/connectors/ibm-assembly-pipeline.md"

**Publish your product with the updated API**

--8<-- "../include/waf/installation/connectors/ibm-publish-product.md"

[Read more](ibm-api-connect.md)

<style>
  h1#ibm-api-connect-for-wizard {
    display: none;
  }
</style>
