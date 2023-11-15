[img-attacks-tab]:      ../images/user-guides/events/check-attack.png
[img-incidents-tab]:    ../images/user-guides/events/incident-vuln.png

# Attack Response Playbook

This guide summarizes how you can respond when a new attack or an incident appears in the **Events** section.

## Attack or incident

What [appears](../user-guides/events/check-attack.md) in the **Events** section may be attack or incident. [Attack](../glossary-en.md#attack) is a single or multiple grouped hits (malicious requests). [Incident](../glossary-en.md#security-incident) is an attack exploiting a confirmed vulnerability. 

![Attacks tab][img-attacks-tab]

Incidents have the same parameters as attacks, except for one column: the **Vulnerabilities** column replaces the **Verification** column of the attacks. The **Vulnerabilities** column displays the vulnerability, that the corresponding incident exploited.

![Incidents tab][img-incidents-tab]

Clicking the vulnerability brings you to its detailed description and instructions on how to fix it.

## Investigation

Once attack appeared, investigate its requests to make sure it is an actual attack and not a false positive as well as well as the mechanism of its detection.

### Is attack false positive?

**False positive** occurs when attack signs are detected in the legitimate request.

* To mark one request (hit) as a false positive, In Wallarm Console → **Events**, expand the attack, find valid request and click **False** in its **Actions** column.
* To mark all requests (hits) in the attack as false positives, expand the attack, then click **Mark as false positive**.

    ![False attack](../images/user-guides/events/analyze-attack.png)

    Note that marking as false positive creates a hidden  rule, that makes system not to consider alike requests to be attacks. To remove a false positive mark and a rule, please send a request to [Wallarm technical support](mailto: support@wallarm.com).

* In case you deal with a bot attack blocked by **API Abuse Prevention** (see "API Abuse Prevention" in [What caused system reaction and how to adjust this reaction for future?](#what-caused-system-reaction-and-how-to-adjust-this-reaction-for-future)), you cannot mark as false positive - instead use adding source IP to [exception list](../about-wallarm/api-abuse-prevention.md#exception-list) or [remove protection](../about-wallarm/api-abuse-prevention.md#disabling-bot-protection-for-specific-urls-and-requests) for specific target endpoints or for specific requests.

Get more information on working with false positives [here](../user-guides/events/false-attack.md).

### What caused system reaction and how to adjust this reaction for future?

Once you decided the detected attack is truly an attack and not a false positive, it is important to investigate what mechanism caused the system reaction (note the `Blocked`, `Partially blocked` and `Monitoring` [statuses](../user-guides/events/check-attack.md#attacks) of the attacks), how the system will behave in future to alike requests and how to adjust (if necessary) this future behavior.

| Mechanism | Payload - search tag | Analysis | 
| -- | -- | -- |
| [Standard tools for attack detection](../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection) (libproton, libdetection and rules)  |  [Multiple](../user-guides/search-and-filters/use-search.md#search-by-attack-type) | In **Events** ([US](https://us1.my.wallarm.com/search) or [EU](https://my.wallarm.com/search)), expand an attack and explore [CVEs](../demo-videos/events-inspection.md) summary for the attack and CVEs for separate requests. Pay your attention to the node mode (`final_wallarm_mod` tag), visit **Rules** ([US](https://us1.my.wallarm.com/rules) or [EU](https://my.wallarm.com/rules)), analyze them by application name from the attack. If necessary, adjust the rules for applications or their specific hosts or endpoints or change the node [filtration mode](../admin-en/configure-wallarm-mode.md#available-filtration-modes). |
| [User-defined detection rule](../user-guides/rules/regex-rule.md) | User defined - [`custom_rule`](../user-guides/search-and-filters/use-search.md#search-by-regexp-based-customer-rule) | In **Events**, expand an attack and follow the **Detected by custom rules** link(s) - if necessary, [modify](../user-guides/rules/regex-rule.md) the rule(s) including [partial disabling](../user-guides/rules/regex-rule.md#partial-disabling-of-a-new-detection-rule) it for particular branches. |
| [Trigger](../user-guides/triggers/triggers.md) | [Multiple](../user-guides/search-and-filters/use-search.md#search-by-attack-type) | In **Events**, expand an attack and after analyzing the requests, click the displayed trigger name (if presented) and modify its parameters. Also note trigger tags, then go to **Triggers** ([US](https://us1.my.wallarm.com/triggers) or [EU](https://my.wallarm.com/triggers)) and find trigger by name, if necessary - adjust it. |
| IP lists: [requests from denylisted IPs](../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) | Multiple - <br>`blocked_source`,<br>`brute`,<br>`dirbust`,<br>`bola`,<br>`multiple_payloads` | In **Events**, expand an attack and analyze requests from denylisted IP; after that, click the displayed trigger name and - if necessary - modify trigger settings. For manually denylisted IPs (`blocked_source`), go to **IP Lists** ([US](https://us1.my.wallarm.com/ip-lists) or [EU](https://my.wallarm.com/ip-lists)) and search by IP: if necessary, adjust time period for IP staying in denylist. |
| Specific module or function: |
| [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) | API Abuse - `api_abuse` | In **Events**, expand an attack and analyze the [heatmaps](../user-guides/api-abuse-prevention.md#exploring-blocked-malicious-bots-and-their-attacks) proving the [confidence](../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works) that it is a bot, note the date of the attack and source IP. Go to **IP lists**, filter by date and IP, click **Reason** column to see IP address details, explore these details, click **Triggered profile**, explore it and [change](../user-guides/api-abuse-prevention.md#creating-api-abuse-profile) if necessary. <br><br>**Additionally you can**:  In **IP Lists**, click the IP address itself to go back to **Events** and see all related attacks.|
| [BOLA Autoprotection](../api-discovery/bola-protection.md) by [API Discovery](../api-discovery/overview.md) | BOLA - `bola` | In **Events**, expand an attack, if one does not contain link to trigger (which is the sing of manual protection from BOLA) then it is autoprotection provided by the **API Discovery** ([US](https://us1.my.wallarm.com/api-discovery) or [EU](https://my.wallarm.com/api-discovery)) module. If necessary, navigate to the **BOLA Protection** ([US](https://us1.my.wallarm.com/bola-protection) or [EU](https://my.wallarm.com/bola-protection)) section to either disable this protection or adjust template with its settings. |
| API Policy Enforcement | NA | Defining what is allowed by uploading your specification, and denying all the rest. The function and corresponding events will be available starting from node 4.10. |

## Dealing with incident's vulnerability

Each [incident](../glossary-en.md#security-incident) is an attack exploiting a confirmed vulnerability. Thus, you need not only to make sure that attack was detected or blocked, but also to resolve the exploited vulnerability as soon as possible.

In **Events** ([US](https://us1.my.wallarm.com/search) or [EU](https://my.wallarm.com/search)), incidents are displayed on a separate tab. They have the  **Vulnerabilities** column that displays the vulnerability, that the corresponding incident exploited.

![Incidents tab][img-incidents-tab]

Click the vulnerability to go to its detailed description in the **Vulnerabilities** ([US](https://us1.my.wallarm.com/vulnerabilities) or [EU](https://my.wallarm.com/vulnerabilities)) section. The description contains instructions on how to fix this vulnerability and the list of related incidents.

![Vulnerability detailed information](../images/user-guides/vulnerabilities/vuln-info.png)

Resolve the vulnerability and then mark it closed in Wallarm. For detailed information, refer to [Managing Vulnerabilities](../user-guides/vulnerabilities.md) article.
