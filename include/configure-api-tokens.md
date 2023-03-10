## Configuring tokens

Tokens are used for API request authentication. You can configure any number of tokens.

![!Wallarm API token][img-api-tokens-edit]

[All users][user-roles-article] can:

* Create, see, edit, disable/enable or remove own tokens.
* For each own token:

    * View, copy and renew token value.
    * Set permissions, but not wider than their own.
    * Set expiration date for the token. If set, the token will be disabled after that date.

Administrators can:

* See, edit, disable/enable or remove all tokens in the company account.
* Create private or shared tokens. Shared tokens can be seen and used by any administrator in the company account. Non-administrator users cannot see shared tokens.

    !!! info "Administrators cannot"
        Administrators cannot view or copy values of the private tokens that they do not own.

Consider that:

* If token owner is disabled, all one's tokens are automatically disabled as well.
* If token owner is reduced in permissions, corresponding permissions will be removed from all one's tokens.
* All disabled tokens are automatically removed in a week after disabling.
* To enable previously disabled token, save it with the new expiration date.

## Legacy tokens

Previously UUID and secret key were used for request authentication which is now replaced with tokens. The UUID and secret key your were using are automatically transformed to the **legacy** token, so that your requests authenticated with UUID and secret key will continue working. Permissions for the migrated legacy tokens are not displayed and cannot be changed.

!!! info "SSO users"
    Legacy tokens are not created for users using SSO to access the Wallarm Console. If SSO is enabled for the owner of some tokens, all these tokens are automatically disabled.