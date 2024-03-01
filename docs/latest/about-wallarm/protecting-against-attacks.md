[rule-creation-options]:    ../user-guides/events/analyze-attack.md#analyze-requests-in-an-attack
[request-processing]:       ../user-guides/rules/request-processing.md

# Attack Detection Procedure

The Wallarm platform continuously analyzes application traffic and mitigates malicious requests in real-time. From this article, you will learn resource types Wallarm protects from attacks, methods of detecting attacks in traffic and how you can track and manage detected threats.

## What is attack and what are attack components?

<a name="attack"></a>**Attack** is a single hit or multiple hits grouped by the following characteristics:

* The same attack type, the parameter with the malicious payload, and the address the hits were sent to. Hits may come from the same or different IP addresses and have different values of the malicious payloads within one attack type.

    This hit grouping method is basic and applied to all hits.
* The same source IP address if [grouping of hits by source IP](../user-guides/events/analyze-attack.md#grouping-of-hits) is enabled. Other hit parameter values can differ.

    This hit grouping method works for all hits except for the ones of the Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb and Virtual patch attack types.

    If hits are grouped by this method, the [**Mark as false positive**](../user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive) button and the [active verification](detecting-vulnerabilities.md#active-threat-verification) option are unavailable for the attack.

The listed hit grouping methods do not exclude each other. If hits have characteristics of both methods, they are all grouped into one attack.

<a name="hit"></a>**Hit** is a serialized malicious request (original malicious request and metadata added by the Wallarm node). If Wallarm detects several malicious payloads of different types in one request, Wallarm records several hits with payloads of one type in each.

<a name="malicious-payload"></a>**Malicious payload** is a part of an original request containing the following elements:

* Attack signs detected in a request. If several attack signs characterizing the same attack type are detected in a request, only the first sign will be recorded to a payload.
* Context of the attack sign. Context is a set of symbols preceding and closing detected attack signs. Since a payload length is limited, the context can be omitted if an attack sign is of full payload length.

    Since attack signs are not used to detect [behavioral attacks](#behavioral-attacks), requests sent as a part of behavioral attacks have empty payloads.

## Types of protected resources

Wallarm nodes analyze HTTP and WebSocket traffic sent to the protected resources:

* HTTP traffic analysis is enabled by default.

    Wallarm nodes analyze HTTP traffic for [input validation attacks](#input-validation-attacks) and [behavioral attacks](#behavioral-attacks).
* WebSocket traffic analysis should be enabled additionally via the directive [`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket).

    Wallarm nodes analyze WebSocket traffic only for [input validation attacks](#input-validation-attacks).

Protected resource API can be designed on the basis of the following technologies (limited under the WAAP [subscription plan](subscription-plans.md#subscription-plans)):

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

## Attack detection process

To detect attacks, Wallarm uses the following process:

1. Determine the request format and [parse](../user-guides/rules/request-processing.md) every request part.
2. Determine the endpoint the request is addressed to.
3. Apply [custom](../user-guides/rules/rules.md) rules for request analysis configured in Wallarm Console.
4. Make a decision whether the request is malicious or not based on [default](#tools-for-attack-detection) and custom rules.

## Attack types

The Wallarm solution protects APIs, microservices and web applications from the [OWASP Top 10](https://owasp.org/www-project-top-ten/) and [OWASP API Top 10](https://owasp.org/www-project-api-security/) threats, API abuse and other automated threats.

Technically, all attacks that can be detected by Wallarm are divided into groups:

* Input validation attacks
* Behavioral attacks

Attack detection method depends on the attack group. To detect behavioral attacks, additional Wallarm node configuration is required.

### Input validation attacks

Input validation attacks include SQL injection, cross‑site scripting, remote code execution, Path Traversal and other attack types. Each attack type is characterized by specific symbol combinations sent in the requests. To detect input validation attacks, it is required to conduct syntax analysis of the requests - parse them in order to detect specific symbol combinations.

Wallarm detects input validation attacks in any request part including binary files like SVG, JPEG, PNG, GIF, PDF, etc using the listed [tools](#tools-for-attack-detection).

Detection of input validation attacks is enabled for all clients by default.

### Behavioral attacks

Behavioral attacks include the following attack classes:

* [Brute‑force attacks](../admin-en/configuration-guides/protecting-against-bruteforce.md) include password brute‑forcing, session identifier brute‑forcing, credential stuffing. These attacks are characterized by a large number of requests with different forced parameter values sent to a typical URI for a limited timeframe.

    For example, if an attacker forces password, many similar requests with different `password` values can be sent to the user authentication URL:

    ```bash
    https://example.com/login/?username=admin&password=123456
    ```
* [Forced browsing attacks](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md) are characterized by a large number of response codes 404 returned to requests to different URIs for a limited timeframe.

    For example, the aim of this attack could to enumerate and access hidden resources (e.g. directories and files containing information on application components) to use this information for performing other attack types.

* [The BOLA (IDOR) attacks](../admin-en/configuration-guides/protecting-against-bola-trigger.md) exploiting the vulnerability of the same name. This vulnerability allows an attacker to access an object by its identifier via an API request and either get or modify its data bypassing an authorization mechanism.

    For example, if an attacker forces shop identifiers to find a real identifier and get the corresponding shop financial data:

    ```bash
    https://example.com/shops/{shop_id}/financial_info
    ```

    If authorization is not required for such API requests, an attacker can get the real financial data and use it for their own purposes.

#### Detection

To detect behavioral attacks, it is required to conduct syntax analysis of requests and correlation analysis of request number and time between requests.

Correlation analysis is conducted when the threshold of request number sent to user authentication or resource file directory or a specific object URL is exceeded. Request number threshold should be set to reduce the risk of legitimate request blocking (for example, when the user inputs incorrect password to his account several times).

* Correlation analysis is conducted by the Wallarm postanalytics module.
* Comparison of the received request number and the threshold for the request number, and blocking of requests is conducted in the Wallarm Cloud.

When behavioral attack is detected, request sources are blocked, namely the IP addresses the requests were sent from are added to the denylist.

#### Protection

To protect the resource against behavioral attacks, it is required to set the threshold for correlation analysis and URLs that are vulnerable to behavioral attacks:

* [Instructions on configuration of brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Instructions on configuration of forced browsing protection](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [Instructions on configuration of BOLA (IDOR) protection](../admin-en/configuration-guides/protecting-against-bola-trigger.md)

## Tools for attack detection

To detect malicious requests, Wallarm nodes [analyze](#attack-detection-process) all requests sent to the protected resource using the following tools:

* Library **libproton**
* Library **libdetection**
* Custom rules for request analysis

### Library libproton

The **libproton** library is a primary tool for detecting malicious requests. The library uses the component **proton.db** which determines different attack type signs as token sequences, for example: `union select` for the [SQL injection attack type](../attacks-vulns-list.md#sql-injection). If the request contains a token sequence matching the sequence from **proton.db**, this request is considered to be an attack of the corresponding type.

Wallarm regularly updates **proton.db** with token sequences for new attack types and for already described attack types.

### Library libdetection

#### libdetection overview

The [**libdetection**](https://github.com/wallarm/libdetection) library additionally validates attacks detected by the library **libproton** as follows:

* If **libdetection** confirms the attack signs detected by **libproton**, the attack is blocked (if the filtering node is working in the `block` mode) and uploaded to the Wallarm Cloud.
* If **libdetection** does not confirm the attack signs detected by **libproton**, the request is considered legitimate, the attack is not uploaded to the Wallarm Cloud and is not blocked (if the filtering node is working in the `block` mode).

Using **libdetection** ensures the double‑detection of attacks and reduces the number of false positives.

!!! info "Attack types validated by the libdetection library"
    Currently, the library **libdetection** only validates SQL Injection attacks.

#### How libdetection works

The particular characteristic of **libdetection** is that it analyzes requests not only for token sequences specific for attack types, but also for context in which the token sequence was sent.

The library contains the character strings of different attack type syntaxes (SQL Injection for now). The string is named as the context. Example of the context for the SQL injection attack type:

```curl
SELECT example FROM table WHERE id=
```

The library conducts the attack syntax analysis for matching the contexts. If the attack does not match the contexts, then the request will not be defined as a malicious one and will not be blocked (if the filtering node is working in the `block` mode).

#### Testing libdetection

To check the operation of **libdetection**, you can send the following legitimate request to the protected resource:

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* The library **libproton** will detect `UNION SELECT` as the SQL Injection attack sign. Since `UNION SELECT` without other commands is not a sign of the SQL Injection attack, **libproton** detects a false positive.
* If analyzing of requests with the **libdetection** library is enabled, the SQL Injection attack sign will not be confirmed in the request. The request will be considered legitimate, the attack will not be uploaded to the Wallarm Cloud and will not be blocked (if the filtering node is working in the `block` mode).

#### Managing libdetection mode

!!! info "**libdetection** default mode"
    The default mode of the **libdetection** library is `on/true` (enabled) for all [deployment options](../installation/supported-deployment-options.md).

You can control the **libdetection** mode using:

* The [`wallarm_enable_libdetection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) directive for NGINX.
* The [`enable_libdetection`](../admin-en/configuration-guides/envoy/fine-tuning.md#request-filtering-settings) parameter for Envoy.
* One of the [options](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode) for the Wallarm NGINX Ingress controller:

    * The `nginx.ingress.kubernetes.io/server-snippet` annotation to the Ingress resource.
    * The `controller.config.server-snippet` parameter of the Helm chart.

* The `wallarm-enable-libdetection` [pod annotation](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list) for the Wallarm Sidecar solution.
* The `libdetection` variable for [AWS Terraform](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module) deployment.

## Ignoring certain attack types

The rule **Ignore certain attack types** allows disabling detection of certain attack types in certain request elements.

By default, the Wallarm node marks the request as an attack if detecting the signs of any attack type in any request element. However, some requests containing attack signs can actually be legitimate (e.g. the body of the request publishing the post on the Database Administrator Forum may contain the [malicious SQL command](../attacks-vulns-list.md#sql-injection) description).

If the Wallarm node marks the standard payload of the request as the malicious one, a [false positive](#false-positives) occurs. To prevent false positives, standard attack detection rules need to be adjusted using the custom rules of certain types to accommodate protected application specificities. One of such custom rule types is **Ignore certain attack types**.

**Creating and applying the rule**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

**Rule example**

Let us say when the user confirms the publication of the post on the database administrator forum, the client sends the POST request to the endpoint `https://example.com/posts/`. This request has the following properties:

* The post content is passed in the request body parameter `postBody`. The post content may include SQL commands that can be marked by Wallarm as malicious ones.
* The request body is of the type `application/json`.

The example of the cURL request containing [SQL injection](../attacks-vulns-list.md#sql-injection):

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

So you need to ignore SQL injections in the parameter `postBody` of the requests to `https://example.com/posts/`

To do so, set the **Ignore certain attack types** rule as displayed on the screenshot:

![Example of the rule "Ignore certain attack types"](../images/user-guides/rules/ignore-attack-types-rule-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## Ignoring certain attack signs in the binary data

The rules **Allow binary data** and **Allow certain file types** are used to adjust the standard attack detection rules for binary data.

By default, the Wallarm node analyzes incoming requests for all known attack signs. During the analysis, the Wallarm node may not consider the attack signs to be regular binary symbols and mistakenly detect malicious payloads in the binary data.

Using the rules **Allow binary data** and **Allow certain file types**, you can explicitly specify request elements containing binary data. During specified request element analysis, the Wallarm node will ignore the attack signs that can never be passed in the binary data.

* The **Allow binary data** rule allows fine-tuning attack detection for request elements containing binary data (e.g. archived or encrypted files).
* The **Allow certain file types** rule allows fine-tuning attack detection for request elements containing specific file types (e.g. PDF, JPG).

**Creating and applying the rule**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

**Rule example**

Let us say when the user uploads the binary file with the image using the form on the site, the client sends the POST request of the type `multipart/form-data` to `https://example.com/uploads/`. The binary file is passed in the body parameter `fileContents` and you need to allow this.

To do so, set the **Allow binary data** rule as displayed on the screenshot::

![Example of the rule "Allow binary data"](../images/user-guides/rules/ignore-binary-attacks-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## Monitoring and blocking attacks

**Input validation attacks**

Wallarm can process the [input validation attacks](#input-validation-attacks) in the following modes:

* Monitoring mode: detects but does not block attacks.
* Safe blocking mode: detects attacks but blocks only those originated from [graylisted IPs](../user-guides/ip-lists/overview.md). Legitimate requests originated from graylisted IPs are not blocked.
* Blocking mode: detects and blocks attacks.

Detailed information about how different filtration modes work and how to configure filtration mode in general and for specific applications, domains or endpoints is available [here](../admin-en/configure-wallarm-mode.md).

**Behavioral attacks**

How Wallarm detects the [behavioral attacks](#behavioral-attacks) and acts in case of their detection is defined not by the filtration mode, but by [specific configuration](#protection) of these attack type protection.

## False positives

**False positive** occurs when attack signs are detected in the legitimate request or when legitimate entity is qualified as a vulnerability. [More details on false positives in vulnerability scanning →](detecting-vulnerabilities.md#false-positives)

When analyzing requests for attacks, Wallarm uses the standard ruleset that provides optimal application protection with ultra‑low false positives. Due to protected application specificities, standard rules may mistakenly recognize attack signs in legitimate requests. For example: SQL injection attack may be detected in the request adding a post with malicious SQL query description to the Database Administrator Forum.

In such cases, standard rules need to be adjusted to accommodate protected application specificities by using the following methods:

* Analyze potential false positives (by filtering all attacks by the [tag `!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits)) and if confirming false positives, [mark](../user-guides/events/false-attack.md) particular attacks or hits appropriately. Wallarm will automatically create the rules disabling analysis of the same requests for detected attack signs.
* [Disable detection of certain attack types](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types) in particular requests.
* [Disable detection of certain attack signs in binary data](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data).
* [Disable parsers mistakenly applied to the requests](../user-guides/rules/request-processing.md#managing-parsers).

Identifying and handling false positives is a part of Wallarm fine‑tuning to protect your applications. We recommend to deploy the first Wallarm node in the monitoring [mode](#monitoring-and-blocking-attacks) and analyze detected attacks. If some attacks are mistakenly recognized as attacks, mark them as false positives and switch the filtering node to blocking mode.

## Managing detected attacks

All detected attacks are displayed in the Wallarm Console → **Attacks** section by the filter `attacks`. You can manage attacks through the interface as follows:

* View and analyze attacks
* Increase the priority of an attack in the recheck queue
* Mark attacks or separate hits as false positives
* Create the rules for custom processing of separate hits

![Attacks view](../images/user-guides/events/check-attack.png)

## Attack dashboards

Wallarm provides comprehensive dashboards to help you stay on top of your system's security posture.

Wallarm's [Threat Prevention](../user-guides/dashboards/threat-prevention.md) dashboard provides general metrics on your system's security posture, including multi-aspect information about attacks: their sources, targets, types and protocols.

![Threat Prevention dashboard](../images/user-guides/dashboard/threat-prevention.png)

The [OWASP API Security Top 10](../user-guides/dashboards/owasp-api-top-ten.md) dashboard provides detailed visibility into your system's security posture against the OWASP API Top 10 threats, including attack information.

![OWASP API Top 10](../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Notifications about detected attacks, hits and malicious payloads

Wallarm can send you notifications on detected attacks, hits and malicious payloads. It allows you to be aware of attempts to attack your system and analyze detected malicious traffic promptly. Analyzing malicious traffic includes reporting false positives, allowlisting IPs originating legitimate requests and denylisting IPs of attack sources.

To configure notifications:

1. Configure [native integrations](../user-guides/settings/integrations/integrations-intro.md) with the systems to send notifications (e.g. PagerDuty, Opsgenie, Splunk, Slack, Telegram).
2. Set the conditions for sending notifications:

    * To get notifications on each detected hit, select the appropriate option in the integration settings.

        ??? info "See the example of the notification about detected hit in the JSON format"
            ```json
            [
                {
                    "summary": "[Wallarm] New hit detected",
                    "details": {
                    "client_name": "TestCompany",
                    "cloud": "EU",
                    "notification_type": "new_hits",
                    "hit": {
                        "domain": "www.example.com",
                        "heur_distance": 0.01111,
                        "method": "POST",
                        "parameter": "SOME_value",
                        "path": "/news/some_path",
                        "payloads": [
                            "say ni"
                        ],
                        "point": [
                            "post"
                        ],
                        "probability": 0.01,
                        "remote_country": "PL",
                        "remote_port": 0,
                        "remote_addr4": "8.8.8.8",
                        "remote_addr6": "",
                        "tor": "none",
                        "request_time": 1603834606,
                        "create_time": 1603834608,
                        "response_len": 14,
                        "response_status": 200,
                        "response_time": 5,
                        "stamps": [
                            1111
                        ],
                        "regex": [],
                        "stamps_hash": -22222,
                        "regex_hash": -33333,
                        "type": "sqli",
                        "block_status": "monitored",
                        "id": [
                            "hits_production_999_202010_v_1",
                            "c2dd33831a13be0d_AC9"
                        ],
                        "object_type": "hit",
                        "anomaly": 0
                        }
                    }
                }
            ]
            ```
    
    * To set the threshold of attack, hit or malicious payload number and get notifications when the threshold is exceeded, configure appropriate [triggers](../user-guides/triggers/triggers.md).

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
