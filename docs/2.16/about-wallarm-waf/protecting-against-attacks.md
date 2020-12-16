# Detecting attacks

## What is attack and what are attack components?

**Attack** is a single hit or multiple hits that have the same attack type, parameter with the attack vector, and the address they are sent to. Hits may come from the same or different IP addresses and have different value of the attack vector within one attack type.

**Hit** is a serialized malicious request (original malicious request and metadata added by the WAF node).

**Attack vector** is a part of a malicious request containing the attack sign.

## Attack types

[All attacks](../attacks-vulns-list.md) that can be detected by Wallarm WAF are divided into groups:

* Input validation attacks
* Behavioral attacks

Attack detection method depends on the attack group. To detect behavioral attacks, additional Wallarm WAF configuration is required.

### Input validation attacks

Input validation attacks include SQL injection, cross‑site scripting, remote code execution, Path Traversal and other attack types. Each attack type are characterized by specific symbol (token) combinations sent in the requests. To detect input validation attacks, it is required to conduct syntax analysis of the requests - parse requests in order to detect specific symbol combinations.

Input validation attacks are detected by the WAF node using the listed [tools](#tools-for-attack-detection).

Detection of input validation attacks is enabled for all clients by default.

### Behavioral attacks

Behavioral attacks include classes of brute‑force attacks: passwords and session identifiers brute‑forcing, files and directories forced browsing (dirbust), credential stuffing. Behavioral attacks can be characterized by a large number of requests with different forced parameter values sent to a typical URL for a limited timeframe.

For example, if an attacker forces password, many similar requests with different `password` values can be sent to the user authentication URL:

```bash
https://example.com/login/?username=admin&password=123456
```

To detect behavioral attacks, it is required to conduct syntax analysis of requests and correlation analysis of request number and time between requests. Correlation analysis is conducted when the treshold of request number sent to user authentication or resource file directory URL is exceeded. Request number treshold should be set to reduce the risk of legitimate request blocking (for example, when the user inputs incorrect password to his account several times).

* Correlation analysis is conducted by the Wallarm WAF postanalytics module.
* Comparison of the received requests number and the threshold for the requests number, and blocking of requests is conducted in the Wallarm Cloud.

When behavioral attack is detected, requests sources are blocked, namely the IP addresses the requests were sent from are added to the blacklist.

To protect the resource against behavioral attacks, it is required to set the treshold for correlation analysis and URLs that are vulnerable to behavioral attacks.

[Instructions on configuration of brute force protection →](../admin-en/configuration-guides/protecting-against-bruteforce.md)

## Types of protected resources

Wallarm WAF analyzes HTTP and WebSocket traffic sent to the protected resources:

* HTTP traffic analysis is enabled by default.

    Wallarm WAF analyzes HTTP traffic for [input validation attacks](#input-validation-attacks) and [behavioral attacks](#behavioral-attacks).
* WebSocket traffic analysis should be enabled additionally via the directive [`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket).

    Wallarm WAF analyzes WebSocket traffic only for [input validation attacks](#input-validation-attacks).

Protected resource API can be designed on the basis of REST, gRPC, or GraphQL technologies.

## Attack detection process

To detect attacks, Wallarm WAF uses the following process:

1. Determine the request format and parse every request part as described in the [document about request parsing](../user-guides/rules/request-processing.md).
2. Determine the endpoint the request is addressed to.
3. Apply [user‑defined detection rules](#userdefined-detection-rules) determined in the LOM file.
4. Make a decision whether the request is malicious or not based on rules determined in [proton.db and LOM](#tools-for-attack-detection).

## Tools for attack detection

To detect malicious requests, Wallarm WAF analyzes all requests sent to the protected resource using the following tools:

* Library **libproton**
* Library **libdetection**
* User‑defined detection rules

### Library libproton

The **libproton** library is a primary tool for detecting malicious requests. The library uses the component **proton.db** which determines different attack type signs as token sequences, for example: `union select` for the SQL injection attack type. If the request contains a token sequence that matches the sequence from **proton.db**, this request is considered to be an attack of the corresponding type.

Wallarm regularly updates **proton.db** with token sequences for new attack types and for already described attack types.

### Library libdetection

The [**libdetection**](https://github.com/wallarm/libdetection) library additionally validates attacks detected by the library **libproton**. Using **libdetection** ensures the double‑detection of attacks and reduces the number of false positives.

The particular characteristic of **libdetection** is that it analyzes requests not only for token sequences specific for attack types, but also for context in which the token sequence was sent. The library contains the character strings of different attack type syntaxes (SQL injection, Remote code execution, Path Traversal for now). The string is named as the context. Example of the context for the SQL injection attack type: `SELECT example FROM table WHERE id=`.

The library conducts the attack syntax analysis for matching the contexts. If the attack does not match the contexts, then the request will not be defined as a malicious request and will not be blocked (if the WAF node is working in the `block` mode).

Analyzing of requests with the **libdetection** library is disabled by default. To enable the analysis, it is required to set the value of the directive [`wallarm_enable_libdetection`](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) to `on`.

!!! warning "Memory consumption increase"
    When analyzing attacks using the **libdetection** library, the amount of memory consumed by NGINX and Wallarm processes may increase by about 10%.

### User‑defined detection rules

Wallarm clients can set custom regular expressions which will be used to detect attacks. This settings allows to define individual traffic processing rules for client applications.

Regular expressions can be set using th [rule **Define a request as an attack based on a regular expression**](../user-guides/rules/regex-rule.md). Regular expressions syntax is described within the [link](../user-guides/rules/add-rule.md#regex).

User‑defined detection rules and other [rules](../user-guides/rules/intro.md) are compiled into Local Objective Model (LOM). Details about LOM build are available within the [link](../user-guides/rules/compiling.md).

## Monitoring and blocking attacks

Wallarm WAF can process attacks in the following modes:

* Monitoring mode: detects attacks and displays information about attacks in the Wallarm Console.
* Blocking mode: detects, blocks attacks and displays information about attacks in the Wallarm Console.

Wallarm WAF ensures quality request analysis and low level of false positives. However each protected application has its own specificities, so we recommend analyzing the work of the Wallarm WAF in the monitoring mode before enabling the blocking mode.

To control the filtering mode, the directive `wallarm_mode` is used. More detailed information about filtering mode configuration is available within the [link](../admin-en/configure-wallarm-mode.md).

The filtering mode for behavioral attacks is configured separately via the particular [trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md).

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
