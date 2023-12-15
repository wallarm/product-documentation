# Credential Stuffing Detection <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[Credential stuffing](https://owasp.org/www-community/attacks/Credential_stuffing) is the automated injection of stolen or weak username and password pairs (credentials) into website login forms, in order to fraudulently gain access to user accounts.

Wallarm's **Credential Stuffing Detection** gathers and displays on time the information about your application's compromised and weak credentials and attempts to use them and allows getting instant notification about such attempts.

Knowledge of accounts with stolen or weak passwords allows you to initiate measures to secure these accounts' data, like communicating with account owners, temporarily suspending access to the accounts, etc.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

Wallarm does not block requests with compromised credentials to avoid blocking legitimate users even if their passwords are weak or were compromised. However, note that credential stuffing attempts can and will be blocked if they are part of detected malicious bot activity and you have enabled the [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) module.

## Enabling

To enable Wallarm's **Credential Stuffing Detection**:

1. Make sure your [subscription plan](../about-wallarm/subscription-plans.md#subscription-plans) includes **Credential Stuffing Detection**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. Make sure you have Wallarm node version 4.10 or higher. If necessary, consider upgrading.
1. Check that your user's [role](../user-guides/settings/users.md#user-roles) allows configuring **Credential Stuffing Detection**.
1. In Wallarm Console → **Credential Stuffing Detection**, enable the functionality (disabled by default).

Once **Credential Stuffing Detection** is enabled, a [configuration](#configuring) is needed for it to start working.

## Configuring

You need to form the list of authentication endpoints to be checked for attempts of compromised credentials usage. If you use the [API Discovery](../api-discovery/overview.md) module, Wallarm provides a list of endpoints detected by API Discovery that could potentially be used for authentication. 

!!! info "Adding recommended endpoints"
    It is recommended to include endpoints detected by API Discovery to authentication endpoint list that will be checked by **Credential Stuffing Detection**.

You can also include your own unique authentication endpoints, ensuring full protection.

To form the list of authentication endpoints:

1. In Wallarm Console, access the **Credential Stuffing Detection** section.
1. Do one of the following:

    * To add the authentication endpoint found by API Discovery, expand the **Recommended endpoints** list, then click **Apply this recommendation** for endpoints you want to use.
    * To add your own unique authentication endpoint, click **Add authentication endpoint**, set [URI](../user-guides/rules/add-rule.md#uri-constructor) and the way of searching for authentication parameters:

        * By **Exact location of parameters** - you will need to indicate the exact endpoint request points where password and login are located.

            ![Credential Stuffing - Add authentication endpoint - Exact location](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-exact-location.png)

        * By **Regular expression** - endpoint parameters with password and login will be searched using [regular expression](../user-guides/rules/add-rule.md#condition-type-regex).

1. Apply the changes.

## Viewing compromised credentials usage attempts

The number of attempts to use compromised credentials in the last 7 days is displayed in the **Credential Stuffing Detection** section. Click the counter and you will be redirected to the **Attacks** section that will display all [`credential_stuffing`](../user-guides/search-and-filters/use-search.md#search-by-attack-type) attacks for the last 7 days.

Expand any of the attacks to see the list of logins which passwords were compromised.

<!--[Screenshot TBD (functionality is not ready at the moment)]-->

## Getting CSV list of compromised credentials

The overall number of compromised credentials is displayed in the **Credential Stuffing Detection** section. Click the counter and your browser will download the CSV file with the list of compromised credentials.

## Getting notified

To get immediate notifications about attempts to use the compromised credentials to your email, messenger or one of your [integrated systems](../user-guides/settings/integrations/integrations-intro.md), in the **Triggers** section of Wallarm Console, configure one or more triggers with the **Compromised user account** condition.

You can narrow notifications by application or host that you want to monitor and by the response type.

**Trigger example: notification about attempt to use compromised credentials in Slack**

In this example, if new attempt to use compromised credentials is detected for the `example.com` API host, the notification about this will be sent to your configured Slack channel.

![Credential stuffing trigger](../images/user-guides/triggers/trigger-example-credentials-stuffing.png)

<!-- Add this after node 4.10 and trigger are available

**To test the trigger:**

1. Go to Wallarm Console → **Integrations** in the [US](https://us1.my.wallarm.com/integrations/) or [EU](https://my.wallarm.com/integrations/) cloud, and configure [integration with Slack](../user-guides/settings/integrations/slack.md).
1. In **Triggers**, create trigger as shown above.
1. Send request containing compromised credentials to the `example.com/users/TBD` endpoint to get the `200` (`OK`) response:

    ```
    request TBD
    ```

1. In the **Attacks** section, check that your request has been registered as event of the `credential_stuffing` type: attempt to use the compromised credentials. 
1. Expand the attack to make sure it contains the compromised login information.
1. Check messages in your Slack channel like:
    ```
    [wallarm] Message header TBD

    Message content TBD.

    ```  -->
