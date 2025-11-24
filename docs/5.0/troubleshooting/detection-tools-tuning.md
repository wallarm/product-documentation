[ip-lists-link]:                    ../user-guides/ip-lists/overview.md
[ip-sessions-link]:                 ../api-sessions/blocking.md#blocking-sessions
[parsing-requests-link]:            ../user-guides/rules/request-processing.md  
[basic-detectors-link]:             ../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors
[custom-rules-link]:                ../about-wallarm/protecting-against-attacks.md#custom-rules
[mc-link]:                          ../about-wallarm/protecting-against-attacks.md#mitigation-controls      
[specific module settings-link]:    ../about-wallarm/protecting-against-attacks.md#specific-module-settings
[filtration-mode-link]:             ../admin-en/configure-wallarm-mode.md
[attack-handling-process-img]:      ../images/about-wallarm-waf/overview/attack-handling-diagram.png
[applications-link]:                ../user-guides/settings/applications.md         

# Detection Tools Troubleshooting

Wallarm is a set of protection tools. If they work not as expected, you can always tune them under your specific needs and situation. This article describes how to do that.

## Generic approach

1. **Understand** Wallarm's [attack handling process](#attack-handling-process): know the set of tools and how they interact when used simultaneously.
1. **Find the desired request** that Wallarm processed (e.g., marked as attack or blocked).
1. **Identify the tool** that performed the action.
1. **Tune** the tool.

## Attack handling process

To detect and handle attacks, Wallarm uses the following process:

1. Checks [IP lists](../user-guides/ip-lists/overview.md) to understand whether to process the request at all. Denylist blocks the request and allowlist allows it - both without further analysis.
1. Determines the request format and [parse](../user-guides/rules/request-processing.md) every request part to apply [basic detectors][basic-detectors-link].
1. Determines the endpoint the request is addressed to apply [custom rules][custom-rules-link] and [specific module settings][specific module settings-link] and understand the [filtration mode](../admin-en/configure-wallarm-mode.md).
1. Makes a decision whether the request is a part of attack or not based on basic detectors, custom rules and specific module settings.
1. Handles request in accordance with decision and filtration mode.

![Attack handling process - diagram](../images/about-wallarm-waf/overview/attack-handling-diagram.png)

Note that rules, settings and filtration mode can be inherited from the parent endpoint or [application](../user-guides/settings/applications.md). More specific has priority.

## Detailed approach

1. Requests are in [API Sessions](../api-sessions/exploring.md) (all: legitimate and ones that are the part of malicious activity, presented as logical sequence) or [Attacks](../user-guides/events/check-attack.md#attack-analysis_1) (only malicious).
1. Get [Allowlist](../user-guides/ip-lists/overview.md) clear - no requests from it will appear in **Attacks** even if malicious. **API Sessions** is the chance to catch malicious from Allowlist.
1. Blocked by [Denylist](../user-guides/ip-lists/overview.md)? In Attacks, use **Type** → "Blocked sources"; in Sessions, expand the session, check for presence of  "Blocked sources" attack, filter by it. Switch to **IP & Session Lists** → **IP lists** → **Denylist** and find blocked source, check **Reason**, if it was some automated tool, go to it and modify.

    * In **Denylist**, do not forget to play with dates if necessary: adding to Denylist is usually not forever, so source may have been blocked in past, not now.
    * If some specific violation was the reason of adding to Denylist, from Sessions you will be able to immediately go to control that caused the action using **Open mitigation control**.
    * You can manually edit the list, but remember automated tool is still in action and may edit the list again in future.

1. [Input validation attack](../attacks-vulns-list.md#attack-types)? Normally found by [basic detectors](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors).

    * If false, [mark as false](../about-wallarm/protecting-against-attacks.md#false-positives) - it is [safe](../about-wallarm/protecting-against-attacks.md#false-positive-safe).
    * Not satisfied with applied action? Adjust [filtration mode](../admin-en/configure-wallarm-mode.md).
    * Want to fine-tune or check what fine-tuning is already in use? In **Rules**, click **Add rule** and check the **Fine-tuning attack detection** section, search for this rules in **Rules** by filter.
    * Found by [custom detector](../user-guides/rules/regex-rule.md)? A request will contain link to it - follow the link and adjust.

1. [Behavioral attack](../attacks-vulns-list.md#attack-types)? Bot? You will easily identify [malicious bot attacks](../api-abuse-prevention/overview.md#automated-threats-blocked-by-api-abuse-prevention) both in Attacks and Sessions. Navigate to API Abuse Prevention and modify [profiles](../api-abuse-prevention/setup.md#creating-profiles) or [exceptions](../api-abuse-prevention/exceptions.md).
1. Other [behavioral attacks](../attacks-vulns-list.md#attack-types)? They will continue link to the control - follow the link and adjust.
1. [API specification violation](../api-specification-enforcement/overview.md#how-it-works)? Requests will contain link to the specification and checking settings - follow the link and adjust.

## Things to consider

Note that:

* Rules/mitigation controls of the same type obey [inheritance](#attack-handling-process). Sometimes you do not need to edit the main rule, just create its modification for some child branch. And vise versa - it makes sense to create more generic rules sometimes to cover more or all branches:

    * Inheritance does not work for rules with **In this part of request** part specified.
    * Besides inheritance, use [variability](../user-guides/rules/rules.md#using-wildcards) with wildcards or regular expressions, but remember your should use **wildcards** in URI field only.

        ??? info "Show where to use wildcards"
            ![Wildcards - correct/incorrect usage](../images/user-guides/rules/wildcards-correct-incorrect.png)

* Disable rules instead of deleting them. You can adjust and re-activate them later if you want.
* [Filtration modes](../admin-en/configure-wallarm-mode.md) other than `off` affect only input validation attacks, but `off` turns off **everything** for the selected scope.
