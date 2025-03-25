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
[link-attacks]:         ../../user-guides/events/check-attack.md
[link-incidents]:       ../../user-guides/events/check-incident.md
[link-sessions]:        ../../api-sessions/overview.md

# Attack Analysis

This article describes how you can analyze attacks detected by the Wallarm node and take actions regarding them.

### Attack analysis

All the [attacks](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components) detected by the Wallarm platform are displayed in the **Attacks** section of the Wallarm Console. You can [filter](../../user-guides/search-and-filters/use-search.md) the list by attack date, type and other criteria, expand any attack and its included requests for detailed analysis.

If a detected attack turns out to be a [false positive](#false-positives), you can immediately mark it as one to prevent alike false positives in future. Also, on the basis of the detected attacks, you can create rules and perform other Wallarm configurations to mitigate further alike threats.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/2k7dijltmvb4" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

In Wallarm:

* **Attack** is a [group](grouping-sampling.md#grouping-of-hits) of hits
* **Hit** is a malicious request plus metadata added by node
* **Malicious payload** is a part of request with attack sign

Read details [here](../../about-wallarm/protecting-against-attacks.md#what-is-attack-and-what-are-attack-components).

Each attack details contain all necessary information for analysis, such as attack's hits and malicious payload summary. To simplify analysis, only unique hits are stored in the attack details. Repeated malicious requests  are dropped from uploading to the Wallarm Cloud and not displayed. This process is called [hit sampling](grouping-sampling.md#sampling-of-hits).

Hit sampling does not affect the quality of attack detection and Wallarm node continues protect your applications and APIs even with hit sampling enabled.

## Full context of threat actor activities

--8<-- "../include/request-full-context.md"

## False positives

False positive occurs when [attack signs](../../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) are detected in the legitimate request.

To prevent the filtering node from recognizing such requests as attacks in future, **you can mark all or specific requests of the attack as false positives**. This automatically creates a rule to skip similar attack sign detection in similar requests, though it does not appear in the Wallarm Console.

You can undo a false positive mark only within a few seconds after the mark was applied. If you decided to undo it later, this can be done only by sending a request to [Wallarm technical support](mailto: support@wallarm.com).

The default view of the attack list presents only actual attacks (without false positives) - to change that, under **All attacks** switch from **Default view** to **With false positives** or **Only false positives**.

![False positive filter](../../images/user-guides/events/filter-for-falsepositive.png)

## Responding to attacks

Is is important to understand if your applications and APIs are properly protected from the attacks to have the possibility to adjust the protection measures if necessary. You can use information from the **Attacks** section to get this understanding and respond correspondingly.

When dealing with this task, you will need to identify what type of attack took place, this will give you an understanding of what Wallarm's mechanisms provided protection and then adjust these mechanisms if necessary:

1. **Identify** - in the **Payload** field context menu, select **Show only**, then pay attention to the **Type** filter and search field content.
1. Check what was done for protection - note the **Status** column:

    * `Blocked` - all hits of the attack were blocked by the filtering node.
    * `Partially blocked` - some hits of the attack were blocked and others were only registered.
    * `Monitoring` - all hits of the attack were registered but not blocked.
    * `Bot detected` - this is bot, check action within the attack.

1. Optionally (recommended), [investigate the full context](#full-context-of-threat-actor-activities) of the attack's malicious requests: to which [user session](../../api-sessions/overview.md) they belong and what the full sequence of requests in this session is.

    This allows seeing all activity and logic of the threat actor and understanding attack vectors and what resources can be compromised.

1. If you think it was not an actual attack, mark it [false positive](#false-positives).
1. **Understand** - become aware of the Wallarm mechanism that detected and reacted to attack.
1. **Adjust** - tune the Wallarm's behavior ("how" depends on mechanism).

| Identify | Understand | Adjust | 
| -- | -- | -- |
| `sqli`, `xss`, `rce`, `ptrav`, `crlf`, `nosqli`, `ssi` [etc.](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) | [Standard tools for attack detection](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection) (libproton, libdetection and rules) | Expand an attack and explore [CVEs](../../demo-videos/events-inspection.md) summary for the attack and CVEs for separate requests. Pay your attention to the node mode (`final_wallarm_mode` tag), visit **Rules** ([US](https://us1.my.wallarm.com/rules) or [EU](https://my.wallarm.com/rules)), analyze them by application name from the attack. If necessary, adjust the rules or [filtration mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) for applications or their specific hosts or endpoints. |
| [`custom_rule`](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule) | [Custom attack detector](../../user-guides/rules/regex-rule.md) | Expand an attack and follow the **Detected by custom rules** link(s) - if necessary, [modify](../../user-guides/rules/regex-rule.md) the rule(s) including [partial disabling](../../user-guides/rules/regex-rule.md#partial-disabling) it for particular branches. |
| `vpatch` | [Virtual patch](../../user-guides/rules/vpatch-rule.md) | Visit the **Rules** section ([US](https://us1.my.wallarm.com/rules) or [EU](https://my.wallarm.com/rules)), search for "Create virtual patch" rules, if necessary, adjust the rule related to your attack. Have in mind that virtual patches work regardless of the filtration mode. |
| `brute`,<br>`dirbust`,<br>`bola`,<br>`multiple_payloads` | [Trigger](../../user-guides/triggers/triggers.md) and IP lists: [requests from denylisted IPs](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | Expand an attack and after analyzing the requests, click the displayed trigger name (if presented) and modify its parameters. Also note trigger tags, then go to **Triggers** ([US](https://us1.my.wallarm.com/triggers) or [EU](https://my.wallarm.com/triggers)) and find trigger by name, if necessary - adjust it. <br> If action is [`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips), this is done via denylist - go to **IP Lists** ([US](https://us1.my.wallarm.com/ip-lists) or [EU](https://my.wallarm.com/ip-lists)) and search by IP: if necessary, adjust time period for IP staying in denylist. |
| `blocked_source` | IP lists: [requests from denylisted IPs](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | Expand an attack and analyze requests from denylisted IP; after that, click the displayed trigger name and - if necessary - modify trigger settings. For manually denylisted IPs (`blocked_source`), go to **IP Lists** ([US](https://us1.my.wallarm.com/ip-lists) or [EU](https://my.wallarm.com/ip-lists)) and search by IP: if necessary, adjust time period for IP staying in denylist. |
| **Specific module or function:** |
| `api_abuse`, `account_takeover`, `security_crawlers`, `scraping` ([details](../../attacks-vulns-list.md#api-abuse)) <br> - note the **Bot detected** status for all | [API Abuse Prevention](../../api-abuse-prevention/overview.md) and IP lists: [requests from denylisted IPs](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) | Expand an attack and analyze the [heatmaps](../../api-abuse-prevention/exploring-bots.md#attacks) proving the [confidence](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works) that it is a bot, note the date of the attack and source IP. <br> If action is [`Blocked`](../../user-guides/ip-lists/overview.md#requests-from-denylisted-ips), this is done via denylist - go to **IP lists**, filter by date and IP, click **Reason** column to see IP address details, explore these details, click **Triggered profile**, explore it and [change](../../api-abuse-prevention/setup.md#creating-profiles) if necessary. <br><br> **Also, you can**: <br> <ul><li>[Add source IP to exception list](../../api-abuse-prevention/exceptions.md) for this IP never to be blocked. Also, you can remove IP from exception list (navigate to **API Abuse Prevention** → **Exception list**)</li> <li>Add source IP to denylist, even if API abuse configuration is not supposed to do it automatically.</li></ul> **Additionally you can**:  In **IP Lists**, click the IP address itself to go back to **Events** and see all related attacks.|
| `bola` | [BOLA autoprotection](../../api-discovery/bola-protection.md) by [API Discovery](../../api-discovery/overview.md) | Expand an attack, if one does not contain link to trigger (which is the sign of manual protection from BOLA) then it is autoprotection provided by the **API Discovery** ([US](https://us1.my.wallarm.com/api-discovery) or [EU](https://my.wallarm.com/api-discovery)) module. If necessary, navigate to the **BOLA Protection** ([US](https://us1.my.wallarm.com/bola-protection) or [EU](https://my.wallarm.com/bola-protection)) section to either disable this protection or adjust template with its settings. |
| `undefined_endpoint`, `undefined_parameter`, `invalid_parameter_value`, `missing_parameter`, `missing_auth`, `invalid_request`  (`api_specification` to search for all of them, [details](../../attacks-vulns-list.md#api-specification)) | [API Specification Enforcement](../../api-specification-enforcement/overview.md) | Expand an attack and follow the link to the violated specification. At the specification dialog, use the **API specification enforcement** tab to adjust settings, consider uploading the latest version of specification via the **Specification upload** tab. |
| `gql_doc_size`, `gql_value_size`, `gql_depth`, `gql_aliases`, `gql_docs_per_batch`, `gql_introspection`, `gql_debug` (`graphql_attacks` to search for all of them, [details](../../attacks-vulns-list.md#graphql-attacks)) | [GraphQL API Protection](../../api-protection/graphql-rule.md) | Expand an attack and follow the **GraphQL security policies** link - if necessary, modify existing **Detect GraphQL attacks** rule(s) or create additional ones for particular branches. |

## Dashboards

Wallarm provides comprehensive dashboards to help you analyze detected attacks.

Wallarm's [Threat Prevention](../../user-guides/dashboards/threat-prevention.md) dashboard provides general metrics on your system's security posture, including multi-aspect information about attacks: their sources, targets, types and protocols.

![Threat Prevention dashboard](../../images/user-guides/dashboard/threat-prevention.png)

The [OWASP API Security Top 10](../../user-guides/dashboards/owasp-api-top-ten.md) dashboard provides detailed visibility into your system's security posture against the OWASP API Top 10 threats, including attack information.

![OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Notifications

Wallarm can send you notifications on detected attacks, hits and malicious payloads. It allows you to be aware of attempts to attack your system and analyze detected malicious traffic promptly. Analyzing malicious traffic includes reporting false positives, allowlisting IPs originating legitimate requests and denylisting IPs of attack sources.

To configure notifications:

1. Configure [native integrations](../../user-guides/settings/integrations/integrations-intro.md) with the systems to send notifications (e.g. PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Set the conditions for sending notifications:

    * To get notifications on each detected hit, select the appropriate option in the integration settings.

        ??? info "See the example of the notification about detected hit in the JSON format"
            ```json
            [
                {
                    "summary": "[Wallarm] New hit detected",
                    "details": {
                    "client_name": "TestCompany",
                    "cloud": "EU",
                    "notification_type": "new_hits",
                    "hit": {
                        "domain": "www.example.com",
                        "heur_distance": 0.01111,
                        "method": "POST",
                        "parameter": "SOME_value",
                        "path": "/news/some_path",
                        "payloads": [
                            "say ni"
                        ],
                        "point": [
                            "post"
                        ],
                        "probability": 0.01,
                        "remote_country": "PL",
                        "remote_port": 0,
                        "remote_addr4": "8.8.8.8",
                        "remote_addr6": "",
                        "tor": "none",
                        "request_time": 1603834606,
                        "create_time": 1603834608,
                        "response_len": 14,
                        "response_status": 200,
                        "response_time": 5,
                        "stamps": [
                            1111
                        ],
                        "regex": [],
                        "stamps_hash": -22222,
                        "regex_hash": -33333,
                        "type": "sqli",
                        "block_status": "monitored",
                        "id": [
                            "hits_production_999_202010_v_1",
                            "c2dd33831a13be0d_AC9"
                        ],
                        "object_type": "hit",
                        "anomaly": 0
                        }
                    }
                }
            ]
            ```
    
    * To set the threshold of attack, hit or malicious payload number and get notifications when the threshold is exceeded, configure appropriate [triggers](../../user-guides/triggers/triggers.md).

## API calls

To get the attack details, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below is the example of the API call for **getting the first 50 attacks detected in the last 24 hours**.

Please replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "Getting 100 or more attacks"
    For attack and hit sets containing 100 or more records, it is best to retrieve them in smaller pieces rather than fetching large datasets all at once, in order to optimize performance. [Explore the corresponding request example](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)
