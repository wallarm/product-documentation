[img-traffic-stats]:        ../../images/user-guides/dashboard/waf-traffic-stats.png
[img-attacks-stats]:        ../../images/user-guides/dashboard/waf-attacks-stats.png
[img-blacklist-stats]:      ../../images/user-guides/dashboard/waf-blacklist-stats.png
[img-traffic-cur-month]:    ../../images/user-guides/dashboard/waf-current-month-stats.png
[img-attacks-type]:         ../../images/user-guides/dashboard/attack-types.png
[img-attacks-sources]:      ../../images/user-guides/dashboard/attack-sources.png

[doc-setup-app]:            ../settings/applications.md
[doc-events-tab]:           ../events/check-attack.md
[doc-blacklist-tab]:        ../ip-lists/blacklist.md
[doc-scanner]:              ../scanner/intro.md

[gl-hit]:                   ../../glossary-en.md#hit

# API Security Dashboard

The API Security dashboard consists of the following data blocks:

* Statistics for the current month and the speed of request encountering
* Normal and malicious traffic
* Top targets
* Attack types
* Attack sources
* Blacklisted IP addresses

You can filter data from the last five blocks by the following parameters:

* **Application**. By default, all applications [added][doc-setup-app] in the settings.
* **Time period**. By default, one month prior to the current date.

## Statistics for the current month and the speed of request encountering

![!Current month statistics][img-traffic-cur-month]

The block contains the following parameters:

* The number of requests, [hits][gl-hit], and blocked hits in the current month
* The real-time speed at which requests and hits are encountered

## Normal and malicious traffic

![!Normal and malicious traffic][img-traffic-stats]

The graph shows the following statistics for the selected period:

* The amount of traffic
* The number of requests, hits, and incidents
* The estimated cost of attacks for the attacker: the value considers the approximate cost of IP address renting and the attacks duration

Points on the graph shows parameter values at a specific time:

* Hover the mouse pointer over a point on the graph to get summary information on traffic at a specific time.
* Click on a graph point to be redirected to the to [**Events** section][doc-events-tab] and view detailed information on each hit and incident at that point in time. 

## Top targets

![!Top targets][img-attacks-stats]

The chart shows the ratio of hits in each application for the selected period. To hide the application from the chart, uncheck the box next to the application name in the table.

The table shows data for each application for the selected period:

* The number of detected incidents
* The number of detected hits
* Trends: change in the hits' number for a selected period and for the same previous period. For example: if you check the statistics for the last month, the trend displays the difference in the hits number between the last and previous months as a percentage

## Attack types

![!Attack types][img-attacks-type]

The block contains the top types of attacks detected in requests for a selected period. Types are divided into blocks:

* Top types among all attacks
* Top types among requests that triggered the incident

Clicking the attack type redirects to the [**Events** section][doc-events-tab] with a list of hits or incidents of this type of attack for the selected period.

## Attack sources

![!Attack sources][img-attacks-sources]

The block shows statistics on the attack sources for the selected period:

* World map with the attack number distributed by source country/region
* Top attack source countries
* Top attack source resources: statistics on data centers IP addresses from which requests were received
