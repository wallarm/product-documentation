# Creating and configuring a partner account

## Procedure for creating a partner account

To create a partner account:

1. Sign up for the Wallarm Console and send a request for switching your account to partner status to Wallarm technical support.
2. Get access to the technical client's account and obtain the parameters required to install partner nodes from the Wallarm technical support.

### Step 1: Sign up and send a request to enable partner status

1. Fill in and confirm the registration form in the Wallarm Console in the [EU Coud](https://my.wallarm.com/signup) or [US Cloud](https://us1.my.wallarm.com/signup).

    ![!Registration form](../images/signup-en.png)

    !!! info "Corporate email"
        Please sign up using a corporate email address.
2. Open your email inbox and activate the account using the link from received message.
3. Send a request for switching your account to a partner status and for creating a [technical client account](overview.md#partner-account-components) to the [Wallarm technical support](mailto:support@wallarm.com). Send the following data with the request:
    * Name of the used Wallarm Cloud (EU Cloud or US Cloud)
    * Names for a partner account and technical client account
    * Email addresses of employees who should have access to the technical client account (after switching your account to a partner status, you will be able to add employees yourself)
    * Logo for branded Wallarm Console, emails and reports
    * Language for the Wallarm Console interface (English or Russian)
    * Custom domain for the Wallarm Console, certificate and encryption key for the domain
    * Your technical support email address

### Step 2: Access the partner account and get parameters for the filtering node configuration

After switching your account to partner status and creating a [technical client account](overview.md#partner-account-components), Wallarm technical support staff will:

* Add you to the list of users of the technical client account with the [role](../user-guides/settings/users.md) **Global administrator**.
* If you sent email adrresses of your employees, the Wallarm technical support will add employees to the list of users of the technical client account with the [role](../user-guides/settings/users.md) **Global read only**. Unregistered employees will receive emails with the link for setting a new password to access the technical client account.
* Send you the partner UUID. The credential will be used for linking clients.

## Providing employees with access to a technical client account

To manage partner nodes with your team, you can provide your employees with access to the [technical client account](overview.md#partner-account-components). Employees can be added to the account with the following user roles:

* Regular roles provide access only to the technical client account
* Global roles provide access to the technical client account and to the accounts of all partner clients linked to the partner account

[Open the roles description →](../user-guides/settings/users.md)
