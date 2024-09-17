[link-using-search]:    ../search-and-filters/use-search.md
[img-current-attacks]:  ../../images/glossary/attack-with-one-hit-example.png
[img-incidents-tab]:    ../../images/user-guides/events/incident-vuln.png
[img-show-falsepositive]: ../../images/user-guides/events/filter-for-falsepositive.png
[use-search]:             ../search-and-filters/use-search.md
[search-by-attack-status]: ../search-and-filters/use-search.md#search-attacks-by-the-action
[img-verify-attack]:            ../../images/user-guides/events/verify-attack.png
[al-brute-force-attack]:      ../../attacks-vulns-list.md#brute-force-attack
[al-forced-browsing]:         ../../attacks-vulns-list.md#forced-browsing
[al-bola]:                    ../../attacks-vulns-list.md#broken-object-level-authorization-bola
[link-analyzing-attacks]:       analyze-attack.md
[img-false-attack]:             ../../images/user-guides/events/false-attack.png
[img-removed-attack-info]:      ../../images/user-guides/events/removed-attack-info.png
[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png
[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload

# Attack Analysis

This article describes how you can analyze attacks detected by the Wallarm node and take actions regarding them.

### Attack analysis

All the [attacks](grouping-sampling.md#grouping-of-hits) detected by the Wallarm platform are displayed in the **Attacks** section of the Wallarm Console. You can [filter](../../user-guides/search-and-filters/use-search.md) the list by attack date, type and other criteria, expand any attack and its included requests for detailed analysis. If a detected attack turns out to be a [false positive](#false-positives), you can immediately mark it as one to prevent alike false positives in future. Also, on the basis of the detected attacks, you can create rules and perform other Wallarm configurations to mitigate further alike threats. Additionally, if the [active verification](../../vulnerability-detection/active-threat-verification/overview.md) is enabled, check its [status](../../vulnerability-detection/active-threat-verification/overview.md#possible-statuses) right in the attack list.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(55.04% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/2k7dijltmvb4" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

Consider the following:

* **Attack** is a [group](grouping-sampling.md#grouping-of-hits) of hits
* **Hit** is a malicious request plus metadata added by node
* **Malicious payload** is a part of request with attack sign

Read more on that terms in a [Glossary](../../glossary-en.md).

Each attack details contain all necessary information for analysis, such as attack's hits and malicious payload summary. To simplify analysis, only unique hits are stored in the attack details. Repeated malicious requests  are dropped from uploading to the Wallarm Cloud and not displayed. This process is called [hit sampling](grouping-sampling.md#sampling-of-hits).

Hit sampling does not affect the quality of attack detection and Wallarm node continues protect your applications and APIs even with hit sampling enabled.

## False positives

False positive occurs when attack signs are detected in the legitimate request. To prevent the filtering node from recognizing such requests as attacks in future, you can mark all or specific requests of the attack as false positives.

If a false positive mark is added for the attack of the type different from [information exposure](../../attacks-vulns-list.md#information-exposure), the rule disabling analysis of the same requests for detected [attack signs](../../about-wallarm/protecting-against-attacks.md#library-libproton) is automatically created. Note that it is not displayed Wallarm Console.

<!--If a false positive mark is added for the incident with the [Information Exposure](../../attacks-vulns-list.md#information-exposure) attack type, the rule disabling analysis of the same requests for detected [vulnerability signs](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods) is automatically created.
-->
You can undo a false positive mark only within a few seconds after the mark was applied. If you decided to undo it later, this can be done only by sending a request to [Wallarm technical support](mailto: support@wallarm.com).

The default view of the attack list presents only actual attacks (without false positives) - to change that, under **All attacks** switch from **Default view** to **With false positives** or **Only false positives**.

![False positive filter](../../images/user-guides/events/filter-for-falsepositive.png)

## API calls to get attacks

To get the attack details, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below is the example of the API call for **getting the first 50 attacks detected in the last 24 hours**.

Please replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format.

--8<-- "../include/api-request-examples/get-attacks-en.md"

!!! warning "Getting 100 or more attacks"
    For attack and hit sets containing 100 or more records, it is best to retrieve them in smaller pieces rather than fetching large datasets all at once, in order to optimize performance. [Explore the corresponding request example](../../api/request-examples.md#get-a-large-number-of-attacks-100-and-more)
