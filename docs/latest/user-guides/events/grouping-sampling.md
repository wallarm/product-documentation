# Hit Sampling

When [analyzing attacks](check-attack.md), it is important to understand how malicious requests are presented. To simplify the attack list, Wallarm samples hits before uploading them to the Wallarm Cloud.

A **hit** is a single malicious request together with the metadata the Wallarm node adds. A request is not always a single attack of one type: when Wallarm detects several malicious payloads of different [attack types](../../attacks-vulns-list.md#attack-types) in one request, it records a separate hit for each type. Sampling therefore applies to hits, not to raw requests.

## Overview

When forming the attack details, Wallarm automatically makes information about the attack easier to analyze by displaying only unique [hits](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) - non-unique (comparable and identical) hits are dropped from uploading to the Wallarm Cloud and not displayed. This process is called hit **sampling**.

Hit sampling does not affect the quality of attack detection but helps to avoid its slowdown. Wallarm node continues attack detection and [blocking](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) even with hit sampling enabled.

!!! info "Displaying dropped hits in the attack list"
    Since dropped hits are not uploaded to the Wallarm Cloud, certain hits or whole attacks can be absent in the list of attacks.

Since dropped requests are still requests processed by the Wallarm node, the RPS value in the node details UI increases with each dropped request. The number of requests and hits on the [Threat Prevention dashboard](../dashboards/threat-prevention.md) also includes the number of dropped hits.

## When hit sampling is enabled

* For [input validation attacks](../../attacks-vulns-list.md#attack-types), hit sampling is disabled by default. If the percentage of attacks in your traffic is high, hit sampling is performed in two sequential stages: **extreme** and **regular**.
* For [behavioral attacks](../../attacks-vulns-list.md#attack-types), attacks of the [Data bomb](../../attacks-vulns-list.md#data-bomb) and [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit): the **regular** sampling algorithm is enabled by default. **Extreme** sampling starts only if the percentage of attacks in your traffic is high.
* For events from denylisted IPs, sampling is configured on the node side. It uploads only the first 10 identical requests to the Cloud while applying a sampling algorithm to the rest of the hits.

Sampling will be automatically disabled once the percentage of attacks in the traffic decreases.

## Extreme sampling

The extreme sampling algorithm has the following core logic:

* If hits are of the [input validation](../../attacks-vulns-list.md#attack-types) type, the algorithm uploads to the Cloud only those with unique [malicious payloads](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). If several hits with the same payload are detected within an hour, only the first of them is uploaded to the Cloud and the others are dropped.
* If hits are of the [behavioral](../../attacks-vulns-list.md#attack-types), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) types, the algorithm uploads to the Cloud only the first 10% of them detected within an hour.

## Regular sampling

Regular algorithm processes only hits saved after the extreme stage, unless hits are of the [behavioral](../../attacks-vulns-list.md#attack-types), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#resource-overlimit) types. If extreme sampling is disabled for hits of these types, the regular algorithm processes the original hit set.

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
