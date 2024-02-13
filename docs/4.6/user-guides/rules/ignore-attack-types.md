[request-processing]:       request-processing.md

# Ignoring certain attack types

The rule **Ignore certain attack types** allows disabling detection of certain attack types in certain request elements.

By default, the Wallarm node marks the request as an attack if detecting the signs of any attack type in any request element. However, some requests containing attack signs can actually be legitimate (e.g. the body of the request publishing the post on the Database Administrator Forum may contain the [malicious SQL command](../../attacks-vulns-list.md#sql-injection) description).

If the Wallarm node marks the standard payload of the request as the malicious one, a [false positive](../../about-wallarm/protecting-against-attacks.md#false-positives) occurs. To prevent false positives, standard attack detection rules need to be adjusted using the custom rules of certain types to accommodate protected application specificities. One of such custom rule types is **Ignore certain attack types**.

## Creating and applying the rule

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

## Rule example

Let's say when the user confirms the publication of the post on the Database Administrator Forum, the client sends the POST request to the endpoint `https://example.com/posts/`. This request has the following properties:

* The post content is passed in the request body parameter `postBody`. The post content may include SQL commands that can be marked by Wallarm as malicious ones.
* The request body is of the type `application/json`.

The example of the cURL request containing [SQL injection](../../attacks-vulns-list.md#sql-injection):

```bash
curl -H "Content-Type: application/json" -X POST https://example.com/posts -d '{"emailAddress":"johnsmith@example.com", "postHeader":"SQL injections", "postBody":"My post describes the following SQL injection: ?id=1%20select%20version();"}'
```

To ignore SQL injections in the parameter `postBody` of the requests to `https://example.com/posts/`, the rule **Ignore certain attack types** can be configured as follows:

![Example of the rule "Ignore certain attack types"](../../images/user-guides/rules/ignore-attack-types-rule-example.png)
