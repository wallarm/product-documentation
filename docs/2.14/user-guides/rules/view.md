
[img-rules-overview]:       ../../images/user-guides/rules/rules-overview.png
[img-view-rules]:           ../../images/user-guides/rules/view-rules.png

# Inspecting Application Profile Rules

## Application Structure Display

To view the application structure, go to the *Profile & Rules* tab. This section represents branches and endpoints that are already known.

![!Rules tab overview][img-rules-overview]

The system automatically groups the rules by branches, highlighting common conditions and building a tree-like structure. As a result, a branch may have child branches. To show or hide nested branches, click on the blue circle to the left of the branch description.

Two asterisks `**` in a branch description refer to any number of nested paths. For instance, the branch `/**/*.php` will contain both `/index.php` and `/app/admin/install.php`.

The size of the blue circle indicates the relative quantity of the nested branches. Its color indicates the relative quantity of the rules within the branch and its sub-branches. On each nesting level, the size and color of the circles are independent from each other.

To the right of the branch description, the system may display an orange number, which indicates the number of rules in that branch (only the direct descendants, not the nested rules). If no number is displayed, then that branch is "virtual"&nbsp;— it is used only for grouping similar sub-branches.

Branches with no rules available for the user (according to the privilege model) are automatically hidden .


## Rule Display

In each branch, the user can look through the list of rules attached to it. To switch over to the page with the rule list, click on the description of the corresponding branch.

![!Viewing branch rules][img-view-rules]

The rules within a branch are grouped by the *point* field. The rules that affect the entire request, rather than individual parameters, are grouped together into one line. To see the entire list, click on the line.

For each rule, the system displays the following parameters: last modified time, quantity, types, and point.

By default, only the rules linked to the selected branch are shown. To see the rules inherited from more common branches, click on the *Hidden* button.
