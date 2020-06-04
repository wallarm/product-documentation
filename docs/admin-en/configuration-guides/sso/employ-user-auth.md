#   Configuring SSO Authentication for Users

[img-enable-sso-for-user]:  ../../../images/admin-guides/configuration-guides/sso/enable-sso-for-user.png
[img-disable-sso-for-user]: ../../../images/admin-guides/configuration-guides/sso/disable-sso-for-user.png

[doc-allow-access-gsuite]:  gsuite/allow-access-to-wl.md
[doc-allow-access-okta]:    okta/allow-access-to-wl.md

[doc-user-sso-guide]:       ../../../user-guides/use-sso.md
[doc-disable-sso]:          change-sso-provider.md   

[anchor-enable]:            #enabling-sso-authentication-for-users 
[anchor-disable]:           #disabling-sso-authentication-for-users      

You can [enable][anchor-enable] or [disable][anchor-disable] SSO authentication to Wallarm portal users.


##   Enabling SSO Authentication for Users

!!! warning
    *   When enabling SSO authentication for users with any non-administrator roles (*Admin* or *Super Admin*), a login/password log in mechanism and the two-factor authentication will not be available. When SSO authentication is enabled, the user's password is erased and two-factor authentication is disabled.
        The *Admin* and *Super Admin* roles can use login/password pair, two-factor authentication, and SSO authentication simultaneously.
    *   It is assumed that you have already given the required group of users access to the configured Wallarm application on the [Okta][doc-allow-access-okta] or [G Suite][doc-allow-access-gsuite] side.


To enable SSO authentication for Wallarm users go to *Settings → Users*. Find the desired user and open the user action menu by clicking the button on the right of the user's record. Click *Enable SSO login*.

![!Enabling SSO for Wallarm user][img-enable-sso-for-user]

In the pop-up window, you will be prompted to send a notification to the user that SSO authentication is enabled. Click the *Send notification* button. If the notification is not required, click *Cancel*.

After that, the user [can authenticate][doc-user-sso-guide] through the identity provider.


##  Disabling SSO Authentication for Users

To disable SSO authentication for Wallarm users, go to *Settings → Users*. Find the desired user and open the user action menu by clicking the button on the right of the user's record. Click *Disable SSO*.

![!Disabling SSO for Wallarm user][img-disable-sso-for-user]

After that, the user will be notified by an email that the login using SSO is disabled with a suggestion (link) to restore the password to log in with the login/password pair. In addition, two-factor authentication becomes available to the user.

!!! info "See also"
    [Changing the configured SSO authentication][doc-disable-sso]