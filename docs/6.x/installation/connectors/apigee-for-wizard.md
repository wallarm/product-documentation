# Apigee for wizard

You can connect the Wallarm Edge node to Apigee API Management to inspect traffic in either [synchronous](../inline/overview.md) or [asynchronous](../oob/overview.md) mode - without blocking any requests.

Follow the steps below to set up the connection.

**1. Create a key value map in Apigee**

Define the `WallarmConfig` [key value map (KVM)](https://cloud.google.com/apigee/docs/api-platform/cache/key-value-maps) to store Wallarm connector configuration:

1. Create the `WallarmConfig` KVM at the environment level using the following [Apigee API call](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.environments.keyvaluemaps/create):

    ```curl
    curl -X POST \
      -H "Authorization: Bearer $(gcloud auth print-access-token)" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "WallarmConfig",
        "encrypted": true
      }' \
      "https://apigee.googleapis.com/v1/organizations/<APIGEE_ORG_ID>/environments/\
      <APIGEE_ENV>/keyvaluemaps"
    ```

    `<APIGEE_ORG_ID>` - the Google Cloud project name, `<APIGEE_ENV>` - the Apigee environment.
1. Add the `node_url` entry with the full domain name of your Wallarm Node including protocol (e.g., `https://wallarm-node-instance.com`) to the `WallarmConfig` KVM using the following [Apigee API call](https://cloud.google.com/apigee/docs/reference/apis/apigee/rest/v1/organizations.environments.keyvaluemaps.entries/create):

    ```curl
    curl -X POST \
      -H "Authorization: Bearer $(gcloud auth print-access-token)" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "node_url",
        "value": "<WALLARM_NODE_URL>"
      }' \
      "https://apigee.googleapis.com/v1/organizations/<APIGEE_ORG_ID>/environments/\
      <APIGEE_ENV>/keyvaluemaps/WallarmConfig/entries"
    ```

**2. Deploy Wallarm shared flows**

Each traffic analysis mode (synchronous or asynchronous) requires 2 shared flows: one for requests and one for responses.

1. Download the provided code bundle for your platform.
1. In Google Cloud Console → **Proxy development** → **Shared flows**, **Upload bundle** from `Wallarm-Sync-Request-Flow.zip` for synchronous mode or from `Wallarm-Async-Request-Flow.zip` for asynchronous mode.
1. **Deploy** the uploaded flow. 
1. In the same section, upload the corresponding response flow archive (`Wallarm-Sync-Response-Flow.zip` or `Wallarm-Async-Response-Flow.zip`).
1. **Deploy** the response shared flow.

**3. Apply shared flows to your APIs**

You can apply the Wallarm shared flows globally to all API proxies in an environment, or attach them only to specific API proxies.

To enable the connector for **all proxies in an environment**, attach the Wallarm flows as flow hooks:

1. Proceed to Google Cloud Console → **Management** → **Environments** → select your environment → **Flow hooks**.
1. Assign the deployed Wallarm flows:

    * **Pre-proxy** → `Wallarm-Sync-Request-Flow` for synchronous mode or `Wallarm-Async-Request-Flow` for asynchronous mode.
    * **Post-proxy** → `Wallarm-Sync-Response-Flow` for synchronous mode or `Wallarm-Async-Response-Flow` for asynchronous mode.

To attach the Wallarm shared flows only to **specific API proxies**, use the `Flow Callout` policies:

1. Proceed to Google Cloud Console → **Proxy development** → **API proxies** → select the API proxy to protect → **Policies** → **Add policy**.
1. Create the request policy:

    * Policy type: `Flow Callout`
    * Name and Display name: `FC-Wallarm-Node-Request`
    * Sharedflow: `Wallarm-Sync-Request-Flow` for synchronous mode or `Wallarm-Async-Request-Flow` for asynchronous mode
1. Create the response policy:

    * Policy type: `Flow Callout`
    * Name and Display name: `FC-Wallarm-Node-Response`
    * Sharedflow: `Wallarm-Sync-Response-Flow` for synchronous mode or `Wallarm-Async-Response-Flow` for asynchronous mode
1. Attach the policies to the proxy flows:

    * **Request → PreFlow** → select `FC-Wallarm-Node-Request`
    * **Response → PostFlow** → select `FC-Wallarm-Node-Response`
1. Add `FC-Wallarm-Node-Response` with `<AlwaysEnforce>true</AlwaysEnforce>` to the default fault rule of your proxy.

    When a proxy returns 4xx/5xx, Apigee skips the `PostFlow` by default. Adding the policy to the fault rule ensures the response is still sent to the Wallarm Node.

    ```xml
    ...
      <FaultRules/>
      <DefaultFaultRule name="DefaultFaultRule">
        <AlwaysEnforce>true</AlwaysEnforce>
        <Step>
          <Name>FC-Wallarm-Node-Response</Name>
        </Step>
      </DefaultFaultRule>
    ...
    ```
1. **Save** and **Deploy** a new API proxy revision.

[More details](apigee.md)

<style>
  h1#apigee-for-wizard {
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