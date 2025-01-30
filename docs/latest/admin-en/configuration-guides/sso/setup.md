# SAML SSO Authentication Setup

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png
[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

This article describes the generic flow of enabling and configuring Wallarm's [SAML SSO Authentication](intro.md).

You can also get acquainted with examples for [G Suite](sso-gsuite.md) and [Okta](sso-okta.md) SAML SSO solutions.

## Step 1: Activate SSO service

By default, SSO service for authentication in Wallarm is not active, corresponding blocks are not visible in the **Integrations** section in Wallarm Console.

To activate the SSO service, contact the [Wallarm support team](mailto:support@wallarm.com).

## Step 2 (Wallarm): Generate metadata

You need Wallarm metadata to enter on the SAML SSO solution side:

1. In Wallarm Console, go to **Integrations** → **SSO SAML AUTHENTICATION** and initiate the appropriate integration. Note that only one SSO integration can be active at the moment.

    ![Integrations - SSO](../../../../images/admin-guides/configuration-guides/sso/sso-integration-add.png)

1. In the SSO configuration wizard, at the **Send details** step, overview the metadata to be sent to your SAML SSO solution.
1. Copy metadata or save them as XML.

See example for [G Suite](sso-gsuite.md#step-2-wallarm-generate-metadata).

## Step 3 (SAML SSO solution): Configure application

1. Log in to your SAML SSO solution.
1. Configure application that will provide access to Wallarm.
1. Copy the application's metadata or save them as XML.
1. Make sure the application is activated and users have access to it.

See examples for [G Suite](sso-gsuite.md#step-3-g-suite-configure-application) and [Okta](sso-okta.md#step-3-okta-configure-application).

## Step 4 (SAML SSO solution): Configure provisioning

The **provisioning** is an automatic transfer of data from SAML SSO solution to Wallarm: your SAML SSO solution users and their group membership define access to Wallarm and permissions there; all user management is performed on SAML SSO solution side.

For this to work, provide the attribute mapping:

1. In the application providing access to Wallarm, map the attributes:

    * `email`
    * `first_name`
    * `last_name`
    * user group(s) to `wallarm_role:[role]` where `role` is:

        * `admin` (**Administrator**)
        * `analytic` (**Analyst**)
        * `api_developer` (**API Developer**)
        * `auditor` (**Read Only**)
        * `partner_admin` (**Global Administrator**)
        * `partner_analytic` (**Global Analyst**)
        * `partner_auditor` (**Global Read Only**)

            See all role descriptions [here](../../../user-guides/settings/users.md#user-roles). Contact the [Wallarm support team](mailto:support@wallarm.com) to get more roles available.

1. Save the changes.

See example for [Okta](sso-okta.md#step-5-okta-configure-provisioning).

**Turning provisioning off**

You can turn the provisioning option off. If it is off, for users that you have in your SAML SSO solution, you will need to create corresponding users in Wallarm. User roles will also be defined in Wallarm.

To turn the **provisioning off**, contact the [Wallarm support team](mailto:support@wallarm.com).

With provisioning turned off, you should manually create users, set their roles and select users that should login via SSO - the remaining will use login/password. You can also enable **Strict SSO** option which enables SSO authentication for all company account users at once. Other characteristics of Strict SSO are:

* The authentication method for all existing users of the account is switched to SSO.
* All new users get the SSO as the authentication method by default.
* Authentication method cannot be switched to anything different from SSO for any user.

When provisioning is off, user management is performed in Wallarm Console → **Settings** → **Users** as described [here](../../../user-guides/settings/users.md). Mapping with SAML SSO solution uses the `email` attribute.

## Step 5 (Wallarm): Enter SSO SAML solution metadata

1. In Wallarm Console, in the SSO configuration wizard, proceed to the **Upload metadata** step.
1. Do one of the following:

    * Upload G Suite metadata as an XML file.
    * Enter metadata manually as follows.

1. Complete SSO configuration wizard. Connection between Wallarm to SAML SSO solution will be tested.

See examples for [G Suite](sso-gsuite.md#step-5-wallarm-enter-g-suite-metadata) and [Okta](sso-okta.md#step-6-wallarm-enter-okta-metadata).

## Step 6 (Wallarm): Configure provisioning (optional)

This step only should be fulfilled if your SAML SSO solution does not support mapping of groups to different attributes (like in [case](sso-gsuite.md#step-6-wallarm-configure-provisioning---part-2) of Google)

1. Proceed to the **Roles mapping** step.
1. Map one or several SSO groups to Wallarm roles. Available roles are:

    * `admin` (**Administrator**)
    * `analytic` (**Analyst**)
    * `api_developer` (**API Developer**)
    * `auditor` (**Read Only**)
    * `partner_admin` (**Global Administrator**)
    * `partner_analytic` (**Global Analyst**)
    * `partner_auditor` (**Global Read Only**)

        See all role descriptions [here](../../../user-guides/settings/users.md#user-roles). Contact the [Wallarm support team](mailto:support@wallarm.com) to get more roles available.

    ![SSO groups to Wallarm roles - mapping in Wallarm](../../../../images/admin-guides/configuration-guides/sso/sso-mapping-in-wallarm.png)

1. Complete SSO configuration wizard. Wallarm to G Suite connection will be tested.
