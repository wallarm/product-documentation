# Rules defining attack counters

## Rules overview

Rules **Tag requests as a forced browsing attack** and **Tag requests as a brute-force attack** are used to add tags to specific requests. The postanalytics module uses these tags to detect [dirbust (forced browsing)](../../attacks-vulns-list.md#forced-browsing) and [brute‑force](../../attacks-vulns-list.md#bruteforce-attack) attacks respectively.

!!! info "Applying the rule to real traffic"
    To apply the rule to real traffic, you need to set a threshold to trigger the rule:

     * Number of 404 responses for the rule **Tag requests as a forced browsing attack**
     * Number of requests for the rule **Tag requests as a brute-force attack**

     Thresholds are configured via triggers. Examples of triggers are available at this [link](../triggers/trigger-examples.md#mark-requests-as-a-bruteforce-or-dirbust-attack-if-31-or-more-requests-are-sent-to-the-protected-resource).

## Creating and applying the rule

To create and apply the rule:

1. Create the rule **Tag requests as a forced browsing attack** or **Tag requests as a brute-force attack** in the **Profile & Rules** section of Wallarm Console. The rule consists of the following components:

    * **Condition** [describes](add-rule.md#branch-description) the endpoints to apply the rule to.
    * **Counter name** defines the name of the tag which will be added to the request. The name should correspond to the following format:
        * `d:<name>` for the rule **Tag requests as a forced browsing attack**
        * `b:<name>` for the rule **Tag requests as a brute-force attack**

    !!! info "Message about inherited counter"
        If you have a **Default rule** defining attack counter, you can get a message `Inherited counter: <name>` when creating a rule with defined conditions that will trigger this rule. **Default rule** is applied to all incoming requests as it does not have defined conditions that trigger the rule.
        
        The message is for informational purposes only. Operation of the rule with defined trigger conditions will not be affected as it has a higher priority than the **Default rule**.

    !!! warning "Number of tags created for one condition"
        * Only one tag of any type (`b:` or `d:`) can be created for one condition.
        * One tag cannot be reused with several conditions.
2. Create a trigger with the filter by the tag and a threshold for request blocking. Examples of triggers are available at this [link](../triggers/trigger-examples.md#mark-requests-as-a-bruteforce-or-dirbust-attack-if-31-or-more-requests-are-sent-to-the-protected-resource).

## Rule examples

* Add a forced browsing attack tag `d:api_fr_user_passwords` to requests sent to the path `api/frontend/user/passwords` of the protected resource
* Add a brute-force attack tag `b:api_fr_user_login` to requests sent to the path `api/frontend/user/login` of the protected resource

![!Examples of rules for brute force and dirbust counters](../../images/user-guides/rules/dirbust-brute-counter-examples.png)
