# SAML SSO Authentication Overview

You can use single sign‑on (SSO) technology to authenticate your company's users to the Wallarm Console if your company already uses a SAML SSO solution. Wallarm can be integrated with any solution that supports the SAML standard.

![Integrations - SSO](../../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

## Available options

You can set up Wallarm SSO integration with or without **provisioning**. Provisioning is an automatic transfer of data from SAML SSO solution to Wallarm: your SAML SSO solution users and their group membership define access to Wallarm and permissions there; all user management is performed on SAML SSO solution side.

With **provisioning off**, for users that you have in your SAML SSO solution, you will need to create corresponding users in Wallarm. User roles will also be defined in Wallarm and you will be able to select users that should login via SSO - the remaining will use login/password.

With provisioning off, you can also enable **Strict SSO** option which enables SSO authentication for all company account users at once.

See details on provisioning and options available when you do not use it [here](setup.md#step-4-saml-sso-solution-configure-provisioning).

## Enabling and setup

By default, SSO service for authentication in Wallarm is not active, corresponding blocks are not visible in the **Integrations** section in Wallarm Console.

To activate the SSO service, contact the [Wallarm support team](mailto:support@wallarm.com).

Once service activated, you can set it up, providing necessary configuration both on Wallarm side and on the side of your SAML SSO solution. See details [here](setup.md).

Note that although Wallarm can be integrated with any solution that supports the SAML standard, there can be only one active SSO integration at a time.
