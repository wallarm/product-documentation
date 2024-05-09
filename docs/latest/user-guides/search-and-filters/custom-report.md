[img-custom-report]:        ../../images/user-guides/search-and-filters/custom-report.png
[link-using-search]:        use-search.md

# Custom Report

You can filter events and then export the results into a PDF or CSV report. Wallarm will email the custom report to the specified address.

PDF is a visually rich report, good for data analysis and presenting. This report includes:

* Summaries for attacks, vulnerabilities and incidents
* Detailed information on the events

CSV includes details on each event matching the filter and is good for the technical purposes. You can use it for creating dashboards, getting unique attacker IPs, producing a list of attacked API hosts/applications, etc.

CSV report may include several CSV files, one for each type of event - attack, incident, vulnerability. Each CSV has a maximum of 10,000 events, sorted by the events with the most hits.

## Creating report

In Wallarm Console, a custom report can be created from the **Attacks**, **Incidents** or **Vulnerabilities** section. Whichever section you use, the report will contain all type of events - attack, incidents, vulnerabilities. Report content depends on current filters. Filters applied at **Attacks** are automatically applied also for **Incidents** and vice versa. For **Vulnerabilities** the report will always contain the list of currently active vulnerabilities.

To create a report:

1. In Wallarm Console, go to **Attacks**, **Incidents** or **Vulnerabilities** section.
1. [Filter][link-using-search] the events.
1. Click **Report** (or **PDF/CSV** for **Vulnerabilities**) and select PDF or CSV.
1. Set the **Send to** email.

    ![Custom report creation window][img-custom-report]
1. Click **Export**. Wallarm will generate the report and email it.

## Downloading previously created PDF report

The last three PDF reports including those [generated for vulnerabilities](../vulnerabilities.md#downloading-vulnerability-report) are saved. If necessary, download them from the export window.

## Getting regular report via email

You can get PDF report regularly - daily, weekly or monthly - via email. This report will contain data about attacks, incidents for the corresponding period and active vulnerabilities.

Set whether to get such report and how often by configuring the [email report](../../user-guides/settings/integrations/email.md) integration.
