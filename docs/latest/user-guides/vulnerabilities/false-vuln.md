[link-analyzing-vulns]:     analyze-vuln.md

[img-false-vuln-page]:       ../../images/user-guides/vulnerabilities/false-vuln-page.png

# Working with false vulnerabilities

[False positive](../../about-wallarm-waf/detecting-vulnerabilities.md#false-positives) occurs when legitimate entity is qualified as a vulnerability.

After analyzing a vulnerability, you may conclude that the vulnerability is a false positive. A vulnerability marked as a false positive will be switched to an appropriate status and will not be rechecked.

!!! info "If the detected vulnerability exists but cannot be fixed"
    If the detected vulnerability exists in the protected application but cannot be fixed, we recommend setting up the [**Create a virtual patch**](../rules/vpatch-rule.md) rule. This rule will allow blocking attacks exploiting the detected type of vulnerability and will eliminate the risk of an incident.

## Mark a vulnerability as a false positive

You can mark the vulnerability as a false positive by clicking an appropriate button either in the vulnerability menu or on the page of the desired vulnerability.

![!False positive on the vulnerability page][img-false-vuln-page]

Wallarm will requalify the vulnerability as a false positive.

## Remove a false positive mark

The vulnerability marked as a false positive, will be displayed on the **Closed** tab. To remove a false positive mark, please open a vulnerability card and click **Reopen**.

![!False vulnerability](../../images/user-guides/vulnerabilities/discard-false-vuln.png)

The vulnerability will be switched to the status **Open** and will be rechecked with Wallarm tools.
