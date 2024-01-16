# Viewing Events Caused by API Policy Enforcement

As soon as you [uploaded](setup.md) your API specification to be used for specification-based policy enforcement and configured the enforcement, the policies are starting to be applied to the requests. This article describes how to view and analyze requests that violate policies in Wallarm Console.

## Statistics on requests that violate policies

To monitor trends in policy violations, check the number of specification violations in Wallarm Console under **API Specifications** → your specification → **Policy violations** column. This data provides insights for the past 7 days.

You can click this number to see details in the **Attacks** section.

## Analysis on requests that violate policies 

In the **Attacks** section, use the **Compare to...** filter or the `spec:'<SPECIFICATION-ID>'` [search tag](../user-guides/search-and-filters/use-search.md#search-by-specification) to find all events related to the selected specification(s) policy violations. To get `<SPECIFICATION-ID>`, in **API Specifications**, open your specification for editing - `specid` will be displayed in your browser address field.

![Specification - use for API policy enforcement](../images/api-policies-enforcement/api-policies-enforcement-events.png)

Blocked and monitored events may be presented depending on the configured policy violation actions. In the event details, the violation type and link to the causing specification are displayed. Use **Type** filters to search for specific violations.

## Overlimit events

When viewing events related to your specification policies, you can meet the **Specification processing overlimit** type of event related to the limits applied for API Policy Enforcement while it processes the requests. See details and the description of your possible actions [here](overview.md#how-it-works).
