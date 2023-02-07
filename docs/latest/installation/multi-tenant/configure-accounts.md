# Creating tenant accounts in Wallarm Console

The [multitenancy](overview.md) feature enables you to use several linked accounts, each a separate record in one Wallarm Console. An account allocated for a particular company or isolated environment is called a **tenant account**.

* To correctly group tenant accounts in Wallarm Console, each tenant account is linked to the global account, indicating a partner or a client with isolated environments.
* Users are provided with access to each tenant account separately.
* Data of each tenant account is isolated and accessible only to users added to the account.
* Users with **global** [roles](../../user-guides/settings/users.md#user-roles) can create new tenant accounts and view and edit all tenant accounts' data.

These instructions provide you with the steps for the correct configuration of tenant accounts.

--8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"

## Tenant account structure

Tenant accounts are created according to the following structure:

![!Tenant account structure](../../images/partner-waf-node/accounts-scheme.png)

* **Global account** is used only to group tenant accounts by a partner or a client.
* **Technical tenant account** is used to add [global users](../../user-guides/settings/users.md#user-roles) providing them with access to tenant accounts. Global users are usually employees of Wallarm partner companies or Wallarm clients using multitenancy for isolated environments.
* **Tenant accounts** are used to:

    * Provide tenants with access to the data on detected attacks and to the traffic filtration settings.
    * Provide users with access to certain tenant account's data.

[Global users](../../user-guides/settings/users.md#user-roles) can: 

* Switch between accounts in Wallarm Console.
* Monitor tenants' [subscriptions and quotas](../../about-wallarm/subscription-plans.md).

![!Tenant selector in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console.png)

* `Technical tenant` is a technical tenant account
* `Tenant 1` and `Tenant 2` are tenant accounts

## Configuring tenant accounts

To configure tenant accounts:

1. Sign up for Wallarm Console and send a request for activating the multitenancy feature for your account to Wallarm technical support.
1. Get access to the tenant account creation from the Wallarm technical support.
1. Create a tenant account.
1. Associate specific traffic with the tenant and its applications.

### Step 1: Sign up and send a request to activate the multitenancy feature

1. Fill in and confirm the registration form in Wallarm Console in the [US Cloud](https://us1.my.wallarm.com/signup) or [EU Cloud](https://my.wallarm.com/signup).

    ![!Registration form](../../images/signup-en.png)

    !!! info "Corporate email"
        Please sign up using a corporate email address.
2. Open your email inbox and activate the account using the link from the received message.
3. Send a request for activating the multitenancy feature for your account to the [Wallarm technical support](mailto:support@wallarm.com). Send the following data with the request:
    * Name of the Wallarm Cloud being used (US Cloud or EU Cloud)
    * Names for a global account and technical tenant account
    * Email addresses of employees to be provided with access to tenant accounts (after activating the multitenancy feature, you will be able to add employees yourself)
    * Logo for branded Wallarm Console
    * Custom domain for Wallarm Console, certificate and encryption key for the domain
    * Your technical support email address

### Step 2: Get access to the tenant account creation

After getting your request, the Wallarm technical support will:

1. Create a global account and technical tenant account in the Wallarm Cloud.
2. Add you to the list of users of the technical client account with the [role](../../user-guides/settings/users.md) of **Global administrator**.
3. If email addresses of your employees are provided, the Wallarm technical support will add employees to the list of users of the technical tenant account with the [role](../../user-guides/settings/users.md) of **Global read only**.

    Unregistered employees will receive emails with the link for setting a new password to access the technical tenant account.
4. Send your UUID (the main tenant UUID indicating the Wallarm partner company or Wallarm client using multitenancy for isolated environments).

    Received UUID will be required in the further steps.

### Step 3: Create the tenant via the Wallarm API

To create the tenant, it is required to send authenticated requests to Wallarm API. Authenticated requests to Wallarm API can be sent from the own client or from the API Reference UI that defines the authentication method:

* For requests to be sent from the **API Reference UI**, it is required to sign in to Wallarm Console with the **Global administrator** user role and update the API Reference by the link:
    * https://apiconsole.us1.wallarm.com/ for the US Cloud
    * https://apiconsole.eu1.wallarm.com/ for the EU Cloud
* For requests to be sent from the **own client**, it is required to pass the Global Administrator [user UUID and secret key](../../api/overview.md#your-own-client) in the request.

At this step, a tenant account linked to a global account will be created.

1. Send the POST request to the route `/v1/objects/client/create` with the following parameters:

    Parameter | Description | Request part | Required
    --------- | -------- | ------------- | ---------
    `name` | Tenant's name. | Body | Yes
    `vuln_prefix` | Vulnerability prefix Wallarm will use for vulnerability tracking and association with the tenant. The prefix must contain four capital letters or numbers and be related to a tenant's name, e.g.: `TNNT` for the tenant `Tenant`. | Body | Yes
    `partner_uuid` | [Main tenant UUID](#step-2-get-access-to-the-tenant-account-creation) received when creating a global account. | Body | Yes
    `WallarmApi-Token` | Appropriate [API token](../../api/overview.md#your-own-client) of the Global administrator user. | Header | Yes, when sending a request from your own client

    ??? info "Show an example of the request sent from your own client"
        === "US Cloud"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v1/objects/client/create" -H "WallarmApi-Token: YOUR_TOKEN" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```
        === "EU Cloud"
            ``` bash
            curl -v -X POST "https://api.wallarm.com/v1/objects/client/create" -H "WallarmApi-Token: YOUR_TOKEN" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```

    ??? info "Show an example of the response"
        ``` bash
        {
        "status":200,
        "body": {
            "id":10110,
            "name":"Tenant 1",
            "components":["waf"],
            "vuln_prefix":"TNTST",
            ...
            "uuid":"11111111-1111-1111-1111-111111111111",
            ...
            }
        }
        ```

2. Copy the value of the `uuid` parameter from the response to the request. The parameter will be used when linking tenant's traffic to the tenant account.

Created tenants will be displayed in Wallarm Console for [global users](../../user-guides/settings/users.md#user-roles). For example, `Tenant 1` and `Tenant 2`:

![!Selector of tenants in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console.png)

### Step 4: Associate specific traffic with your tenant

!!! info "When to configure?"
    This configuration is performed during the node deployment and only if the traffic of all tenants is [processed or will be processed](deploy-multi-tenant-node.md) by only one Wallarm node.

    If a separate node processes each tenant's traffic, please skip this step and proceed to [node deployment and configuration](deploy-multi-tenant-node.md).

To provide Wallarm Cloud with the information about which traffic should be displayed under which tenant account, we need to associate the specific traffic with the created tenant. To do this, include the tenant in the NGINX configuration file using its `uuid` (obtained in **Step 3**) as the value for the [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) directive. For example:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
}
```

In the configuration above, the traffic targeting `tenant1.com`  will be associated with the client `11111111-1111-1111-1111-111111111111`.

## Providing users with access to accounts

* On the technical tenant account, there are **global** and **regular** [roles](../../user-guides/settings/users.md) to provide the users with.

    Global users will have access to all linked tenant accounts.

    Regular users will have access only to the technical tenant account.
* On certain tenant accounts, there are only **regular** [roles](../../user-guides/settings/users.md) to provide the users with.

    Users will be able to track blocked requests, analyze discovered vulnerabilities, and perform additional configurations of the filtering node within a certain tenant account. Users will be able to add each other on their own if the roles allow this action.

[Proceed to the multi-tenant node deployment and configuration →](deploy-multi-tenant-node.md)

## Deactivating and activating tenant accounts in Wallarm Console

In Wallarm Console, the user with the **Global administrator** role can deactivate tenant accounts linked to the global account this administrator serves. When the tenant account is deactivated:

* Users of this tenant account has no access to Wallarm Console.
* Filtering node(s) installed on this [tenant level](deploy-multi-tenant-node.md#multi-tenant-node-characteristics) will stop traffic processing.

Deactivated accounts are not deleted and can be activated again.

To deactivate a tenant account, in the tenant selector, from the tenant menu, select **Deactivate**, then confirm. The tenant account will be deactivated and hidden from the tenant list.

![!Tenant - Deactivate](../../images/partner-waf-node/tenant-deactivate.png)

To activate previously deactivated tenant account, in the tenant selector, click **Show deactivated tenants**, then select **Activate** for your tenant.
