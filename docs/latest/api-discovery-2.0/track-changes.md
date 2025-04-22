# Tracking changes in API <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

If changes occur in your API, [API Discovery](overview.md) updates the built API inventory, highlights the changes and gives you information on when and what has changed.<!-- Additionally, you can set up notifications on all or some of the changes.-->

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-changes.png)

## Overview

The company may have several teams, disparate programming languages, and a variety of language frameworks. Thus changes can come to API at any time from different sources which make them difficult to control. For security officers it is important to detect changes as soon as possible and analyze them. If missed, such changes may hold some risks, for example:

* The development team can start using a third-party library with a separate API and they do not notify the security specialists about that. This way the company gets endpoints that are not monitored and not checked for vulnerabilities. They can be potential attack directions.
* The PII data begin to be transferred to the endpoint. An unplanned transfer of PII can lead to a violation of compliance with the requirements of regulators, as well as lead to reputational risks.
* Important for the business logic endpoint (for example, `/login`, `/order/{order_id}/payment/`) is no longer called.
* Other parameters that should not be transferred, for example `is_admin` (someone accesses the endpoint and tries to do it with administrator rights) begin to be transferred to the endpoint.

## Highlighting changes in API

In the **Status** column for endpoints and parameters, API Discovery provides data about changes in your API for the last week:

* **New** for the endpoints discovered within a week.
* **Changed** for the endpoints that have newly discovered parameters or parameters that obtained the `Unused` status within the period. In the details of the endpoint such parameters will have a corresponding mark.

    * A parameter gets the `New` status if is is discovered within the last week.
    * A parameter gets the `Unused` status if it does not pass any data for a week. 
    * If later the parameter in the `Unused` status passes data again it will lose the `Unused` status.

* **Unused** for the endpoints not requested (with the code 200 in response) within the last week or longer.

    * If later the endpoint in the `Unused` status is requested (with the code 200 in response) again it will lose the `Unused` status.

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-changes.png)

To change the time period, redefine dates in the **Changes since** filter.

<!--## Getting notified

To get immediate notifications about changes in API to your messenger, SIEM or log management system, configure [triggers](../user-guides/triggers/triggers.md) with the **Changes in API** condition.

You can get messages about new, changed or unused endpoints or about all of these changes. You can also narrow notifications by application or host that you want to monitor and by the type of presented sensitive data.

**Trigger example: notification about new endpoints in Slack**

In this example, if new endpoints for the `example.com` API host are discovered by the API Discovery module, the notification about this will be sent to your configured Slack channel.

![Changes in API trigger](../images/user-guides/triggers/trigger-example-changes-in-api.png)

**To test the trigger:**

1. Go to Wallarm Console → **Integrations** in the [US](https://us1.my.wallarm.com/integrations/) or [EU](https://my.wallarm.com/integrations/) cloud, and configure [integration with Slack](../user-guides/settings/integrations/slack.md).
1. In the **Triggers** section, create a trigger as shown above.
1. Send several requests to the `example.com/users` endpoint to get the `200` (`OK`) response.
1. In the **API Discovery** section, check that your endpoint was added with the **New** mark.
1. Check messages in your Slack channel like:
    ```
    [wallarm] A new endpoint has been discovered in your API

    Notification type: api_structure_changed

    The new GET example.com/users endpoint has been discovered in your API.

        Client: Client 001
        Cloud: US

        Details:

          application: Application 1802
          domain: example.com
          endpoint_path: /users
          http_method: GET
          change_type: added
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
    ```-->
