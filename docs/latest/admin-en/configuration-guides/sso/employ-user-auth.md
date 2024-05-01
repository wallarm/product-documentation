#   Configuring SSO authentication for users

[img-enable-sso-for-user]:  ../../../images/admin-guides/configuration-guides/sso/enable-sso-for-user.png
[img-disable-sso-for-user]: ../../../images/admin-guides/configuration-guides/sso/disable-sso-for-user.png

[doc-allow-access-gsuite]:  gsuite/allow-access-to-wl.md
[doc-allow-access-okta]:    okta/allow-access-to-wl.md

[doc-user-sso-guide]:       ../../../user-guides/use-sso.md
[doc-disable-sso]:          change-sso-provider.md   

[anchor-enable]:            #enabling-sso-authentication-for-users 
[anchor-disable]:           #disabling-sso-authentication-for-users      

You can [enable][anchor-enable] or [disable][anchor-disable] SSO authentication to Wallarm portal users.


##   Enabling SSO authentication for users

!!! warning
    *   When enabling SSO authentication for users, a login/password log in mechanism and the two-factor authentication will not be available. When SSO authentication is enabled, the user's password is erased and two-factor authentication is disabled.
    *   It is assumed that you have already given the required group of users access to the configured Wallarm application on the [Okta][doc-allow-access-okta] or [G Suite][doc-allow-access-gsuite] side.


To enable SSO authentication for Wallarm users:

1. Go to **Settings** → **Users**.
1. From the user menu, select **Enable SSO login**.

![Enabling SSO for Wallarm user][img-enable-sso-for-user]

In the pop-up window, you will be prompted to send a notification to the user that SSO authentication is enabled. Click the **Send notification** button. If the notification is not required, click **Cancel**.

After that, the user [can authenticate][doc-user-sso-guide] through the identity provider.

Note that you can also enable SSO for all company account users using the [Strict SSO](#strict-sso-mode) mode.

##  Disabling SSO authentication for users

To disable SSO authentication for Wallarm users:

1. Go to **Settings** → **Users**.
1. From the user menu, select **Disable SSO**.

![Disabling SSO for Wallarm user][img-disable-sso-for-user]

After that, the user will be notified by an email that the login using SSO is disabled with a suggestion (link) to restore the password to log in with the login/password pair. In addition, two-factor authentication becomes available to the user.

## SSO and API authentication

When SSO is enabled for the user, authentication for [requests to Wallarm API](../../../api/overview.md#your-own-api-client) becomes unavailable for this user. To get working API credentials, you have two options: 

* If the **strict SSO** mode is not used, create user without SSO option under your company account, and create [API token(s)](../../../api/overview.md#your-own-api-client).
* If the **strict SSO** mode is used, you can enable API authentication for the SSO users with the **Administrator** role. To do this, select **Enable API access** from this user menu. The `SSO+API` auth method is enabled for the user which allows creating API tokens.

    Later you can disable API authentication for the user by selecting **Disable API access**. If this is done, all existing API tokens will be deleted and in a week - removed.

## Strict SSO mode

Wallarm supports the **strict SSO** mode that differs from the regular SSO in that it enables SSO authentication for all company account users at once. Other characteristics of the strict SSO mode are:

* The authentication method for all existing users of the account is switched to SSO.
* All new users get the SSO as the authentication method by default.
* Authentication method cannot be switched to anything different from SSO for any user.

To enable or disable the strict SSO mode, contact the [Wallarm support team](mailto:support@wallarm.com).

!!! info "How active sessions are treated when enabling strict SSO"
    If there are any users signed into the company account when it is switched to the strict SSO mode, these sessions remain active. After sign out, the users will be prompted to use SSO.

## SSO authentication troubleshooting

If the user cannot sign in via SSO, the error message is displayed with one of the error codes described in the table below. In most cases, the company account administrator can fix these errors:

| Error code | Description | How to fix |
|--|--|--|
| `saml_auth_not_found + userid` | User does not have SSO enabled. | Enable SSO as described in the section [above](#enabling-sso-authentication-for-users). |
| `saml_auth_not_found + clientid` | Client does not have an SSO integration in the **Integrations** section. | Follow the instructions in the [integration with the SAML SSO](intro.md) documentation. |
| `invalid_saml_response` or `no_mail_in_saml_response` | The SSO provider gave an unexpected response. It may be a sign of a misconfigured SSO integration. | Do one of the following:<br><ul><li>Make sure there are no mistakes in the SSO integration configured in the **Integrations** section of Wallarm Console.</li><li>Make sure there are no mistakes in the configuration on the SSO provider side.</li></ul> |
| `user_not_found` | Wallarm did not find the user with the specified email. | Create a user with this email in Wallarm Console. |
| `client_not_found` | The company account was not found in Wallarm. | Create a user account with an appropriate email domain, which will create the company account immediately. |

 If necessary, administrator can contact the [Wallarm support team](mailto:support@wallarm.com) to get help in fixing any of these errors.