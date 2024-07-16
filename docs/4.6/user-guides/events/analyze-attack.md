[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md

[img-analyze-attack]:       ../../images/user-guides/events/analyze-attack.png
[img-analyze-attack-raw]:   ../../images/user-guides/events/analyze-attack-raw.png
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png

[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload

# Analyzing Events

You can check events in the **Attacks** and **Incidents** sections of Wallarm Console.

## Analyze an event

You can get information about an event of particular type (attack or incident) by investigating all the table columns described in [Checking Attacks](check-attack.md) and [Checking Incidents](check-incident.md).

## Analyze requests in an event

1. Define an attack or incident of your interest.
2. Click the number in the *Requests* column.

Clicking the number will unfold all requests in the selected event.

![Requests in the event][img-analyze-attack]

Each request displays the associated information in the following columns:

* *Date*: Date and time of the request.
* *Payload*: [malicious payload][glossary-attack-vector]. Clicking the value in the payload column displays reference information on the attack type.
* *Source*: The IP address from which the request originated. Clicking the IP address adds the IP address value into the search field. The following information is also displayed if it was found in the IP2Location or similar database:
     * The country/region in which the IP address is registered.
     * The source type, e.g. **Proxy**, **Tor** or the cloud platform the IP registered in, etc.
     * The **Malicious IPs** label will appear if the IP address is known for malicious activities. This is based on public records and expert validations.
* *Status*: The request blocking status (depends on the [traffic filtration mode](../../admin-en/configure-wallarm-mode.md)).
* *Code*: The server's response status code for the request. If the filtering node blocked the request, the code would be `403` or another [custom value](../../admin-en/configuration-guides/configure-block-page-and-code.md).
* *Size*: The server's response size.
* *Time*: The server's response time.

If the attack is happening at the current moment, the *“now”* label is shown under the request graph.

![A currently happening attack][img-current-attack]

Request view provides the following options for Wallarm behavior fine-tuning:

* [**Mark as false positive** and **False**](false-attack.md) to report legitimate requests flagged as attacks.
* **Disable base64** to indicate the base64 parser incorrectly applied to the request element.

    The button opens a pre-filled form for setting up the [rule disabling the parser](../rules/disable-request-parsers.md).
* **Rule** to create [any individual rule](../rules/add-rule.md#rule) to handle certain requests.

    The button opens a rule setup form pre-filled with the request data.

* **Detected by custom rules** section is displayed if the attack was detected by a [regexp-based customer rule](../../user-guides/rules/regex-rule.md). The section contains the link to the corresponding rule (there can be more than one) - click the link to access the rule details and edit them if necessary.

    ![Attack detected by regexp-based customer rule - editing rule](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

    [Learn how to search for such attacks →](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule)

## Analyze request in raw format

The raw format of a request is the maximum possible level of detail. Raw format view in Wallarm Console also enables copying of a request in a cURL format.

To view a request in a raw format, expand a required attack and then the request within it.

![Raw format of the request][img-analyze-attack-raw]

## Sampling of hits

Malicious traffic often consists of comparable and identical [hits](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). Storing all hits results in duplicate entries in the event list that increases both the time for event analysis and the load on the Wallarm Cloud.

Hit sampling optimizes the data storage and analysis by dropping non-unique hits from being uploaded to the Wallarm Cloud.

!!! warning "Dropped hits in the number of RPS"
    Since dropped requests are still requests processed by the Wallarm node, the RPS value in the node details UI increases with each dropped request.

    The number of requests and hits on the [Threat Prevention dashboard](../dashboards/threat-prevention.md) also includes the number of dropped hits.

Hit sampling does not affect the quality of attack detection and only helps to avoid its slowdown. Wallarm node continues attack detection and [blocking](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) even with hit sampling enabled.

### Enabling the sampling algorithm

* For [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), hit sampling is disabled by default. If the percentage of attacks in your traffic is high, hit sampling is performed in two sequential stages: **extreme** and **regular**.
* For [behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), attacks of the [Data bomb](../../attacks-vulns-list.md#data-bomb) and [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit): the **regular** sampling algorithm is enabled by default. **Extreme** sampling starts only if the percentage of attacks in your traffic is high.

When the sampling algorithm is enabled, in the **Attacks** section, the **Hits sampling is enabled** notification is displayed.

Sampling will be automatically disabled once the percentage of attacks in the traffic decreases.

### Core logic of hit sampling

Hit sampling is performed in two sequential stages: **extreme** and **regular**.

Regular algorithm processes only hits saved after the extreme stage, unless hits are of the [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) types. If extreme sampling is disabled for hits of these types, the regular algorithm processes the original hit set.

**Extreme sampling**

The extreme sampling algorithm has the following core logic:

* If hits are of the [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) type, the algorithm uploads to the Cloud only those with unique [malicious payloads](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). If several hits with the same payload are detected within an hour, only the first of them is uploaded to the Cloud and the others are dropped.
* If hits are of the [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) types, the algorithm uploads to the Cloud only the first 10% of them detected within an hour.

**Regular sampling**

The regular sampling algorithm has the following core logic:

1. The first 5 identical hits for each hour are saved in the sample in the Wallarm Cloud. The rest of the hits are not saved in the sample, but their number is recorded in a separate parameter.

    The hits are identical if all of the following parameters have the same values:

    * Attack type
    * Parameter with the malicious payload
    * Target address
    * Request method
    * Response code
    * Originating IP address
2. Hit samples are grouped into [attacks](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) in the event list.

Grouped hits are displayed in the **Attacks** or **Incidents** section of Wallarm Console as follows:

![Dropped hits](../../images/user-guides/events/bruteforce-dropped-hits.png)

To filter the list of events so that it only displays the sampled hits, click the **Hits sampling is enabled** notification. The `sampled` attribute will be [added](../search-and-filters/use-search.md#search-for-sampled-hits) to the search field, and the list of events will display only the sampled hits.

!!! info "Displaying dropped hits in the event list"
    Since dropped hits are not uploaded to the Wallarm Cloud, certain hits or whole attacks can be absent in the list of events.

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/spD3BnI6fq4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->
