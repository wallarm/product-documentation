# Detecting attacks

The Wallarm platform continuously analyzes application traffic and mitigates malicious requests in real-time. From this article, you will learn resource types Wallarm protects from attacks, methods of detecting attacks in traffic and how you can track and manage detected threats.

## What is attack and what are attack components?

<a name="attack"></a>**Attack** is a single hit or multiple hits grouped by the following characteristics:

* The same attack type, the parameter with the malicious payload, and the address the hits were sent to. Hits may come from the same or different IP addresses and have different values of the malicious payloads within one attack type.

    This hit grouping method is basic and applied to all hits.
* The same source IP address if the appropriate [trigger](../user-guides/triggers/trigger-examples.md#group-hits-originating-from-the-same-ip-into-one-attack) is enabled. Other hit parameter values can differ.

    This hit grouping method works for all hits except for the ones of the Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb and Virtual patch attack types.

    If hits are grouped by this method, the [**Mark as false positive**](../user-guides/events/false-attack.md#mark-an-attack-as-a-false-positive) button and the [active verification](detecting-vulnerabilities.md#active-threat-verification) option are unavailable for the attack.

The listed hit grouping methods do not exclude each other. If hits have characteristics of both methods, they are all grouped into one attack.

<a name="hit"></a>**Hit** is a serialized malicious request (original malicious request and metadata added by the Wallarm node). If Wallarm detects several malicious payloads of different types in one request, Wallarm records several hits with payloads of one type in each.

<a name="malicious-payload"></a>**Malicious payload** is a part of an original request containing the following elements:

* Attack signs detected in a request. If several attack signs characterizing the same attack type are detected in a request, only the first sign will be recorded to a payload.
* Context of the attack sign. Context is a set of symbols preceding and closing detected attack signs. Since a payload length is limited, the context can be omitted if an attack sign is of full payload length.

    Since attack signs are not used to detect [behavioral attacks](#behavioral-attacks), requests sent as a part of behavioral attacks have empty payloads.

## Attack types

The Wallarm solution protects APIs, microservices and web applications from OWASP API Top 10 threats, API abuse and other automated threats.

Technically, [all attacks](../attacks-vulns-list.md) that can be detected by Wallarm are divided into groups:

* Input validation attacks
* Behavioral attacks

Attack detection method depends on the attack group. To detect behavioral attacks, additional Wallarm node configuration is required.

### Input validation attacks

Input validation attacks include SQL injection, cross‑site scripting, remote code execution, Path Traversal and other attack types. Each attack type is characterized by specific symbol combinations sent in the requests. To detect input validation attacks, it is required to conduct syntax analysis of the requests - parse them in order to detect specific symbol combinations.

Wallarm detects input validation attacks in any request part including binary files like SVG, JPEG, PNG, GIF, PDF, etc using the listed [tools](#tools-for-attack-detection).

Detection of input validation attacks is enabled for all clients by default.

### Behavioral attacks

Behavioral attacks include the following attack classes:

* Brute‑force attacks: passwords and session identifiers brute‑forcing, files and directories forced browsing, credential stuffing. Behavioral attacks can be characterized by a large number of requests with different forced parameter values sent to a typical URL for a limited timeframe.

    For example, if an attacker forces password, many similar requests with different `password` values can be sent to the user authentication URL:

    ```bash
    https://example.com/login/?username=admin&password=123456
    ```

* The BOLA (IDOR) attacks exploiting the vulnerability of the same name. This vulnerability allows an attacker to access an object by its identifier via an API request and either get or modify its data bypassing an authorization mechanism.

    For example, if an attacker forces shop identifiers to find a real identifier and get the corresponding shop financial data:

    ```bash
    https://example.com/shops/{shop_id}/financial_info
    ```

    If authorization is not required for such API requests, an attacker can get the real financial data and use it for their own purposes.

#### Behavioral attack detection

To detect behavioral attacks, it is required to conduct syntax analysis of requests and correlation analysis of request number and time between requests.

Correlation analysis is conducted when the threshold of request number sent to user authentication or resource file directory or a specific object URL is exceeded. Request number threshold should be set to reduce the risk of legitimate request blocking (for example, when the user inputs incorrect password to his account several times).

* Correlation analysis is conducted by the Wallarm postanalytics module.
* Comparison of the received request number and the threshold for the request number, and blocking of requests is conducted in the Wallarm Cloud.

When behavioral attack is detected, request sources are blocked, namely the IP addresses the requests were sent from are added to the denylist.

#### Configuration of behavioral attack protection

To protect the resource against behavioral attacks, it is required to set the threshold for correlation analysis and URLs that are vulnerable to behavioral attacks:

* [Instructions on configuration of brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Instructions on configuration of BOLA (IDOR) protection](../admin-en/configuration-guides/protecting-against-bola.md)

!!! warning "Behavioral attack protection restrictions"
    When searching for behavioral attack signs, Wallarm nodes analyze only HTTP requests that do not contain signs of other attack types. For example, the requests are not considered to be a part of behavioral attack in the following cases:

    * These requests contain signs of [input validation attacks](#input-validation-attacks).
    * These requests match the regular expression specified in the [rule **Create regexp-based attack indicator**](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule).

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

1. Determine the request format and parse every request part as described in the [document about request parsing](../user-guides/rules/request-processing.md).
2. Determine the endpoint the request is addressed to.
3. Apply [custom rules for request analysis](#custom-rules-for-request-analysis) configured in Wallarm Console.
4. Make a decision whether the request is malicious or not based on [default and custom detection rules](#tools-for-attack-detection).

## Tools for attack detection

To detect malicious requests, Wallarm nodes analyze all requests sent to the protected resource using the following tools:

* Library **libproton**
* Library **libdetection**
* Custom rules for request analysis

### Library libproton

The **libproton** library is a primary tool for detecting malicious requests. The library uses the component **proton.db** which determines different attack type signs as token sequences, for example: `union select` for the [SQL injection attack type](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1). If the request contains a token sequence matching the sequence from **proton.db**, this request is considered to be an attack of the corresponding type.

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

### Custom rules for request analysis

To adjust default Wallarm request analysis to protected application specificities, Wallarm clients can use custom rules of the following types:

* [Create a virtual patch](../user-guides/rules/vpatch-rule.md)
* [Create regexp-based attack indicator](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)
* [Disable regexp-based attack detection](../user-guides/rules/regex-rule.md#partial-disabling-of-a-new-detection-rule)
* [Ignore certain attack types](../user-guides/rules/ignore-attack-types.md)
* [Allow binary data and file types](../user-guides/rules/ignore-attacks-in-binary-data.md)
* [Disable/Enable parsers](../user-guides/rules/disable-request-parsers.md)
* [Fine-tune the overlimit_res attack detection](../user-guides/rules/configure-overlimit-res-detection.md)

[Compiled](../user-guides/rules/compiling.md) custom ruleset is applied along with the standard rules from **proton.db** when analyzing requests.

## Monitoring and blocking attacks

Wallarm can process attacks in the following modes:

* Monitoring mode: detects but does not block attacks.
* Safe blocking mode: detects attacks but blocks only those originated from [graylisted IPs](../user-guides/ip-lists/graylist.md). Legitimate requests originated from graylisted IPs are not blocked.
* Blocking mode: detects and blocks attacks.

Wallarm ensures quality request analysis and low level of false positives. However each protected application has its own specificities, so we recommend analyzing the work of the Wallarm in the monitoring mode before enabling the blocking mode.

To control the filtration mode, the directive `wallarm_mode` is used. More detailed information about filtration mode configuration is available within the [link](../admin-en/configure-wallarm-mode.md).

The filtration mode for behavioral attacks is configured separately via the particular [trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md).

## False positives

**False positive** occurs when attack signs are detected in the legitimate request or when legitimate entity is qualified as a vulnerability. [More details on false positives in vulnerability scanning →](detecting-vulnerabilities.md#false-positives)

When analyzing requests for attacks, Wallarm uses the standard ruleset that provides optimal application protection with ultra‑low false positives. Due to protected application specificities, standard rules may mistakenly recognize attack signs in legitimate requests. For example: SQL injection attack may be detected in the request adding a post with malicious SQL query description to the Database Administrator Forum.

In such cases, standard rules need to be adjusted to accommodate protected application specificities by using the following methods:

* Analyze potential false positives (by filtering all attacks by the [tag `!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits)) and if confirming false positives, [mark](../user-guides/events/false-attack.md) particular attacks or hits appropriately. Wallarm will automatically create the rules disabling analysis of the same requests for detected attack signs.
* [Disable detection of certain attack types](../user-guides/rules/ignore-attack-types.md) in particular requests.
* [Disable detection of certain attack signs in binary data](../user-guides/rules/ignore-attacks-in-binary-data.md).
* [Disable parsers mistakenly applied to the requests](../user-guides/rules/disable-request-parsers.md).

Identifying and handling false positives is a part of Wallarm fine‑tuning to protect your applications. We recommend to deploy the first Wallarm node in the monitoring [mode](#monitoring-and-blocking-attacks) and analyze detected attacks. If some attacks are mistakenly recognized as attacks, mark them as false positives and switch the filtering node to blocking mode.

## Managing detected attacks

All detected attacks are displayed in the Wallarm Console → **Attacks** section by the filter `attacks`. You can manage attacks through the interface as follows:

* View and analyze attacks
* Increase the priority of an attack in the recheck queue
* Mark attacks or separate hits as false positives
* Create the rules for custom processing of separate hits

For more information on managing attacks, see the instructions on [working with attacks](../user-guides/events/analyze-attack.md).

![Attacks view](../images/user-guides/events/check-attack.png)

Additionally, Wallarm provides comprehensive dashboards to help you stay on top of your system's security posture. Wallarm's [Threat Prevention](../user-guides/dashboards/threat-prevention.md) dashboard provides general metrics on your system's security posture, while the [OWASP API Security Top 10](../user-guides/dashboards/owasp-api-top-ten.md) dashboard provides detailed visibility into your system's security posture against the OWASP API Top 10 threats.

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

        [See the example of configured trigger and notification →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
