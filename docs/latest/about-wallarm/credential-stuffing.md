# Credential Stuffing Detection <a href="../subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[Credential stuffing](../attacks-vulns-list.md#credential-stuffing) is a cyber attack where hackers use lists of compromised user credentials to gain unauthorized access to user accounts on multiple websites. This article describes how to detect this type of threats using Wallarm's **Credential Stuffing Detection**.

<div>
        <script src="https://js.storylane.io/js/v1/storylane.js"></script>
        <div class="sl-embed" style="position:relative;padding-bottom:calc(51.72% + 27px);width:100%;height:0;transform:scale(1)">
          <iframe class="sl-demo" src="https://wallarm.storylane.io/demo/sz9nukwy2hx4" name="sl-embed" allow="fullscreen" style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
        </div>
      </div>

A credential stuffing attack is hazardous because of the common practice of reusing identical usernames and passwords across different services, along with the tendency to choose easily guessable (weak) passwords. A successful credential stuffing attack requires fewer attempts, so attackers can send requests much less frequently, which makes standard measures like brute force protection ineffective.

## How Wallarm addresses credential stuffing

Wallarm's **Credential Stuffing Detection** collects and displays real-time information about attempts to use compromised or weak credentials to access your applications. It also enables instant notifications about such attempts and forms downloadable list of all compromised or weak credentials providing access to your applications.

To identify compromised and weak passwords, Wallarm uses a comprehensive database of more than **850 million records** collected from the public [HIBP](https://haveibeenpwned.com/) compromised credentials database.

![Credential Stuffing - Schema](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-schema.png)

Wallarm's Credential Stuffing Detection keeps credentials data safe applying the following sequence of actions:

1. As the request arrives at the node, it generates [SHA-1](https://en.wikipedia.org/wiki/SHA-1) from the password and sends several chars to the Cloud.
1. Cloud checks its database of known compromised passwords looking for those starting with the received chars. If found, they are sent to the node in the SHA-1 encrypted format, and the node compares them to the password from the request.
1. If it is a match, the node reports a credential stuffing attack to the Cloud, including the login taken from the request to this attack information.
1. The node passes the request to the application.

Thus, passwords from machines with Wallarm nodes are never sent to the Wallarm Cloud unencrypted. Credentials are not sent simultaneously, ensuring clients' authorization data remains secure within your network.

**Mass and single attempts**

Credential Stuffing Detection is capable of registering both massive attempts of usage of the compromised credentials performed by bots and single attempts, undetectable by other means.

**Mitigation measures**

Knowledge of accounts with stolen or weak passwords allows you to initiate measures to secure these accounts' data, like communicating with account owners, temporarily suspending access to the accounts, etc.

Wallarm does not block requests with compromised credentials to avoid blocking legitimate users even if their passwords are weak or were compromised. However, note that credential stuffing attempts can be blocked if:

* They are part of detected malicious bot activity and you have enabled the [API Abuse Prevention](../api-abuse-prevention/overview.md) module.
* They are part of requests with other [attack signs](../attacks-vulns-list.md).

## Enabling

To enable Wallarm's **Credential Stuffing Detection**:

1. Make sure your [subscription plan](../about-wallarm/subscription-plans.md#core-subscription-plans) includes **Credential Stuffing Detection**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com?subject=Change%20Wallarm%20subscription%20plan%20to%20include%20Credential%20Stuffing%20Detection&body=Hello%20Wallarm%20Sales%20Team%2C%0AI%27m%20writing%20to%20request%20the%20change%20of%20Wallarm%20subscription%20plan%20to%20the%20one%20that%20includes%20the%20Credential%20Stuffing%20Detection.%0AThank%20you%20for%20your%20time%20and%20assistance.).
1. Ensure your Wallarm node is [version 4.10](../updating-migrating/what-is-new.md) or higher, deployed using one of the specified artifacts:

    * [All-in-one installer](../installation/nginx/all-in-one.md)
    * [Helm chart for NGINX-based Ingress controller](../admin-en/installation-kubernetes-en.md)
    * [NGINX-based Docker image](../admin-en/installation-docker-en.md)
    * [Amazon Machine Image (AMI)](../installation/cloud-platforms/aws/ami.md)
    * [Google Cloud Machine Image](../installation/cloud-platforms/gcp/machine-image.md)
1. Check that your user's [role](../user-guides/settings/users.md#user-roles) allows configuring **Credential Stuffing Detection**.
1. In Wallarm Console → **Credential Stuffing**, enable the functionality (disabled by default).

Once **Credential Stuffing Detection** is enabled, a [configuration](#configuring) is needed for it to start working.

## Configuring

You need to form the list of authentication endpoints to be checked for attempts of compromised credentials usage. To form the list, navigate to Wallarm Console → **Credential Stuffing**.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

There are two ways of adding endpoints to the list:

* From the **Recommended endpoints** list that includes two types of elements:

    * Wallarm's predefined rules utilizing regular expressions to specify commonly used authentication endpoints and their parameters storing passwords and logins.
    <!--
        ![Credential Stuffing - Recommended Endpoints - Predefined rules](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-predefined-rules.png)
    -->
    * Endpoints used for authentication that were found by the [API Discovery](../api-discovery/overview.md) module and recorded as they actually received traffic.

* Manually - you can also include your own unique authentication endpoints, ensuring full protection. When adding manually, set [URI](../user-guides/rules/rules.md#uri-constructor) and the way of searching for authentication parameters:

    * By **Exact location of parameters** - you will need to indicate the exact endpoint [request points](../user-guides/rules/rules.md#configuring) where password and login are located.
    <!--
        ![Credential Stuffing - Add authentication endpoint - Exact location](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-exact-location.png)
    -->
    * By **Regular expression** - endpoint parameters with password and login will be searched using [regular expression](../user-guides/rules/rules.md#condition-type-regex).
    
        ![Credential Stuffing - Add authentication endpoint - Regular expression](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-add-endpoint-regexp.png)

## Viewing compromised credentials usage attempts

The number of attempts to use compromised credentials in the last 7 days is displayed in the **Credential Stuffing** section. Click the counter and you will be redirected to the **Attacks** section that will display all [`credential_stuffing`](../user-guides/search-and-filters/use-search.md#search-by-attack-type) attacks for the last 7 days.

Expand any of the attacks to see the list of logins which passwords were compromised.

![Attacks - credential stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing-attacks.png)

## Getting CSV list of compromised credentials

The overall number of compromised credentials is displayed in the **Credential Stuffing** section. Click the counter and your browser will download the CSV file with the list of compromised credentials.

## Getting notified

You can get immediate notifications about attempts to use the compromised credentials to your email, messenger or one of your [integrated systems](../user-guides/settings/integrations/integrations-intro.md). To enable such notifications, in the **Triggers** section of Wallarm Console, configure one or more triggers with the **Compromised user account** condition.

You can narrow notifications by the application or host that you want to monitor and by the response type.

**Trigger example: notification about an attempt to use compromised credentials in Slack**

In this example, if a new attempt to use compromised credentials is detected, a notification about this will be sent to your configured Slack channel.

![Credential stuffing trigger](../images/user-guides/triggers/trigger-example-credentials-stuffing.png)

**To test the trigger:**

1. Go to Wallarm Console → **Integrations** in the [US](https://us1.my.wallarm.com/integrations/) or [EU](https://my.wallarm.com/integrations/) cloud, and configure [integration with Slack](../user-guides/settings/integrations/slack.md).
1. In the **Credential Stuffing** section, make sure Credential Stuffing is enabled, and the following Wallarm's predefined rule is added from the **Recommended endpoints** to the active **Authentication endpoints**:

    Request is:

    ```
    /**/{{login|auth}}.*
    ```

    Password is located here:

    ```
    ([^/](|((api|current|new|old|plain)(|\.|-|_)))(pass(|word|wd))|^pass(|wd|word))$
    ```

    Login is located here:

    ```
    ^((w+.)|_|.|)(login|user|auth)(|_|-.)(user|client|auth|id|name|)(|[\d])$
    ```

1. In the **Triggers** section, create a trigger as shown above, map it to your own Slack integration.
1. Send a request containing compromised credentials to you node's `localhost/login` endpoint:

    ```
    curl -X POST http://localhost/login -d '{"password": "123456", "user": "user-01@company.com"}'
    ```

1. In the **Attacks** section, check that your request has been registered as the event of the `credential_stuffing` type: attempt to use the compromised credentials. 
1. Expand the attack to make sure it contains the compromised login information.
1. Check messages in your Slack channel. The new message should look like this:
    ```
    [wallarm] Stolen credentials detected
    
    Notification type: compromised_logins

    Stolen credentials have been detected in your incoming traffic:

    Compromised accounts: user-01@company.com
    Associated URL: localhost/login
    Link: https://my.wallarm.com/attacks/?q=attacks+d%3Alocalhost+u%3A%2Flogin+statuscode%3A404+application%3Adefault+credential_stuffing+2024%2F01%2F22

    Client: YourCompany
    Cloud: EU
    ```

## Limitations

Currently, the Credential Stuffing Detection module is not supported on Wallarm nodes deployed via [Terraform module for AWS](../installation/cloud-platforms/aws/terraform-module/overview.md).
