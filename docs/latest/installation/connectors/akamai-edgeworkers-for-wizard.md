# Akamai for wizard

You can connect the Wallarm Edge node to Akamai to inspect traffic in either [synchronous](../inline/overview.md) or [asynchronous](../oob/overview.md) mode - without blocking any requests.

Follow the steps below to set up the connection.

**1. Create EdgeWorkers from Wallarm bundles**

1. Download the provided code bundle for your platform.
1. Go to Akamai Control Center → **EdgeWorkers** → **Create EdgeWorker ID**, then import the code bundle `wallarm-main`.
1. Create another EdgeWorker ID and import the `wallarm-sp` bundle.

**2. Create the Wallarm Node property** 

1. In Akamai Property Manager, create a new property:

    * **Property name / hostname**: the dedicated Node hostname (e.g., `node.customer.com`). This hostname must belong to a DNS zone you control.
    * **Property type**: `Dynamic Site Accelerator`.
    * **Origin type**: `Web server`.
    * **Origin Hostname**: Wallarm node URL.
1. Configure TLS for the property:

    * Either select an **Akamai Managed Certificate** (Akamai will issue and maintain a certificate for `node.customer.com`), or
    * Upload your own certificate if required.
1. Save the property. Akamai will generate an Edge Hostname, e.g. `node.customer.com.edgesuite.net`.
1. In your DNS zone, create a CNAME record pointing your Node hostname to the Edge Hostname, e.g. `node.customer.com → node.customer.com.edgesuite.net`.
1. [Activate the property in staging](https://techdocs.akamai.com/property-mgr/docs/activate-stage), verify functionality, then [activate in production](https://techdocs.akamai.com/property-mgr/docs/activate-prod).

**3. Configure variables in the origin property**

Open your existing origin property → **Edit New Version** and configure the following variables:

* `PMUSER_WALLARM_NODE`: the property name that you have created for the `wallarm-main` EdgeWorker.
* `PMUSER_WALLARM_HEADER_SECRET`: arbitrary secret string (e.g., `aj8shd82hjd72hs9`). The specified value is passed as the request header `x-wlrm-checked` when the EdgeWorker forwards a request back into the same property. This prevents loops and blocks requests with fake headers.
* `PMUSER_WALLARM_ASYNC`: if using [asynchronous (out-of-band)](../oob/overview.md) mode, set the variable to `true`.

If necessary, modify [other variables](akamai-edgeworkers.md#4-configure-variables-in-the-origin-property).

**4. Add Wallarm EdgeWorker rule**

In the origin property, create a new blank rule:

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    does not exist
    ```
* Behavior: EdgeWorkers → the `wallarm-main` EdgeWorker

**5. Add spoofing-prevention rule**

In the origin property, create another new blank rule:

* Criteria:

    ```
    If 
    Request Header 
    x-wlrm-checked
    exists
    ```
* Behavior: EdgeWorkers → the `wallarm-sp` EdgeWorker

**6. Save and activate the property**

1. Save the new origin property version.
1. [Activate it in the staging environment](https://techdocs.akamai.com/property-mgr/docs/activate-stage).
1. After verification, [activate in production](https://techdocs.akamai.com/property-mgr/docs/activate-prod).

[More details](akamai-edgeworkers.md)

<style>
  h1#akamai-for-wizard {
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