# Incident Search and Filters

The **Incidents** section of Wallarm Console lets you narrow the incident list down to the incidents you are interested in. It uses the same filter field and time range selector as the **Attacks** section. This article describes what works the same way and what differs.

To search detected attacks, see [Attack Search and Filters](attack-filters.md).

## Filter

The filter field builds a filter from conditions. Each condition consists of a field, an operator, and one or more values. Start typing a field name, and Wallarm suggests the fields available for your account.

The fields, the operators, the wildcards, and the way conditions combine are the same as in the **Attacks** section:

* [Filter fields](attack-filters.md#filter)
* [Operators](attack-filters.md#operators)
* [Combining conditions](attack-filters.md#combining-conditions)

The filter and the time range are stored in the page address. Reloading the page keeps them, and a copied link opens the same list for a colleague.

## Time range

The time range selector limits the data to a period, as described in [Time range](attack-filters.md#time-range).

## Grouping and views

The **Incidents** section has no **Group by** control and no views. Incidents are always grouped by attack type, HTTP method, domain, path, and parameter. See [Grouping](../events/check-incident.md#grouping).

## Export

To get the filtered incidents as a file, see [Creating Reports](custom-report.md#incidents).

## API calls

The same filters are available in the [Attacks API](../../api-sessions/attacks-api.md#3-filtering) with the `incidents` preset. See [API calls to get incidents](../events/check-incident.md#api-calls-to-get-incidents).
