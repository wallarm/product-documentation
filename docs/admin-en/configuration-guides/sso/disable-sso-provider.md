#   Disabling and Removing the Configured SSO Provider

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png

[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

[anchor-disable]:   #disabling
[anchor-remove]:    #removing

You can [disable][anchor-disable] or [remove][anchor-remove] configured SSO provider.

!!! warning "Attention: SSO will be disabled for all users"
    Note that when you disable or remove SSO authentication, it will be disabled for all users. Users will be notified that SSO authentication is disabled and the password needs to be restored.

##  Disabling

To disable SSO, go to *Settings → Integration*. Click on the block of the corresponding SSO provider and then on the *Disable* button.

![!disabling-sso-provider][img-disable-sso-provider]

In the pop-up window, it is required to confirm the disabling of the SSO provider, as well as the disabling of the SSO authentication of all users.
Click *Yes, disable*.

After confirmation, the SSO provider will be disconnected, but its settings will be saved and you can enable this provider again in the future. In addition, after disabling, you will be able to connect another SSO provider (another service as an identity provider).

##  Removing

!!! warning "Attention: About removing the SSO provider"
    Compared to disabling, removing the SSO provider will cause the loss of all its settings without the possibility of recovery.
    
    If you need to reconnect your provider, you will need to reconfigure it.


Removing the SSO provider is similar to disabling it.

Go to *Settings → Integration*. Click on the block of the corresponding SSO provider and then on the *Remove* button.

In the pop-up window, it is required to confirm the removing of the provider, as well as to disable SSO authentication of all users.
Click *Yes, remove*.

After confirmation, the selected SSO provider will be removed and will no longer be available. Also, you will be able to connect to another SSO provider.

!!! info "See also"
    *   [Configuring the G Suite SSO provider][doc-setup-sso-gsuite]
    *   [Configuring the Okta SSO provider][doc-setup-sso-okta]