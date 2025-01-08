# SAML SSO Authentication Setup

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png

[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

This article describes how to enable and configure Wallarm's [SAML SSO Authentication](intro.md).

## Select mode and enable

By default, SSO connection on Wallarm is not available without activating the appropriate service. To activate the SSO service: 

1. Select the [SSO mode](intro.md#sso-modes) matching your needs.
1. Contact the [Wallarm support team](mailto:support@wallarm.com) to activate.
1. [Setup integration](#setup-integration) between your SAML SSO solution and Wallarm.
    
If no SSO service is activated, then SSO-related blocks will not be visible in the **Integrations** section in Wallarm Console.

## Migrating between modes

To migrate to a SSO mode different from you current one, contact the [Wallarm support team](mailto:support@wallarm.com).

## Setup integration

To setup integration between your SAML SSO solution and Wallarm:

1. Make sure the SSO service is [enabled](#select-mode-and-enable) in a selected mode.
1. Act as described in [G Suite](../../../admin-en/configuration-guides/sso/gsuite/overview.md) or [Okta](../../../admin-en/configuration-guides/sso/okta/overview.md) examples.
1. If in **Simple SSO** mode, provide [required mapping](#simple-sso-mapping).
1. If in **Simple SSO (legacy)** mode, [enable SSO](../../../admin-en/configuration-guides/sso/employ-user-auth.md) for selected users.

## Simple SSO mapping

In Simple SSO [mode](intro.md#sso-modes), in your SAML SSO solution (identity provider), you create users and add them to groups, set users' permissions by mapping groups to Wallarm [roles](../../../user-guides/settings/users.md#user-roles); integrate with Wallarm and it will use data from your solution.

[Setup](#setup-integration) as all other modes, obligatory add mapping for the following attributes:

* `email`
* `first_name`
* `last_name`
* `wallarm_role:[role]` where `role` is:

    * `admin`
    * `analytic`
    * `api_developer`
    * `partner_admin`
    * `partner_analytic`

        See all role descriptions [here](../../../user-guides/settings/users.md#user-roles). Contact the [Wallarm support team](mailto:support@wallarm.com) to get more roles available.

![SAML SSO solution - G Suite - Mapping](../../../images/admin-guides/configuration-guides/sso/simple-sso-mapping.png)

##  Disabling and removing

**Disabling**

To disable SSO, go to **Integrations**. In the block of the corresponding SSO provider, from the menu select **Disable**.

!!! warning "Attention: SSO will be disabled for all users"
    Note that when you disable or remove SSO authentication, it will be disabled for all users. Users will be notified that SSO authentication is disabled and the password needs to be restored.

![disabling-sso-provider][img-disable-sso-provider]

In the pop-up window, it is required to confirm the disabling of the SSO provider, as well as the disabling of the SSO authentication of all users. Click **Yes, disable**.

After confirmation, the SSO provider will be disconnected, but its settings will be saved and you can enable this provider again in the future. In addition, after disabling, you will be able to connect another SSO provider (another service as an identity provider).

**Deleting**

!!! warning "Attention: About deleting the SSO integration"
    Compared to disabling, deleting the SSO provider integration will cause the loss of all its settings without the possibility of recovery.
    
    If you need to reconnect your provider, you will need to reconfigure it.


Deleting the SSO provider integration is similar to disabling it.

Go to **Integrations**. In the block of the corresponding SSO provider, from the menu select **Delete**.

In the pop-up window, it is required to confirm the removing of the provider, as well as to disable SSO authentication of all users. Click **Yes, delete**.

After confirmation, the selected SSO provider will be removed and will no longer be available. Also, you will be able to connect to another SSO provider.
