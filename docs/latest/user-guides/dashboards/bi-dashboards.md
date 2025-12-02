# Business Intelligence Dashboards <a href="../../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

In Wallarm, you have the ability to build and customize your own dashboards. This allows you to collect, present, and share the security data, crucial for your business in your own way serving making better, more informed decisions on required security measures. This article describes how to create, use, and share such dashboards.

## Adding dashboards

You can:

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

* Chart title is required.
* You can use filters. Filters are chart-wide, so if you have several metrics in the chart, they will all be affected by the selected filters. Consider future interaction between chart and dashboard filters.

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
