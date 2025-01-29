[link-glossary-incident]:       ../../glossary-en.md#security-incident
[link-glossary-vulnerability]:  ../../glossary-en.md#vulnerability

# Managing Access and Permissions

Wallarm uses **groups** to provide users with access to [Wallarm Cloud](../../about-wallarm/overview.md#how-wallarm-works) resources and set users' permissions.

## How groups work

Each group meaning is: these users have access to these tenants with these permissions.

![Group - Permissions](../../images/user-guides/settings/groups/groups-permissions.png)

* **These users** - users should be pre-created in Wallarm Cloud, except when using SSO integration in Simle SSO (2025) mode.
* **These tenants** - if [multitenancy](../../installation/multi-tenant/overview.md) feature is enabled, you will be able to provide access to several tenants (usually they are isolated environments protected by Wallarm, e.g. production and staging environments managed by isolated teams).
* **These permissions** - you can set custom permissions or use one of the predefined [user roles](#user-roles).

Group membership approach: the same user **can belong to several groups**.

Consequences of above told:

* Permissions may conflict. If for `action A` we have `allow` and `deny` from different groups, the result will be `allow`.
* Adding user to the group results in this user obtaining access to the listed tenants with listed permissions. Users’ permissions may become wider than this was allowed by other groups.
* Adding tenant to the group results in users included into the group obtaining access to the this tenant with at least listed permissions.
* Removing user from the group results in this user losing access to the listed tenants, unless he/she belongs to other groups providing this access. Users’ permissions may reduce if other groups define that. Removing from the group does not delete the user itself.
* Removing tenant from the group results in users included into the group losing access to the this tenant, unless they belong to other groups providing this access. Removing from the group does not delete the tenant itself.
* Deleting group results in users included into the group losing access to the listed tenants, unless they belong to other groups providing this access. Users’ permissions may reduce if other groups define that. Deleting group does not delete the tenants or users themselves.
* Users not included into any groups do not have access to Wallarm Console.
* Groups not having tenants do not provide any access to Wallarm Console.

## Managing groups

Groups are managed in Wallarm Console → **Settings** → **Groups**.

![Group - list of groups](../../images/user-guides/settings/groups/groups-list.png)

Here you can:

* Create or delete groups
* Add/remove users and tenants to/from groups
* Modify group permissions
* Modify group name
* Search for groups by names and filter by roles

To clearly understand the results of these activities, learn [how groups work](#how-groups-work).

## User roles

In Wallarm, roles are the predefined sets of permissions that cover most common Wallarm usage scenarios. If one of predefined sets is appropriate for your group, use it to save your effort.

The following roles exist:

* **Administrator** with access to all Wallarm settings.
* **Analyst** with access to view main Wallarm settings, and manage information about attacks, [incidents][link-glossary-incident] and [vulnerabilities][link-glossary-vulnerability].
* **Read Only** with access to view main Wallarm settings.
* **API Developer** with access to view and download the API inventory discovered by the [API Discovery](../../api-discovery/overview.md) module. This role allows distinguishing users whose tasks only require using Wallarm to get actual data on company APIs. These users do not have access to any Wallarm Console sections except for **API Discovery**, its dashboard, and **Settings → Profile**.
* **Deploy** with access to create Wallarm filtering nodes using the `addnode` script and with no access to Wallarm Console.

    !!! warning "Using the Deploy role to install the Wallarm node 4.0"
        The **Deploy** user role is recommended to be used to install only nodes 3.6 and lower since the [`addnode` script is deprecated in the release of version 4.0](../../updating-migrating/older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-api-tokens).

The [multitenancy](../../installation/multi-tenant/overview.md) feature also enables you to use the global roles **Global Administrator**, **Global Analyst**, **Global Read Only**. Global roles provide users with access to the technical tenant account and linked tenant accounts, regular roles provide users with access only to the technical tenant account.

More detailed information about access of different user roles to the Wallarm entities is provided in the table below. Entity management covers entity creating, editing, and deleting.

| Entity              | Administrator / Global Administrator | Analyst / Global Analyst | Read Only / Global Read Only | API Developer |
|---------------------|--------------------------------------|--------------------------|------------------------------|---|
| **Filtering nodes**       | View and manage                      | View                     | View                         | - |
| **Dashboard**       | View                                 | View                     | View                         | - |
| **Attacks**          | View and manage                      | View and manage          | View                         | - |
| **Incidents**          | View and manage                      | View and manage          | View                         | - |
| **API Sessions**          | View and manage                      | View          | View                         | - |
| **Vulnerabilities** | View and manage                      | View and manage          | View              | - |
| **API inventory by API Discovery**   | View and manage                      | View and manage          | -                            | View and download |
| **API Specifications**   | View and manage                      | View          | View                            | View |
| **Scanner**         | View and manage                      | View and manage          | View                         | - |
| **Triggers**        | View and manage                      | -                        | -                            | - |
| **IP lists**       | View, manage, and export             | View, manage, and export | View and export              | - |
| **Rules**           | View and manage                      | View and manage          | View                         | - |
| **Credential Stuffing Detection**           | View and manage                      | View and manage          | View                         | - |
| **BOLA protection**           | View and manage                      | View          | - | - |
| **Security Edge**    | View and manage                      | View                        | -                            | - |
| **Integrations**    | View and manage                      | -                        | -                            | - |
| **Filtration mode**        | View and manage                      | View                     | View                         | - |
| **Applications**    | View and manage                      | View                     | View                         | - |
| **Users**           | View and manage                      | -                        | View                         | - |
| **API tokens**           | Manage personal and shared tokens | Manage personal tokens | - | - |
| **Activity log**    | View                                 | -                        | View                         | - |

## Global administrators

In the context of groups one [role](#user-roles) is specific - **global administrators**. Users of this role are the only ones whose access and permissions are not defined by any group:

* User of this role always has access to all tenants of the account.
* Permissions are as ones of the **Administrator** - in each tenant of account.
* This user needs not and cannot be added to any group.

## Automatic groups

To avoid the situation when a [newly created](users.md) user is not in any group and thus has no access to the system, when creating or inviting a new user, you set this user's [role](#user-roles) and among groups, this does one of the following:

* Automatically creates the group with permissions set this user role, add the current tenant to the group, add the created user to the group.
* If automatic group with that role already exists, add the created user to it.

The automatically created groups get the `Auto` tag next to its name.

![Group - list of groups - autogroup](../../images/user-guides/settings/groups/groups-list-autogroup.png)

Note that you can view the details of automatically created groups, but cannot edit them (cannot add/remove tenants and users, cannot change permissions).

<!--## Groups and SSO integration

TBD-->
