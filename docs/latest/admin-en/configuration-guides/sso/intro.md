# SAML SSO Authentication Overview

You can use single sign‑on (SSO) technology to authenticate your company's users to the Wallarm Console if your company already uses a SAML SSO solution. Wallarm can be integrated with any solution that supports the SAML standard PDF.

## SSO modes

Wallarm provides the following SSO modes:

* [Simple SSO](#simple-sso) (since 2025) - provides you with the ability of performing all user management right from you SAML SSO solution with no need to create or configure users separately in Wallarm.
* Legacy approaches - in Wallarm, create users and set their permissions by assigning roles; integrate with your SAML SSO solution (identity provider) for users to be able to login using their existing account:

    * [Simple SSO (legacy)](#simple-sso-legacy) - provide SSO login possibility for selected users.
    * [Strict SSO (legacy)](#strict-sso-legacy) - set SSO login necessity for all company's users.

It is recommended to migrate from legacy versions to the new one. To do so, contact the [Wallarm support team](mailto:support@wallarm.com).

## Simple SSO

This SSO [mode](#sso-modes) was introduced in 2025, providing you with the ability of performing all user management right from your SAML SSO solution. This includes both user account creation and permission management via groups. No need to create or configure users separately in Wallarm.

In your SAML SSO solution (identity provider), you create users and add them to groups, set users' permissions by mapping groups to Wallarm [roles](../../../user-guides/settings/users.md#user-roles); integrate with Wallarm and it will use data from your solution.

![SAML SSO solution - G Suite - Mapping](../../../images/admin-guides/configuration-guides/sso/simple-sso-mapping.png)

See details on setup [here](setup.md#simple-sso-mapping).

## Simple SSO (legacy)

In this [mode](#sso-modes), you: 

1. In Wallarm, create users and set their permissions by assigning [roles](../../../user-guides/settings/users.md#user-roles).
1. Integrate with your SAML SSO solution (identity provider) for users to be able to login using their existing account.
1. [Select](employ-user-auth.md) users for whom the SSO authentication will be available.

See details on setup [here](setup.md#setup-integration).

## Strict SSO (legacy)

Wallarm supports the **Strict SSO (legacy)** [mode](#sso-modes) that differs from the [Simple SSO (legacy)](#simple-sso-legacy) in that it enables SSO authentication for all company account users at once. Other characteristics of the strict SSO mode are:

* The authentication method for all existing users of the account is switched to SSO.
* All new users get the SSO as the authentication method by default.
* Authentication method cannot be switched to anything different from SSO for any user.

To enable or disable the strict SSO mode, contact the [Wallarm support team](mailto:support@wallarm.com).

See details on setup [here](setup.md#setup-integration).

!!! info "How active sessions are treated when enabling strict SSO"
    If there are any users signed into the company account when it is switched to the strict SSO mode, these sessions remain active. After sign out, the users will be prompted to use SSO.