# IBM API Connect for wizard

The Wallarm Edge node can be connected to your IBM DataPower in [synchronous](../inline/overview.md) mode to inspect traffic before it reaches the managed APIs - without blocking any requests.

Follow the steps below to set up the connection.

**1. Apply the Wallarm policies to APIs in IBM API Connect**

1. Download the provided code bundle for your platform.
1. Register the request inspection policy:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-pre.zip
    ```
1. Register the response inspection policy:

    ```
    apic policies:create \
        --scope <CATALOG OR SPACE> \
        --server <MANAGEMENT SERVER ENDPOINT> \
        --org <ORG NAME OR ID> \
        --catalog <CATALOG NAME OR ID> \
        --configured-gateway-service <GATEWAY SERVICE NAME OR ID> \
        /<PATH>/wallarm-post.zip
    ```

In most cases, the `configured-gateway-service` name is `datapower-api-gateway`.

**2. Integrate Wallarm inspection steps into the assembly pipeline**

In your API specification, within the `x-ibm-configuration.assembly.execute` section, add or update the following steps to route traffic through the Wallarm Node:

1. Before the `invoke` step, add the `wallarm_pre` step to proxy incoming requests to the Wallarm Node.
1. Ensure that the `invoke` step is configured as follows:
    
    * The `target-url` should follow the format `$(target-url)$(request.path)?$(request.query-string)`. This ensures that requests are proxied to the original backend path along with any query parameters.
    * `header-control` and `parameter-control` allow all headers and parameters to pass through. This enables the Wallarm Node to analyze the full request, detect attacks in any part of it, and accurately build the API inventory.
1. After the `invoke` step, add the `wallarm_post` step to proxy responses to the Wallarm Node for inspection.

```yaml hl_lines="8-22"
...
x-ibm-configuration:
  properties:
    target-url:
      value: <BACKEND_ADDRESS>
  ...
  assembly:
    execute:
      - wallarm_pre:
          version: 1.0.1
          title: wallarm_pre
          wallarmNodeAddress: <WALLARM_NODE_URL>
      - invoke:
          title: invoke
          version: 2.0.0
          verb: keep
          target-url: $(target-url)$(request.path)?$(request.query-string)
          persistent-connection: true
      - wallarm_post:
          version: 1.0.1
          title: wallarm_post
          wallarmNodeAddress: <WALLARM_NODE_URL>
...
```

**3. Publish your product with the updated API**

To apply changes to the traffic flow, re-publish the product that includes the modified API:

```
apic products:publish \
    --scope <CATALOG OR SPACE> \
    --server <MANAGEMENT SERVER ENDPOINT> \
    --org <ORG NAME OR ID> \
    --catalog <CATALOG NAME OR ID> \
    <PATH TO THE UPDATED PRODUCT YAML>
```

[More details](ibm-api-connect.md)

<style>
  h1#ibm-api-connect-for-wizard {
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
