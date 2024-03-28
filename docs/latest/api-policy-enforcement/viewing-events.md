# Viewing Events Caused by API Specification Enforcement <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

As soon as you [uploaded](setup.md) your API specification to be used for applying  specification-based security policies and configured the enforcement, the policies are starting to be applied to the requests. This article describes how to view and analyze requests that violate policies in Wallarm Console.

## Statistics on requests that violate policies

To monitor trends in policy violations, check the number of specification violations in Wallarm Console under **API Specifications** → your specification → **Policy violations** column. This data provides insights for the past 7 days.

You can click this number to see details in the **Attacks** section.

## Analysis of requests that violate policies 

In the **Attacks** section, to find events related to specification-based policy violations, use the following search keys or filters:

| Violations | Search key | Filter |
| ------- | ----------------- | --------------------- |
| [All](../user-guides/search-and-filters/use-search.md#spec-violation-tags) specification-based violations | `api_specification` | **Type**: `API Specification` |
| All specification-based violations for [particular](../user-guides/search-and-filters/use-search.md#search-by-specification) specification | `spec:'<SPECIFICATION-ID>'` <br> <br> To get `<SPECIFICATION-ID>`, in **API Specifications**, open your specification for editing - `specid` will be displayed in your browser address field. | **Compare to...**: `<SPECIFICATION-NANE>` |
| Requesting an undefined endpoint | `undefined_endpoint` | **Type**: `Undefined endpoint` |
| Requesting endpoint with undefined parameter | `undefined_parameter` | **Type**: `Undefined parameter` |
| Requesting endpoint without required parameter | `missing_parameter` | **Type**: `Missing parameter` |
| Requesting endpoint with invalid parameter value | `invalid_parameter_value` | **Type**: `Invalid value` |
| Requesting endpoint without authentication method | `missing_auth` | **Type**: `Missing auth` |
| Requesting endpoint with invalid JSON | `invalid_request` | **Type**: `Invalid request` |

Blocked and monitored events may be presented depending on the configured policy violation actions. In the event details, the violation type and link to the causing specification are displayed.

![Specification - use for applying security policies](../images/api-policies-enforcement/api-policies-enforcement-events.png)

## Overlimit events

When viewing events related to your specification policies, you can meet the **Specification processing overlimit** type of event related to the limits applied for API Specification Enforcement while it processes the requests. See details and the description of your possible actions [here](overview.md#how-it-works).

In the **Attacks** section, the overlimit events can be found using the `processing_overlimit` search key or **Processing overlimit** filter.
