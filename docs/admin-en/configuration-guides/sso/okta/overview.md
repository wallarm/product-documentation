#   Connecting SSO with Okta

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../disable-sso-provider.md

[link-okta]:                        https://www.okta.com/

This guide will cover the process of connecting the [Okta][link-okta] service as an identity provider to Wallarm, which acts as the service provider.

!!! note

    By default, SSO connection on Wallarm is not available without activating the appropriate service. To activate the SSO service, please contact your account manager.
    
    After activating the service
    
    *   you will be able to perform the following SSO connection procedure, and
    *   the SSO-related blocks will be visible in the “Integrations” tab.
    
    In addition, you need accounts with administration rights both for Wallarm and Okta.

The process of connecting SSO with Okta comprises the following steps:
1.  [Generating Parameters on the Wallarm Side.][doc-setup-sp]
2.  [Creating and Configuring an Application in Okta.][doc-setup-idp]
3.  [Transferring Okta Metadata to the Wallarm Setup Wizard.][doc-metadata-transfer]
4.  [Allowing Access to the Wallarm Application on the Okta Side][doc-allow-access-to-wl]

After that, [configure SSO authentication][doc-employ-sso] for Wallarm users.

!!! info "See also"
    *   [User guide][doc-user-sso-guide] to using SSO authentication to log in to Wallarm.
    *   [Disabling and removing the configured SSO provider.][doc-disable-sso]