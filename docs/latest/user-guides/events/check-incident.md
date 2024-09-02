[link-using-search]:    ../search-and-filters/use-search.md
[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action

# Incident Analysis

In Wallarm Console, you can analyze detected incidents in the **Incidents** section. To find required data, please use the search field as described [here][use-search] or manually set required search filters.

## Incidents

![Incidents tab][img-incidents-tab]

* **Date**: The date and time of the malicious request.
    * If several requests of the same type were detected at short intervals, the attack duration appears under the date. Duration is the time period between the first request of a certain type and the last request of the same type in the specified timeframe. 
    * If the attack is happening at the current moment, an appropriate label is displayed.
* **Payloads**: Attack type and the number of unique [malicious payload](../../glossary-en.md#malicious-payload). 
* **Hits**: The number of hits (requests) in the attack in the specified time frame. 
* **Top IP / Source**: The IP address from which the malicious requests originated. When the malicious requests originate from several IP addresses, the interface shows the IP address responsible for the most requests. There is also the following data displayed for the IP address:
     * The total number of IP addresses from which the requests in the same attack originated during the specified timeframe. 
     * The country/region in which the IP address is registered (if it was found in the databases like IP2Location or others)
     * The source type, like **Public proxy**, **Web proxy**, **Tor** or the cloud platform the IP registered in, etc (if it was found in the databases like IP2Location or others)
     * The **Malicious IPs** label will appear if the IP address is known for malicious activities. This is based on public records and expert validations
* **Domain / Path**: The domain, path and the application ID that the request targeted.
* **Status**: The attack blocking status (depends on the [traffic filtration mode](../../admin-en/configure-wallarm-mode.md)):
     * Blocked: all hits of the attack were blocked by the filtering node.
     * Partially blocked: some hits of the attack were blocked and others were only registered.
     * Monitoring: all hits of the attack were registered but not blocked.
* **Parameter**: The malicious request's parameters and tags of [parsers](../rules/request-processing.md) applied to the request
* **Vulnerabilities**: The vulnerability, that the incident exploits. Clicking the vulnerability brings you to its detailed description and instructions on how to fix it.

To sort incidents by the time of the last request, you can use the **Sort by latest hit** switch.

## API calls to get incidents

To get the incident details, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below is the example of the API call for **getting the first 50 incidents detected in the last 24 hours**.

The request is similar to the [one used](check-attack.md#api-calls-to-get-attacks) for a list of attacks; the `"!vulnid": null` term is added to request for incidents. This term instructs the API to ignore all attacks without specified vulnerability ID, and this is how the system distinguishes between attacks and incidents.

Please replace `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-incidents-en.md"
