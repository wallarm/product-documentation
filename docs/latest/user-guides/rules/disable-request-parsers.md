# Managing request parsers

The rule **Disable/Enable request parser** allows managing the set of parsers applied to the request during its analysis.

By default, when analyzing the request the Wallarm node attempts to sequentially apply each of the suitable [parsers](request-processing.md) to each element of the request. However, certain parsers can be applied mistakenly and as a result, the Wallarm node may detect attack signs in the decoded value.

For example: the Wallarm node may mistakenly identify unencoded data as encoded into [Base64](https://en.wikipedia.org/wiki/Base64), since the Base64 alphabet symbols are often used in the regular text, token values, UUID values and other data formats. If decoding the unencoded data and detecting attack signs in the resulting value, the [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) occurs.

To prevent false positives in such cases, you can disable the parsers mistakenly applied to certain request elements by using the rule **Disable/Enable request parser**.

## Creating and applying the rule

--8<-- "../include/waf/features/rules/rule-creation-options.md"

To create and apply the rule in the **Rules** section:

1. Create the rule **Disable/Enable request parser** in the **Rules** section of Wallarm Console. The rule consists of the following components:

      * **Condition** [describes](add-rule.md#branch-description) the endpoints to apply the rule to.
      * Parsers to be disabled / enabled for the specified request element.      
      * **Part of request** points to the original request element to be parsed / not parsed with the selected parsers.

         --8<-- "../include/waf/features/rules/request-part-reference.md"
2. Wait for the [rule compilation to complete](compiling.md).

## Rule example

Let's say the requests to `https://example.com/users/` require the authentication header `X-AUTHTOKEN`. The header value may contain specific symbol combinations (e.g. `=` in the end) to be potentially decoded by Wallarm with the parser `base64`.

The rule **Disable/Enable request parser** preventing false positives in the `X-AUTHTOKEN` values can be configured as follows:

![Example of the rule "Disable/Enable request parser"](../../images/user-guides/rules/disable-parsers-example.png)
