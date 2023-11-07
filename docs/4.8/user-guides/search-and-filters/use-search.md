[al-sqli]:                ../../attacks-vulns-list.md#sql-injection
[al-xss]:                 ../../attacks-vulns-list.md#crosssite-scripting-xss
[al-rce]:                 ../../attacks-vulns-list.md#remote-code-execution-rce
[al-brute-force]:         ../../attacks-vulns-list.md#bruteforce-attack
[al-path-traversal]:      ../../attacks-vulns-list.md#path-traversal
[al-crlf]:                ../../attacks-vulns-list.md#crlf-injection
[al-open-redirect]:       ../../attacks-vulns-list.md#open-redirect
[al-nosqli]:              ../../attacks-vulns-list.md#nosql-injection
[al-logic-bomb]:          ../../attacks-vulns-list.md#data-bomb
[al-xxe]:                 ../../attacks-vulns-list.md#attack-on-xml-external-entity-xxe
[al-virtual-patch]:       ../../attacks-vulns-list.md#virtual-patch
[al-forced-browsing]:     ../../attacks-vulns-list.md#forced-browsing
[al-ldapi]:               ../../attacks-vulns-list.md#ldap-injection
[al-port-scanner]:        ../../attacks-vulns-list.md#resource-scanning
[al-infoleak]:            ../../attacks-vulns-list.md#information-exposure
[al-vuln-component]:      ../../attacks-vulns-list.md#vulnerable-component
[al-overlimit]:           ../../attacks-vulns-list.md#overlimiting-of-computational-resources
[email-injection]:        ../../attacks-vulns-list.md#email-injection
[ssi-injection]:          ../../attacks-vulns-list.md#ssi-injection
[invalid-xml]:            ../../attacks-vulns-list.md#unsafe-xml-header
[ssti-injection]:         ../../attacks-vulns-list.md#serverside-template-injection-ssti
[overlimit-res]:          ../../attacks-vulns-list.md#overlimiting-of-computational-resources

# Event Search and Filters

Wallarm provides convenient methods for searching detected events (attacks and incidents). In the **Attacks** and **Incidents** sections of Wallarm Console, the following search methods available:

* **Filters** to select filtering criteria
* **Search field** to input search queries with attributes and modifiers similar to human language

The values set in the filters are automatically duplicated in the search field, and vice versa.

Any search query or a filter combination can be saved by clicking **Save a query**.

## Filters

Available filters are presented in Wallarm Console in multiple forms:

* Filters panel that is expanded and collapsed using the **Filter** button
* Quick filters for excluding or showing only events with the specific parameter values

![Filters in the UI](../../images/user-guides/search-and-filters/filters.png)

When values of different filters are selected, the results will meet all those conditions. When different values for the same filter are specified, the results will meet any of those conditions.

## Search field

The search field accepts queries with attributes and modifiers similar to human language which makes submitting queries intuitive. For example:

* `attacks xss`: to search for all [XSS-attacks][al-xss]
* `attacks today`: to search for all attacks that happened today
* `xss 12/14/2020`: to search for all suspicions, attacks, and incidents of [cross‑site scripting][al-xss] on 14 December 2020
* `p:xss 12/14/2020`: to search for all suspicions, attacks, and incidents of all types within the xss HTTP request parameter (i.e. `http://localhost/?xss=attack-here`) as of 14 December 2020
* `attacks 9-12/2020`: to search for all attacks from September to December 2020
* `rce /catalog/import.php`: to search for all [RCE][al-rce] attacks and incidents on `/catalog/import.php` path since yesterday

When values of different parameters are specified, the results will meet all those conditions. When different values for the same parameter are specified, the results will meet any of those conditions.

!!! info "Setting the attribute value to NOT"
    To negate the attribute value, please use `!` before the attribute or modifier name. For example: `attacks !ip:111.111.111.111` to show all attacks originated from any IP address excluding `111.111.111.111`.

Below you will find the list of attributes and modifiers available for use in search queries.

### Search by object type

Specify in the search string:

* `attack`, `attacks`: to search only for the attacks that are *not* aimed at known vulnerabilities.
* `incident`, `incidents`: to search only for incidents (attacks exploiting a known vulnerability).

### Search by attack type

Specify in the search string:

* `sqli`: to search for [SQL injection][al-sqli] attacks.
* `xss`: to search for [Cross Site Scripting][al-xss] attacks.
* `rce`: to search for [OS Commanding][al-rce] attacks.
* `brute`: to search for [brute-force][al-brute-force] attacks and blocked requests from IPs [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) because of the attacks of this type.
* `ptrav`: to search for [path traversal][al-path-traversal] attacks.
* `crlf`: to search for [CRLF injection][al-crlf] attacks.
* `redir`: to search for [open redirect][al-open-redirect] attacks.
* `nosqli`: to search for [NoSQL injection][al-nosqli] attacks.
* `data_bomb`: to search for [logic bomb][al-logic-bomb] attacks.
* `ssti`: to search for [Server‑Side Template Injections][ssti-injection].
* `invalid_xml`: to search for [usage of unsafe XML header][invalid-xml].
* `overlimit_res`: to search for attacks aimed at [overlimiting of computational resources][al-overlimit].
* `xxe`: to search for [XML External Entity][al-xxe] attacks.
* `vpatch`: to search for [virtual patches][al-virtual-patch].
* `dirbust`: to search for [forced browsing][al-forced-browsing] attacks and blocked requests from IPs [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) because of the attacks of this type.
* `ldapi`: to search for [LDAP injection][al-ldapi] attacks.
* `scanner`: to search for [port scanner][al-port-scanner] attacks.
* `infoleak`: to search for attacks of [information disclosure][al-infoleak].
* `mail_injection`: to search for [Email Injections][email-injection].
* `ssi`: to search for [SSI Injections][ssi-injection].
* `overlimit_res`: to search for attacks of the [resource overlimiting][overlimit-res] type.
* `experimental`: to search for experimental attacks detected based on [custom regular expression](../rules/regex-rule.md).
* `bola`: to search for attacks exploiting the [BOLA (IDOR) vulnerability](../../attacks-vulns-list.md#broken-object-level-authorization-bola) and blocked requests from IPs [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) because of the attacks of this type.
* `mass_assignment`: to search for [Mass Assignment](../../attacks-vulns-list.md#mass-assignment) attack attempts.
* `api_abuse`: to search for [attacks on API performed by bots](../../attacks-vulns-list.md#api-abuse).
* `ssrf`: to search for [Server‑side Request Forgery (SSRF) and attacks](../../attacks-vulns-list.md#serverside-request-forgery-ssrf).
* `blocked_source`: to search for attacks from **manually** [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) IPs.
* `multiple_payloads`: to search for attacks detected by the [Number of malicious payloads](../../admin-en/configuration-guides/protecting-with-thresholds.md) trigger and blocked requests from IPs [denylisted](../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips) because of the attacks of this type.
* `ebpf`: to search for attacks detected by the [Wallarm eBPF-based soultion](../../installation/oob/ebpf/deployment.md).

An attack name can be specified in both uppercase and lowercase letters: `SQLI`, `sqli`, and `SQLi` are equally correct.

### Search attacks associated with the OWASP top threats

You can find attacks associated with the OWASP top threats by using the OWASP threat tags. The format to search for these attacks is `owasp_api1_2023`.

These tags correspond to the original numbering of threats as defined by OWASP. Wallarm associates attacks with the OWASP API Top threats of both the 2019 and 2023 versions.

### Search by known attacks (CVE and well‑known exploits)

* `known`: to search for requests that precisely attack since they exploit CVE vulnerabilities or other well‑known vulnerability types.

    To filter attacks by certain CVE or another well‑known vulnerability type, you can pass the appropriate tag in addition to the tag `known` or separate from it. For example: `known:CVE-2004-2402 CVE-2018-6008` or `CVE-2004-2402 CVE-2018-6008` to search for attacks exploiting the [CVE-2004-2402](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2004-2402) and [CVE-2018-6008](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-6008) vulnerabilities.
* `!known`: potential false positives. These requests may contain little‑known exploits or the context turning the exploits into legitimate parameter values.

To filter attacks by CVE and well‑known exploits, quick filters by event types and **CVE and exploits** can be used.

### Search hits by API protocols

To filter hits by API protocols, use the `proto:` or `protocol:` tag.

This tag allows the following values:

* `proto:graphql`
* `proto:grpc`
* `proto:websocket`
* `proto:rest`
* `proto:soap`
* `proto:xml-rpc`
* `proto:web-form`
* `proto:webdav`
* `proto:json-rpc`

### Search hits by authentication protocols

To filter hits by authentication protocols attackers have used, use the `auth:` tag.

This tag allows the following values:

* `auth:none`
* `auth:api-key`
* `auth:aws`
* `auth:basic`
* `auth:bearer`
* `auth:cookie`
* `auth:digest`
* `auth:hawk`
* `auth:jwt`
* `auth:ntlm`
* `auth:oauth1`
* `auth:oauth2`
* `auth:scram`

### Search by the attack target

Specify in the search string:

* `client`: to search for clients' data attacks.
* `database`: to search for database attacks.
* `server`: to search for app server attacks.

### Search by risk level

Specify the risk level in the search string:

* `low`: low risk level.
* `medium`: medium risk level.
* `high`: high risk level.

### Search by event time

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

### Search by IP address

To search by IP address, use the `ip:` prefix, after which you can specify
*   A specific IP address, for example `192.168.0.1`—in this case, all attacks and incidents will be found for which the source address of the attack corresponds to this IP address.
*   An expression describing a range of IP addresses.
*   A total number of IP addresses related to an attack or incident.

#### Search by IP address range

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

#### Search by number of IP addresses

It is possible to search by the total number of IP addresses that are related to an attack or an incident (only for attacks and incidents):
*   `ip:1000+ last month`—search for attacks and incidents over the past month for which the number of unique IP addresses is more than 1000 (equivalent to `attacks incidents ip:1000+ last month`).
*   `xss ip:100+`—search for all cross‑site scripting attacks and incidents. The search result will be empty if the number of attacking IP addresses (with the XSS attack type) is less than 100.
*   `xss p:id ip:100+`—search for all XSS attacks and incidents related to the id parameter (`?id=aaa`). This will return results only if the number of different IP addresses exceeds 100.

### Search by the data center the IP address belongs to

To search by the data center, to which the IP address originated the attacks belongs, use the `source:` prefix.

This attribute value can be:

* `tor` for the Tor network
* `proxy` for the public or web proxy server
* `vpn` for VPN
* `aws` for Amazon
* `azure` for Microsoft Azure
* `gce` for Google Cloud Platform
* `ibm` for IBM Cloud
* `alibaba` for Alibaba Cloud
* `huawei` for Huawei Cloud
* `rackspace` for Rackspace Cloud
* `plusserver` for PlusServer
* `hetzner` for Hetzner
* `oracle` for Oracle Cloud
* `ovh` for OVHcloud
* `tencent` for Tencent
* `linode` for Linode
* `docean` for Digital Ocean

### Search by the country or region in which the IP address is registered

To search by the country or the region, in which the IP address originated the attacks is registered, use the `country:` prefix.

The country/region name should be passed to the attribute in the format corresponding to the standard [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) in uppercase or lowercase letters. For example: `country:CN` or `country:cn` for attacks originated from China.

### Search for events originating from well-known malicious IPs

Wallarm scans public resources for IP addresses that are widely recognized as being associated with malicious activities. We then validate this information to ensure its accuracy, making it easier for you to take necessary actions, such as denylisting these IPs.

To search for events originating from these malicious IP addresses, use the `source:malicious` tag. This stands for **Malicious IPs** and is named accordingly in the denylist, in the section for blocking by source type.

We pull the data for this object from a combination of the following resources:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

### Search by server response status

To search by server response status, specify `statuscode:` prefix.

Response status can be specified as:
* a number from 100 to 999.
* «N–M» range, where N and M are figures from 100 to 999.
* «N+» and «N-» ranges, where N is a number from 100 to 999.

### Search by server response size

To search by the server response size, use the `s:` or `size:` prefix.

You can search for any integer value. Figures above 999 can be specified without a prefix. The «N–M», «N+» and «N-» ranges can be specified, where figures above 999 can also be specified without a prefix.

### Search by HTTP request method

To search by HTTP request method, specify the `method:` prefix.

To search for `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`: if upper-case is used, then the search string can be specified without a prefix. For all other values, a prefix should be specified.

### Search by a number of hits within attack/incident

To search attacks and incidents by a number of hits, specify the `N:` prefix.

For example, you can search for attacks that have more than 100 hits: `attacks N:>100`. Or search for attacks with less than 10 hits with `attacks N:<10`.

### Search by domain

To search by domain, use the `d:` or `domain:` prefix.

Any string, that may be a domain of the second or a higher level can be specified without a prefix. Any string can be specified with a prefix. 

You may use masks within a domain. The symbol `*` replaces any number of characters; the symbol `?` replaces any single character.

### Search by path

To search by path, either:

* Use the `u:` or `url:` prefix and specify the path in quotes starting with `/`, e.g.: `url:"/api/users"`, or
* Start the input with `/` without any prefix, e.g.: `/api/users`

### Search by application

To search by the application to which the attack was sent, use the `application:` or `app:` prefix (the former `pool:` prefix is still supported but not recommended).

The attribute value is the application name set on the **Applications** tab in the **Settings** section. For example: `application:'Example application'`.

### Search by parameter or parser

To search by parameter or parser, use the `p:`, `param:`, or `parameter:` prefix, or the `=` suffix. If using the suffix, a string that does not start with `/` is considered to be a parameter (wherein the ending `=` character is not included in the value).

Possible attribute values:

* Name of the aimed parameter.

    For example, if you need to find attacks aimed at the `xss` parameter but not at XSS-attacks (for instance, SQL-injection attack having `xss` in the GET-parameter), then specify `attacks sqli p:xss` in the search string.
* Name of the [parser](../rules/request-processing.md) used by Wallarm node to read the parameter value. The name must be in uppercase.

    For example, `attacks p:*BASE64` to find attacks aimed at any parameter parsed by the base64 parser.
* Sequence of parameters and parsers.

    For example: `attacks p:"POST_JSON_DOC_HASH_from"` to find attacks sent in the `from` parameter in the JSON body of a request.

You may use masks within a value. The symbol `*` replaces any number of characters, the symbol `?` replaces any single character.

### Search for anomalies in events

To search for anomalies in events, use the `a:` or `anomaly:` prefix.

To refine an anomaly search, use the following parameters:

* `size`
* `statuscode`
* `time`
* `stamps`
* `impression`
* `vector`

Example:

`attacks sqli a:size` will search for all SQL-injection attacks, that have response size anomalies in their requests.

### Search by request identifier

To search for attacks and incidents by request identifier, specify the `request_id` prefix.
The `request_id` parameter has the following value form: `a79199bcea606040cc79f913325401fb`. In order to make it easier to read, this parameter has been replaced by the placeholder abbreviation `<requestId>` in the examples below.

Examples:
*   `attacks incidents request_id:<requestId>`: to search for an attack or an incident with the `request_id` equal to `<requestId>`.
*   `attacks incidents !request_id:<requestId>`: to search for attacks and incidents with the `request_id` not equal to `<requestId>`.
*   `attacks incidents request_id`: to search for attacks and incidents with any `request_id`.
*   `attacks incidents !request_id`: to search for attacks and incidents without any `request_id`.

### Search for sampled hits

To search for the [sampled hits](../events/analyze-attack.md#sampling-of-hits), add `sampled` to the search string.

### Search by node UUID

To search for attacks detected by specific node, specify the `node_uuid` prefix, followed by the node UUID.

Examples:

* `attacks incidents today node_uuid:<NODE UUID>`: to search for all attacks and incidents for today found by the node with this `<NODE UUID>`.
* `attacks today !node_uuid:<NODE UUID>`: to search for all attacks for today found by any node except the node with this `<NODE UUID>`.

!!! info "Search only for new attacks"
    Only attacks detected after May 31, 2023 will be displayed when searching by node UUID.

You can find the node UUID in the **Nodes** section, [node details](../../user-guides/nodes/nodes.md#viewing-details-of-a-node). Click UUID to copy it or click **View events from this node for the day** (switches to the **Attacks** section).

### Search by regexp-based customer rule

To get the list of attacks detected by [regexp-based customer rules](../../user-guides/rules/regex-rule.md), in the search field specify `custom_rule`.

For any of such attacks, in its details, the links to the corresponding rules are presented (there can be more than one). Click the link to access the rule details and edit them if necessary.

![Attack detected by regexp-based customer rule - editing rule](../../images/user-guides/search-and-filters/detected-by-custom-rule.png)

You can use `!custom_rule` to get the list of attacks not related to any regexp-based customer rules.
