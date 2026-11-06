[img-attack-export]:        ../../images/user-guides/search-and-filters/attack-export.png
[link-using-search]:        use-search.md
[link-attack-filters]:      attack-filters.md

# Security Reports

You can filter events and then get the results as a file. How you do this depends on the event type:

* For [attacks](#attacks) and [incidents](#incidents), export the list to CSV from the **Attacks** or **Incidents** section. Wallarm emails you a download link.
* For [security issues](#security-issues), download a CSV or JSON report from the **Security Issues** section.
* For a [regular PDF report](#regular-reports-via-email) on incidents and active vulnerabilities, configure the email report integration.

## Attacks

In the **Attacks** section, **Export attacks as CSV** exports the attacks you currently see. The export reproduces the [filter][link-attack-filters], the time range, the grouping, and the columns of the active view, so the file matches the list on the screen.

To export attacks:

1. In Wallarm Console, go to the **Attacks** section and narrow the list down to the attacks you need.
1. Click **Export attacks as CSV**.
1. Set the **Email** to send the download link to.

    ![Exporting attacks as CSV][img-attack-export]
1. Click **Export**.

Wallarm prepares the file in the background and emails you a link to download it. The link stays valid for one week.

## Incidents

In the **Incidents** section, the export works the same way as for [attacks](#attacks): it exports the incidents you currently see, with the [filter][link-using-search] and the time range applied. Wallarm prepares the file in the background and emails you a link to download it.

## Security issues

In the **Security Issues** section, use **Download report** to get all or filtered security issues in CSV or JSON format. See [Security issue reports](../vulnerabilities.md#security-issue-reports).

## Regular reports via email

You can get a PDF report regularly - daily, weekly or monthly - via email. This report will contain data about incidents for the corresponding period and active vulnerabilities.

Set whether to get such report and how often by configuring the [email report](../../user-guides/settings/integrations/email.md) integration.
