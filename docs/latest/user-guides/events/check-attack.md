[link-using-search]:    ../search-and-filters/use-search.md
[link-verify-attack]:   ../events/verify-attack.md
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[img-verification-statuses]:    ../../images/user-guides/events/attack-verification-statuses.png
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[img-verified-icon]:            ../../images/user-guides/events/verified.png
[img-error-icon]:               ../../images/user-guides/events/error.png#mini
[img-forced-icon]:              ../../images/user-guides/events/forced.png#mini
[img-sheduled-icon]:            ../../images/user-guides/events/sheduled.png#mini
[img-cloud-icon]:               ../../images/user-guides/events/cloud.png#mini
[img-skip-icon]:                ../../images/user-guides/events/skipped.png#mini
[img-happening-icon]:           ../../images/user-guides/events/happening.png#mini
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

# Attack analysis

In the **Attacks** section of the Wallarm Console, you can analyze detected attacks and perform actions regarding them to prevent false positives and mitigate further threats.

### Checking attacks

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/2k7dijltmvb4" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Consider the following:

* Attack is a group of hits
* Hit is a request plus metadata added by node
* Malicious payload is a part of request with attack sign

See details on that terms in a [Glossary](../../glossary-en.md).

Also

* Attack **Status** is what has been done by the node, this depends on the [traffic filtration mode](../../admin-en/configure-wallarm-mode.md)
* **Active verification** is if target was [tested](#verifying-attacks) by other payloads to be vulnerable to this attack type

## Grouping of hits

When forming the attack list, Wallarm [groups](../../glossary-en.md#attack) hits into one attack using two grouping methods:

* Basic grouping
* Grouping of hits by source IP

These methods do not exclude each other. If hits have characteristics of both methods, they are all grouped into one attack.

**Basic grouping**

The hits are grouped if they have the same attack type, the parameter with the malicious payload, and the address the hits were sent to. Hits may come from the same or different IP addresses and have different values of the malicious payloads within one attack type.

This hit grouping method is basic, applied to all hits and cannot be disabled or modified.

**Grouping of hits by source IP**

The hits are grouped if they have the same source IP address. If grouped hits have different attack types, malicious payloads and URLs, attack parameters will be marked with the `[multiple]` tag in the attack list.

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
* For [behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), attacks of the [Data bomb](../../attacks-vulns-list.md#data-bomb) and [Resource overlimiting](../../attacks-vulns-list.md#overlimiting-of-computational-resources): the **regular** sampling algorithm is enabled by default. **Extreme** sampling starts only if the percentage of attacks in your traffic is high.
* For events from denylisted IPs, sampling is configured on the node side. It uploads only the first 10 identical requests to the Cloud while applying a sampling algorithm to the rest of the hits.

Sampling will be automatically disabled once the percentage of attacks in the traffic decreases.

**Extreme sampling**

The extreme sampling algorithm has the following core logic:

* If hits are of the [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks) type, the algorithm uploads to the Cloud only those with unique [malicious payloads](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components). If several hits with the same payload are detected within an hour, only the first of them is uploaded to the Cloud and the others are dropped.
* If hits are of the [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#overlimiting-of-computational-resources) types, the algorithm uploads to the Cloud only the first 10% of them detected within an hour.

**Regular sampling**

Regular algorithm processes only hits saved after the extreme stage, unless hits are of the [behavioral](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks), [Data bomb](../../attacks-vulns-list.md#data-bomb) or [Resource overlimiting](../../attacks-vulns-list.md#overlimiting-of-computational-resources) types. If extreme sampling is disabled for hits of these types, the regular algorithm processes the original hit set.

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


## False positives

False positive occurs when attack signs are detected in the legitimate request. To prevent the filtering node from recognizing such requests as attacks in future, you can mark all or specific requests of the attack as false positives.

If a false positive mark is added for the attack of the type different from [information exposure](../../attacks-vulns-list.md#information-exposure), the rule disabling analysis of the same requests for detected [attack signs](../../about-wallarm/protecting-against-attacks.md#library-libproton)) is automatically created. Note that it is not displayed Wallarm Console.

<!--If a false positive mark is added for the incident with the [Information Exposure](../../attacks-vulns-list.md#information-exposure) attack type, the rule disabling analysis of the same requests for detected [vulnerability signs](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods) is automatically created.
-->
You can undo a false positive mark only within a few seconds after the mark was applied. If you decided to undo it later, this can be done only by sending a request to [Wallarm technical support](mailto: support@wallarm.com).

The default view of the attack list presents only actual attacks (without false positives) - to change that, under **All attacks** switch from **Default view** to **With false positives** or **Only false positives**.

![False positive filter](../../images/user-guides/events/filter-for-falsepositive.png)

## Verifying attacks

Wallarm automatically [rechecks](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) attacks for active vulnerability detection (**Active verification**).

![Attacks with various verification statuses][img-verification-statuses]

Verification statuses:

* ![Happening now][img-happening-icon] **Happening now**: the attack is happening now; it will be verified when finished.
* ![Verified][img-verified-icon] **Verified**: the attack has been verified.
* ![Error][img-error-icon] **Error**: an attempt to verify an attack type that does not support verification:

    * [Brute-force][al-brute-force-attack]
    * [Forced browsing][al-forced-browsing]
    * [BOLA][al-bola]
    * Attacks with a request processing limit
    * Attacks for which the vulnerabilities have already been closed
    * Attacks that do not contain enough data for verification
    * [Attacks that consist of hits grouped by originating IPs](../../admin-en/configuration-guides/protecting-with-thresholds.md)

* ![Skipped][img-skip-icon] **Skipped**: an attempt to verify an attack type has been skipped. Possible reasons:

    * Attacks sent via the gRPC or Protobuff protocol
    * Attacks sent via the HTTP protocol of the version different from 1.x
    * Attacks sent via the method different from one of the following: GET, POST, PUT, HEAD, PATCH, OPTIONS, DELETE, LOCK, UNLOCK, MOVE, TRACE
    * Failed to reach an address of an original request
    * Attack signs are in the `HOST` header
    * [Request element](../rules/request-processing.md) containing attack signs is different from one of the following: `uri` , `header`, `query`, `post`, `path`, `action_name`, `action_ext`

* ![Sheduled][img-sheduled-icon] **Scheduled**: the attack is queued for verification. To raise the priority of the attack verification in the queue, click the verification icon and then **Force verification**.
* ![Forced][img-forced-icon] **Forced**: the attack has a raised priority in the verification queue.
* ![Could not connect][img-cloud-icon] **Could not connect to the server**: it is not possible to access the server at this time.

## API calls to get attacks

To get the attack details, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below is the example of the API call for **getting the first 50 attacks detected in the last 24 hours**.

Please replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "Getting 100 or more attacks"
    For attack and hit sets containing 100 or more records, it is best to retrieve them in smaller pieces rather than fetching large datasets all at once, in order to optimize performance. [Explore the corresponding request example](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)
