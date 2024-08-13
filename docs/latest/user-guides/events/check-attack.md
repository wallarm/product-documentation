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

# Attack Analysis

This article describes how you can analyze attacks detected by the Wallarm node and take actions regarding them.

### Attack analysis

All the [attacks](grouping-sampling.md#grouping-of-hits) detected by the Wallarm platform are displayed in the **Attacks** section of the Wallarm Console. You can [filter](../../user-guides/search-and-filters/use-search.md) the list by attack date, type and other criteria, expand any attack and its included requests for detailed analysis. If a detected attack turns out to be a [false positive](#false-positives), you can immediately mark it as one to prevent alike false positives in future. Also, on the basis of the detected attacks, you can create rules and perform other Wallarm configurations to mitigate further alike threats. Additionally, if the [active verification](../../vulnerability-detection/active-threat-verification/overview.md) is enabled, check its [status](../../vulnerability-detection/active-threat-verification/overview.md#possible-statuses) right in the attack list.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/2k7dijltmvb4" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Consider the following:

* **Attack** is a [group](grouping-sampling.md#grouping-of-hits) of hits
* **Hit** is a malicious request plus metadata added by node
* **Malicious payload** is a part of request with attack sign

Read more on that terms in a [Glossary](../../glossary-en.md).

Each attack details contain all necessary information for analysis, such as attack's hits and malicious payload summary. To simplify analysis, only unique hits are stored in the attack details. Repeated malicious requests  are dropped from uploading to the Wallarm Cloud and not displayed. This process is called [hit sampling](grouping-sampling.md#sampling-of-hits).

Hit sampling does not affect the quality of attack detection and Wallarm node continues protect your applications and APIs even with hit sampling enabled.

## False positives

False positive occurs when attack signs are detected in the legitimate request. To prevent the filtering node from recognizing such requests as attacks in future, you can mark all or specific requests of the attack as false positives.

If a false positive mark is added for the attack of the type different from [information exposure](../../attacks-vulns-list.md#information-exposure), the rule disabling analysis of the same requests for detected [attack signs](../../about-wallarm/protecting-against-attacks.md#library-libproton) is automatically created. Note that it is not displayed Wallarm Console.

<!--If a false positive mark is added for the incident with the [Information Exposure](../../attacks-vulns-list.md#information-exposure) attack type, the rule disabling analysis of the same requests for detected [vulnerability signs](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods) is automatically created.
-->
You can undo a false positive mark only within a few seconds after the mark was applied. If you decided to undo it later, this can be done only by sending a request to [Wallarm technical support](mailto: support@wallarm.com).

The default view of the attack list presents only actual attacks (without false positives) - to change that, under **All attacks** switch from **Default view** to **With false positives** or **Only false positives**.

![False positive filter](../../images/user-guides/events/filter-for-falsepositive.png)

## Responding to attacks

Once attack appeared in the **Attacks** section, explore its requests to make sure it is an actual attack and not a [false positive](#false-positives). Then, investigate what mechanism caused the system reaction (note the `Blocked`, `Partially blocked` and `Monitoring` [statuses](../user-guides/events/check-attack.md#attacks) of the attacks), how the system will behave in future to alike requests and how to adjust (if necessary) this future behavior.

| Mechanism | Payload - search tag | Response | 
| -- | -- | -- |
| [Standard tools for attack detection](../../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection) (libproton, libdetection and rules)  |  [Multiple](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) | Expand an attack and explore [CVEs](../../demo-videos/events-inspection.md) summary for the attack and CVEs for separate requests. Pay your attention to the node mode (`final_wallarm_mod` tag), visit **Rules** ([US](https://us1.my.wallarm.com/rules) or [EU](https://my.wallarm.com/rules)), analyze them by application name from the attack. If necessary, adjust the rules or [filtration mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) for applications or their specific hosts or endpoints. |
| [User-defined detection rule](../../user-guides/rules/regex-rule.md) | User defined - [`custom_rule`](../../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule) | Expand an attack and follow the **Detected by custom rules** link(s) - if necessary, [modify](../../user-guides/rules/regex-rule.md) the rule(s) including [partial disabling](../../user-guides/rules/regex-rule.md#partial-disabling) it for particular branches. |
| [Trigger](../../user-guides/triggers/triggers.md) | [Multiple](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) | Expand an attack and after analyzing the requests, click the displayed trigger name (if presented) and modify its parameters. Also note trigger tags, then go to **Triggers** ([US](https://us1.my.wallarm.com/triggers) or [EU](https://my.wallarm.com/triggers)) and find trigger by name, if necessary - adjust it. |
| IP lists: [requests from denylisted IPs](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) | Multiple - <br>`blocked_source`,<br>`brute`,<br>`dirbust`,<br>`bola`,<br>`multiple_payloads` | Expand an attack and analyze requests from denylisted IP; after that, click the displayed trigger name and - if necessary - modify trigger settings. For manually denylisted IPs (`blocked_source`), go to **IP Lists** ([US](https://us1.my.wallarm.com/ip-lists) or [EU](https://my.wallarm.com/ip-lists)) and search by IP: if necessary, adjust time period for IP staying in denylist. |
| **Specific module or function:** |
| [API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md) | [Multiple](../../attacks-vulns-list.md#api-abuse) - `api_abuse` and multiple specific, see full list [here](../../attacks-vulns-list.md#api-abuse) | Expand an attack and analyze the [heatmaps](../../user-guides/api-abuse-prevention.md#exploring-blocked-malicious-bots-and-their-attacks) proving the [confidence](../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works) that it is a bot, note the date of the attack and source IP. Go to **IP lists**, filter by date and IP, click **Reason** column to see IP address details, explore these details, click **Triggered profile**, explore it and [change](../user-guides/api-abuse-prevention.md#creating-api-abuse-profile) if necessary. <br><br>**Additionally you can**:  In **IP Lists**, click the IP address itself to go back to **Events** and see all related attacks.|
| [BOLA Autoprotection](../../api-discovery/bola-protection.md) by [API Discovery](../../api-discovery/overview.md) | BOLA - `bola` | Expand an attack, if one does not contain link to trigger (which is the sing of manual protection from BOLA) then it is autoprotection provided by the **API Discovery** ([US](https://us1.my.wallarm.com/api-discovery) or [EU](https://my.wallarm.com/api-discovery)) module. If necessary, navigate to the **BOLA Protection** ([US](https://us1.my.wallarm.com/bola-protection) or [EU](https://my.wallarm.com/bola-protection)) section to either disable this protection or adjust template with its settings. |
| [API Specification Enforcement](../../api-specification-enforcement/overview.md) | [Multiple](../../attacks-vulns-list.md#api-specification) - `api_specification` and multiple specific, see full list [here](../../attacks-vulns-list.md#api-specification) | Expand an attack and follow the link to the violated specification. At the specification dialog, use the **API specification enforcement** tab to adjust settings, consider uploading the latest version of specification via the **Specification upload** tab. |
| [GraphQL API Protection](../../api-protection/graphql-rule.md) | GraphQL <...> - `graphql_<...>`, see full list [here](../../attacks-vulns-list.md#graphql-attacks) | Expand an attack and follow the **GraphQL security policies** link - if necessary, modify existing **Detect GraphQL attacks** rule(s) or create additional ones for particular branches. |

## API calls to get attacks

To get the attack details, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below is the example of the API call for **getting the first 50 attacks detected in the last 24 hours**.

Please replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "Getting 100 or more attacks"
    For attack and hit sets containing 100 or more records, it is best to retrieve them in smaller pieces rather than fetching large datasets all at once, in order to optimize performance. [Explore the corresponding request example](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)
