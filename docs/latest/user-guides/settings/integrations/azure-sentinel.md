# Azure Monitor Logs / Microsoft Sentinel

You can set up Wallarm to send security events to a [Log Analytics Workspace](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-workspace-overview) in Microsoft Azure via the [Azure Monitor Logs Ingestion API](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/logs-ingestion-api-overview).

On top of that, you can optionally enable:

* [Microsoft Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/) — for analytics rules, threat hunting, and workbooks
* [Microsoft Defender portal](https://learn.microsoft.com/en-us/azure/sentinel/microsoft-sentinel-defender-portal) — for unified security operations across the Defender suite

## What this setup creates

* One [custom table](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/create-custom-table) in a Log Analytics Workspace
* One [Data Collection Endpoint (DCE)](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-endpoint-overview)
* One [Data Collection Rule (DCR)](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-overview) with the Wallarm event schema
* One [Microsoft Entra app registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) with a client secret
* One role assignment: [`Monitoring Metrics Publisher`](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/monitor#monitoring-metrics-publisher) on the DCR

## Prerequisites

* A [**Log Analytics Workspace**](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/quick-create-workspace)

    Optionally, [enable Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-) on it for threat hunting and analytics features.
* For CLI steps: [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed locally or [Azure Cloud Shell](https://shell.azure.com)

    Each step below provides both Azure portal and CLI instructions.
* An Azure account with the following permissions:

    * **[Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor)** on the resource group — to create DCE, DCR, and custom tables
    * **[Log Analytics Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#log-analytics-contributor)** on the Log Analytics Workspace — to manage tables
    * **[Owner](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#owner)** or **[User Access Administrator](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator)** on the DCR — to assign the Monitoring Metrics Publisher role
    * Permission to create app registrations in Microsoft Entra ID (typically the **[Application Developer](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/permissions-reference#application-developer)** role)

## Wallarm event schema

Wallarm sends events with the following columns:

| Column | Type | Description |
| ------ | ---- | ----------- |
| `TimeGenerated` | `datetime` | Event timestamp. |
| `Vendor` | `string` | Always `Wallarm`. |
| `EventType` | `string` | [Event type](#wallarm-event-types) (e.g., `new_hits`, `create_user`). |
| `Severity` | `string` | Risk level: `high`, `medium`, `low`, or `info`. |
| `ClientName` | `string` | Wallarm account name. |
| `Summary` | `string` | Short event summary. |
| `Description` | `string` | Detailed event description. |
| `RequestId` | `string` | Related request ID (for hits). |
| `RemoteAddr` | `string` | Source IP address (for hits). |
| `Url` | `string` | Related URL (for hits and vulnerabilities). |
| `RawData` | `string` | Full event payload as JSON. |

## Step 1: Configure Azure resources

### Set variables (CLI)

If using Azure CLI, set these variables first. Replace the placeholders with your values:

* `<RESOURCE_GROUP>` — the resource group containing your Log Analytics Workspace (find in **Log Analytics workspaces** → your workspace → **Overview** → **Resource group**)
* `<LOCATION>` — the Azure region of your workspace (e.g., `eastus`, `westeurope`; find in the same **Overview** page)
* `<WORKSPACE_NAME>` — the name of your Log Analytics Workspace

```bash
RESOURCE_GROUP="<RESOURCE_GROUP>"
LOCATION="<LOCATION>"
WORKSPACE_NAME="<WORKSPACE_NAME>"

# Names for Azure resources to be created — change if needed
TABLE_NAME="WallarmSentinel_CL"
DCE_NAME="wallarm-sentinel-dce"
DCR_NAME="wallarm-sentinel-dcr"
STREAM_NAME="Custom-WallarmSentinel_CL"
APP_NAME="wallarm-sentinel-ingestion"

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
TENANT_ID=$(az account show --query tenantId -o tsv)

WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group "$RESOURCE_GROUP" \
  --workspace-name "$WORKSPACE_NAME" \
  --query id -o tsv)
```

### 1. Register an application in Microsoft Entra ID

Wallarm uses app registration credentials to authenticate with the Azure Monitor Logs Ingestion API.

Register the application in your organization's Microsoft Entra ID directory (the same one that contains your Azure subscription and Log Analytics Workspace):

=== "Azure portal"

    1. Go to **Microsoft Entra ID** → **App registrations** → **New registration**.
    1. Enter an application name (e.g., `wallarm-sentinel-ingestion`) and click **Register**.
    1. On the application **Overview** page, copy:

        * **Application (client) ID** — this is the **Client ID** for Wallarm.
        * **Directory (tenant) ID** — this is the **Tenant ID** for Wallarm.

    1. Go to **Manage** → **Certificates & secrets** → **New client secret**, add a description (e.g., `wallarm-integration`), choose an expiration period, and click **Add**.
    1. Copy the secret **Value** immediately — it will not be shown again. This is the **Client secret** for Wallarm.

    ![Register an application in Microsoft Entra ID](../../../images/user-guides/settings/integrations/microsoft-sentinel-new/entra-app-registration.png)

=== "Azure CLI"

    ```bash
    CLIENT_ID=$(az ad app create \
      --display-name "$APP_NAME" \
      --sign-in-audience AzureADMyOrg \
      --query appId -o tsv)

    az ad sp create --id "$CLIENT_ID" >/dev/null

    CLIENT_SECRET=$(az ad app credential reset \
      --id "$CLIENT_ID" \
      --query password -o tsv)

    SP_OBJECT_ID=$(az ad sp show \
      --id "$CLIENT_ID" \
      --query id -o tsv)

    echo "Client ID:     $CLIENT_ID"
    echo "Client Secret: $CLIENT_SECRET"
    ```

    Save the printed values — you will need them for Wallarm configuration. The client secret cannot be retrieved again later.

### 2. Create a Data Collection Endpoint (DCE)

A DCE provides the ingestion endpoint URL that Wallarm sends events to.

=== "Azure portal"

    1. Go to **Monitor** → **Data Collection Endpoints** → **Create**.
    1. Enter a name (e.g., `wallarm-sentinel-dce`), select the same region as your Log Analytics Workspace, and click **Create**.
    1. Open the created DCE and copy the **Logs Ingestion URI** — this is the **Logs Ingestion endpoint** for Wallarm.

    ![Azure Data Collection Endpoint](../../../images/user-guides/settings/integrations/microsoft-sentinel-new/dce.png)
=== "Azure CLI"

    ```bash
    az monitor data-collection endpoint create \
      --name "$DCE_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION" \
      --public-network-access Enabled

    DCE_ID=$(az monitor data-collection endpoint show \
      --name "$DCE_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      --query id -o tsv)

    ENDPOINT=$(az monitor data-collection endpoint show \
      --name "$DCE_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      --query logsIngestion.endpoint -o tsv)
    ```

### 3. Create a custom table

Create a custom table in your Log Analytics Workspace to store Wallarm events.

=== "Azure portal"

    1. Go to **Log Analytics workspaces** → select your workspace → **Tables** → **Create**.
    1. Enter a table name, e.g., `WallarmSentinel` (the `_CL` suffix is added automatically).
    1. Under **Table plan**, select **Analytics**.
    1. Select **Create a new data collection rule**. Specify the subscription, resource group, and name (e.g., `wallarm-sentinel-dcr`).
    1. Select the DCE created in the previous step, then click **Next**.
    1. Click **Browse for files** and upload a JSON file with sample Wallarm event data. Save the following content as a `.json` file (e.g., `wallarm-sample.json`) and upload it:

        ```json
        [
          {
            "TimeGenerated": "2026-01-01T00:00:00Z",
            "Vendor": "Wallarm",
            "EventType": "new_hits",
            "Severity": "high",
            "ClientName": "Sample Company",
            "Summary": "New hit detected",
            "Description": "A new hit was detected on your application.",
            "RequestId": "sample-request-id",
            "RemoteAddr": "1.2.3.4",
            "Url": "https://example.com/api/v1/users",
            "RawData": "{}"
          }
        ]
        ```

    1. Optionally configure a transformation, then click **Next**.
    1. Review the schema and click **Create**.

    ![Azure Custom Table](../../../images/user-guides/settings/integrations/microsoft-sentinel-new/custom-table.png)
=== "Azure CLI"

    ```bash
    az monitor log-analytics workspace table create \
      --resource-group "$RESOURCE_GROUP" \
      --workspace-name "$WORKSPACE_NAME" \
      --name "$TABLE_NAME" \
      --columns \
        TimeGenerated=datetime \
        Vendor=string \
        EventType=string \
        Severity=string \
        ClientName=string \
        Summary=string \
        Description=string \
        RequestId=string \
        RemoteAddr=string \
        Url=string \
        RawData=string
    ```

### 4. Create a Data Collection Rule (DCR)

A DCR tells Azure Monitor how to route incoming data to the correct table.

=== "Azure portal"
    When using the Azure portal, a DCR is created automatically as part of custom table creation in step 3 — skip to collecting the values below:

    1. Go to **Monitor** → **Data Collection Rules** → select the DCR that was created with your table.
    1. Open **JSON View** and copy the **immutableId** value (starts with `dcr-`) — this is the **DCR immutable ID** for Wallarm.
    1. In the same JSON, find `streamDeclarations` — the key name (e.g., `Custom-WallarmSentinel_CL`) is the **Stream name** for Wallarm.

    ![Azure Data Collection Rule](../../../images/user-guides/settings/integrations/microsoft-sentinel-new/dcr.png)
=== "Azure CLI"
    When using CLI, the DCR must be created manually:

    1. Create a DCR definition file:

        ```bash
        cat > /tmp/wallarm-sentinel-dcr.json <<EOF
        {
          "location": "${LOCATION}",
          "kind": "Direct",
          "properties": {
            "dataCollectionEndpointId": "${DCE_ID}",
            "streamDeclarations": {
              "${STREAM_NAME}": {
                "columns": [
                  { "name": "TimeGenerated", "type": "datetime" },
                  { "name": "Vendor", "type": "string" },
                  { "name": "EventType", "type": "string" },
                  { "name": "Severity", "type": "string" },
                  { "name": "ClientName", "type": "string" },
                  { "name": "Summary", "type": "string" },
                  { "name": "Description", "type": "string" },
                  { "name": "RequestId", "type": "string" },
                  { "name": "RemoteAddr", "type": "string" },
                  { "name": "Url", "type": "string" },
                  { "name": "RawData", "type": "string" }
                ]
              }
            },
            "destinations": {
              "logAnalytics": [
                {
                  "workspaceResourceId": "${WORKSPACE_ID}",
                  "name": "wallarmDestination"
                }
              ]
            },
            "dataFlows": [
              {
                "streams": ["${STREAM_NAME}"],
                "destinations": ["wallarmDestination"],
                "transformKql": "source",
                "outputStream": "Custom-${TABLE_NAME}"
              }
            ]
          }
        }
        EOF
        ```

    1. Create the DCR:

        ```bash
        az monitor data-collection rule create \
          --name "$DCR_NAME" \
          --resource-group "$RESOURCE_GROUP" \
          --location "$LOCATION" \
          --rule-file /tmp/wallarm-sentinel-dcr.json

        DCR_ID=$(az monitor data-collection rule show \
          --name "$DCR_NAME" \
          --resource-group "$RESOURCE_GROUP" \
          --query id -o tsv)

        DCR_IMMUTABLE_ID=$(az monitor data-collection rule show \
          --name "$DCR_NAME" \
          --resource-group "$RESOURCE_GROUP" \
          --query immutableId -o tsv)
        ```

    If `DCR_IMMUTABLE_ID` comes back empty, print the full DCR and copy `immutableId` from the JSON:

    ```bash
    az monitor data-collection rule show \
      --name "$DCR_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      -o json
    ```

### 5. Grant permissions

Assign the **Monitoring Metrics Publisher** role to your app registration on the DCR so Wallarm can send data.

!!! info "Role assignment propagation delay"
    Azure RBAC changes can take up to 10 minutes to propagate. If you get an access error right after assigning the role, wait a few minutes and try again.

=== "Azure portal"

    1. Go to **Monitor** → **Data Collection Rules** → select your DCR → **Access Control (IAM)** → **Add role assignment**.
    1. On the **Role** tab, switch to **Job function roles** and search for **Monitoring Metrics Publisher**. Select it and click **Next**.
    1. On the **Members** tab, select **User, group, or service principal**, then click **+ Select members** and search for your app registration by name.
    1. Click **Review + assign**.

    ![Monitoring Metrics Publisher role](../../../images/user-guides/settings/integrations/microsoft-sentinel-new/monitoring-metrics-publicher-role.png)
=== "Azure CLI"

    ```bash
    az role assignment create \
      --assignee-object-id "$SP_OBJECT_ID" \
      --assignee-principal-type ServicePrincipal \
      --role "Monitoring Metrics Publisher" \
      --scope "$DCR_ID"
    ```

### 6. Collect values for Wallarm

After completing all steps, you should have the following values:

| Value | Where to find |
| ----- | ------------- |
| **Tenant ID** | App registrations → `wallarm-sentinel-ingestion` → Overview → Directory (tenant) ID. |
| **Client ID** | App registrations → `wallarm-sentinel-ingestion` → Overview → Application (client) ID. |
| **Client secret** | Saved when creating the client secret. |
| **Logs Ingestion endpoint** | Data Collection Endpoints → `wallarm-sentinel-dce` → Overview → Logs Ingestion URI. |
| **DCR immutable ID** | Data Collection Rules → `wallarm-sentinel-dcr` → JSON View → `immutableId`. |
| **Stream name** | Data Collection Rules → `wallarm-sentinel-dcr` → JSON View → key in `streamDeclarations` (e.g., `Custom-WallarmSentinel_CL`). |

With CLI, you can print all values at once:

```bash
cat <<EOF
tenant_id:        $TENANT_ID
client_id:        $CLIENT_ID
client_secret:    $CLIENT_SECRET
endpoint:         $ENDPOINT
dcr_immutable_id: $DCR_IMMUTABLE_ID
stream_name:      $STREAM_NAME
EOF
```

## Step 2: Configure Wallarm integration

1. Open the **Integrations** section in Wallarm Console.
1. Click the **Microsoft Sentinel** block or click the **Add integration** button and choose **Microsoft Sentinel**.
1. Enter an integration name.
1. Fill in the values collected from Azure: **Tenant ID**, **Client ID**, **Client secret**, **Logs Ingestion endpoint**, **DCR immutable ID**, and **Stream name**.
1. Choose event types to trigger notifications.

    ![Sentinel integration](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    Details on available events:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the target system, and the notification format.
1. Click **Add integration**.

--8<-- "../include/cloud-ip-by-request.md"

## Viewing Wallarm logs in Microsoft Azure

After the integration is set up, you can query Wallarm events in several places:

**Log Analytics Workspace → Logs**

In the Azure portal, go to **Log Analytics workspaces** → select your workspace → **Logs**:

![Wallarm logs in Microsoft Azure](../../../images/user-guides/settings/integrations/microsoft-sentinel-new/test-logs.png)

**Microsoft Sentinel → Logs**

If Microsoft Sentinel is enabled on the workspace, go to **Microsoft Sentinel** → select your workspace → **Logs**.

**Microsoft Defender portal**

If your Sentinel workspace is [connected to the Defender portal](https://learn.microsoft.com/en-us/azure/sentinel/microsoft-sentinel-defender-portal), open [security.microsoft.com](https://security.microsoft.com) → **Investigation & response** → **Hunting** → **Advanced hunting**.

**Useful KQL queries**

To see all hits grouped by source IP:

```kusto
WallarmSentinel_CL
| where EventType == "new_hits"
| summarize HitCount = count() by RemoteAddr
| sort by HitCount desc
```

To see high-severity events in the last 7 days:

```kusto
WallarmSentinel_CL
| where TimeGenerated > ago(7d)
| where Severity == "high"
| project TimeGenerated, EventType, Summary, Url, RemoteAddr
| sort by TimeGenerated desc
```

## Wallarm event types

All events are sent to a single custom table (e.g., `WallarmSentinel_CL`). The `EventType` column distinguishes between event types:

| Event | `EventType` value |
| ----- | ----------------- |
| New [hit](../../../glossary-en.md#hit) | `new_hits` |
| New [user](../../../user-guides/settings/users.md) in a company account | `create_user` |
| Deletion of a user from a company account | `delete_user` |
| User role update | `update_user` |
| Deletion of an [integration](integrations-intro.md) | `delete_integration` |
| Disabling an integration | `disable_integration` or `integration_broken` if it was disabled due to incorrect settings |
| New [application](../../../user-guides/settings/applications.md) | `create_application` |
| Deletion of an application | `delete_application` |
| Application name update | `update_application` |
| New [vulnerability](../../../glossary-en.md#security-issue-vulnerability) of a high risk | `vuln_high` |
| New vulnerability of a medium risk | `vuln_medium` |
| New vulnerability of a low risk | `vuln_low` |
| New [rule](../../../user-guides/rules/rules.md) | `rule_create` |
| Deletion of a rule | `rule_delete` |
| Changes of an existing rule | `rule_update` |
| New [trigger](../../../user-guides/triggers/triggers.md) | `trigger_create` |
| Deletion of a trigger | `trigger_delete` |
| Changes of an existing trigger | `trigger_update` |
| Changes in API inventory (if the corresponding [trigger](../../triggers/triggers.md) is active) | `api_structure_changed` |
| Amount of attacks exceeds the threshold (if the corresponding [trigger](../../triggers/triggers.md) is active) | `attacks_exceeded` |
| New denylisted IP (if the corresponding [trigger](../../triggers/triggers.md) is active) | `ip_blocked` |

## Migration from legacy integration

The previous version of the Microsoft Sentinel integration used the Azure Log Analytics Data Collector API with **Workspace ID** and **Primary key** for authentication. This API will be [deprecated by Microsoft on July 1, 2026](https://techcommunity.microsoft.com/blog/microsoft-security-blog/planning-your-move-to-microsoft-defender-portal-for-all-microsoft-sentinel-custo/4428613).

If you already have an active legacy integration, it remains visible in the Wallarm Console with a **Legacy** suffix and continues to work until the Microsoft deprecation date. For new setups, only the new integration is available.

### Legacy integration setup reference

The legacy integration required only two values from Azure:

1. [Run Microsoft Sentinel on a Workspace](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-).
1. Go to the Sentinel Workspace settings → **Agents** → **Log Analytics agent instructions** and copy:

    * **Workspace ID**
    * **Primary key**

These values were then pasted into the Wallarm integration form along with an optional table name.

### Migration path

1. Keep the old (Legacy) integration untouched while preparing the new setup.
1. Create the Azure resources described in [Step 1](#step-1-configure-azure-resources) above.
1. Create a new **Microsoft Sentinel** integration in Wallarm with the new fields.
1. Test the new integration and verify data appears in the table.
1. Optionally run both integrations in parallel for a short validation period.
1. Disable or remove the legacy integration after cutover.

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
