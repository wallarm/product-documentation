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
    * Provide users with with access to certain tenant account's data.

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
1. Link tenant's applications to the tenant account.

### Step 1: Sign up and send a request to activate the multitenancy feature

1. Fill in and confirm the registration form in Wallarm Console in the [EU Cloud](https://my.wallarm.com/signup) or [US Cloud](https://us1.my.wallarm.com/signup).

    ![!Registration form](../../images/signup-en.png)

    !!! info "Corporate email"
        Please sign up using a corporate email address.
2. Open your email inbox and activate the account using the link from the received message.
3. Send a request for activating the multitenancy feature for your account to the [Wallarm technical support](mailto:support@wallarm.com). Send the following data with the request:
    * Name of the Wallarm Cloud being used (EU Cloud or US Cloud)
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

To create the tenant and [link tenant's applications to the account](#step-4-link-tenants-applications-to-the-appropriate-tenant-account), it is required to send authenticated requests to Wallarm API. Authenticated requests to Wallarm API can be sent from the own client or from the API Reference UI that defines the authentication method:

* For requests to be sent from the **API Reference UI**, it is required to sign in to Wallarm Console with the **Global administrator** user role and update the API Reference by the link:
    * https://apiconsole.eu1.wallarm.com/ for the EU Cloud
    * https://apiconsole.us1.wallarm.com/ for the US Cloud
* For requests to be sent from the **own client**, it is required to pass the Global Administrator [user UUID and secret key](../../api/overview.md#your-own-client) in the request.

At this step, a tenant account linked to a global account will be created.

1. Send the POST request to the route `/v1/objects/client/create` with the following parameters:

    Parameter | Description | Request part | Required
    --------- | -------- | ------------- | ---------
    `name` | Tenant's name. | Body | Yes
    `vuln_prefix` | Vulnerability prefix Wallarm will use for vulnerability tracking and association with the tenant. The prefix must contain four capital letters or numbers and be related to a tenant's name, e.g.: `TNNT` for the tenant `Tenant`. | Body | Yes
    `partner_uuid` | [Main tenant UUID](#step-2-get-access-to-the-tenant-account-creation) received when creating a global account. | Body | Yes
    `X-WallarmAPI-UUID` | The Global administrator [user UUID](../../api/overview.md#your-own-client). | Header | Yes, when sending a request from your own client
    `X-WallarmAPI-Secret` | [Secret key](../../api/overview.md#your-own-client) of the Global administrator user. | Header | Yes, when sending a request from your own client

    ??? info "Show an example of the request sent from your own client"
        === "EU Cloud"
            ``` bash
            curl -v -X POST "https://api.wallarm.com/v1/objects/client/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```
        === "US Cloud"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v1/objects/client/create" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```

2. Copy the values of the `id` and `partnerid` parameters from the response to the request. The parameters will be used when linking tenant's applications to the tenant account.

Created tenants will be displayed in Wallarm Console for [global users](../../user-guides/settings/users.md#user-roles). For example, `Tenant 1` and `Tenant 2`:

![!Selector of tenants in Wallarm Console](../../images/partner-waf-node/clients-selector-in-console.png)

### Step 4: Link tenant's applications to the appropriate tenant account

!!! info "Perform this step only if..."
    ... traffic of all tenants is [processed or will be processed](deploy-multi-tenant-node.md) by only one Wallarm node.

    If a separate node processes each tenant's traffic, please skip this step and proceed to [node deployment and configuration](deploy-multi-tenant-node.md).

An "application" is any tenants' network application protected by the Wallarm node. One tenant may have one or more applications.

Each tenant's application must be linked to the appropriate tenant account by sending the corresponding request to Wallarm API and setting the `wallarm_application` directive in the node configuration accordingly.

To link the application to the account:

1. Define the number of applications based on the tenant's application structure and requirements to the [event management in Wallarm Console](../../user-guides/settings/applications.md).

    It can be only one application, e.g.: the Wallarm node protects one domain of a tenant and it is not required to split the traffic by endpoints. If so, it is still required to perform the further steps.
1. For each application, send the POST request to the route `/v2/partner/<partnerid>/partner_client` with the following parameters:

    Parameter | Description | Request part | Required
    --------- | -------- | ------------- | ------
    `partnerid` | The `partnerid` value obtained after the [tenant creation](#step-3-create-the-tenant-via-the-wallarm-api). | Path | Yes
    `clientid` | Tenant ID obtained after the [tenant creation](#step-3-create-the-tenant-via-the-wallarm-api) (`id`).  | Body | Yes
    `id` | Unique ID for the link between the tenant and the application. The value can be an arbitrary positive integer. | Body | Yes
    `X-WallarmAPI-UUID` | The Global administrator [user UUID](../../api/overview.md#your-own-client). | Header | Yes, when sending a request from your own client
    `X-WallarmAPI-Secret` | [Secret key](../../api/overview.md#your-own-client) of the Global administrator user. | Header | Yes, when sending a request from your own client

    ??? info "Show an example of the request sent from your own client"
        === "EU Cloud"
            ``` bash
            curl -v -X POST "https://api.wallarm.com/v2/partner/111/partner_client" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"clientid\": 888, \"id\": \"13\"}"
            ```
        === "US Cloud"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v2/partner/111/partner_client" -H "X-WallarmAPI-UUID: YOUR_UUID" -H "X-WallarmAPI-Secret: YOUR_SECRET_KEY" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"clientid\": 888, \"id\": \"14\"}"
            ```
1. Copy and save the `id` values you passed in the requests. These IDs will be used in NGINX configuration (`wallarm_application`) to splitt several tenants' traffic later.

If you are a Wallarm partner and the Wallarm node protects the traffic of several clients, please repeat the steps above for each client.

When the tenant resource gets the traffic, the configured `id` will be displayed in Wallarm Console → **Settings** → **Applications** for an appropriate tenant account.

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
