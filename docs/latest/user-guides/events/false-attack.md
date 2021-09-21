[link-analyzing-attacks]:       analyze-attack.md

[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png


# Working with false attacks

## What is a false positive?

**False positive** occurs when attack signs are detected in the legitimate request.

After analyzing an attack, you may conclude that all or some requests in this attack are false positives. To prevent the filtering node from recognizing such requests as attacks in future traffic analysis, you can mark several requests or the entire attack as a false positive.

## How a false positive mark works?

* If a false positive mark is added for the attack of the type different from [Information Exposure](../../attacks-vulns-list.md#information-exposure), the rule disabling analysis of the same requests for detected attack signs ([tokens](../../about-wallarm-waf/protecting-against-attacks.md#library-libproton)) is automatically created.
* If a false positive mark is added for the incident with the [Information Exposure](../../attacks-vulns-list.md#information-exposure) attack type, the rule disabling analysis of the same requests for detected [vulnerability signs](../../about-wallarm-waf/detecting-vulnerabilities.md#vulnerability-detection-methods) is automatically created.

Created rule is applied when analyzing requests to the protected application. The rule is not displayed in the Wallarm Console and can be changed or removed only by the request sent to [Wallarm technical support](mailto: support@wallarm.com).

## Mark a hit as a false positive

To mark one request (hit) as a false positive:

1. In Wallarm Console → **Events**, filter the attacks by potential false positives using the [tag `!known`](../search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits).
2. Expand the list of requests in this attack.
3. Define a valid request and click **False** in the **Actions** column.

    ![!False hit][img-false-attack]

## Mark an attack as a false positive

To mark all requests (hits) in the attack as false positives:

1. In Wallarm Console → **Events**, filter the attacks by potential false positives using the [tag `!known`](../search-and-filters/use-search.md#search-by-known-attacks-cve-and-wellknown-exploits).
2. Select an attack with valid requests.
2. Click **Report attack as false positive**.

    ![!False attack](../../images/user-guides/events/analyze-attack.png)

If all the requests in the attack are marked as false positives, then the information about that attack will look like this:

![!The whole attack is marked as false one][img-removed-attack-info]

## Remove a false positive mark

To remove a false positive mark from the hit or attack, please send a request to [Wallarm technical support](mailto: support@wallarm.com). Also, you can undo a false positive mark in the dialog box in the Wallarm Console within a few seconds after the mark was applied.
