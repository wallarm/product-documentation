[link-using-search]:    ../search-and-filters/use-search.md
[link-verify-attack]:   ../events/verify-attack.md
[link-check-vulns]:     ../vulnerabilities/check-vuln.md

[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-vulns-tab]:        ../../images/user-guides/events/check-vulns.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action

# Checking events

You can check detected attacks, incidents, and vulnerabilities in the **Events** section of Wallarm Console. To find required data, please use the search field as described [here][use-search] or manually set required search filters.

## Attacks

![!Attacks tab][img-attacks-tab]

* **Date**: The date and time of the malicious request.
    * If several requests of the same type were detected at short intervals, the attack duration appears under the date. Duration is the time period between the first request of a certain type and the last request of the same type in the specified timeframe. 
    * If the attack is happening at the current moment, an appropriate [label](#events-that-are-currently-happening) is displayed.
* **Requests (hits)**: The number of requests (hits) in the attack in the specified time frame. 
* **Payloads**: Attack type and the number of unique [malicious payload](../../glossary-en.md#malicious-payload). 
* **Top IP / Source**: The IP address from which the malicious requests originated. When the malicious requests originate from several IP addresses, the interface shows the IP address responsible for the most requests. There is also the following data displayed for the IP address:
     * The total number of IP addresses from which the requests in the same attack originated during the specified timeframe. 
     * The country/region in which the IP address is registered (if it was found in the databases like IP2Location or others)
     * The source type, like **Public proxy**, **Web proxy**, **Tor** or the cloud platform the IP registered in, etc (if it was found in the databases like IP2Location or others)
* **Domain / Path**: The domain, path and the application ID that the request targeted.
* Color indicator displays the status of attack blocking:

     * Orange indicator if all hits of the attack were recorded but not blocked by the filtering node because the filtering node operates in the monitoring [mode](../../admin-en/configure-wallarm-mode.md). If your application blocked the attack (for example, the application returned `403 Forbidden`), the indicator would be still orange and the **Code** column would display the code returned by the application.
     * Red indicator if all hits of the attack were blocked by the filtering node.
     * Red with a white indicator if some hits of the attack were blocked and others were only recorded ([filtration mode](../../admin-en/configure-wallarm-mode.md) for some hits is set to monitoring).
* **Code**: The server's response status code on the request. When there are several response status codes, the most frequent code and the total number of returned codes are displayed. If the filtering node blocked the request, the code would be `403` or another [custom value](../../admin-en/configuration-guides/configure-block-page-and-code.md).
* **Parameter**: The malicious request's parameters and tags of [parsers](../rules/request-processing.md) applied to the request
* **Active verification**: The attack verification status. If the attack is ticked as false positive, the corresponding mark will be shown in this column (**FP**) and the attack will not be verified again. To find attacks by the false positive action, use the search filter below
    ![!Filter for false positive][img-show-falsepositive]

To sort attacks by the time of the last request, you can use the **Sort by latest hit** switch.

## Incidents

![!Incidents tab][img-incidents-tab]

Incidents have the same parameters as attacks, except for one column: the **Vulnerabilities** column replaces the **Verification** column of the attacks. The **Vulnerabilities** column displays the vulnerability, that the corresponding incident exploited.

Clicking the vulnerability brings you to its detailed description and instructions on how to fix it.

To sort incidents by the time of the last request, you can use the **Sort by latest hit** switch.

## Vulnerabilities

![!Vulnerabilities tab][img-vulns-tab]

* **Date**: The date and time of vulnerability discovery.
* **Risk**: The danger level of the vulnerability.
* **Target**: The side to be the victim in the case of vulnerability exploitation (client, server).
* **Type**: The type of the attack that exploits the vulnerability.
* **Domain**: The domain that the vulnerability was discovered at.
* **ID**: The unique identifier of the vulnerability in the Wallarm system.
* **Title**: The title of the vulnerability.

## Events that are currently happening

You can check events in real time. If your company resources are receiving malicious requests, the following data is displayed in Wallarm Console:

* The number of events that have happened in the last 5 minutes, which will be displayed next to the **Events** section name and inside the section.
* Special label, which is shown under the event date in the attacks or the incidents table.

You may also add the `now` keyword to the search field to only display those events happening at the moment:

* `attacks now` to display attacks happening right now.
* `incidents now` to display incidents happening right now.
* `attacks incidents now` to display attacks and incidents happening right now.

![!Attacks happening right now][img-current-attacks]

## API calls to get attacks, incidents and vulberabilities

To get the attack, incident and vulnerability details, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below are some examples of the corresponding API calls.

**Get the first 50 attacks detected in the last 24 hours**

Please replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-attacks-en.md"

**Get the first 50 incidents confirmed in the last 24 hours**

The request is very similar to the previous example for a list of attacks; the `"!vulnid": null` term is added to this request. This term instructs the API to ignore all attacks without specified vulnerability ID, and this is how the system distinguishes between attacks and incidents.

Please replace `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-incidents-en.md"

**Get the first 50 vulnerabilities in the status "active" within the last 24 hours**

Please replace `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-vulnerabilities.md"

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/rhigX3DEoZ8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
