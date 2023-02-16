[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

In Wallarm Console → **Settings** → **API tokens**, you can manage tokens for [API request authentication](../../api/overview.md).

![!Wallarm API token][img-api-tokens-edit]

This section is available for the users of any role.

!!! warning "SSO users"
    If you [use SSO](../../admin-en/configuration-guides/sso/employ-user-auth.md) to login into Wallarm, tokens are not available and the **API tokens** section is not displayed. If you switch to SSO, your tokens are disabled and the section is hidden.

## Configuring tokens

**[All users][user-roles-article]** can create own tokens and use them (which means, view token value and include it into API request to authenticate it). For each own token you can set permissions, but not wider than the ones your user has. Optionally, you can set expiration date for the token - if set, the token will be disabled after that date. Also, you can disable/enable your tokens manually.

You can renew the token value at any moment.

**Administrators** / **Global Administrators** can view and manage all tokens in the company account. Besides private tokens, they can create shared ones, that can be viewed/used by other administrators.

!!! info "Token privacy"
    No other users (even administrators) can use your private tokens (which means, view or copy token value). Besides, non-administrators will not even see your tokens.

Consider that:

* If the token owner has been [disabled](../../user-guides/settings/users.md#disable-access-for-a-user), all one's tokens are automatically disabled as well.
* If the token owner has been reduced in permissions, corresponding permissions will be removed from all one's tokens.
* All disabled tokens are automatically removed in a week after disabling.

## Backward-compatible tokens

Previously UUID and secret key were used for request authentication which is now replaced with tokens. The UUID and secret key your were using are automatically transformed to the **backward-compatible** token. With this token requests authenticated with UUID and secret key will continue working.

!!! warning "Renew token"
    If you renew the value of the backward-compatible token, the backward compatibility ends - all requests authenticated with old UUID and secret key will stop working.

You can also use the generated value of the backward-compatible token passing it in the `WallarmApi-Token` header parameter of your requests.

Backward-compatible token has the same permissions as the user role does, these permissions are not displayed in the token window and cannot be changed. If you want to control permissions, you need to remove a backward-compatible token and create a new one.

Backward-compatible tokens are not created for users using SSO to access Wallarm Console.
