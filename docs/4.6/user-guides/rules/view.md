
[img-rules-overview]:       ../../images/user-guides/rules/rules-overview.png
[img-view-rules]:           ../../images/user-guides/rules/view-rules.png

# Inspecting Application Profile Rules

To view the rules in the application structure, go to the **Rules** section of Wallarm Console. This section represents branches and endpoints that are already known.

![Rules tab overview][img-rules-overview]

The system automatically groups the rules by branches, highlighting common conditions and building a tree-like structure. As a result, a branch may have child branches. To show or hide nested branches, click on the blue circle to the left of the branch description.

Two asterisks `**` in a branch description refer to any number of nested paths. For instance, the branch `/**/*.php` will contain both `/index.php` and `/app/admin/install.php`.

The size of the blue circle indicates the relative quantity of the nested branches. Its color indicates the relative quantity of the rules within the branch and its sub-branches. On each nesting level, the size and color of the circles are independent from each other.

To the right of the branch description, the system may display an orange number, which indicates the number of rules in that branch (only the direct descendants, not the nested rules). If no number is displayed, then that branch is "virtual"&nbsp;— it is used only for grouping similar sub-branches.

Branches with no rules available for the user (according to the privilege model) are automatically hidden .


## Rule Display

In each branch, the user can look through the list of rules attached to it. To switch over to the page with the rule list, click on the description of the corresponding branch.

![Viewing branch rules][img-view-rules]

The rules within a branch are grouped by the *point* field. The rules that affect the entire request, rather than individual parameters, are grouped together into one line. To see the entire list, click on the line.

For each rule, the system displays the following parameters: last modified time, quantity, types, and point.

## Default rules

You can create rules with specified action but not linked to any endpoint - they are called **default rules**. Such rules are applied to all endpoints.

* To create default rule, follow the [standard procedure](add-rule.md) but leave URI blank. The new rule not linked to any endpoint will be created.
* To view the list of created default rules, click the **Default rules** button.

!!! info "Traffic filtration mode default rule"
    Wallarm automatically [creates](wallarm-mode-rule.md#default-instance-of-rule) the `Set filtration mode` default rule for all clients and sets its value on the basis of [general filtration mode](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) setting.

Default rules are [inherited](#distinct-and-inherited-rules) by all branches.

## Distinct and inherited rules

The rules are inherited down the rules branch. Principles:

* All branches inherit [default](#default-rules) rules.
* In a branch, child endpoints inherit rules from the parent.
* Distinct has priority over inherited.
* Directly specified has priority over [regex](add-rule.md#condition-type-regex).
* Case [sensitive](add-rule.md#condition-type-equal) has priority over [insensitive](add-rule.md#condition-type-iequal-aa).

Here are some details of how to work with the rules branch:

* To expand the endpoint, click the blue circle.
* Endpoints that do not have distinct rules are greyed out and not clickable.
    
    ![Branch of endpoints](../../images/user-guides/rules/rules-branch.png)

* To view rules for the endpoint, click it. First, distinct rules for this endpoint will be displayed.
* When viewing the rule list for the specific endpoint, click **Distinct and inherited rules** to display the inherited ones. Inherited rules will be displayed together with the distinct; they will be greyed out compared to distinct.

    ![Distinct and inherited rules for endpoint](../../images/user-guides/rules/rules-distinct-and-inherited.png)

## API calls to get rules

To get custom rules, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below are some examples of the corresponding API calls.

**Get all configured rules**

--8<-- "../include/api-request-examples/get-all-configured-rules.md"

**Get only conditions of all rules**

--8<-- "../include/api-request-examples/get-conditions.md"

**Get rules attached to a specific condition**

To point to a specific condition, use its ID - you can get it when requesting conditions of all rules (see above).

--8<-- "../include/api-request-examples/get-rules-by-condition-id.md"
