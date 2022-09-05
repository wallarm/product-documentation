[img-custom-report]:        ../../images/user-guides/search-and-filters/custom-report.png

[link-using-search]:        use-search.md

# Creating a custom report

You can filter events and then export the results into a PDF or CSV report. Wallarm will email the custom report to the specified address.

## Create report

1. At the **Events** tab, [filter][link-using-search] the events.
1. Click **Export** and select PDF or CSV.
1. Set the **Send to** email.

    ![!Custom report creation window][img-custom-report]
1. Click **Export**. Wallarm will generate the report and email it.

## Download previously created PDF report

3 last PDF reports are saved. If necessary, download them from the export dialog.

## CSV report

A report may include several CSV files, one for each type of event - attack, incident, vulnerability - each CSV has a maximum of 10,000 events, sorted by the events with the most hits.
