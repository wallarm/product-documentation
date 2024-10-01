[link-using-search]:    ../search-and-filters/use-search.md
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[al-brute-force-attack]:      ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing
[al-bola]:                    ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[link-analyzing-attacks]:       analyze-attack.md
[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png
[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png
[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload

# Grouping and Sampling of Hits

When [analyzing attacks](check-attack.md), it is important to understand how malicious requests are presented. Wallarm uses hit grouping and sampling techniques to simplify the attack list. These techniques are explained in this article.

## Grouping of hits

Wallarm groups [hits](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) into one attack using two grouping methods:

* Basic grouping
* Grouping of hits by source IP

These methods do not exclude each other. If hits have characteristics of both methods, they are all grouped into one attack.

### Basic grouping

The hits are grouped if they have the same attack type, the parameter with the malicious payload, and the address the hits were sent to. Hits may come from the same or different IP addresses and have different values of the malicious payloads within one attack type.

This hit grouping method is basic, applied to all hits and cannot be disabled or modified.

### Grouping of hits by source IP

The hits are grouped if they have the same source IP address. If grouped hits have different attack types, malicious payloads and URLs, attack parameters will be marked with the `[multiple]` tag in the attack list.

This hit grouping method works for all hits except for the ones of the Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb and Virtual patch attack types.

If hits are grouped by this method, the [**Mark as false positive**](check-attack.md#false-positives) button and the [active verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) option are unavailable for the attack.

Grouping by source IP is by default enabled in Wallarm Console → **Triggers** with the **Hits from the same IP** default trigger which activates when a single IP address originates more than 50 hits within 15 minutes.

![Example of a trigger for hit grouping](../../images/user-guides/triggers/trigger-example-group-hits.png)

You can adjust grouping by source IP under your needs: do this by creating your custom triggers of the **Hits from the same IP** type. Creating any custom trigger deletes the default one, if you delete all your custom triggers, the default is restored. You can also pause grouping by temporary disabling the default trigger.

## Sampling of hits

When forming the attack details, Wallarm automatically makes information about attack more comfortable for analysis by displaying only unique [hits](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) - non-unique (comparable and identical) hits are dropped from uploading to the Wallarm Cloud and not displayed. This process is called hit **sampling**.

Hit sampling does not affect the quality of attack detection but helps to avoid its slowdown. Wallarm node continues attack detection and [blocking](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) even with hit sampling enabled.

The **Hits sampling is enabled** notification shows that sampling works now. You can click this notification or add [`sampled`](../search-and-filters/use-search.md#search-for-sampled-hits) to the search field to see only attacks that sampling was applied to. In the attack details you will see how many similar hits were detected but not displayed:

![Dropped hits](../../images/user-guides/events/bruteforce-dropped-hits.png)

!!! info "Displaying dropped hits in the attack list"
    Since dropped hits are not uploaded to the Wallarm Cloud, certain hits or whole attacks can be absent in the list of attacks.

Since dropped requests are still requests processed by the Wallarm node, the RPS value in the node details UI increases with each dropped request. The number of requests and hits on the [Threat Prevention dashboard](../dashboards/threat-prevention.md) also includes the number of dropped hits.

**When hit sampling is enabled**

* For [input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), hit sampling is disabled by default. If the percentage of attacks in your traffic is high, hit sampling is performed in two sequential stages: **extreme** and **regular**.
* For [behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), attacks of the [Data bomb](../../attacks-vulns-list.md#data-bomb) and [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit): the **regular** sampling algorithm is enabled by default. **Extreme** sampling starts only if the percentage of attacks in your traffic is high.
* For events from denylisted IPs, sampling is configured on the node side. It uploads only the first 10 identical requests to the Cloud while applying a sampling algorithm to the rest of the hits.

Sampling will be automatically disabled once the percentage of attacks in the traffic decreases.

### Extreme sampling

The extreme sampling algorithm has the following core logic:

* If hits are of the [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) type, the algorithm uploads to the Cloud only those with unique [malicious payloads](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). If several hits with the same payload are detected within an hour, only the first of them is uploaded to the Cloud and the others are dropped.
* If hits are of the [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) types, the algorithm uploads to the Cloud only the first 10% of them detected within an hour.

### Regular sampling

Regular algorithm processes only hits saved after the extreme stage, unless hits are of the [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) types. If extreme sampling is disabled for hits of these types, the regular algorithm processes the original hit set.

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
