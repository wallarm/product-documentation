# Tracking changes in API <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

If changes occur in your API, [API Discovery](overview.md) updates the built API inventory, highlights the changes and gives you information on when and what has changed. Additionally, you can set up notifications on all or some of the changes.

This allows you to make sure as early as the changes occur that:

* Changes do not disrupt current business processes
* No unknown endpoints have appeared in the infrastructure that could be a potential threat vector
* PII and other unexpected parameters did not start being transferred to the endpoints

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

??? info "Examples of risks caused by missed changes in API"
    * The development team can start using a third-party library with a separate API and they do not notify the security specialists about that. This way the company gets endpoints that are not monitored and not checked for vulnerabilities. They can be potential attack directions.
    * The PII data begin to be transferred to the endpoint. An unplanned transfer of PII can lead to a violation of compliance with the requirements of regulators, as well as lead to reputational risks.
    * Important for the business logic endpoint (for example, `/login`, `/order/{order_id}/payment/`) is no longer called.
    * Other parameters that should not be transferred, for example `is_admin` (someone accesses the endpoint and tries to do it with administrator rights) begin to be transferred to the endpoint.

Quick tips for Wallarm console:

* By default, you will always see highlights for API changes in the last 7 days
* Mouse over the **New**, **Changed** or **Unused** labels to see when the change happened
* Go to **Changed** endpoint details to see reason of this status: **New** parameters and parameters that got **Unused** status - mouse over labels to see when

## Getting notified

To get notifications about changes in API to your email or messenger, in **Triggers**, configure the trigger with the **Changes in API** condition (see example [here](../user-guides/triggers/trigger-examples.md#new-endpoints-in-your-api-inventory)).

You can get messages about only new, changed or unused endpoints or about all of this changes and also narrow notifications by application or host you want to monitor or by the type of sensitive data presented in a changing endpoint.

You can configure as many **Changes in API** triggers as you need. As soon as all is done, watch your messages to stay up-to-date.

## Overviewing dashboard

Select **Dashboards** → **API Discovery**, and overview **API changes** for the last 7 days.

![API Discovery widget](../images/user-guides/dashboard/api-discovery-widget.png)

Click elements to go to **API Discovery** and have the list of the new, changed APIs or APIs that got the `Unused` status in the last 7 days.

## Highlighting changes in API

To check what changes occurred in the API within the specified period of time that, in the **API Discovery** section, from the **Changes since** filter, select the appropriate period or date. The following marks will be displayed in the endpoint list:

* **New** for the endpoints added to the list within the period.
* **Changed** for the endpoints that have newly discovered parameters or parameters that obtained the `Unused` status within the period. In the details of the endpoint such parameters will have a corresponding mark.

    * A parameter gets the `New` status if is is discovered within the period.
    * A parameter gets the `Unused` status if it does not pass any data for 7 days. 
    * If later the parameter in the `Unused` status passes data again it will lose the `Unused` status.

* **Unused** for the endpoints that obtained the `Unused` status within the period.

    * An endpoint gets the `Unused` status if it is not requested (with the code 200 in response) for 7 days.
    * If later the endpoint in the `Unused` status is requested (with the code 200 in response) again it will lose the `Unused` status.

Note that whatever period is selected, if nothing is highlighted with the **New**, **Changed** or **Unused** mark, this means there are no changes in API for that period.

![API Discovery - track changes](../images/about-wallarm-waf/api-discovery/api-discovery-track-changes.png)

!!! info "Default period"
    Each time you open the **API Discovery** section, the **Changes since** filter goes to the `Last week` state, which means only the changes occurred within the last week are highlighted.

## Filtering changes in API

In the **API Discovery** section, using the **Changes since** filter only highlights the endpoints changed within the selected period, but does not filter out endpoints without changes.

The **Changes in API** filter works differently and shows **only** endpoints changed within the selected period and filters out all the rest.

<a name="example"></a>Let us consider the example: say your API today has 10 endpoints (there were 12, but 3 of them were marked unused 10 days ago). 1 of this 10 was added yesterday, 2 have changes in their parameters occurred 5 days ago for one and 10 days ago for another:

* Each time you open the **API Discovery** section today, the **Changes since** filter will go to the `Last week` state; page will display 10 endpoints, in the **Changes** column 1 of them will have the **New** mark, and 1 - the **Changed** mark.
* Switch **Changes since** to `Last 2 weeks` - 13 endpoints will be displayed, in the **Changes** column 1 of them will have the **New** mark, 2 - the **Changed** mark, and 3 - the **Unused** mark.
* Set **Changes in API** to `Unused endpoints` - 3 endpoints will be displayed, all with the **Unused** mark.
* Change **Changes in API** to `New endpoints + Unused endpoints` - 4 endpoints will be displayed, 3 with the **Unused** mark, and 1 with the **New** mark.
* Switch **Changes since** back to `Last week` - 1 endpoint will be displayed, it will have the **New** mark.
