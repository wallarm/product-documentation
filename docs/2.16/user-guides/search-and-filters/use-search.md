[link-using-filters]:       use-filter.md

[anchor1]:      #search-by-object-type
[anchor2]:      #search-by-attack-type-or-vulnerability-type
[anchor3]:      #search-by-the-attack-target-or-the-vulnerability-target
[anchor4]:      #search-by-risk-level
[anchor5]:      #search-by-vulnerability-identifier
[anchor6]:      #search-by-vulnerability-status
[anchor7]:      #search-by-event-time
[anchor8]:      #search-by-ip-address
[anchor9]:      #search-by-server-response-status
[anchor10]:     #search-by-server-response-size
[anchor11]:     #search-by-http-request-method
[anchor12]:     #search-by-domain
[anchor13]:     #search-by-path
[anchor14]:     #search-by-parameter
[anchor15]:     #search-by-request-identifier
[anchor16]:     #search-attacks-by-the-action

[al-sqli]:                ../../attacks-vulns-list.md#sql-injection
[al-xss]:                 ../../attacks-vulns-list.md#cross-site-scripting-xss
[al-rce]:                 ../../attacks-vulns-list.md#remote-code-execution-rce
[al-brute-force]:         ../../attacks-vulns-list.md#bruteforce-attack
[al-path-traversal]:      ../../attacks-vulns-list.md#path-traversal
[al-crlf]:                ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]:       ../../attacks-vulns-list.md#open-redirect
[al-nosqli]:              ../../attacks-vulns-list.md#nosql-injection
[al-logic-bomb]:          ../../attacks-vulns-list.md#logic-bomb
[al-xxe]:                 ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-virtual-patch]:       ../../attacks-vulns-list.md#virtual-patch
[al-forced-browsing]:     ../../attacks-vulns-list.md#forced-browsing
[al-ldapi]:               ../../attacks-vulns-list.md#ldap-injection
[al-port-scanner]:        ../../attacks-vulns-list.md#resource-scanning
[al-infoleak]:            ../../attacks-vulns-list.md#information-exposure
[al-overlimit]:           ../../attacks-vulns-list.md#overlimiting-of-computational-resources

# Using Search

You can search for virtually any attacks, incidents, and vulnerabilities. 

Wallarm is equipped with a query language similar to human language, which makes submitting queries intuitive. Queries can be refined using special modifiers, which are described below.

When values of different parameters are specified, the results will meet all those conditions. When different values for the same parameter are specified, the results will meet any of those conditions.

To search within a single application, specify in the search string `pool:<application name>`, where `<application name>` is set on the *Applications* tab in the *Settings* section.

Examples of search requests:

* `attacks xss`: to search for all [XSS-attacks][al-xss].
* `attacks today`: to search for all attacks that happened today.
* `vulns sqli`: to search for [SQL-injection][al-sqli] vulnerabilities.
* `vulns 01/01/2019-01/10/2019`: to search for vulnerabilities within a certain period of time.
* `xss 01/14/2019`: to search for all vulnerabilities, suspicions, attacks, and incidents of [cross‑site scripting][al-xss] on 14 January 2019.
* `p:xss 01/14/2019`: to search for all vulnerabilities, suspicions, attacks, and incidents of all types within the xss HTTP request parameter (i.e. http://localhost/?xss=attack-here) as of 14 January 2019.
* `attacks 2-9/2018`: to search for all attacks from February to September 2018.
* `rce /catalog/import.php`: to search for all [RCE][al-rce] attacks, incidents, and vulnerabilities on `/catalog/import.php` path since yesterday.

In addition to using the search string, you can retrieve data using filters (see [Using Filters][link-using-filters]).

Parameters you enter into the search string will automatically duplicate in the filters and vice versa.

!!! info "Save as a filter"
    Any search query or combination of filters can be saved using the *Save as template* button and quickly accessed later with the *Searches* drop-down menu.

## Search Attributes

* [Type of object][anchor1]
* [Type of attack or vulnerability][anchor2]
* [Aim of attack or vulnerability][anchor3]
* [Action with an attack][anchor16]
* [Severity level][anchor4]
* [Vulnerability identifier][anchor5]
* [Vulnerability status][anchor6]
* [Time][anchor7]
* [IP address][anchor8]
* [Server response status][anchor9]
* [Server response size][anchor10]
* [HTTP request method][anchor11]
* [Domain][anchor12]
* [Path][anchor13]
* [Parameter][anchor14]
* [Request identifier][anchor15]

### Search by Object Type   

Specify in the search string:

* `attack`, `attacks`: to search only for the attacks that are *not* aimed at known vulnerabilities.
* `incident`, `incidents`: to search only for incidents (attacks exploiting a known vulnerability).
* `vuln`, `vulns`, `vulnerability`, `vulnerabilities`: to search only for vulnerabilities.

### Search by Attack Type or Vulnerability Type

Specify in the search string:

* `sqli`: to search for [SQL injection][al-sqli] attacks/vulnerabilities.
* `xss`: to search for [Cross Site Scripting][al-xss] attacks/vulnerabilities.
* `rce`: to search for [OS Commanding][al-rce] attacks/vulnerabilities.
* `brute`: to search for [brute-force][al-brute-force] attacks.
* `ptrav`: to search for [path traversal][al-path-traversal] attacks.
* `crlf`: to search for [CRLF injection][al-crlf] attacks/vulnerabilities.
* `redir`: to search for [open redirect][al-open-redirect] vulnerabilities.
* `nosqli`: to search for [NoSQL injection][al-nosqli] attacks/vulnerabilities.
* `logic_bomb`: to search for [logic bomb][al-logic-bomb] attacks.
* `overlimit_res`: to search for attacks aimed at [overlimiting of computational resources][al-overlimit].
* `xxe`: to search for [XML External Entity][al-xxe] attacks.
* `vpatch`: to search for [virtual patches][al-virtual-patch].
* `dirbust`: to search for [forced browsing][al-forced-browsing] attacks.
* `ldapi`: to search for [LDAP injection][al-ldapi] attacks/vulnerabilities.
* `scanner`: to search for [port scanner][al-port-scanner] attacks/vulnerabilities.
* `info`: to search for attacks/vulnerabilities of [information disclosure][al-infoleak].

An attack or vulnerability name can be specified in both uppercase and lowercase letters: `SQLI`, `sqli`, and `SQLi` are equally correct.

### Search by the Attack Target or the Vulnerability Target

Specify in the search string:

* `client`: to search for client data attacks/vulnerabilities.
* `database`: to search for database attacks/vulnerabilities.
* `server`: to search for app server attacks/vulnerabilities.

### Search Attacks by the Action

Specify in the search string:

* `falsepositive`: to search for attacks marked as false positives.
* `!falsepositive`: to search for real attacks.

### Search by Risk Level

Specify the risk level in the search string:

* `low`: low risk level.
* `medium`: medium risk level.
* `high`: high risk level.

### Search by Vulnerability Identifier

To search for a certain vulnerability, specify its identifier. It can be specified in two ways:

* either fully: `WLRM-ABCD-X0123`
* or in abbreviated form: `X0123`

### Search by Vulnerability Status

Specify vulnerability status in the search string. Vulnerability can have one of the three statuses:

* `open`: currently relevant vulnerability;
* `closed`: fixed vulnerability;
* `falsepositive`: vulnerability marked as false.

### Search by Event Time

Specify time period in the search string. If the period is not specified, the search is conducted within the events that occurred during the last 24 hours.

There are the following methods to specify the period:

* By date: `01/10/2019-01/14/2019`
* By date and time (seconds are disregarded): `01/10/2019 11:11`, `11:30-12:22`, `01/10/2019 11:12-01/14/2019 12:14`
* With relation to a certain moment of time: `>01/10/19`
* Using string aliases: `yesterday` equal to yesterday's date or `today` equal to today's date

Date and time format depends on the settings specified in your [profile](../settings/account.md#changing-your-date-time-format):

* MM/DD/YYYY if **MDY** is selected
* DD/MM/YYYY if **DMY** is selected
* `13:00` if **24‑hour** is ticked
* `1pm` if **24‑hour** is unticked

The month can be specified as both number and name: `01`, `1`, `January`, `Jan` for January. The year can be specified in both full form (`2020`) and shortened form (`20`). If the year is not specified in the date, then the current year is used.

### Search by IP Address

To search by IP address, use the `ip:` prefix, after which you can specify
*   A specific IP address, for example `192.168.0.1`—in this case, all attacks and incidents will be found for which the source address of the attack corresponds to this IP address.
*   An expression describing a range of IP addresses.
*   A total number of IP addresses related to an attack or incident.

#### Search by IP Address Range

To set a required range of IP addresses, you can use
*   An explicit IP address range:
    *   `192.168.0.0-192.168.63.255`
    *   `10.0.0.0-10.255.255.255`
*   A part of an IP address:
    *   `192.168.`—equivalent to `192.168.0.0-192.168.255.255`. Redundant format with the `*` modifier is allowed—`192.168.*`
    *   `192.168.0.`—equivalent to `192.168.0.0-192.168.0.255`
*   An IP address or part of it with a range of values inside the last octet in the expression:
    *   `192.168.1.0-255`—equivalent to `192.168.1.0-192.168.1.255`
    *   `192.168.0-255`—equivalent to `192.168.0.0-192.168.255.255`
    
    !!! warning "Important"
        When using a range of values within an octet, a dot is not set at the end.

*   Subnet prefixes ([CIDR notation](https://tools.ietf.org/html/rfc4632)):
    *   `192.168.1.0/24`—equivalent to `192.168.1.0-192.168.1.255`
    *   `192.168.0.0/17`—equivalent to `192.168.0.1-192.168.127.255`

!!! note
    You can combine the above methods for defining IP address ranges. To do this, list all the necessary ranges with the ip: prefix separately.
    
    **Example**: `ip:192.168.0.0/24 ip:10.10. ip:10.0.10.0-128`

#### Search by Number of IP Addresses

It is possible to search by the total number of IP addresses that are related to an attack or an incident (only for attacks and incidents):
*   `ip:1000+ last month`—search for attacks and incidents over the past month for which the number of unique IP addresses is more than 1000 (equivalent to `attacks incidents ip:1000+ last month`).
*   `xss ip:100+`—search for all cross‑site scripting attacks and incidents. The search result will be empty if the number of attacking IP addresses (with the XSS attack type) is less than 100.
*   `xss p:id ip:100+`—search for all XSS attacks and incidents related to the id parameter (`?id=aaa`). This will return results only if the number of different IP addresses exceeds 100.

### Search by Server Response Status

To search by server response status, specify `statuscode:` prefix.

Response status can be specified as:
* a number from 100 to 999.
* «N–M» range, where N and M are figures from 100 to 999.
* «N+» and «N-» ranges, where N is a number from 100 to 999.

### Search by Server Response Size

To search by the server response size, use the `s:` or `size:` prefix.

You can search for any integer value. Figures above 999 can be specified without a prefix. The «N–M», «N+» and «N-» ranges can be specified, where figures above 999 can also be specified without a prefix.

### Search by HTTP Request Method

To search by HTTP request method, specify the `method:` prefix.

To search for `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`: if upper-case is used, then the search string can be specified without a prefix. For all other values, a prefix should be specified.

### Search by a number of hits within attack/incident

To search attacks and incidents by a number of hits, specify the `N:` prefix.

For example, you can search for attacks that have more than 100 hits: `attacks N:>100`. Or search for attacks with less than 10 hits with `attacks N:<10`.

### Search by Domain

To search by domain, use the `d:` or `domain:` prefix.

Any string, that may be a domain of the second or a higher level can be specified without a prefix. Any string can be specified with a prefix. 

You may use masks within a domain. The symbol `*` replaces any number of characters; the symbol `?` replaces any single character.

### Search by Path

To search by path, use the `u:` or `url:` prefix.

Strings that start with `/` are processed without a prefix. Any string can be specified with a prefix.

### Search by Parameter

To search by parameter, use the `p:`, `param:`, or `parameter:` prefix and also the `=` suffix.

For example, if you need to find attacks aimed at the `xss` parameter but not at XSS-attacks (for instance, SQL-injection attack having `xss` in the GET-parameter), then specify `attacks p:xss` in the search string.

A string that does not start with `/` and ends with `=` is considered to be a parameter (wherein the ending `=` character is not included in the value). Any string can be specified with a prefix.

### Search for Anomalies in Attacks

To search for anomalies in attacks, use the `a:` or `anomaly:` prefix.

To refine an anomaly search, use the following parameters:

* `size`
* `statuscode`
* `time`
* `stamps`
* `impression`
* `vector`

Example:

`attacks sqli a:size` will search for all SQL-injection attacks, that have response size anomalies in their requests.

### Search by Request Identifier

To search for attacks and incidents by request identifier, specify the `request_id` prefix.
The `request_id` parameter has the following value form: `a79199bcea606040cc79f913325401fb`. In order to make it easier to read, this parameter has been replaced by the placeholder abbreviation `<requestId>` in the examples below.

Examples:
*   `attacks incidents request_id:<requestId>`: to search for an attack or an incident with the `request_id` equal to `<requestId>`.
*   `attacks incidents !request_id:<requestId>`: to search for attacks and incidents with the `request_id` not equal to `<requestId>`.
*   `attacks incidents request_id`: to search for attacks and incidents with any `request_id`.
*   `attacks incidents !request_id`: to search for attacks and incidents without any `request_id`.

!!! info "See also"
    [Using filters][link-using-filters]
