[al-sqli]:                ../../attacks-vulns-list.md#sql-injection
[al-xss]:                 ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]:                 ../../attacks-vulns-list.md#remote-code-execution-rce
[al-path-traversal]:      ../../attacks-vulns-list.md#path-traversal
[al-crlf]:                ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]:       ../../attacks-vulns-list.md#open-redirect
[al-nosqli]:              ../../attacks-vulns-list.md#nosql-injection
[al-xxe]:                 ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-ldapi]:               ../../attacks-vulns-list.md#ldap-injection
[al-infoleak]:            ../../attacks-vulns-list.md#information-exposure
[al-vuln-comp]:           ../../attacks-vulns-list.md#vulnerable-component
[al-ssrf]:                ../../attacks-vulns-list.md#serverside-request-forgery-ssrf
[al-csrf]:                ../../attacks-vulns-list.md#cross-site-request-forgery-csrf
[al-vuln-component]:      ../../attacks-vulns-list.md#vulnerable-component
[ssti-injection]:         ../../attacks-vulns-list.md#serverside-template-injection-ssti
[al-weak-jwt]:            ../../attacks-vulns-list.md#weak-jwt

# Vulnerability Search and Filters

Wallarm provides convenient methods for searching detected vulnerabilities. In the **Vulnerabilities** section of Wallarm Console, the following search methods available:

* **Filters** to select filtering criteria
* **Search field** to input search queries with attributes and modifiers similar to human language

The values set in the filters are automatically duplicated in the search field, and vice versa.

## Filters

Available filters are presented in Wallarm Console on the filters panel that is expanded and collapsed using the **Filter** button.

![Vulnerability filters in the UI](../../images/user-guides/search-and-filters/filters-vuln.png)

When values of different filters are selected, the results will meet all those conditions. When different values for the same filter are specified, the results will meet any of those conditions.

## Search field

The search field accepts queries with attributes and modifiers similar to human language which makes submitting queries intuitive. For example:

* `rce high`: to search for all [RCE](../../attacks-vulns-list.md#remote-code-execution-rce) vulnerabilities with high risk level
* `ptrav medium`: to search for all [path traversal](../../attacks-vulns-list.md#path-traversal) vulnerabilities with high risk level

When values of different parameters are specified, the results will meet all those conditions. When different values for the same parameter are specified, the results will meet any of those conditions.

!!! info "Setting the attribute value to NOT"
    To negate the attribute value, please use `!` before the attribute or modifier name. For example: `rce !low` to show all RCE vulnerabilities except the ones with the low risk level.

Below you will find the list of attributes and modifiers available for use in search queries.

### Search by vulnerability type

Specify in the search string:

<!-- * `anomaly`: TBD, makes sense only in the context of requests. -->
* `sqli`: to search for [SQL injection][al-sqli] vulnerabilities.
* `xss`: to search for [cross site scripting][al-xss] vulnerabilities.
* `rce`: to search for [OS commanding][al-rce] vulnerabilities.
* `ptrav`: to search for [path traversal][al-path-traversal] vulnerabilities.
* `crlf`: to search for [CRLF injection][al-crlf] vulnerabilities.
* `nosqli`: to search for [NoSQL injection][al-nosqli] vulnerabilities.
* `xxe`: to search for [XML external entity][al-xxe] vulnerabilities.
* `ldapi`: to search for [LDAP injection][al-ldapi] vulnerabilities.
* `ssti`: to search for [server‑side template injections][ssti-injection].
* `infoleak`: to search for vulnerabilities of [information disclosure][al-infoleak] type.
* `vuln_component`: to search for vulnerabilities related to the [components][al-vuln-comp] of your applications that are outdated or contain security affecting errors.
* `redir`: to search for [open redirect][al-open-redirect] vulnerabilities.
<!-- * BOLA (TBD) - presented in filter but does not add search tag, does not work -->
* `ssrf`: to search for [server‑side request forgery (SSRF)][al-ssrf] vulnerabilities.
* `csrf`: to search for [cross-site request forgery (CSRF)][al-csrf] vulnerabilities.
* `weak_auth`: to search for [weak JWT][al-weak-jwt] vulnerabilities.

A vulnerability name can be specified in both uppercase and lowercase letters: `SQLI`, `sqli`, and `SQLi` are equally correct.

### Search by risk level

Specify the risk level in the search string:

* `low`: low risk level.
* `medium`: medium risk level.
* `high`: high risk level.

<!-- ### Search by event time

Specify time period in the search string. If the period is not specified, the search is conducted within the events that occurred during the last 24 hours.

There are the following methods to specify the period:

* By date: `11/10/2020-11/14/2020`
* By date and time (seconds are disregarded): `11/10/2020 11:11`, `11:30-12:22`, `11/10/2020 11:12-01/14/2020 12:14`
* With relation to a certain moment of time: `>11/10/20`
* Using string aliases:
    * `yesterday` equal to yesterday's date
    * `today` equal to today's date
    * `last <unit>` equal to the period from the entire past unit start to current date and time

        `week`, `month`, `year` or the number of these units can be used as `<unit>`. For example: `last week`, `last 3 month` or `last 3 months`.
    
    * `this <unit>` equal to current unit

        `week`, `month`, `year` can be used as `<unit>`. For example: `this week` will return events detected on Monday, Tuesday and Wednesday this week if today is Wednesday.

Date and time format depends on the settings specified in your [profile](../settings/account.md#changing-your-date-time-format):

* MM/DD/YYYY if **MDY** is selected
* DD/MM/YYYY if **DMY** is selected
* `13:00` if **24‑hour** is ticked
* `1pm` if **24‑hour** is unticked

The month can be specified as both number and name: `01`, `1`, `January`, `Jan` for January. The year can be specified in both full form (`2020`) and shortened form (`20`). If the year is not specified in the date, then the current year is used.
-->