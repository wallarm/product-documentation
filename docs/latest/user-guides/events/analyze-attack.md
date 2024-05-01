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

    The button opens a pre-filled form for setting up the [rule disabling the parser](../../user-guides/rules/request-processing.md#managing-parsers).
* **Rule** to create [any individual rule](../rules/rules.md) to handle certain requests.

    The button opens a rule setup form pre-filled with the request data.

* **Detected by custom rules** section is displayed if the attack was detected by a [regexp-based customer rule](../../user-guides/rules/regex-rule.md). The section contains the link to the corresponding rule (there can be more than one) - click the link to access the rule details and edit them if necessary.

    ![Attack detected by regexp-based customer rule - editing rule](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

    [Learn how to search for such attacks →](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule)

## Analyze request in raw format

The raw format of a request is the maximum possible level of detail. Raw format view in Wallarm Console also enables copying of a request in a cURL format.

To view a request in a raw format, expand a required attack and then the request within it.

![Raw format of the request][img-analyze-attack-raw]

## Analyze requests from denylisted IPs

[Denylisting](../../user-guides/ip-lists/overview.md) proves to be an effective defensive measure against high-volume attacks of different types. This is achieved by blocking requests at the earliest stage of processing. At the same time, it is equally important to gather comprehensive information on all blocked requests for further analysis.

Wallarm offers the ability to collect and display statistics regarding blocked requests from denylisted source IPs. This empowers you to evaluate the potency of attacks originating from denylisted IPs, and conduct precise analysis of the requests from these IPs, exploring various parameters.

!!! info "Feature availability"
    Feature is available starting from node version 4.8, for NGINX-based nodes. By default it is [enabled](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable).
    
In Wallarm, there are several ways for IP to get into the denylist. Depending on the way used, you will need to [search](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) for the associated events using different tags/filters:

* You add it manually (in the **Attacks** section, use `blocked_source` search or `Blocked Source` filter)
* It performs a behavioral attack and is automatically denylisted by:
    * [API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md) module (`api_abuse`, `account_takeover`, `scraping` and `security_crawlers` search keys, the appropriate **Type** filters)
    * [`Brute force`](../../admin-en/configuration-guides/protecting-against-bruteforce.md) trigger (`brute`, `Brute force`)
    * [`Forced browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.md) trigger (`dirbust`, `Forced browsing`)
    * [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md) trigger (`bola`, `BOLA`)
    * `Number of malicious payloads` trigger (`multiple_payloads`, `Multiple payloads`)

The listed behavioral attacks can be detected only after accumulating certain statistics the required amount of which depends on the corresponding trigger thresholds. Thus, in the first stage, before denylisting, Wallarm collects this information but all requests are passed and displayed within the `Monitoring` events.

Once trigger thresholds are exceeded, malicious activity is considered to be detected, and Wallarm places the IP in the denylist, the node starts immediate blocking of all requests originating from them.

As soon as sending of information about requests from denylisted IPs is enabled, you will see `Blocked` requests from these IPs in the event list. This applies to manually denylisted IPs as well.

![Events related to denylisted IPs - sending data enabled](../../images/user-guides/events/events-denylisted-export-enabled.png)

Note that search/filters will display both `Monitoring` and - if sending information is enabled - `Blocked` events for each attack type. For manually denylisted IPs a `Monitoring` event never exists.

Within the `Blocked` events, use tags to switch to the reason of denylisting - BOLA settings, API Abuse Prevention, trigger or causing record in denylist.

## Fine-tuning of events

### Grouping of hits

You can optimize the lists of attacks and incidents by grouping [hits](../../glossary-en.md#hit) sent from the same IP address into one attack.

Grouping is enabled by default in Wallarm Console → **Triggers** with the **Hits from the same IP** default trigger which activates when a single IP address originates more than 50 hits within 15 minutes.

![Example of a trigger for hit grouping](../../images/user-guides/triggers/trigger-example-group-hits.png)

If grouped hits have different attack types, malicious payloads and URLs, attack parameters will be marked with the `[multiple]` tag in the attack list.

The hits with the Brute force, Forced browsing, Resource overlimit, Data bomb, or Virtual patch attack types are not considered in this trigger.

You can temporary disable the default trigger. You can also modify behavior provided by the default trigger - to do so, create your custom triggers of the **Hits from the same IP** type. Creating any custom trigger deletes the default one, if you delete all your custom triggers, the default is restored.

### Sampling of hits

#### Overview

Malicious traffic often consists of comparable and identical [hits](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). Storing all hits results in duplicate entries in the event list that increases both the time for event analysis and the load on the Wallarm Cloud.

Hit sampling optimizes the data storage and analysis by dropping non-unique hits from being uploaded to the Wallarm Cloud.

!!! warning "Dropped hits in the number of RPS"
    Since dropped requests are still requests processed by the Wallarm node, the RPS value in the node details UI increases with each dropped request.

    The number of requests and hits on the [Threat Prevention dashboard](../dashboards/threat-prevention.md) also includes the number of dropped hits.

Hit sampling does not affect the quality of attack detection and only helps to avoid its slowdown. Wallarm node continues attack detection and [blocking](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) even with hit sampling enabled.

#### Enabling

* For [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), hit sampling is disabled by default. If the percentage of attacks in your traffic is high, hit sampling is performed in two sequential stages: **extreme** and **regular**.
* For [behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), attacks of the [Data bomb](../../attacks-vulns-list.md#data-bomb) and [Resource overlimiting](../../attacks-vulns-list.md#overlimiting-of-computational-resources): the **regular** sampling algorithm is enabled by default. **Extreme** sampling starts only if the percentage of attacks in your traffic is high.
* For events from denylisted IPs, sampling is configured on the node side. It uploads only the first 10 identical requests to the Cloud while applying a sampling algorithm to the rest of the hits.

When the sampling algorithm is enabled, in the **Attacks** section, the **Hits sampling is enabled** notification is displayed.

Sampling will be automatically disabled once the percentage of attacks in the traffic decreases.

#### Core logic

Hit sampling is performed in two sequential stages: **extreme** and **regular**.

Regular algorithm processes only hits saved after the extreme stage, unless hits are of the [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#overlimiting-of-computational-resources) types. If extreme sampling is disabled for hits of these types, the regular algorithm processes the original hit set.

**Extreme sampling**

The extreme sampling algorithm has the following core logic:

* If hits are of the [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) type, the algorithm uploads to the Cloud only those with unique [malicious payloads](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). If several hits with the same payload are detected within an hour, only the first of them is uploaded to the Cloud and the others are dropped.
* If hits are of the [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#overlimiting-of-computational-resources) types, the algorithm uploads to the Cloud only the first 10% of them detected within an hour.

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
