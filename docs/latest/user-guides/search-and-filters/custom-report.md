[img-custom-report]:        ../../images/user-guides/search-and-filters/custom-report.png

[link-using-search]:        use-search.md

# Creating a custom report

You can filter events and then export the results into a PDF or CSV report. Wallarm will email the custom report to the specified address.

PDF is a visually rich report, good for data analysis and presenting. This report includes:

* Summaries for attacks, vulnerabilities and incidents
* Detailed information on the events

CSV includes details on each event matching the filter and is good for the technical purposes. You can use it for creating dashboards, getting unique attacker IPs, producing a list of attacked API hosts/applications, etc.

CSV report may include several CSV files, one for each type of event - attack, incident, vulnerability. Each CSV has a maximum of 10,000 events, sorted by the events with the most hits.

## Create report

1. At the **Events** tab, [filter][link-using-search] the events.
1. Click **Export** and select PDF or CSV.
1. Set the **Send to** email.

    ![!Custom report creation window][img-custom-report]
1. Click **Export**. Wallarm will generate the report and email it.

## Download previously created PDF report

The last three PDF reports including those [generated for vulnerabilities](../vulnerabilities.md#downloading-vulnerability-report) are saved. If necessary, download them from the export window.
