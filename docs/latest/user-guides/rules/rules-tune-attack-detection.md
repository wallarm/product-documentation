# Using Rules for Fine Tuning of Attack Detection

Using [rules](intro.md), you can fine tune how attacks are detected. This article describes how create such rules and configure them.

You can:

* [Disable/enable parsers](#disable-enable-parsers)
* [Change server response headers](#change-server-response-headers)
* [Set ignoring certain attack types](#set-ignoring-certain-attack-types)
* [Set ignoring certain attack signs in the binary data](#set-ignoring-certain-attack-signs-in-the-binary-data)

## Disable-enable parsers

The rule **Disable/Enable request parser** allows managing the set of parsers applied to the request during its analysis.

By default, when analyzing the request the Wallarm node attempts to sequentially apply each of the suitable [parsers](request-processing.md) to each element of the request. However, certain parsers can be applied mistakenly and as a result, the Wallarm node may detect attack signs in the decoded value.

For example: the Wallarm node may mistakenly identify unencoded data as encoded into [Base64](https://en.wikipedia.org/wiki/Base64), since the Base64 alphabet symbols are often used in the regular text, token values, UUID values and other data formats. If decoding the unencoded data and detecting attack signs in the resulting value, the [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) occurs.

To prevent false positives in such cases, you can disable the parsers mistakenly applied to certain request elements by using the rule **Disable/Enable request parser**.

**Creating and applying the rule**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

To create and apply the rule in the **Rules** section:

1. Create the rule **Disable/Enable request parser** in the **Rules** section of Wallarm Console. The rule consists of the following components:

      * **Condition** [describes](add-rule.md#branch-description) the endpoints to apply the rule to.
      * Parsers to be disabled / enabled for the specified request element.      
      * **Part of request** points to the original request element to be parsed / not parsed with the selected parsers.

         --8<-- "../include/waf/features/rules/request-part-reference.md"
2. Wait for the [rule compilation to complete](compiling.md).

**Rule example**

Let's say the requests to `https://example.com/users/` require the authentication header `X-AUTHTOKEN`. The header value may contain specific symbol combinations (e.g. `=` in the end) to be potentially decoded by Wallarm with the parser `base64`.

The rule **Disable/Enable request parser** preventing false positives in the `X-AUTHTOKEN` values can be configured as follows:

![Example of the rule "Disable/Enable request parser"](../../images/user-guides/rules/disable-parsers-example.png)

## Change server response headers

The rule **Change server response headers** allows adding, deleting server response headers and changing its values.

This rule type is most often used to configure the additional layer of the application security, for example:

* To add the response header [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) controlling the resources the client is allowed to load for a given page. This helps guard against the [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) attacks.

    If your server does not return this header by default, it is recommended to add it by using the rule **Change server response headers**. In the MDN Web Docs, you can find descriptions of [possible header values](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives) and [header usage examples](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases).

    Similarly, this rule can be used to add the response headers [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection), [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options), [`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options).
* To change the NGINX header `Server` or any other header containing the data on installed module versions. This data can be potentially used by the attacker to discover vulnerabilities of installed module versions and as a result, to exploit discovered vulnerabilities.

    The NGINX header `Server` can be changed starting with Wallarm node 2.16.

The rule **Change server response headers** can also be used to address any of your business and technical issues.

**Creating and applying the rule**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

To create and apply the rule in the **Rules** section:

1. Create the rule **Change server response headers** in the **Rules** section of Wallarm Console. The rule consists of the following components:

      * **Condition** [describes](add-rule.md#branch-description) the endpoints to apply the rule to.
      * Name of the header to be added or to replace its value.
      * New value of the specified header.

        To delete an existing response header, please leave the value of this header on the **Replace** tab empty.

2. Wait for the [rule compilation to complete](compiling.md).

**Rule example**

To allow all content of `https://example.com/*` to come only from the site's origin, you can add the response header [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) by using the rule **Change server response headers** as follows:

![Example of the rule "Change server response headers"](../../images/user-guides/rules/add-replace-response-header.png)

## Set ignoring certain attack types

The rule **Ignore certain attack types** allows disabling detection of certain attack types in certain request elements.

By default, the Wallarm node marks the request as an attack if detecting the signs of any attack type in any request element. However, some requests containing attack signs can actually be legitimate (e.g. the body of the request publishing the post on the Database Administrator Forum may contain the [malicious SQL command](../../attacks-vulns-list.md#sql-injection) description).

If the Wallarm node marks the standard payload of the request as the malicious one, a [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) occurs. To prevent false positives, standard attack detection rules need to be adjusted using the custom rules of certain types to accommodate protected application specificities. One of such custom rule types is **Ignore certain attack types**.

**Creating and applying the rule**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

To create and apply the rule in the **Rules** section:

1. Create the rule **Ignore certain attack types** in the **Rules** section of Wallarm Console. The rule consists of the following components:

      * **Condition** [describes](add-rule.md#branch-description) the endpoints to apply the rule to.
      * Attack types to be ignored in the specified request element.

        The **Certain attack types** tab allows selecting one or more attack types the Wallarm node can detect at the time of the rule creation.

        The **All attack types (auto-updated)** tab disables detection of both attack types the Wallarm node can detect at the time of the rule creation and those that will be detected in the future. For example: if Wallarm supports a new attack type detection, the node will automatically ignore signs of this attack type in the selected request element.
      
      * **Part of request** points to the original request element that should not be analyzed for selected attack type signs.

         --8<-- "../include/waf/features/rules/request-part-reference.md"

2. Wait for the [rule compilation to complete](compiling.md).

**Rule example**

Let's say when the user confirms the publication of the post on the Database Administrator Forum, the client sends the POST request to the endpoint `https://example.com/posts/`. This request has the following properties:

* The post content is passed in the request body parameter `postBody`. The post content may include SQL commands that can be marked by Wallarm as malicious ones.
* The request body is of the type `application/json`.

The example of the cURL request containing [SQL injection](../../attacks-vulns-list.md#sql-injection):

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

To ignore SQL injections in the parameter `postBody` of the requests to `https://example.com/posts/`, the rule **Ignore certain attack types** can be configured as follows:

![Example of the rule "Ignore certain attack types"](../../images/user-guides/rules/ignore-attack-types-rule-example.png)

## Set ignoring certain attack signs in the binary data

The rules **Allow binary data** and **Allow certain file types** are used to adjust the standard attack detection rules for binary data.

By default, the Wallarm node analyzes incoming requests for all known attack signs. During the analysis, the Wallarm node may not consider the attack signs to be regular binary symbols and mistakenly detect malicious payloads in the binary data.

Using the rules **Allow binary data** and **Allow certain file types**, you can explicitly specify request elements containing binary data. During specified request element analysis, the Wallarm node will ignore the attack signs that can never be passed in the binary data.

* The rule **Allow binary data** allows fine-tuning attack detection for request elements containing binary data (e.g. archived or encrypted files).
* The rule **Allow certain file types** allows fine-tuning attack detection for request elements containing specific file types (e.g. PDF, JPG).

**Creating and applying the rule**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

To create and apply the rule in the **Rules** section:

1. To adjust the attack detection rules for the binary data passed in the specified request element in any way, create the rule **Allow binary data** in the **Rules** section of Wallarm Console. The rule consists of the following components:

      * **Condition** [describes](add-rule.md#branch-description) the endpoints to apply the rule to.
      * **Part of request** points to the original request element containing the binary data.

         --8<-- "../include/waf/features/rules/request-part-reference.md"
2. To adjust the attack detection rules for certain file types passed in the specified request element, create the rule **Allow certain file types** in the **Rules** section of Wallarm Console. The rule consists of the following components:
      
      * **Condition** [describes](add-rule.md#branch-description) the endpoints to apply the rule to.
      * File types to ignore the attack signs in.
      * **Part of request** points to the original request element containing the specified file types.

         --8<-- "../include/waf/features/rules/request-part-reference.md"
3. Wait for the [rule compilation to complete](compiling.md).

**Rule example**

Let's say when the user uploads the binary file with the image using the form on the site, the client sends the POST request of the type `multipart/form-data` to `https://example.com/uploads/`. The binary file is passed in the body parameter `fileContents`.

The rule **Allow binary data** fine‑tuning attack detection in the parameter `fileContents` looks as follows:

![Example of the rule "Allow binary data"](../../images/user-guides/rules/ignore-binary-attacks-example.png)
