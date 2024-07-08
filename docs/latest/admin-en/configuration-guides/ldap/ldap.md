# Using LDAP

You can use LDAP technology to authenticate your company's users to the Wallarm portal if your company already uses a LDAP solution. This article describes how to configure an LDAP integration with your directory service.

## Overview

To provide seamless integration with your company's existing user management systems ([directory services](https://en.wikipedia.org/wiki/Directory_service#LDAP_implementations)) such as [Microsoft Active Directory (AD)](https://learn.microsoft.com/en-us/entra/architecture/auth-ldap), Wallarm supports an integration with such systems via the LDAP protocol. Such integration allows you:

* Provide your company's users an ability to login into Wallarm Console using credentials stored in your directory service without the need for prior registration in the Wallarm Console.
* Forward user roles and permissions from your directory service to the Wallarm Console.
* Use data encryption that is supported by your directory service.

## Requirements

* LDAP configuration is not available until activated, for activation, contact the [Wallarm support team](mailto:support@wallarm.com).
* You can only use authentication via either LDAP or SSO but not both of them. To configure LDAP, first remove SSO, if you have it.

## Setup

If [requirements](#requirements) are met, you can configure LDAP integration in Wallarm Console at **Integrations** → **LDAP** → **LDAP**.

![Configuring LDAP integration](../../../images/admin-guides/configuration-guides/ldap/configuring-ldap.png)

As basic options, set LDAP server URL and port in **LDAP Server**, and base distribution name **Base DN**. Select authentication type and, if SSL/TLS encryption should be used, configure it by pasting the corresponding certificate and private key values.

In LDAP integration, you need to map LDAP groups to [user roles](../../../user-guides/settings/users.md#user-roles) in Wallarm. You need to map at least one LDAP group and may add as many additional as necessary.