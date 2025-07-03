In your API specification, within the `x-ibm-configuration.assembly.execute` section, add or update the following steps to route traffic through the Wallarm Node:

1. Before the `invoke` step, add the `wallarm_pre` step to proxy incoming requests to the Wallarm Node.
1. Ensure that the `invoke` step is configured as follows:
    
    * The `target-url` should follow the format `$(target-url)$(request.path)?$(request.query-string)`. This ensures that requests are proxied to the original backend path along with any query parameters.
    * `header-control` and `parameter-control` allow all headers and parameters to pass through. This enables the Wallarm Node to analyze the full request, detect attacks in any part of it, and accurately build the API inventory.
1. After the `invoke` step, Add the `wallarm_post` step to proxy responses to the Wallarm Node for inspection.

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
