# Detecting attacks

## What is attack and what are attack components?

**Attack** is a single hit or multiple hits that have the same attack type, parameter with the attack vector, and the address they are sent to. Hits may come from the same or different IP addresses and have different value of the attack vector within one attack type.

**Hit** is a serialized malicious request (original malicious request and metadata added by the filtering node).

**Attack vector** is a part of a malicious request containing the attack sign.

## Attack types

[All attacks](../attacks-vulns-list.md) that can be detected by Wallarm are divided into groups:

* Input validation attacks
* Behavioral attacks

Attack detection method depends on the attack group. To detect behavioral attacks, additional Wallarm node configuration is required.

### Input validation attacks

Input validation attacks include SQL injection, cross‑site scripting, remote code execution, Path Traversal and other attack types. Each attack type are characterized by specific symbol (token) combinations sent in the requests. To detect input validation attacks, it is required to conduct syntax analysis of the requests - parse requests in order to detect specific symbol combinations.

Input validation attacks are detected by the filtering node using the listed [tools](#tools-for-attack-detection).

Detection of input validation attacks is enabled for all clients by default.

### Behavioral attacks

Behavioral attacks include classes of brute‑force attacks: passwords and session identifiers brute‑forcing, files and directories forced browsing (dirbust), credential stuffing. Behavioral attacks can be characterized by a large number of requests with different forced parameter values sent to a typical URL for a limited timeframe.

For example, if an attacker forces password, many similar requests with different `password` values can be sent to the user authentication URL:

```bash
https://example.com/login/?username=admin&password=123456
```

To detect behavioral attacks, it is required to conduct syntax analysis of requests and correlation analysis of request number and time between requests. Correlation analysis is conducted when the threshold of request number sent to user authentication or resource file directory URL is exceeded. Request number threshold should be set to reduce the risk of legitimate request blocking (for example, when the user inputs incorrect password to his account several times).

* Correlation analysis is conducted by the Wallarm postanalytics module.
* Comparison of the received requests number and the threshold for the requests number, and blocking of requests is conducted in the Wallarm Cloud.

When behavioral attack is detected, request sources are blocked, namely the IP addresses the requests were sent from are added to the blacklist.

To protect the resource against behavioral attacks, it is required to set the threshold for correlation analysis and URLs that are vulnerable to behavioral attacks.

[Instructions on configuration of brute force protection →](../admin-en/configuration-guides/protecting-against-bruteforce.md)

!!! warning "Brute force protection restrictions"
    When searching for brute‑force attack signs, Wallarm nodes analyze only HTTP requests that do not contain signs of other attack types. For example, the requests are not considered to be a part of brute-force attack in the following cases:

    * These requests contain signs of [input validation attacks](#input-validation-attacks).
    * These requests match the regular expression specified in the [rule **Define a request as an attack based on a regular expression**](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule).

## Types of protected resources

Wallarm nodes analyze HTTP and WebSocket traffic sent to the protected resources:

* HTTP traffic analysis is enabled by default.

    Wallarm nodes analyze HTTP traffic for [input validation attacks](#input-validation-attacks) and [behavioral attacks](#behavioral-attacks).
* WebSocket traffic analysis should be enabled additionally via the directive [`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket).

    Wallarm nodes analyze WebSocket traffic only for [input validation attacks](#input-validation-attacks).

Protected resource API can be designed on the basis of REST, gRPC, or GraphQL technologies.

## Attack detection process

To detect attacks, Wallarm uses the following process:

1. Determine the request format and parse every request part as described in the [document about request parsing](../user-guides/rules/request-processing.md).
2. Determine the endpoint the request is addressed to.
3. Apply [custom detection rules](#custom-detection-rules) determined in the LOM file.
4. Make a decision whether the request is malicious or not based on rules determined in [proton.db and LOM](#tools-for-attack-detection).

## Tools for attack detection

To detect malicious requests, Wallarm nodes analyze all requests sent to the protected resource using the following tools:

* Library **libproton**
* Library **libdetection**
* Custom detection rules

### Library libproton

The **libproton** library is a primary tool for detecting malicious requests. The library uses the component **proton.db** which determines different attack type signs as token sequences, for example: `union select` for the SQL injection attack type. If the request contains a token sequence that matches the sequence from **proton.db**, this request is considered to be an attack of the corresponding type.

Wallarm regularly updates **proton.db** with token sequences for new attack types and for already described attack types.

### Library libdetection

#### libdetection overview

The [**libdetection**](https://github.com/wallarm/libdetection) library additionally validates attacks detected by the library **libproton** as follows:

* If **libdetection** confirms the attack signs detected by **libproton**, the attack is uploaded to the Wallarm Cloud and blocked (if the filtering node is working in the `block` mode).
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

The library conducts the attack syntax analysis for matching the contexts. If the attack does not match the contexts, then the request will not be defined as a malicious request and will not be blocked (if the filtering node is working in the `block` mode).

#### Enabling libdetection

Analyzing requests with the **libdetection** library is disabled by default. To reduce the number of false positives, we recommend enabling analysis. 

To enable the analysis:

1. Set the value of the directive [`wallarm_enable_libdetection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) to `on`. The directive can be set inside the `http`, `server`, or `location` block of the NGINX configuration file.
2. Set the value of the directive [`proxy_request_buffering`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering) to `on` to allow analyzing the request body. The directive can be set inside the `http`, `server`, or `location` block of the NGINX configuration file.

!!! warning "Memory consumption increase"
    When analyzing attacks using the **libdetection** library, the amount of memory consumed by NGINX and Wallarm processes may increase by about 10%.

#### Testing libdetection

To check the operation of **libdetection**, you can send the following legitimate request to the protected resource:

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* The library **libproton** will detect `UNION SELECT` as the SQL Injection attack sign. Since `UNION SELECT` without other commands is not a sign of the SQL Injection attack, **libproton** detects a false positive.
* If analyzing of requests with the **libdetection** library is enabled, the SQL Injection attack sign will not be confirmed in the request. The request will be considered legitimate, the attack will not be uploaded to the Wallarm Cloud and will not be blocked (if the filtering node is working in the `block` mode).

### Custom detection rules

Wallarm clients can set custom detection rules based on protected application specificities. There are the following types of custom detection rules:

* [Tag requests as a brute-force or forced browsing attack](../user-guides/rules/define-counters.md)
* [Create a virtual patch](../user-guides/rules/vpatch-rule.md)
* [Define a request as an attack based on a regular expression](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule)
* [Disable attack detection by the regular expressions](../user-guides/rules/regex-rule.md#partial-disabling-of-a-new-detection-rule)
* **Ignore tokens** disables detection of specified attack signs ([tokens](#library-libproton)) in certain requests. This rule is created automatically when adding a [false positive](#false-positives) marks and is not displayed in the Wallarm Console.

Custom detection rules and other [rules](../user-guides/rules/intro.md) are compiled into Local Objective Model (LOM) and applied along with the standard rules from **proton.db** when analyzing requests. [More details on LOM building →](../user-guides/rules/compiling.md)

## Monitoring and blocking attacks

Wallarm can process attacks in the following modes:

* Monitoring mode: detects attacks and displays information about attacks in the Wallarm Console.
* Blocking mode: detects, blocks attacks and displays information about attacks in the Wallarm Console.

Wallarm ensures quality request analysis and low level of false positives. However each protected application has its own specificities, so we recommend analyzing the work of the Wallarm in the monitoring mode before enabling the blocking mode.

To control the filtration mode, the directive `wallarm_mode` is used. More detailed information about filtration mode configuration is available within the [link](../admin-en/configure-wallarm-mode.md).

The filtration mode for behavioral attacks is configured separately via the particular [trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md).

## False positives

**False positive** occurs when attack signs are detected in the legitimate request or when legitimate entity is qualified as a vulnerability. [More details on false positives in vulnerability scanning →](detecting-vulnerabilities.md#false-positives)

When analyzing requests for attacks, Wallarm uses the standard rule set that provides optimal application protection with ultra‑low false positives. Due to protected application specificities, standard rules may mistakenly recognize attack signs in legitimate requests. For example: SQL injection attack may be detected in the request adding a post with malicious SQL query description to the Database Administrator Forum.

In such cases, standard rules need to be adjusted to accommodate protected application specificities by using the following methods:

* Analyze attacks detected by Wallarm and [mark](../user-guides/events/false-attack.md) particular attacks or hits as false positives. Wallarm will automatically create the rules disabling analysis of the same requests for detected attack signs.
* [Disable detection of certain attack types](../user-guides/rules/ignore-attack-types.md) in particular requests.
* [Disable detection of certain attack signs in binary data](../user-guides/rules/ignore-attacks-in-binary-data.md).
* [Disable parsers mistakenly applied to the requests](../user-guides/rules/disable-request-parsers.md).

Identifying and handling false positives is a part of fine‑tuning Wallarm API Security to protect your applications. We recommend to deploy the first Wallarm node in the monitoring [mode](#monitoring-and-blocking-attacks) and analyze detected attacks. If some attacks are mistakenly recognized as attacks, mark them as false positives and switch the filtering node to blocking mode.

## Managing detected attacks

All detected attacks are displayed in the Wallarm Console → **Events** section by the filter `attacks`. You can manage attacks through the interface as follows:

* View and analyze attacks
* Increase the priority of an attack in the recheck queue
* Mark attacks or separate hits as false positives
* Create the rules for custom processing of separate hits

For more information on managing attacks, see the instructions on [working with attacks](../user-guides/events/analyze-attack.md).

![!Attacks view](../images/user-guides/events/check-attack.png)

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

---------

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/0R_2wL5_a-I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
