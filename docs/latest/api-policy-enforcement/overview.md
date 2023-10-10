# API Policy Enforcement

The **API Policy Enforcement** module allows aplying security policies regarding your APIs basing on your API specifications: you upload one or several specifications to Wallarm and configure the system to find inconsistencies between endpoint description in your specification and actual requests and perform action in case of found inconsistency.

Requests may violate your specification by different positions:

![Specification - use for API policy enforcement](../images/api-policies-enforcement/specification-use-for-api-policies-enforcement.png)

Details on available positions:

--8<-- "../include/api-policies-enforcement/api-policies-violations.md"

The system can perform the following actions in case of found inconsistency:

* **Block** - block request and put in the **Events** as blocked
* **Monitor** - mark request as malicious, but do not block, put it in the **Events** section as monitored
* **Not tracked** - do nothing

API Policy Enforcement utilizes the positive security model - via specification it defines what is allowed, via the short set of policies it defines how to deal with all the rest. Thus, the specific restricting rules and their inevitable necessary updates are not required which saves time and resources. You also never miss attacks for which a direct restricting rule is not configured.
