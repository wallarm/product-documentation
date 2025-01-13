[img-custom-report]:        ../../images/user-guides/search-and-filters/custom-report.png
[link-using-search]:        use-search.md

# Creating Reports

You can filter events and then export the results into a PDF or CSV report. Wallarm will email the created report to the specified address.

PDF is a visually rich report, good for data analysis and presenting. This report includes:

* Summaries for attacks, vulnerabilities and incidents
* Detailed information on the events

CSV includes details on each event matching the filter and is good for the technical purposes. You can use it for creating dashboards, getting unique attacker IPs, producing a list of attacked API hosts/applications, etc.

CSV report may include several CSV files, one for each type of event - attack, incident, vulnerability. Each CSV has a maximum of 10,000 events, sorted by the events with the most hits.

## Generating

In Wallarm Console, reports can be generated from the **Attacks**, **Incidents** or **Vulnerabilities** section. Whichever section you use, the report will contain all types of events - attacks, incidents, and vulnerabilities. Report content depends on the current filters. Filters applied for the attacks are automatically applied also for the incidents and vice versa. For vulnerabilities, the report will always contain the list of currently active vulnerabilities.

To generate a report:

1. In Wallarm Console, go to **Attacks**, **Incidents** or **Vulnerabilities** section.
1. [Filter][link-using-search] the events.
1. Click **Report** (or **PDF/CSV** for **Vulnerabilities**) and select PDF or CSV.
1. Set the **Send to** email.

    ![Report creation window][img-custom-report]
1. Click **Export**. Wallarm will generate the report and email it.

## Downloading previous reports

The last 3 PDF reports including those [generated for vulnerabilities](../vulnerabilities.md#downloading-vulnerability-report) are saved for 6 months from the date of generation.

If necessary, download them from the export window.

## Getting regular reports via email

You can get PDF report regularly - daily, weekly or monthly - via email. This report will contain data about attacks, incidents for the corresponding period and active vulnerabilities.

Set whether to get such report and how often by configuring the [email report](../../user-guides/settings/integrations/email.md) integration.
