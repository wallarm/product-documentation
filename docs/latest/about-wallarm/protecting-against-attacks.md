[rule-creation-options]:    ../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../api-discovery/setup.md#enable

# Attack Detection Procedure

The Wallarm platform continuously analyzes API traffic and mitigates malicious requests in real-time. From this article, you will learn resource types Wallarm protects from attacks, methods of detecting attacks in traffic and how you can track and manage detected threats.

## What is attack and what are attack components?

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(61.18% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/pmaofaxiwniz?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

<a name="attack"></a>**Attack** is a single hit or multiple hits grouped by the following characteristics:

* The same attack type, the parameter with the malicious payload, and the address the hits were sent to. Hits may come from the same or different IP addresses and have different values of the malicious payloads within one attack type. New hit should arrive within an hour from the last - otherwise it will go to a separate attack.

    This hit grouping method is basic and applied to all hits.

* The same source IP address if [grouping of hits by source IP](../user-guides/events/grouping-sampling.md#grouping-of-hits) is enabled. Other hit parameter values can differ.

    This hit grouping method works for all hits except for the ones of the Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb and Virtual patch attack types.

    If hits are grouped by this method, the [**Mark as false positive**](../user-guides/events/check-attack.md#false-positives) button is unavailable for the attack.

The listed hit grouping methods do not exclude each other. If hits have characteristics of both methods, they are all grouped into one attack.

<a name="hit"></a>**Hit** is a serialized malicious request (original malicious request and metadata added by the Wallarm node). If Wallarm detects several malicious payloads of different types in one request, Wallarm records several hits with payloads of one type in each.

<a name="malicious-payload"></a>**Malicious payload** is a part of an original request containing the following elements:

* Attack signs detected in a request. If several attack signs characterizing the same attack type are detected in a request, only the first sign will be recorded to a payload.
* Context of the attack sign. Context is a set of symbols preceding and closing detected attack signs. Since a payload length is limited, the context can be omitted if an attack sign is of full payload length.

    Since attack signs are not used to detect [behavioral attacks](../attacks-vulns-list.md#attack-types), requests sent as a part of behavioral attacks have empty payloads.

[Learn how to analyze attacks in Wallarm →](../user-guides/events/check-attack.md)

## Types of protected resources

Wallarm nodes analyze HTTP and WebSocket traffic sent to the protected resources:

* HTTP traffic analysis is enabled by default.

    Wallarm nodes analyze HTTP traffic for [input validation attacks](../attacks-vulns-list.md#attack-types) and [behavioral attacks](../attacks-vulns-list.md#attack-types).
* WebSocket traffic analysis should be enabled additionally via the directive [`wallarm_parse_websocket`](../admin-en/configure-parameters-en.md#wallarm_parse_websocket).

    Wallarm nodes analyze WebSocket traffic only for [input validation attacks](../attacks-vulns-list.md#attack-types).

Protected resource API can be designed on the basis of the following technologies (limited under the WAAP [subscription plan](subscription-plans.md#core-subscription-plans)):

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* WebDAV
* JSON-RPC

## Attack handling process

To detect and handle attacks, Wallarm uses the following process:

1. Checks [IP lists](../user-guides/ip-lists/overview.md) to understand whether to process the request at all. Denylist blocks the request and allowlist allows it - both without further analysis.
1. Determines the request format and [parse](../user-guides/rules/request-processing.md) every request part to apply [basic detectors](#basic-set-of-detectors).
1. Determines the endpoint the request is addressed to apply [custom rules](#custom-rules)/[mitigation controls](#mitigation-controls) and [specific module settings](#specific-module-settings) and understand the [filtration mode](../admin-en/configure-wallarm-mode.md).
1. Makes a decision whether the request is a part of attack or not based on basic detectors, custom rules and specific module settings.
1. Handles request in accordance with decision and filtration mode.

![Attack handling process - diagram](../images/about-wallarm-waf/overview/attack-handling-diagram.png)

Note that rules, mitigation controls, settings and filtration mode can be inherited from the parent endpoint or [application](../user-guides/settings/applications.md). More specific has priority.

## Tools for attack detection

To detect attacks, Wallarm [analyzes](#attack-handling-process) all requests sent to the protected resource using the following tools:

* [Basic set of detectors](#basic-set-of-detectors)
* [Custom rules](#custom-rules) / [mitigation controls](#mitigation-controls)
* [Specific module settings](#specific-module-settings)

### Basic set of detectors

Wallarm uses a basic set of detectors (**libproton** library, developed by Wallarm) to determine different attack type signs as token sequences, for example: `union select` for the [SQL injection attack type](../attacks-vulns-list.md#sql-injection). If the request contains a token sequence matching the sequence from the set, this request is considered to be an attack of the corresponding type.

Wallarm regularly updates list of detectors (token sequences) for new attack types and for already described attack types.

Wallarm additionally validates SQL injection attacks (**libdetection** library, developed by Wallarm). See how to  [manage](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection).

### Custom rules

Custom [rules](../user-guides/rules/rules.md) are used to fine-tune the behavior defined by basic set of detectors. Users create them in Wallarm Console and the set of them is uploaded to filtering node.

### Mitigation controls

[Mitigation controls](../about-wallarm/mitigation-controls-overview.md) extend Wallarm's attack protection with additional security measures and allow fine-tuning of the Wallarm behavior.

### Specific module settings

Besides comparing against basic detectors or custom rules, requests are checked against settings, provided by different protection tools, such as:

* [API Abuse Prevention](../api-abuse-prevention/overview.md)
* [API Specification Enforcement](../api-specification-enforcement/overview.md)
* [Credential Stuffing](../about-wallarm/credential-stuffing.md)
* [Trigger-based protection measures](../user-guides/triggers/triggers.md#what-you-can-do-with-triggers)

Any of these tools can cause specific attack or vulnerability detection and request blocking.

## Ignoring certain attack types

The rule **Ignore certain attack types** allows disabling detection of certain attack types in certain request elements.

By default, the Wallarm node marks the request as an attack if detecting the signs of any attack type in any request element. However, some requests containing attack signs can actually be legitimate (e.g. the body of the request publishing the post on the Database Administrator Forum may contain the [malicious SQL command](../attacks-vulns-list.md#sql-injection) description).

If the Wallarm node marks the standard payload of the request as the malicious one, a [false positive](#false-positives) occurs. To prevent false positives, standard attack detection rules need to be adjusted using the custom rules of certain types to accommodate protected API specificities. Wallarm provides the **Ignore certain attack types** [rule](../user-guides/rules/rules.md) to do this.

**Creating and applying the rule**

--8<-- "../include/rule-creation-initial-step.md"
1. Choose **Fine-tuning attack detection** → **Ignore certain attacks**.
1. In **If request is**, [describe](../user-guides/rules/rules.md#configuring) the scope to apply the rule to.
1. Set whether to ignore only the signs of the specific attacks (select them) or signs of all attacks.
1. In **In this part of request**, specify request points for which you wish to set the rule.

    All available points are described [here](../user-guides/rules/request-processing.md), you can choose those matching your particular use case.

1. Wait for the [rule compilation to complete](../user-guides/rules/rules.md#ruleset-lifecycle).

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

By default, the Wallarm node analyzes incoming requests for all known attack signs. During the analysis, the Wallarm node may not consider the attack signs to be regular binary symbols and mistakenly detect malicious payloads in the binary data.

Using the **Allow binary data** [rule](../user-guides/rules/rules.md), you can explicitly specify request elements containing binary data. During specified request element analysis, the Wallarm node will ignore the attack signs that can never be passed in the binary data.

* The **Allow binary data** rule allows fine-tuning attack detection for request elements containing binary data (e.g. archived or encrypted files).

**Creating and applying the rule**

--8<-- "../include/rule-creation-initial-step.md"
1. Choose **Fine-tuning attack detection** → **Binary data processing**.
1. In **If request is**, [describe](../user-guides/rules/rules.md#configuring) the scope to apply the rule to.
1. In **In this part of request**, specify request points in which you wish to set the rule.

    All available points are described [here](../user-guides/rules/request-processing.md), you can choose those matching your particular use case.

1. Wait for the [rule compilation to complete](../user-guides/rules/rules.md#ruleset-lifecycle).

**Rule example**

Let us say when the user uploads the binary file with the image using the form on the site, the client sends the POST request of the type `multipart/form-data` to `https://example.com/uploads/`. The binary file is passed in the body parameter `fileContents` and you need to allow this.

To do so, set the **Allow binary data** rule as displayed on the screenshot:

![Example of the rule "Allow binary data"](../images/user-guides/rules/ignore-binary-attacks-example.png)

--8<-- "../include/waf/features/rules/request-part-reference.md"

## Monitoring and blocking attacks

**Input validation attacks**

Wallarm can process the [input validation attacks](../attacks-vulns-list.md#attack-types) in the following modes:

* Monitoring mode: detects but does not block attacks.
* Safe blocking mode: detects attacks but blocks only those originated from [graylisted IPs](../user-guides/ip-lists/overview.md). Legitimate requests originated from graylisted IPs are not blocked.
* Blocking mode: detects and blocks attacks.

Detailed information about how different filtration modes work and how to configure filtration mode in general and for specific applications, domains or endpoints is available [here](../admin-en/configure-wallarm-mode.md).

**Behavioral attacks**

How Wallarm detects the [behavioral attacks](../attacks-vulns-list.md#attack-types) and acts in case of their detection is defined not by the filtration mode, but by [specific configuration](#specific-module-settings) of these attack type protection.

## False positives

**False positive** occurs when attack signs are detected in the legitimate request or when legitimate entity is qualified as a vulnerability. [More details on false positives in vulnerability scanning →](detecting-vulnerabilities.md#false-positives)

When analyzing requests for attacks, Wallarm uses the standard ruleset that provides optimal API protection with ultra‑low false positives. Due to protected API specificities, standard rules may mistakenly recognize attack signs in legitimate requests. For example: SQL injection attack may be detected in the request adding a post with malicious SQL query description to the Database Administrator Forum.

In such cases, standard rules need to be adjusted to accommodate protected API specificities by using the following methods:

* Analyze potential false positives (by filtering all attacks by the [tag `!known`](../user-guides/search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits)) and if confirming false positives, [mark](../user-guides/events/check-attack.md#false-positives) particular attacks or hits appropriately. Wallarm will automatically create the rules disabling analysis of the same requests for detected attack signs.
* [Disable detection of certain attack types](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types) in particular requests.
* [Disable detection of certain attack signs in binary data](../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data).
* [Disable parsers mistakenly applied to the requests](../user-guides/rules/request-processing.md#managing-parsers).

Identifying and handling false positives is a part of Wallarm fine‑tuning to protect your APIs. We recommend to deploy the first Wallarm node in the monitoring [mode](#monitoring-and-blocking-attacks) and analyze detected attacks. If some attacks are mistakenly recognized as attacks, mark them as false positives and switch the filtering node to blocking mode.

## Attacks in Wallarm UI

Wallarm provides you with the comprehensive user interface displaying all detected attacks and details on them. You can use attack dashboards for quick visualization and set you custom notifications.

See details in the [Attack Analysis](../user-guides/events/check-attack.md) article.

![Attacks view](../images/user-guides/events/check-attack.png)

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->
