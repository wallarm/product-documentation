# Business Intelligence Dashboards <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

In Wallarm, you have the ability to build and customize your own dashboards. This allows you to collect, present, and share the security data, crucial for your business in your own way serving making better, more informed decisions on required security measures. This article describes how to create, use, and share such dashboards.

## Requirements

BI dashboards require:

* The [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) subscription plan
* Properly configured [API Sessions](../../api-sessions/overview.md) (data source for all dashboards)

## Adding dashboards

You can:

* Create any number of dashboards.
* Populate your dashboards with multiple [charts](#setting-up-charts) of different types.
* Resize and change chart positions by drag-and-drop.
* Add a dashboard to favorites; this will display it in the Wallarm's dashboard menu on the left.

    ![BI dashboards](../../images/user-guides/dashboard/bi-dashboards.png)

To add a BI dashboard:

1. Go to Wallarm Console → **BI Dashboards**.
1. Click **Add dashboard**. The **Dashboard Builder** is displayed.
1. Set the dashboard name.
1. Add and position charts.
1. Save changes. The new dashboard is added to the list. Click to view.

## Setting up charts

Depending on the chart type, settings may vary. Available types:

* Bar chart
* Line chart
* Area chart
* Donut chart
* Single metric

![BI dashboards - chart types](../../images/user-guides/dashboard/bi-dashboards-chart-types.png)

Generally, to set up a chart, you need to select metric and how it will be presented on the chart. Note that:

* Charts use [API Sessions](../../api-sessions/overview.md) as default data source (so far, only one available).
* Chart title is required.
* You can use **labels** to split data of a single metric "by label". For example, add the "Number of requests" metric, then add "Application" label to the see number of requests for each application.

    ![BI dashboards - using labels](../../images/user-guides/dashboard/bi-dashboards-labels.png)

* You can use **filters**. Filters are chart-wide, so if you have several metrics in the chart, they will all be affected by the selected filters. Consider future interaction between chart and dashboard filters.

## Using and sharing

You can:

* If added to favorites - click the dashboard name in the Wallarm's left menu.
* Access the dashboard by clicking its name in Wallarm Console → **BI Dashboards**.
* Redefine dashboard filters:

    * Default period is **the last week**
    * All applications' data is displayed by default
    * Traffic from all IP is considered by default, change by including or excluding IPs or CIDR notations
    * Consider dashboard filters interacting with chart filters.

* To share the dashboard's live state, click **Share** on its page and send the copied link.
* To share the dashboard's snapshot, apply filters, then click **Download PDF**.

## Limitations

BI dashboards use [API Sessions](../../api-sessions/overview.md) data and may differ by up to 5% from the [Threat Prevention dashboard](../../user-guides/dashboards/threat-prevention.md) or billing counts in edge cases, such as: 

* [Allowlisted IPs](../../user-guides/ip-lists/overview.md)
* [Sampling](../../user-guides/events/grouping-sampling.md#sampling-of-hits) during traffic spikes
* Limited [processing-node resources](../../admin-en/configuration-guides/allocate-resources-for-node.md) causing missed exports
