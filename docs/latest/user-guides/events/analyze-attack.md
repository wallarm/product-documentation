[link-check-attack]:        check-attack.md
[link-false-attack]:        false-attack.md

[img-analyze-attack]:       ../../images/user-guides/events/analyze-attack.png
[img-analyze-attack-raw]:   ../../images/user-guides/events/analyze-attack-raw.png
[img-current-attack]:       ../../images/user-guides/events/analyze-current-attack.png

[glossary-attack-vector]:   ../../glossary-en.md#malicious-payload

# Analyzing Attacks

You can check attacks in the *Events* tab of the Wallarm interface.

Wallarm automatically groups associated malicious requests into one entity — an attack.

## Analyze an Attack

You can get information about an attack by investigating all the table columns described in [“Checking Attacks and Incidents.”][link-check-attack]

## Analyze Requests in an Attack

1. Select an attack.
2. Click the number in the *Requests* column.

Clicking the number will unfold all requests in the selected attack.

![!Requests in the attack][img-analyze-attack]

Each request displays the associated information in the following columns:

* *Date*: Date and time of the request.
* *Payload*: [malicious payload][glossary-attack-vector]. Clicking the value in the payload column displays reference information on the attack type.
* *Source*: The IP address from which the request originated. Clicking the IP address adds the IP address value into the search field. The following information is also displayed if it was found in the IP2Location or Wallarm's databases:
    * The country in which the IP address is registered
    * Which data center the given IP addresses belong to: the **AWS** tag for Amazon, the **GCP** tag for Google, the **Azure** tag for Microsoft data centers, and **DC** for other data centers
    * The **Tor** tag if the attack's source is the Tor network
    * The **VPN** tag if IP address belongs to VPN
    * The **Public proxy** or **Web proxy** tag if the request was sent from the public or web proxy server
* *Code*: The server's response status code from the request. If the filtering node blocked the request, the code would be `403` or another [custom value](../../admin-en/configuration-guides/configure-block-page-and-code.md).
* *Size*: The server's response size.
* *Time*: The server's response time.

If the attack is happening at the current moment, the *“now”* label is shown under the request graph.

![!A currently happening attack][img-current-attack]

Request view provides the following options for Wallarm behavior fine-tuning:

* [**Mark as false positive** and **False**](false-attack.md) to report legitimate requests flagged as attacks.
* **Disable base64** to indicate the base64 parser incorrectly applied to the request element.

    The button opens a pre-filled form for setting up the [rule disabling the parser](../rules/disable-request-parsers.md).
* **Rule** to create [any individual rule](../rules/add-rule.md#rule) to handle certain requests.

    The button opens a rule setup form pre-filled with the request data.

## Analyze a Request in Raw Format

The raw format of a request is the maximum possible level of detail. Raw format view in Wallarm Console also enables copying of a request in a cURL format.

To view a request in a raw format, expand a required attack and then the request within it.

![!Raw format of the request][img-analyze-attack-raw]

## Sampling of hits

The attack may consist of a large number of identical hits (more than 100). Storing all hits may increase the Wallarm Cloud load and require a considerable amount of time to analyze and search for attacks via Wallarm Console.

To optimize the data storage and analysis, we apply the sampling algorithm to hits:

* The first 5 identical hits for each hour are saved in the sample in the Wallarm Cloud. If several samples are the part of the same attack, these samples are grouped (for example, the hits in the samples may differ only in the IP addresses).
* The rest of the hits are not saved in the sample, but their number is recorded in a separate parameter for each attack.

**Examples**

* If the attack consists of 20 hits (10 identical hits each originated from different IP addresses), data on the first 5 hits from each IP address will be saved in the sample in the Wallarm Cloud and the number of the rest hits (10) will be recorded in a separate variable.
* If the attack consists of 10 hits originated from different IP addresses, data on all hits will be saved in the Wallarm Cloud.

**Enabling the sampling algorithm**

* For [input validation attacks](../../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks), the sampling algorithm is enabled if Wallarm detects a high percentage of attacks in your traffic.

    When the sampling algorithm is enabled, all users of the [**Administrator** or **Global Administrator** role](../settings/users.md#user-roles) added to your company account will receive a corresponding email. Emails are sent once per 8 hours if the sampling algorithm is enabled / disabled due to the attack percentage change.
* For all [behavioral attacks](../../about-wallarm-waf/protecting-against-attacks.md#behavioral-attacks), the sampling algorithm is enabled by default.

If hits sampling is enabled for your traffic, the appropriate status, the sample of saved hits, and the number of other hits are displayed in the **Events** section of Wallarm Console. For example:

![!Dropped hits](../../images/user-guides/events/bruteforce-dropped-hits.png)

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/spD3BnI6fq4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
