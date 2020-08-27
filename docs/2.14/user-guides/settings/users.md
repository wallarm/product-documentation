[link-audit-log]:               audit-log.md

[link-glossary-incident]:       ../../glossary-en.md#security-incident
[link-glossary-vulnerability]:  ../../glossary-en.md#vulnerability

[img-configure-user]:       ../../images/user-guides/settings/configure-user.png
[img-disabled-users]:       ../../images/user-guides/settings/disabled-users.png
[img-search-user]:          ../../images/user-guides/settings/search-users.png
[img-add-user]:             ../../images/user-guides/settings/add-user.png
[img-user-menu]:            ../../images/user-guides/settings/user-menu.png
[img-disabled-user-menu]:   ../../images/user-guides/settings/disabled-user-menu.png
[img-edit-user]:            ../../images/user-guides/settings/edit-user.png
[img-user-disable-2fa]:     ../../images/user-guides/settings/users-disable-2fa.png
[img-user-menu-disable-2fa]:    ../../images/user-guides/settings/disable-2fa-button.png
[img-disable-delete-multi]:     ../../images/user-guides/settings/users-multi-disable-access.png
[img-enable-delete-multi]:      ../../images/user-guides/settings/users-multi-enable-access.png    


# Configuring Users

You can manage user accounts in the *Users* tab located in *Settings*.

!!! warning "Administrator access"
    Only users with the **Administrator** role can access this setting.

## User Roles

Users of Wallarm clients can have the following roles:

* **Administrator** with access to all Wallarm WAF settings
* **Analyst** with access view main Wallarm WAF settings, information about attacks, [incidents][link-glossary-incident] and [vulnerabilities][link-glossary-vulnerability]
* **Read Only** with access to view main Wallarm WAF settings
* **Deploy** with access to create WAF nodes using the `addnode` script and with no access to Wallarm Console

For Wallarm partners, global roles **Global Administrator**, **Global Analyst**, **Global Read Only** are also available. Global roles provide users with access to the partner account and linked client accounts, regular roles provide users with access only to the partner account.

More detailed information about access of different user roles to Wallarm WAF entitites is provided in the table below. Entity management covers entity creating, editing and deleting.

| Entity              | Administrator / Global Administrator | Analyst / Global Analyst | Read Only / Global Read Only | Deploy                            |
|---------------------|--------------------------------------|--------------------------|------------------------------|-----------------------------------|
| **WAF nodes**       | View and manage                      | View                     | View                         | Create using the `addnode` script |
| **Dashboard**       | View                                 | View                     | View                         | -                                 |
| **Events**          | View and manage                      | View and manage          | View                         | -                                 |
| **Vulnerabilities** | View and manage                      | View and manage          | View and manage              | -                                 |
| **Scanner**         | View and manage                      | View and manage          | View                         | -                                 |
| **Triggers**        | View and manage                      | -                        | -                            | -                                 |
| **Blacklist**       | View, manage and export              | View, manage and export  | View and export              | -                                 |
| **Rules**           | View and manage                      | View and manage          | View                         | -                                 |
| **WAF mode**        | View and manage                      | View                     | View                         | -                                 |
| **Applications**    | View and manage                      | View                     | View                         | -                                 |
| **Markers**         | View and manage                      | -                        | -                            | -                                 |
| **Integrations**    | View and manage                      | -                        | -                            | -                                 |
| **Users**           | View and manage                      | -                        | View                         | -                                 |
| **Activity log**    | View                                 | -                        | View                         | -                                 |

## Viewing Users

You can view user lists in the following tabs:
*   The main *Users* tab contains all users of your company registered in the Wallarm cloud. In this tab, any disabled users are highlighted in gray.

    ![!User list][img-configure-user]

*   The *Disabled* tab contains only disabled users.

    ![!Disabled users list][img-disabled-users]

You can click the cells in the table header to sort users by name, role, email, and last login date.

Also, you can choose one or several users by checking the checkboxes on the left from a user name; therefore, you will be able to do operations on a group of users. 

## Searching Users

You can use the search field above the table to search users by name, email, or system role.

![!Searching a user][img-search-user]

## Create a User

1.  In the *Users* tab of the *Settings* section, click the *Add user* button.
2.  Select the user role from the dropdown list.
3.  Enter a first and a last name, an email, and a temporary password for the user.

    ![!New user form][img-add-user]

4.  Click the *Add user* button.

The new user will receive an automatic email with a link to login and set a new password.

## Change the User Info

To change the data on the user, perform the following actions:
1.  In the *Users* tab of the *Settings* section, select the user to edit.
2.  Open the user actions menu by clicking the button to the right of the corresponding user.

    ![!User actions menu][img-user-menu]

3.  Click *Edit user settings*.
4.  In the form that appears, enter the new user info and click the *Save* button.

    ![!User info editing form][img-edit-user]

The old user info will be replaced with the new.

## Two-Factor Authentication Settings Reset

To reset the two-factor authentication settings, perform the following actions:
1.  In the *Users* tab of the *Settings* section, select the desired user.
2.  Open the user actions menu by clicking the button to the right of the corresponding user.

    ![!User actions menu][img-user-menu-disable-2fa]

3.  Click *Disable 2FA*.
4.  In the form that appears, enter your Wallarm administrator account password and click the *Disable 2FA* button.

    ![!Disabling 2-factor authentication][img-user-disable-2fa]

The 2-factor authentication function will be disabled for the selected user.

## Disable Access for a User

Disabling access for a user disables their Wallarm account.

To disable a particular user’s Wallarm account, perform the following actions:
1.  In the *Users* tab of the *Settings* section, select the desired user.
2.  Open the user actions menu by clicking the button to the right of the corresponding user.

    ![!User actions menu][img-user-menu]

3.  Click *Disable Access*.

Now the selected user from your company will not be able to use their Wallarm account.

If it is necessary to disable access for several user accounts, select the users whose access you need to revoke. The action panel will appear. Click the *Disable Access* button on this panel.

![!Disabling several users' accounts][img-disable-delete-multi]

## Enable Access for a User

Enabling access for a user enables their Wallarm account.

To enable a particular user’s Wallarm account, perform the following actions:
1.  In the *Users* tab of the *Settings* section, select the desired user with disabled access.
2.  Open the user actions menu by clicking the button to the right of the corresponding user.

    ![!Disabled user actions menu][img-disabled-user-menu]

3.  Click *Enable Access*.

Now the selected user from your company will be able to use their Wallarm account.

If it is necessary to enable access for several user accounts, select the users you need to grant access to. The action panel will appear. Click the *Enable Access* button on this panel.

![!Enabling several users' accounts][img-enable-delete-multi]

## Delete a User

To delete a  particular user account, perform the following actions:
1.  In the *Users* tab of the *Settings* section, select the user to delete.
2.  Open the user actions menu by clicking the button to the right of the corresponding user.

    ![!User actions menu][img-user-menu]

3.  Click *Delete*.

If it is necessary to delete several user accounts, select the users whose accounts you need to delete. The action panel will appear. Click the *Delete* button on this panel.

![!Deleting several users' accounts][img-disable-delete-multi]

!!! info "See also"
    [User activity log][link-audit-log]
