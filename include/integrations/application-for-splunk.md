To get Wallarm events organized into a ready-to-use dashboard in Splunk 9.0 or later, you can install the [Wallarm application for Splunk](https://splunkbase.splunk.com/app/6610).

This application provides you with a pre-configured dashboard that is automatically filled with the events received from Wallarm. In addition to that, the application enables you to proceed to detailed logs on each event and export the data from the dashboard.

![Splunk dashboard][splunk-dashboard-by-wallarm-img]

To install the Wallarm application for Splunk:

1. In the Splunk UI ➝ **Apps** find the `Wallarm API Security` application.
1. Click **Install** and input the Splunkbase credentials.

If some Wallarm events are already logged in Splunk, they will be displayed on the dashboard, as well as further events Wallarm will discover.

In addition, you can fully customize the ready-to-use dashboard, e.g. its view or [search strings](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Search) used to extract data from all Splunk records.
