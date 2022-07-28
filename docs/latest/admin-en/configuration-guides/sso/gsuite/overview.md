#   Connecting SSO with G Suite

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-gsuite]:                      https://gsuite.google.com/

This guide will cover the process of connecting the [G Suite][link-gsuite] (Google) service as an identity provider to Wallarm, which acts as the service provider.

!!! note
    By default, SSO connection on Wallarm is not available without activating the appropriate service. To activate the SSO service, please contact your account manager or the [Wallarm support team](mailto:support@wallarm.com).
    
    After activating the service
    
    *   you will be able to perform the following SSO connection procedure, and
    *   the SSO-related blocks will be visible in the “Integrations” tab.
    
    In addition, you need accounts with administration rights both for Wallarm and G Suite.

The process of connecting SSO with G Suite comprises the following steps:
1.  [Generating Parameters on the Wallarm Side.][doc-setup-sp]
2.  [Creating and Configuring an Application in G Suite.][doc-setup-idp]
3.  [Transferring G Suite Metadata to the Wallarm Setup Wizard.][doc-metadata-transfer]
4.  [Allowing Access to the Wallarm Application on the G Suite Side][doc-allow-access-to-wl]

After that, [configure SSO authentication][doc-employ-sso] for Wallarm users.
