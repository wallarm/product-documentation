# Setting response headers

The rule **Change server response headers** allows adding, deleting server response headers and changing its values.

This rule type is most often used to configure the additional layer of the application security, for example:

* To add the response header [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) controlling the resources the client is allowed to load for a given page. This helps guard against the [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) attacks.

    If your server does not return this header by default, it is recommended to add it by using the rule **Change server response headers**. In the MDN Web Docs, you can find descriptions of [possible header values](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives) and [header usage examples](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#examples_common_use_cases).

    Similarly, this rule can be used to add the response headers [`X-XSS-Protection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection), [`X-Frame-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options), [`X-Content-Type-Options`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options).
* To change the NGINX header `Server` or any other header containing the data on installed module versions. This data can be potentially used by the attacker to discover vulnerabilities of installed module versions and as a result, to exploit discovered vulnerabilities.

    The NGINX header `Server` can be changed starting with Wallarm node 2.16.

The rule **Change server response headers** can also be used to address any of your business and technical issues.

## Creating and applying the rule

--8<-- "../include/waf/features/rules/rule-creation-options.md"

To create and apply the rule in the **Rules** section:

1. Create the rule **Change server response headers** in the **Rules** section of Wallarm Console. The rule consists of the following components:

      * **Condition** [describes](add-rule.md#branch-description) the endpoints to apply the rule to.
      * Name of the header to be added or to replace its value.
      * New value of the specified header.

        To delete an existing response header, please leave the value of this header on the **Replace** tab empty.

2. Wait for the [rule compilation to complete](compiling.md).

## Rule example

To allow all content of `https://example.com/*` to come only from the site's origin, you can add the response header [`Content-Security-Policy: default-src 'self'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#example_1) by using the rule **Change server response headers** as follows:

![Example of the rule "Change server response headers"](../../images/user-guides/rules/add-replace-response-header.png)
