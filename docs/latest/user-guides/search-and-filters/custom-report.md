[img-custom-report]:        ../../images/user-guides/search-and-filters/custom-report.png
[img-attack-export]:        ../../images/user-guides/search-and-filters/attack-export.png
[link-using-search]:        use-search.md
[link-attack-filters]:      attack-filters.md

# Security Reports

You can filter events and then get the results as a file that Wallarm emails to you. How you do this depends on the event type:

* For [attacks](#attacks), export the attack list to CSV from the **Attacks** section.
* For [incidents and vulnerabilities](#incidents-and-vulnerabilities), generate a PDF or CSV report from the **Incidents** or **Vulnerabilities** section.

## Attacks

In the **Attacks** section, **Export attacks as CSV** exports the attacks you currently see. The export reproduces the [filter][link-attack-filters], the time range, the grouping, and the columns of the active view, so the file matches the list on the screen.

To export attacks:

1. In Wallarm Console, go to the **Attacks** section and narrow the list down to the attacks you need.
1. Click **Export attacks as CSV**.
1. Set the **Email** to send the download link to.

    ![Exporting attacks as CSV][img-attack-export]
1. Click **Export**.

Wallarm prepares the file in the background and emails you a link to download it. The link stays valid for one week.

## Incidents and vulnerabilities

For incidents and vulnerabilities, Wallarm generates a report in one of two formats:

* PDF is a visually rich report, good for data analysis and presenting. This report includes:

    * Summaries for vulnerabilities and incidents
    * Detailed information on the events

* CSV includes details on each event matching the filter and is good for technical purposes. You can use it for creating dashboards, getting unique attacker IPs, producing a list of attacked API hosts/applications, etc.

    CSV report may include several CSV files, one for each type of event - incident, vulnerability. Each CSV has a maximum of 10,000 events, sorted by the events with the most hits.

### Generating

In Wallarm Console, reports can be generated from the **Incidents** or **Vulnerabilities** section. Whichever section you use, the report will contain both incidents and vulnerabilities. Report content depends on the current filters. For vulnerabilities, the report will always contain the list of currently active vulnerabilities.

To generate a report:

1. In Wallarm Console, go to **Incidents** or **Vulnerabilities** section.
1. [Filter][link-using-search] the events.
1. Click **Report** (or **PDF/CSV** for **Security Issues**) and select PDF or CSV.
1. Set the **Send to** email.

    ![Report creation window][img-custom-report]
1. Click **Export**. Wallarm will generate the report and email it.

### Downloading previous reports

The last 3 PDF reports including those [generated for vulnerabilities](../vulnerabilities.md#security-issue-reports) are saved for 6 months from the date of generation.

If necessary, download them from the export window.

### Getting regular reports via email

You can get a PDF report regularly - daily, weekly or monthly - via email. This report will contain data about incidents for the corresponding period and active vulnerabilities.

Set whether to get such report and how often by configuring the [email report](../../user-guides/settings/integrations/email.md) integration.
