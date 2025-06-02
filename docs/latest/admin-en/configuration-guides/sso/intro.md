# SAML SSO Authentication Overview

You can use single sign‑on (SSO) technology to authenticate your company's users to the Wallarm Console. Wallarm seamlessly integrates with any identity provider (IdP) that supports the SAML standard, such as Google or Okta, while acting as the service provider (SP).

![Integrations - SSO](../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

## Available options

### Provisioning

You can set up Wallarm SSO integration with or without **provisioning**. Provisioning is an automatic transfer of data from SAML SSO solution to Wallarm: your SAML SSO solution users and their group membership define access to Wallarm and permissions there; all user management is performed on SAML SSO solution side.

With **provisioning off**, for users that you have in your SAML SSO solution, you need to create corresponding users in Wallarm. User roles are also defined in Wallarm and you are able to select users that should login via SSO - the remaining will use login/password. You can also enable **Strict SSO** option which enables SSO authentication for all company account users at once.

Users using SSO:

* Cannot authenticate with login and password and cannot have two-factor authentication (2FA) enabled.
* With provisioning, cannot be disabled or deleted from Wallarm side.

See details on provisioning and options available when you do not use it [here](setup.md#step-4-saml-sso-solution-configure-provisioning).

### Tenant dependent permissions

If you use the [multitenancy](../../../installation/multi-tenant/overview.md) feature and want to provide users with **different permissions in different tenants**, contact the [Wallarm support team](https://support.wallarm.com/) to enable this option.

Consider an example of what you can do with it: let us say you have a `Department A` group in your SAML SSO solution and two tenants: `TEST environment` and `PROD environment`. You want users of the group to have administrative permissions (**Administrator** role) for TEST, and restricted permissions (**Analyst** role) for PROD.

To do this, you need the **different permissions in different tenants** option enabled and [configured](setup.md#tenant-dependent-permissions).

You can also use this option to configure users of different SAML SSO solution groups have access only to specific tenants, and not to others, for example, your `Department B` SAML SSO solution group will have access only to TEST (with permissions of you choice).

## Enabling and setup

By default, SSO service for authentication in Wallarm is not active, corresponding blocks are not visible in the **Integrations** section in Wallarm Console.

To activate the SSO service, contact the [Wallarm support team](https://support.wallarm.com/).

Once service activated, you can set it up, providing necessary configuration both on Wallarm side and on the side of your SAML SSO solution. See details [here](setup.md).

Note that although Wallarm can be integrated with any solution that supports the SAML standard, there can be only one active SSO integration at a time.
