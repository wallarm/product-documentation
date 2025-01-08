# SAML SSO Authentication Troubleshooting

This article describes how to troubleshoot Wallarm's [SAML SSO Authentication](intro.md).

### SSO and API authentication

When SSO is enabled for the user, authentication for [requests to Wallarm API](../../../api/overview.md#your-own-api-client) becomes unavailable for this user. To get working API credentials, different options depending on the SSO [mode](intro.md#sso-modes): 

* If **Simple SSO** or **Strict SSO (legacy)** mode is used, you can enable API authentication for the SSO users with the **Administrator** role. To do this, select **Enable API access** from this user menu. The `SSO+API` auth method is enabled for the user which allows creating API tokens.

    Later you can disable API authentication for the user by selecting **Disable API access**. If this is done, all existing API tokens will be deleted and in a week - removed.

* If **Simple SSO (legacy)** mode is used, create user without SSO option under your company account, and create [API token(s)](../../../api/overview.md#your-own-api-client).

### Cannot sign in issues

If the user cannot sign in via SSO, the error message is displayed with one of the error codes described in the table below. In most cases, the company account administrator can fix these errors:

| Error code | Description | How to fix |
|--|--|--|
| `saml_auth_not_found + userid` | User does not have SSO enabled. | Enable SSO as described in the section [above](#enabling-sso-authentication-for-users). |
| `saml_auth_not_found + clientid` | Client does not have an SSO integration in the **Integrations** section. | Follow the instructions in the [integration with the SAML SSO](intro.md) documentation. |
| `invalid_saml_response` or `no_mail_in_saml_response` | The SSO provider gave an unexpected response. It may be a sign of a misconfigured SSO integration. | Do one of the following:<br><ul><li>Make sure there are no mistakes in the SSO integration configured in the **Integrations** section of Wallarm Console.</li><li>Make sure there are no mistakes in the configuration on the SSO provider side.</li></ul> |
| `user_not_found` | Wallarm did not find the user with the specified email. | Create a user with this email in Wallarm Console. |
| `client_not_found` | The company account was not found in Wallarm. | Create a user account with an appropriate email domain, which will create the company account immediately. |

 If necessary, administrator can contact the [Wallarm support team](mailto:support@wallarm.com) to get help in fixing any of these errors.
