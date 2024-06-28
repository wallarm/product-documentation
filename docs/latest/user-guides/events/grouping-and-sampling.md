# Grouping and Sampling

## Grouping of hits

You can optimize the lists of attacks and incidents by grouping [hits](../../glossary-en.md#hit) sent from the same IP address into one attack.

Grouping is enabled by default in Wallarm Console → **Triggers** with the **Hits from the same IP** default trigger which activates when a single IP address originates more than 50 hits within 15 minutes.

![Example of a trigger for hit grouping](../../images/user-guides/triggers/trigger-example-group-hits.png)

If grouped hits have different attack types, malicious payloads and URLs, attack parameters will be marked with the `[multiple]` tag in the attack list.

The hits with the Brute force, Forced browsing, Resource overlimit, Data bomb, or Virtual patch attack types are not considered in this trigger.

You can temporary disable the default trigger. You can also modify behavior provided by the default trigger - to do so, create your custom triggers of the **Hits from the same IP** type. Creating any custom trigger deletes the default one, if you delete all your custom triggers, the default is restored.

## Sampling of hits

### Overview

Malicious traffic often consists of comparable and identical [hits](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). Storing all hits results in duplicate entries in the event list that increases both the time for event analysis and the load on the Wallarm Cloud.

Hit sampling optimizes the data storage and analysis by dropping non-unique hits from being uploaded to the Wallarm Cloud.

!!! warning "Dropped hits in the number of RPS"
    Since dropped requests are still requests processed by the Wallarm node, the RPS value in the node details UI increases with each dropped request.

    The number of requests and hits on the [Threat Prevention dashboard](../dashboards/threat-prevention.md) also includes the number of dropped hits.

Hit sampling does not affect the quality of attack detection and only helps to avoid its slowdown. Wallarm node continues attack detection and [blocking](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) even with hit sampling enabled.

### Enabling

* For [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), hit sampling is disabled by default. If the percentage of attacks in your traffic is high, hit sampling is performed in two sequential stages: **extreme** and **regular**.
* For [behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), attacks of the [Data bomb](../../attacks-vulns-list.md#data-bomb) and [Resource overlimiting](../../attacks-vulns-list.md#overlimiting-of-computational-resources): the **regular** sampling algorithm is enabled by default. **Extreme** sampling starts only if the percentage of attacks in your traffic is high.
* For events from denylisted IPs, sampling is configured on the node side. It uploads only the first 10 identical requests to the Cloud while applying a sampling algorithm to the rest of the hits.

When the sampling algorithm is enabled, in the **Attacks** section, the **Hits sampling is enabled** notification is displayed.

Sampling will be automatically disabled once the percentage of attacks in the traffic decreases.

### Core logic

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
