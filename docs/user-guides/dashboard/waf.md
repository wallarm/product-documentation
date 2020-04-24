[img-dashboard-options]:    ../../images/user-guides/dashboard/waf-dashboard-options.png
[img-traffic-stats]:        ../../images/user-guides/dashboard/waf-traffic-stats.png
[img-attacks-stats]:        ../../images/user-guides/dashboard/waf-attacks-stats.png
[img-blacklist-stats]:      ../../images/user-guides/dashboard/waf-blacklist-stats.png

[doc-setup-app]:            ../settings/applications.md
[doc-events-tab]:           ../events/check-attack.md
[doc-blacklist-tab]:        ../blacklist.md

[gl-hit]:                   ../../glossary-en.md#hit


#   The “WAF” Dashboard

This dashboard provides you with information related to web firewall operations:
*   traffic statistics
*   data about applications under attack
*   blacklisted IP addresses

When working with this dashboard, you can
*   choose the date range you are interested in (default choice: one month prior to the current date). This choice influences all information on the dashboard.
*   choose the application you are interested in (default choice: all applications). This choice influences the displayed traffic statistics. To use this filter, [configure a few applications][doc-setup-app] first.

![!Available options][img-dashboard-options]

##  Traffic Statistics

![!Traffic statistics][img-traffic-stats]

Available statistics are
*   the number of requests, [hits][gl-hit], and blocked hits in the current month
*   the real-time speed at which requests and hits are encountered
*   graphs for the chosen date range:
    *   the amount of traffic
    *   the number of requests, hits, and incidents
    *   the approximated cost of the attacks
    
Hover the mouse pointer over a point on the graph to get extra information about exact numbers of traffic and events in the particular period of time. To view detailed data, click the point on the graph. The [*Events* tab][doc-events-tab] will open. The table on this tab will contain events or incidents in the selected period.

##  Data About Applications Under Attack

![!Data about applications under attack][img-attacks-stats]

For each configured application, the dashboard shows
*   the number of detected incidents, and
*   the number of hits.

You can filter the data displayed on the pie chart. To do this, check or uncheck the checkbox to the left of the application's name. 

##  Blacklisted IP Addresses

![!Blacklisted IP addresses][img-blacklist-stats]

This part of the dashboard shows a few blacklisted IP addresses. A reason for blocking and the time until unblocking are shown for each entry in the list.

Press the *Full list* button to be redirected to the [*Blacklist* tab][doc-blacklist-tab], where you can view the full blacklist and manage its entries.

Also, there is a graph on the right that shows statistics on IP address blocking and unblocking events.
