#   Step 4: Allowing Access to the Wallarm Application on the G Suite Side

[img-gsuite-console]:           ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-user-list]:                ../../../../images/admin-guides/configuration-guides/sso/gsuite/user-list.png
[img-gsuite-navigation-saml]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-navigation-saml.png
[img-app-page]:                 ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png

[doc-use-user-auth]:            ../employ-user-auth.md

To authenticate through G Suite, an account must be created on the G Suite side, and the user must have access rights to the Wallarm application. The required sequence of actions for granting access rights is described below.

Go to the G Suite’s user management section by clicking on the *Users* block.

![G Suite console][img-gsuite-console]

Make sure that the user you are going to give access to the application via SSO authentication is in your organization's user list.

![G Suite user list][img-user-list]

Go to the SAML applications section by clicking on the *SAML apps* menu item as shown below.

![Navigate to the SAML applications][img-gsuite-navigation-saml]

Enter the settings of the desired application and make sure that the status of the application is “ON for everyone.” If the status of the application is “OFF for everyone,” click the *Edit service* button.

![Application page in G Suite][img-app-page]

Select the “ON for everyone” status and click *Save*.

After that you will receive a message that the status of the service has been updated. The Wallarm application is now available for SSO authentication to all users of your organization in G Suite.


##  Setup Complete

This completes the configuration of the G Suite‑based SSO, and now you can start configuring the [user specific][doc-use-user-auth] SSO authentication on the Wallarm side.