# Viewing Events Caused by API Specification Enforcement <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

As soon as you [uploaded](setup.md) your API specification to be used for applying  specification-based security policies and configured the enforcement, the policies are starting to be applied to the requests. This article describes how to view and analyze requests that violate policies in Wallarm Console.

## Statistics on requests that violate policies

To monitor trends in policy violations, check the number of specification violations in Wallarm Console under **API Specifications** → your specification → **Policy violations** column. This data provides insights for the past 7 days.

You can click this number to see details in the **Attacks** section.

## Analysis of requests that violate policies 

In the **Attacks** section, to find events related to specification-based policy violations, use the [appropriate search keys](../user-guides/search-and-filters/use-search.md#spec-violation-tags) or corresponding filters.

Blocked and monitored events may be presented depending on the configured policy violation actions. In the event details, the violation type and link to the causing specification are displayed.

![Specification - use for applying security policies](../images/api-specification-enforcement/api-specification-enforcement-events.png)

## Overlimit events

When viewing events related to your specification policies, you can meet the **Specification processing overlimit** type of event related to the limits applied for API Specification Enforcement while it processes the requests. See details and the description of your possible actions [here](overview.md#how-it-works).

In the **Attacks** section, the overlimit events can be found using the `processing_overlimit` search key or **Processing overlimit** filter.
