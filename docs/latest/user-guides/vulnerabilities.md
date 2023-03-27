# Managing Vulnerabilities

Wallarm stores the history of all [detected](../about-wallarm/detecting-vulnerabilities.md) vulnerabilities in the **Vulnerabilities** section of Wallarm Console. This guide instructs you on how to use this section.

Users of the **Administrator / Global Administrator** and **Analyst / Global Analyst** [roles](settings/users.md#user-roles) can view and manage vulnerabilities. Users of the **Read Only / Global Read** role can only view the data.	

![!Vulnerabilities tab](../images/user-guides/vulnerabilities/check-vuln.png)

## Analyzing vulnerabilities

Analyzing vulnerabilities helps you find weaknesses in your system and take steps to address them, reducing the risk of security breaches and data loss.

Wallarm provides each vulnerability with the following data:

* The unique identifier of the vulnerability in the Wallarm system
* Risk level indicating danger of consequences of the vulnerability exploitation
* Type of the vulnerability that also corresponds to the type of attacks that can exploit the vulnerability. [The list of vulnerability types Wallarm detects](../attacks-vulns-list.md)
* Domain and path at which the vulnerability exists
* Parameter that can be used to pass a malicious payload exploiting the vulnerability
* Method by which the vulnerability was [detected](../about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods):

    * **Passive detection**: the vulnerability was found due to the security incident that occurred
    * **Active threat verification**: the vulnerability was found during the attack verification process
    * **Vulnerability Scanner**: the vulnerability was found during the scope scanning process
* Target application architecture part that can be affected if the vulnerability exploited, can be **Server**, **Client**, **Database**
* Date and time when the vulnerability was detected
* Last [verification date](#veryfying-vulnerabilities) of the vulnerability
* Current vulnerability status
* Detailed vulnerability description and exploitation example
* Related incidents
* History of vulnerability status changes

![!Vulnerability detailed information](../images/user-guides/vulnerabilities/vuln-info.png)

All vulnerabilities should be fixed on the application side because they make your system more vulnerable to malicious attacks. If a vulnerability can't be fixed, using the [virtual patch](rules/vpatch-rule.md) rule can help block attacks and eliminate the risk of an incident.

## Closing and reopening vulnerabilities

Wallarm automatically changes the status of vulnerabilities to **Closed** if they are not confirmed by the automatic vulnerability [verification](#veryfying-vulnerabilities) process. Additionally, closed vulnerabilities are re-checked, and if they are found to still exist in subsequent tests, they will be returned to the **Active** status.

You can also manually close vulnerabilities that have been fixed in your application by using the appropriate option in the menu.

![!Closing a vulnerability on its page](../images/user-guides/vulnerabilities/close-vuln-page.png)

Similarly, you can manually reopen a vulnerability if needed.

## Marking vulnerabilities as false positives

A [false positive](../about-wallarm/detecting-vulnerabilities.md#false-positives) occurs when a legitimate entity is mistakenly identified as a vulnerability. If you come across a vulnerability that you believe is a false positive, you can report it using the appropriate option in the menu. This will help to improve the accuracy of Wallarm's vulnerability detection.

![!False positive on the vulnerability page](../images/user-guides/vulnerabilities/false-vuln-page.png)

Wallarm reclassifies the vulnerability as a false positive, changes its status to **Closed** and does not subject it to further [verification](#veryfying-vulnerabilities).

To undo a false positive mark, use the **Reopen** option:

![!Discard false vulnerability](../images/user-guides/vulnerabilities/discard-false-vuln.png)

## Veryfying vulnerabilities <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

To ensure that your list of vulnerabilities is up-to-date, Wallarm regularly verifies both active and closed vulnerabilities using the [**Active threat prevention**](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) method. This involves generating a test attack set and analyzing the application's response.

If the response indicates that the vulnerability no longer exists, Wallarm changes its status to **Closed**. This may also occur if the server is temporarily unavailable. Conversely, if the verification of a closed vulnerability indicates that it still exists in the application, Wallarm changes its status back to **Active**.

If you need to verify a vulnerability manually, you can trigger the verification process using the appropriate option:

![!A vulnerability that can be rechecked](../images/user-guides/vulnerabilities/recheck-vuln.png)

## Downloading vulnerability report

You can export the vulnerability data into a PDF or CSV report using the corresponding button in the UI. Wallarm will email the report to the specified address.

PDF is good for presenting visually rich reports with vulnerability and incident summaries, while CSV is better suited for technical purposes, providing detailed information on each vulnerability. CSV can be used to create dashboards, produce a list of the most vulnerable API hosts/applications, and more.

## API call to get vulnerabilities

To get vulnerability details, you can [call the Wallarm API directly](../api/overview.md) besides using the Wallarm Console UI. Below is the example of the corresponding API call.

To get the first 50 vulnerabilities in the status **Active** within the last 24 hours, use the following request replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format:

--8<-- "../include/api-request-examples/get-vulnerabilities.md"
