# Azure APIM for wizard

You can connect the Wallarm Edge node to Azure API Management to inspect traffic in either [synchronous](../inline/overview.md) or [asynchronous](../oob/overview.md) mode - without blocking any requests.

Follow the steps below to set up the connection.

**1. Create named values in Azure**

Create the `WallarmNodeUrl` [named value in Azure API Management](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-properties?tabs=azure-portal) with the full domain name of your Wallarm Node including protocol (e.g., `https://wallarm-node-instance.com`).

**2. Deploy Wallarm policy fragments**

You will deploy 2 policy fragments: one for requests (inbound) and one for responses (outbound):

1. Download the provided code bundle for your platform.
1. Navigate to Azure Portal → **API Management** service → **APIs** → **Policy fragments** → **Create**.
1. Create a request policy fragment using `wallarm-inline-request.xml` for synchronous mode or `wallarm-out-of-band-request.xml` for asynchronous mode.

    You can name the fragment consistently with the file: `wallarm-inline-request` or `wallarm-out-of-band-request`.
1. Create a response policy fragment using `wallarm-inline-response.xml` for synchronous mode or `wallarm-out-of-band-response.xml` for asynchronous mode.
   
    You can name the fragment consistently with the file: `wallarm-inline-response` or `wallarm-out-of-band-response`.

**3. Apply Wallarm policy fragments to APIs**

You can attach Wallarm fragments **globally** to all APIs or **individually** to specific APIs or operations. Insert fragments inside your existing policy to preserve the current flow.

To apply Wallarm policies globally (all APIs):

1. Navigate to Azure Portal → **APIs** → **All APIs**.
1. Under **Inbound processing** and **Outbound processing**, add the fragments, for example, for the synchronous traffic analysis:

```xml hl_lines="2-4 8-10"
<policies>
    <inbound>
        <include-fragment fragment-id="wallarm-sync-request" />
    </inbound>
    <backend>
        <forward-request />
    </backend>
    <outbound>
        <include-fragment fragment-id="wallarm-sync-response" />
    </outbound>
    <on-error />
</policies>
```

To apply Wallarm policies per API or operation:

1. Navigate to Azure Portal → **APIs** → select API → **All operations** or specific operation.
1. Under **Inbound processing** and **Outbound processing**, add the fragments **before `<base/>`** so inspection happens prior to routing, for example, for the synchronous traffic analysis:

```xml hl_lines="2-6 10-13"
<policies>
    <inbound>
        <include-fragment fragment-id="wallarm-sync-request" />
        <base />
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <include-fragment fragment-id="wallarm-sync-response" />
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

[More details](azure-api-management.md)

<style>
  h1#azure-apim-for-wizard {
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