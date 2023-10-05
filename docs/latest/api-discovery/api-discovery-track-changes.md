# Track changes in API

If you update the API and the traffic structure is adjusted, API Discovery updates the built API inventory.

## Overview

The company may have several teams, disparate programming languages, and a variety of language frameworks. Thus changes can come to API at any time from different sources which make them difficult to control. For security officers it is important to detect changes as soon as possible and analyze them. If missed, such changes may hold some risks, for example:

* The development team can start using a third-party library with a separate API and they do not notify the security specialists about that. This way the company gets endpoints that are not monitored and not checked for vulnerabilities. They can be potential attack directions.
* The PII data begin to be transferred to the endpoint. An unplanned transfer of PII can lead to a violation of compliance with the requirements of regulators, as well as lead to reputational risks.
* Important for the business logic endpoint (for example, `/login`, `/order/{order_id}/payment/`) is no longer called.
* Other parameters that should not be transferred, for example `is_admin` (someone accesses the endpoint and tries to do it with administrator rights) begin to be transferred to the endpoint.

With the **API Discovery** module of Wallarm you can:

* Track changes and check that they do not disrupt current business processes.
* Make sure that no unknown endpoints have appeared in the infrastructure that could be a potential threat vector.
* Make sure PII and other unexpected parameters did not start being transferred to the endpoints.
* Configure notifications about changes in your API via [triggers](../user-guides/triggers/trigger-examples.md#new-endpoints-in-your-api-inventory) with the **Changes in API** condition.

## View changes in API

To check what changes occurred in the API within the specified period of time that, from the **Changes since** filter, select the appropriate period or date. The following marks will be displayed in the endpoint list:

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

Using the **Changes since** filter only highlights the endpoints changed within the selected period, but does not filter out endpoints without changes.

The **Changes in API** filter works differently and shows **only** endpoints changed within the selected period and filters out all the rest.

<a name="example"></a>Let us consider the example: say your API today has 10 endpoints (there were 12, but 3 of them were marked unused 10 days ago). 1 of this 10 was added yesterday, 2 have changes in their parameters occurred 5 days ago for one and 10 days ago for another:

* Each time you open the **API Discovery** section today, the **Changes since** filter will go to the `Last week` state; page will display 10 endpoints, in the **Changes** column 1 of them will have the **New** mark, and 1 - the **Changed** mark.
* Switch **Changes since** to `Last 2 weeks` - 13 endpoints will be displayed, in the **Changes** column 1 of them will have the **New** mark, 2 - the **Changed** mark, and 3 - the **Unused** mark.
* Set **Changes in API** to `Unused endpoints` - 3 endpoints will be displayed, all with the **Unused** mark.
* Change **Changes in API** to `New endpoints + Unused endpoints` - 4 endpoints will be displayed, 3 with the **Unused** mark, and 1 with the **New** mark.
* Switch **Changes since** back to `Last week` - 1 endpoint will be displayed, it will have the **New** mark.
