[link-audit-log]:               audit-log.md

[link-glossary-incident]:       ../../glossary-en.md#security-incident
[link-glossary-vulnerability]:  ../../glossary-en.md#vulnerability

[img-configure-user]:       ../../images/user-guides/settings/configure-user.png
[img-disabled-users]:       ../../images/user-guides/settings/disabled-users.png
[img-search-user]:          ../../images/user-guides/settings/search-users.png
[img-add-user]:             ../../images/user-guides/settings/integrations/webhook-examples/adding-user.png
[img-add-user-invitation-link]: ../../images/user-guides/settings/invite-user-by-link.png
[img-user-menu]:            ../../images/user-guides/settings/user-menu.png
[img-disabled-user-menu]:   ../../images/user-guides/settings/disabled-user-menu.png
[img-edit-user]:            ../../images/user-guides/settings/edit-user.png
[img-user-disable-2fa]:     ../../images/user-guides/settings/users-disable-2fa.png
[img-user-menu-disable-2fa]:    ../../images/user-guides/settings/disable-2fa-button.png
[img-disable-delete-multi]:     ../../images/user-guides/settings/users-multi-disable-access.png
[img-enable-delete-multi]:      ../../images/user-guides/settings/users-multi-enable-access.png    

# Managing Users

Invite your team members to your Wallarm account and set permissions to safeguard sensitive information and limit account actions. Manage users under **Settings** → **Users**.

Only **Administrator** and **Global Administrator** roles have user management privileges.

## Inviting a user

You can add a user to your account in two ways, both involving the creation and sharing of an invitation link. You can either have Wallarm automatically send the invitation link to the user's specified email or share the link directly with the user.

### Automatic email invitation

For this method, set up the user's role, email, and names in advance, and Wallarm will automatically send an invitation email with a link to log in and set a password to the specified user's email. The user should then follow the link to complete the signup process.

To send an invitation link automatically, click the **Add new user** button and complete the form:

![New user form][img-add-user]

After submitting the form, the user will be added to your list of users and receive an email with the invitation link.

### Manual invitation link sharing

Generate an invitation link by selecting your team member's email, their role, and the link's duration using the **Invite by link** option. Then, share this link with the intended user.

![New user inv link][img-add-user-invitation-link]

This link leads them to the Wallarm signup page to create their account by choosing a password and entering their name.

After signup, they will be added to your user list and will receive a confirmation email.

## Managing users' access and permission

Wallarm uses groups to provide users with access to Wallarm Cloud resources and set users' permissions. Include user in one or several groups in **Settings** → **Groups**.

See detailed information on working with groups [here](groups.md).

## Changing user settings

Once a user appears in the user list, you can edit their settings using the **Edit user settings** option from the corresponding user menu. This allows you to change their first name, and last name.

## Disabling 2FA

If a user has [two-factor authentication (2FA) enabled](account.md#enabling-two-factor-authentication) and you need to reset it, select the **Disable 2FA** option from the user menu. Confirm the action by entering your Wallarm administrator account password.

![User actions menu][img-user-menu-disable-2fa]

This will disable 2FA for the selected user. The user can re-enable 2FA through their profile settings.

## Disabling and deleting users

* To temporarily suspend a user's Wallarm account login capability without deleting their account information, use the **Disable access** option next to their name. This action marks them in gray in the main user list and lists them under the **Disabled** tab. Reactivate their account by choosing **Enable access**, allowing them to log in and access Wallarm again.
* For permanent removal and to revoke login access forever, select **Delete** user from the user menu. This action permanently removes them from the user list and cannot be undone.

## New user alerts

Receive instant alerts when new users are added to your Wallarm account by setting up a [trigger](../triggers/triggers.md) with the **User added** condition. Choose to be notified about specific roles or any new user addition.

Team members interested in these notifications must set up their own triggers.

**Trigger example: new user alerts to Slack**

If a new user with the **Administrator** or **Analyst** role is added to the company account in Wallarm Console, notification about this event will be sent to the email address specified in the integration and to the Slack channel.

![Example of a trigger sending the notification to Slack and by email](../../images/user-guides/triggers/trigger-example2.png)

**To test the trigger:**

1. Open the Wallarm Console → **Settings** → **Users** and add a new user.
2. Open your email Inbox and check that the following message received:

    ![Email about new user added](../../images/user-guides/triggers/test-new-user-email-message.png)
3. Open the Slack channel and check that the following notification from the user **wallarm** received:

    ```
    [Wallarm] Trigger: New user was added to the company account
    
    Notification type: create_user
    
    A new user John Smith <johnsmith@example.com> with the role Analyst was added to the company account by John Doe <johndoe@example.com>.
    This notification was triggered by the "Added user" trigger.

    Client: TestCompany
    Cloud: EU
    ```

    * `John Smith` and `johnsmith@example.com` is information about the added user
    * `Analyst` is the role of the added user
    * `John Doe` and `johndoe@example.com` is information about the user who added a new user
    * `Added user` is the trigger name
    * `TestCompany` is the name of your company account in Wallarm Console
    * `EU` is the Wallarm Cloud where your company account is registered

## Logout management

**Administrator** and **Global Administrator** [roles](users.md#user-roles) can set up logout timeouts for company account in **Settings** → **General**. Settings will affect all account users. Idle and absolute timeouts can be set.

![General tab](../../images/user-guides/settings/general-tab.png)
