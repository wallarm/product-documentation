# Managing Vulnerabilities

Vulnerabilities are security flaws in an infrastructure that may be exploited by attackers to perform unauthorized malicious actions with your system. The **Vulnerabilities** section of Wallarm Console allows you to analyze and manage security flaws that have been detected by Wallarm in your system.

Wallarm uses multiple methods to [discover](../about-wallarm/detecting-vulnerabilities.md) security weaknesses:

* **Passive detection**: the vulnerability was found due to the security incident that occurred
* **Active threat verification**: the vulnerability was found during the attack verification process
* **Vulnerability Scanner**: the vulnerability was found during the [exposed asset](scanner.md) scanning process

Wallarm stores the history of all detected vulnerabilities in the **Vulnerabilities** section:

![!Vulnerabilities tab](../images/user-guides/vulnerabilities/check-vuln.png)

## Vulnerability lifecycle

The lifecycle of a vulnerability involves its assessment, remediation, and verification stages. Taking this approach helps mitigate the risk of security breaches arising from weaknesses in the system.

![!Vulnerability lifecycle](../images/user-guides/vulnerabilities/vulnerability-lifecycle.png)

At Wallarm, we cover all stages of the vulnerability lifecycle. Our platform provides you with details on vulnerability assessment, recommendations for remediation, virtual patching and automatic vulnerability verification to ensure that you have truly remediated and secured your system. Changes in the vulnerability lifecycle are reflected in the vulnerability change history.

## Assessing and remediating vulnerabilities

Wallarm provides each vulnerability with the details that helps to assess the level of risk and take steps to address security issues:

* The unique identifier of the vulnerability in the Wallarm system
* Risk level indicating danger of consequences of the vulnerability exploitation

    Wallarm automatically indicates the vulnerability risk using the Common Vulnerability Scoring System (CVSS) framework, likelihood of a vulnerability being exploited, its potential impact on the system, etc. You can change the risk level to your own value based on your unique system requirements and security priorities.
* Type of the vulnerability that also corresponds to the type of attacks exploiting the vulnerability. [The list of vulnerability types Wallarm detects](../attacks-vulns-list.md)
* Domain and path at which the vulnerability exists
* Parameter that can be used to pass a malicious payload exploiting the vulnerability
* Method by which the vulnerability was [detected](../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods)
* Target application architecture part that can be affected if the vulnerability exploited, can be **Server**, **Client**, **Database**
* Date and time when the vulnerability was detected
* Last [verification date](#verifying-vulnerabilities) of the vulnerability
* Detailed vulnerability description, exploitation example and recommended remediation steps
* Related incidents
* History of vulnerability status changes

![!Vulnerability detailed information](../images/user-guides/vulnerabilities/vuln-info.png)

All vulnerabilities should be fixed on the application side because they make your system more vulnerable to malicious actions. If a vulnerability cannot be fixed, using the [virtual patch](rules/vpatch-rule.md) rule can help block related attacks and eliminate the risk of an incident.

## Verifying vulnerabilities <a href="../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

Wallarm regularly rechecks both active and closed vulnerabilities. This involves repeat testing of an infrastructure for a security issue that was discovered earlier. If rechecking result indicates that the vulnerability no longer exists, Wallarm changes its status to **Closed**. This may also occur if the server is temporarily unavailable. Conversely, if the rechecking of a closed vulnerability indicates that it still exists in the application, Wallarm changes its status back to **Active**.

Active vulnerabilities and vulnerabilities fixed less than a month ago are rechecked once a day. Vulnerabilities that were fixed more than a month ago are rechecked once a week.

Depending on the initial vulnerability detection method, the testing is performed by either **Vulnerability Scanner** or the **Active Threat Verification** module. The configuration settings for the automated recheking process can be controlled via the [**Configure**](#configuring-vulnerability-detection) button.

It is not possible to recheck vulnerabilities that were detected passively.

If you need to recheck a vulnerability manually, you can trigger the rechecking process using the appropriate option in the vulnerability menu:

![!A vulnerability that can be rechecked](../images/user-guides/vulnerabilities/recheck-vuln.png)

## Vulnerability statuses

Wallarm automatically changes the status of vulnerabilities depending on the [rechecking](#verifying-vulnerabilities) results. You can also manually adjust vulnerability statuses as needed.

* **Active** status indicates that the vulnerability still exists in the infrastructure.
* **Closed** status is used when the vulnerability has been resolved on the application side or determined to be a false positive.

A [false positive](../about-wallarm/detecting-vulnerabilities.md#false-positives) occurs when a legitimate entity is mistakenly identified as a vulnerability. If you come across a vulnerability that you believe is a false positive, you can report it using the appropriate option in the vulnerability menu. This will help to improve the accuracy of Wallarm's vulnerability detection. Wallarm reclassifies the vulnerability as a false positive, changes its status to **Closed** and does not subject it to further [rechecking](#verifying-vulnerabilities).

## Configuring vulnerability detection

The vulnerability detection configuration can be fine-tuned using the **Configure** button, with the following options:

* Enable / disable **Vulnerability Scanner** and specify the types of vulnerabilities you want to detect using this Wallarm module. The Scanner is enabled by default and is set to target all available vulnerability types.

    !!! info "Disabling Vulnerability Scanner affect exposed asset discovery"
        Please note that the **Vulnerability Scanner** switcher controls both the vulnerability and [exposed asset](scanner.md) discovery processes.
* Enable / disable vulnerability rechecking with the Scanner by selecting the **Recheck vulnerabilities** option.
* Enable / disable the **Active threat verification** module for vulnerability detection and rechecking. Note that this option controls the module itself, not just the rechecking process.

    By default, this module is disabled, learn its configuration [best practices](../admin-en/attack-rechecker-best-practices.md) before enabling.

TBD: screenshot

Additionally, in the [**Scanner**](scanner.md) section of the UI you can control which exposed assets should be scanned by the Vulnerability Scanner for vulnerabilities and what RPS/RPM generated by the Scanner is allowed for each asset.

## Downloading vulnerability report

You can export the vulnerability data into a PDF or CSV report using the corresponding button in the UI. Wallarm will email the report to the specified address.

PDF is good for presenting visually rich reports with vulnerability and incident summaries, while CSV is better suited for technical purposes, providing detailed information on each vulnerability. CSV can be used to create dashboards, produce a list of the most vulnerable API hosts/applications, and more.

## API call to get vulnerabilities

To get vulnerability details, you can [call the Wallarm API directly](../api/overview.md) besides using the Wallarm Console UI. Below is the example of the corresponding API call.

To get the first 50 vulnerabilities in the status **Active** within the last 24 hours, use the following request replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format:

--8<-- "../include/api-request-examples/get-vulnerabilities.md"