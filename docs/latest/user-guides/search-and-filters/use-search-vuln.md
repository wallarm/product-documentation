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
[al-weak-jwt]:            ../../attacks-vulns-list.md#weak-authentication
[al-bola]:                ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[al-anomaly]:             ../../fast/vuln-list.md#anomaly

# Vulnerability Search and Filters

In the **Vulnerabilities** section, Wallarm provides convenient methods for searching among detected vulnerabilities.

You can use:

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

<!-- * `anomaly`: to search for [anomaly][al-anomaly] vulnerabilities detected by [FAST](../../fast/README.md). -->
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
* `idor`: to search for [broken object level authorization (BOLA)][al-bola] vulnerabilities.
* `ssrf`: to search for [server‑side request forgery (SSRF)][al-ssrf] vulnerabilities.
* `csrf`: to search for [cross-site request forgery (CSRF)][al-csrf] vulnerabilities.
* `weak_auth`: to search for [weak JWT][al-weak-jwt] vulnerabilities.

A vulnerability name can be specified in both uppercase and lowercase letters: `SQLI`, `sqli`, and `SQLi` are equally correct.

### Search by risk level

Specify the risk level in the search string:

* `low`: low risk level.
* `medium`: medium risk level.
* `high`: high risk level.
