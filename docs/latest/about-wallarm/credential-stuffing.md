# Credential Stuffing Detection <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[Credential stuffing](https://owasp.org/www-community/attacks/Credential_stuffing) is the automated injection of stolen or weak username/email and password pairs (credentials) into website login forms, in order to fraudulently gain access to user accounts. This article describes how to detect this type of threats using Wallarm's **Credential Stuffing Detection**.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

## How Wallarm addresses credential stuffing

Wallarm's **Credential Stuffing Detection** collects and displays real-time information about attempts to use compromised or weak credentials to access your applications. It also enables instant notifications about such attempts and forms full downloadable list of all compromised or weak credentials providing access to your applications.

Knowledge of accounts with stolen or weak passwords allows you to initiate measures to secure these accounts' data, like communicating with account owners, temporarily suspending access to the accounts, etc.

Wallarm does not block requests with compromised credentials to avoid blocking legitimate users even if their passwords are weak or were compromised. However, note that credential stuffing attempts can be blocked if:

* They are part of detected malicious bot activity and you have enabled the [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) module.
* They are part of requests with other [attack signs](../attacks-vulns-list.md).

## Security of sensitive data

To identify compromised and weak passwords, Wallarm uses a comprehensive database of more than 850 million records collected from the public [HIBP](https://haveibeenpwned.com/) compromised credentials database.

![Credential Stuffing - Schema](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-schema.png)

Wallarm's Credential Stuffing Detection keeps credentials data safe applying the following sequence of actions:

1. As request arrives to the node, it counts [SHA-1](https://en.wikipedia.org/wiki/SHA-1) from the password and sends several chars to the Cloud.
1. Cloud sends full SHA-1 encrypted compromised passwords that begin with the received chars back to the node.
1. If there is a match, the node reports a credential stuffing attack to the Cloud, the login taken from the request is included into this attack information.
1. The node passes request to the application.

Thus, credentials are never sent together, passwords are never sent unencrypted, and your clients' authorization data always stays secure.

## Enabling

To enable Wallarm's **Credential Stuffing Detection**:

1. Make sure your [subscription plan](../about-wallarm/subscription-plans.md#subscription-plans) includes **Credential Stuffing Detection**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com?subject=Change%20Wallarm%20subscription%20plan%20to%20include%20Credential%20Stuffing%20Detection&body=Hello%20Wallarm%20Sales%20Team%2C%0AI%27m%20writing%20to%20request%20the%20change%20of%20Wallarm%20subscription%20plan%20to%20the%20one%20that%20includes%20the%20Credential%20Stuffing%20Detection.%0AThank%20you%20for%20your%20time%20and%20assistance.).
1. Make sure you have Wallarm node [version 4.10](../updating-migrating/what-is-new.md) or higher. If necessary, consider upgrading.
1. Check that your user's [role](../user-guides/settings/users.md#user-roles) allows configuring **Credential Stuffing Detection**.
1. In Wallarm Console → **Credential Stuffing**, enable the functionality (disabled by default).

Once **Credential Stuffing Detection** is enabled, a [configuration](#configuring) is needed for it to start working.

## Configuring

You need to form the list of authentication endpoints to be checked for attempts of compromised credentials usage. To form the list, navigate to Wallarm Console → **Credential Stuffing**.

There are two ways of adding endpoints to the list:

* From the **Recommended endpoints** list that includes two types of elements:

    * Wallarm's predefined rules utilizing regular expressions to specify commonly used authentication endpoints and their parameters storing passwords and logins.

        ![Credential Stuffing - Recommended Endpoints - Predefined rules](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-predefined-rules.png)

    * Endpoints used for authentication that were found by the [API Discovery](../api-discovery/overview.md) module and recorded as they actually received traffic.

* Manually - you can also include your own unique authentication endpoints, ensuring full protection. When adding manually, set [URI](../user-guides/rules/add-rule.md#uri-constructor) and the way of searching for authentication parameters:

    * By **Exact location of parameters** - you will need to indicate the exact endpoint [request points](../user-guides/rules/add-rule.md#points) where password and login are located.

        ![Credential Stuffing - Add authentication endpoint - Exact location](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-exact-location.png)

    * By **Regular expression** - endpoint parameters with password and login will be searched using [regular expression](../user-guides/rules/add-rule.md#condition-type-regex).

        ![Credential Stuffing - Add authentication endpoint - Regular expression](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-regexp.png)

## Viewing compromised credentials usage attempts

The number of attempts to use compromised credentials in the last 7 days is displayed in the **Credential Stuffing** section. Click the counter and you will be redirected to the **Attacks** section that will display all [`credential_stuffing`](../user-guides/search-and-filters/use-search.md#search-by-attack-type) attacks for the last 7 days.

Expand any of the attacks to see the list of logins which passwords were compromised.

![Attacks - credential stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

## Getting CSV list of compromised credentials

The overall number of compromised credentials is displayed in the **Credential Stuffing** section. Click the counter and your browser will download the CSV file with the list of compromised credentials.

## Getting notified

To get immediate notifications about attempts to use the compromised credentials to your email, messenger or one of your [integrated systems](../user-guides/settings/integrations/integrations-intro.md), in the **Triggers** section of Wallarm Console, configure one or more triggers with the **Compromised user account** condition.

You can narrow notifications by application or host that you want to monitor and by the response type.

**Trigger example: notification about an attempt to use compromised credentials in Slack**

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
