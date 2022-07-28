# Overview of integration with the SAML SSO solution

[doc-admin-sso-gsuite]:     gsuite/overview.md
[doc-admin-sso-okta]:       okta/overview.md

[link-saml]:                https://wiki.oasis-open.org/security/FrontPage
[link-saml-sso-roles]:      https://www.oasis-open.org/committees/download.php/27819/sstc-saml-tech-overview-2.0-cd-02.pdf     

You can use Single Sign‑On (SSO) technology to authenticate your company's users to the Wallarm portal if your company already uses a [SAML][link-saml] SSO solution.

Wallarm can be integrated with any solution that supports the SAML standard. The SSO guides describe integration using [Okta][doc-admin-sso-okta] or [Google Suite (G Suite)][doc-admin-sso-gsuite] as an example.

The documents related to the configuration and operation of Wallarm with SSO assume the following:
*   Wallarm acts as a **service provider** (SP).
*   Google or Okta acts as an **identity provider** (IdP).

More information about roles in SAML SSO can be found here ([PDF][link-saml-sso-roles]).

!!! warning "Enabling the SSO service"
    By default, SSO connection on Wallarm is not available without activating the appropriate service. To activate the SSO service, please contact your account manager or the [Wallarm support team](mailto:support@wallarm.com).
    
    If no SSO service is activated, then SSO-related blocks will not be visible in the *Integrations* tab of the *Settings* section on the Wallarm portal.