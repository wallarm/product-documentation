[link-request-processing]:      request-processing.md
[link-regex]:                   https://github.com/yandex/pire
[link-filter-mode-rule]:        wallarm-mode-rule.md
[link-sensitive-data-rule]:     sensitive-data-rule.md
[link-virtual-patch]:           vpatch-rule.md
[link-regex-rule]:              regex-rule.md

[img-add-rule]:     ../../images/user-guides/rules/add-rule.png

# Adding Rules in the Application Profile

To add a new rule, go to the *Profile & Rules* tab.

Rules can be added to both existing and new branches. They can be created from scratch or based on one of the existing branches.

To add a rule to an existing branch, click *Add rule* (the button will appear in the pop-up menu on the right after hovering the mouse cursor over the branch description line). You can also perform this operation on the rule page of this branch.

If necessary, it is possible to modify the branch to which a rule will be added. For this, click on the *If request is* clause in the rule-adding form and make changes to the branch description conditions. If a new branch is created, it will appear on the screen, and the application structure view will be updated.

![!Adding a new rule][img-add-rule]


### Branch Description

A branch description consists of a set of conditions for various parameters that an HTTP request must fulfill; otherwise, the rules associated with this branch will not be applied. Each line in the *If request is* section of the rule-adding form refers to a separate condition comprised of three fields: point, type, and comparison argument. The rules described in the branch are only applied to the request if all the conditions are fulfilled.

The *point* field indicates which parameter value should be extracted from the request for comparison. At present, not all of the points that can be analyzed by the filter node, are supported.

The following points are currently supported:
* **instance**: application ID.
* **proto**: HTTP protocol version (1.0, 1.1, 2.0, ...).
* **scheme**: http or https.
* **url**: full URL of the request in the same form as it was passed in the first line of the HTTP request.
* **path**, **action_name**, **action_ext**: URL elements. The details are provided in the [request analysis description][link-request-processing].
* **get**: GET parameters in the request.
* **header**: request headers.
* **method**: request methods.

Condition categories:

* **equal**: point value must match precisely with the comparison argument.
* **regex**: point value must match the regular expression. Note that the system uses [a limited subset of the regular expression syntax][link-regex].
* **absent**: the request should not contain the designated point. In this case, the comparison argument is not used.

### Rule

The added request processing rule is described in the *Then* section.

The following rules are supported:

* [Set the filter mode][link-filter-mode-rule].
* [Mask sensitive data][link-sensitive-data-rule].
* [Apply a virtual patch][link-virtual-patch].
* [User-defined detection rules][link-regex-rule].
