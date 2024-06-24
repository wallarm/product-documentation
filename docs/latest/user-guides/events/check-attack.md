[link-using-search]:    ../search-and-filters/use-search.md
[link-verify-attack]:   ../events/verify-attack.md
[img-attacks-tab]:      ../../images/user-guides/events/check-attack.png
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[img-verification-statuses]:    ../../images/user-guides/events/attack-verification-statuses.png
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[img-verified-icon]:            ../../images/user-guides/events/verified.png#mini
[img-error-icon]:               ../../images/user-guides/events/error.png#mini
[img-forced-icon]:              ../../images/user-guides/events/forced.png#mini
[img-sheduled-icon]:            ../../images/user-guides/events/sheduled.png#mini
[img-cloud-icon]:           ../../images/user-guides/events/cloud.png#mini
[img-skip-icon]:                ../../images/user-guides/events/skipped.png#mini
[al-brute-force-attack]:      ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing
[al-bola]:                    ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[link-analyzing-attacks]:       analyze-attack.md
[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png
[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md
[img-analyze-attack]:       ../../images/user-guides/events/analyze-attack.png
[img-analyze-attack-raw]:   ../../images/user-guides/events/analyze-attack-raw.png
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png
[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload

# Checking Attacks

In Wallarm Console, you can check detected attacks in the **Attacks** section.

## Attack list

The attack list presents data on attacks for the selected period (today's attacks by default), including the number of unique [malicious payload](../../glossary-en.md#malicious-payload), blocking status (depends on the [traffic filtration mode](../../admin-en/configure-wallarm-mode.md)), and [verification status](#verifying-attacks).

![Attacks tab][img-attacks-tab]

Note that you [can use][use-search] search field and filters as alternatives.

To get the attack details, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below is the example of the API call for **getting the first 50 attacks detected in the last 24 hours**.

Please replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "Getting 100 or more attacks"
    For attack and hit sets containing 100 or more records, it is best to retrieve them in smaller pieces rather than fetching large datasets all at once, in order to optimize performance. [Explore the corresponding request example](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)

## Attack details

Expand an attack to get the list of included requests and general attack details.

![Requests in the event][img-analyze-attack]

You can quickly create [rules](../rules/rules.md) to handle similar requests in future. Expand a request inside an attack to view it in a raw format.

![Raw format of the request][img-analyze-attack-raw]

<!--## Analyze requests from denylisted IPs

[Denylisting](../../user-guides/ip-lists/overview.md) proves to be an effective defensive measure against high-volume attacks of different types. This is achieved by blocking requests at the earliest stage of processing. At the same time, it is equally important to gather comprehensive information on all blocked requests for further analysis.

Wallarm offers the ability to collect and display statistics regarding blocked requests from denylisted source IPs. This empowers you to evaluate the potency of attacks originating from denylisted IPs, and conduct precise analysis of the requests from these IPs, exploring various parameters.

!!! info "Feature availability"
    Feature is available starting from node version 4.8, for NGINX-based nodes. By default it is [enabled](../../admin-en/configure-parameters-en.md#wallarm_acl_export_enable).
    
In Wallarm, there are several ways for IP to get into the denylist. Depending on the way used, you will need to [search](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) for the associated events using different tags/filters:

* You add it manually (in the **Attacks** section, use `blocked_source` search or `Blocked Source` filter)
* It performs a behavioral attack and is automatically denylisted by:
    * [API Abuse Prevention](../../api-abuse-prevention/overview.md) module (`api_abuse`, `account_takeover`, `scraping` and `security_crawlers` search keys, the appropriate **Type** filters)
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
-->
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

* ![Verified][img-verified-icon] **Verified**: The attack has been verified.
* ![Error][img-error-icon] **Error**: An attempt to verify an attack type that does not support verification:

    * [Brute-force][al-brute-force-attack]
    * [Forced browsing][al-forced-browsing]
    * [BOLA][al-bola]
    * Attacks with a request processing limit
    * Attacks for which the vulnerabilities have already been closed
    * Attacks that do not contain enough data for verification
    * [Attacks that consist of hits grouped by originating IPs](../../admin-en/configuration-guides/protecting-with-thresholds.md)

* ![Skipped][img-skip-icon] **Skipped**: An attempt to verify an attack type has been skipped. Possible reasons:

    * Attacks sent via the gRPC or Protobuff protocol
    * Attacks sent via the HTTP protocol of the version different from 1.x
    * Attacks sent via the method different from one of the following: GET, POST, PUT, HEAD, PATCH, OPTIONS, DELETE, LOCK, UNLOCK, MOVE, TRACE
    * Failed to reach an address of an original request
    * Attack signs are in the `HOST` header
    * [Request element](../rules/request-processing.md) containing attack signs is different from one of the following: `uri` , `header`, `query`, `post`, `path`, `action_name`, `action_ext`

* ![Sheduled][img-sheduled-icon] **Scheduled**: The attack is queued for verification. To raise the priority of the attack verification in the queue, click the verification icon and then **Force verification**.
* ![Forced][img-forced-icon] **Forced**: The attack has a raised priority in the verification queue.
* ![Could not connect][img-cloud-icon] **Could not connect to the server**: It is not possible to access the server at this time.
