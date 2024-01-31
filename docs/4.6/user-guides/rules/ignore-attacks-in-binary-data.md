# Ignoring attack signs in the binary data

The rules **Allow binary data** and **Allow certain file types** are used to adjust the standard attack detection rules for binary data.

By default, the Wallarm node analyzes incoming requests for all known attack signs. During the analysis, the Wallarm node may not consider the attack signs to be regular binary symbols and mistakenly detect malicious payloads in the binary data.

Using the rules **Allow binary data** and **Allow certain file types**, you can explicitly specify request elements containing binary data. During specified request element analysis, the Wallarm node will ignore the attack signs that can never be passed in the binary data.

* The rule **Allow binary data** allows fine-tuning attack detection for request elements containing binary data (e.g. archived or encrypted files).
* The rule **Allow certain file types** allows fine-tuning attack detection for request elements containing specific file types (e.g. PDF, JPG).

## Creating and applying the rule

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

## Rule example

Let's say when the user uploads the binary file with the image using the form on the site, the client sends the POST request of the type `multipart/form-data` to `https://example.com/uploads/`. The binary file is passed in the body parameter `fileContents`.

The rule **Allow binary data** fine‑tuning attack detection in the parameter `fileContents` looks as follows:

![Example of the rule "Allow binary data"](../../images/user-guides/rules/ignore-binary-attacks-example.png)
