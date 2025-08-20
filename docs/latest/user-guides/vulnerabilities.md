# Managing Security Issues

Vulnerabilities are security flaws in an infrastructure that may be exploited by attackers to perform unauthorized malicious actions with your system. In Wallarm Console, you can analyze and manage security flaws that have been detected by Wallarm in your system in the **Security Issues** section

Wallarm employs various techniques to [discover](../about-wallarm/detecting-vulnerabilities.md) security weaknesses, which include:

* **Passive detection**: the vulnerability was found by analyzing real traffic, including both requests and responses. This can happen during a security incident, where a real flaw is exploited, or when requests show signs of vulnerabilities, like compromised JWTs, without direct flaw exploitation.
* **Threat Replay Testing**: the vulnerability was found during the [attack replay security tests](../vulnerability-detection/threat-replay-testing/overview.md) launched by Wallarm.
* **API Attack Surface Management (AASM)**: [discovers](../api-attack-surface/overview.md) external hosts with their APIs, then, for each of them, identifies missing WAF/WAAP solutions, and finds vulnerabilities.
* **API Discovery insights**: the vulnerability was found by [API Discovery](../api-discovery/overview.md) module due to PII transfer in query parameters of GET requests.

Wallarm stores the history of all detected vulnerabilities in the **Vulnerabilities** section:

![Vulnerabilities tab](../images/user-guides/vulnerabilities/check-vuln.png)

## Vulnerability lifecycle

The lifecycle of a vulnerability involves the assessment, remediation, and verification stages. At each stage, Wallarm equips you with the necessary data to thoroughly address the issue and fortify your system. Additionally, Wallarm Console provides you with the ability to monitor and manage the vulnerability status with ease by utilizing the **Active** and **Closed** statuses.

* **Active** status indicates that the vulnerability exists in the infrastructure.
* **Closed** status is used when the vulnerability has been resolved on the application side or determined to be a false positive.

    A [false positive](../about-wallarm/detecting-vulnerabilities.md#false-positives) occurs when a legitimate entity is mistakenly identified as a vulnerability. If you come across a vulnerability that you believe is a false positive, you can report it using the appropriate option in the vulnerability menu. This will help to improve the accuracy of Wallarm's vulnerability detection. Wallarm reclassifies the vulnerability as a false positive, changes its status to **Closed** and does not subject it to further [rechecking](#verifying-vulnerabilities).

When managing vulnerabilities, you can switch vulnerability statuses manually. Additionally, Wallarm regularly [rechecks](#verifying-vulnerabilities) vulnerabilities and changes the status of vulnerabilities automatically depending on the results.

![Vulnerability lifecycle](../images/user-guides/vulnerabilities/vulnerability-lifecycle.png)

Changes in the vulnerability lifecycle are reflected in the vulnerability change history.

## Assessing and remediating vulnerabilities

Wallarm provides each vulnerability with the details that helps to assess the level of risk and take steps to address security issues:

* The unique identifier of the vulnerability in the Wallarm system
* Risk level indicating danger of consequences of the vulnerability exploitation

    Wallarm automatically indicates the vulnerability risk using the Common Vulnerability Scoring System (CVSS) framework, likelihood of a vulnerability being exploited, its potential impact on the system, etc. You can change the risk level to your own value based on your unique system requirements and security priorities.
* [Type of the vulnerability](../attacks-vulns-list.md) that also corresponds to the type of attacks exploiting the vulnerability
* Domain and path at which the vulnerability exists
* Parameter that can be used to pass a malicious payload exploiting the vulnerability
* Method by which the vulnerability was [detected](../about-wallarm/detecting-vulnerabilities.md#detection-methods)
* The target component that may be impacted if a vulnerability is exploited, can be **Server**, **Client**, **Database**
* Date and time when the vulnerability was detected
* Last [verification date](#verifying-vulnerabilities) of the vulnerability
* Detailed vulnerability description, exploitation example and recommended remediation steps
* Related incidents
* History of vulnerability status changes

You can filter vulnerabilities by using the [search string](search-and-filters/use-search.md) and pre-defined filters.

![Vulnerability detailed information](../images/user-guides/vulnerabilities/vuln-info.png)

All vulnerabilities should be fixed on the application side because they make your system more vulnerable to malicious actions. If a vulnerability cannot be fixed, using the [virtual patch](rules/vpatch-rule.md) rule can help block related attacks and eliminate the risk of an incident.

## Verifying vulnerabilities <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarm regularly rechecks both active and closed vulnerabilities. This involves repeat testing of an infrastructure for a security issue that was discovered earlier. If rechecking result indicates that the vulnerability no longer exists, Wallarm changes its status to **Closed**. This may also occur if the server is temporarily unavailable. Conversely, if the rechecking of a closed vulnerability indicates that it still exists in the application, Wallarm changes its status back to **Active**.

Active vulnerabilities and vulnerabilities fixed less than a month ago are rechecked once a day. Vulnerabilities that were fixed more than a month ago are rechecked once a week.

Depending on the initial vulnerability detection method, the testing is performed by either **API Attack Surface Management (AASM)** or the **Threat Replay Testing** module.

It is not possible to recheck vulnerabilities that were detected passively.

If you need to recheck a vulnerability manually, you can trigger the rechecking process using the appropriate option in the vulnerability menu:

![A vulnerability that can be rechecked](../images/user-guides/vulnerabilities/recheck-vuln.png)

## Downloading vulnerability report

You can export the vulnerability data into a PDF or CSV report using the corresponding button in the UI. Wallarm will email the report to the specified address.

PDF is good for presenting visually rich reports with vulnerability and incident summaries, while CSV is better suited for technical purposes, providing detailed information on each vulnerability. CSV can be used to create dashboards, produce a list of the most vulnerable API hosts/applications, and more.

## API call to get vulnerabilities

To get vulnerability details, you can [call the Wallarm API directly](../api/overview.md) besides using the Wallarm Console UI. Below is the example of the corresponding API call.

To get the first 50 vulnerabilities in the status **Active** within the last 24 hours, use the following request replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format:

--8<-- "../include/api-request-examples/get-vulnerabilities.md"