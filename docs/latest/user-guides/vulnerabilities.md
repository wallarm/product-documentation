[link-aasm-security-issue-risk-level]:  #issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md

# Managing Security Issues

Vulnerabilities are security flaws in an infrastructure that may be exploited by attackers to perform unauthorized malicious actions with your system. In Wallarm Console, you can analyze and manage security flaws that have been detected by Wallarm in your system in the **Events** →  **Security Issues** section.

Wallarm employs [various techniques](../about-wallarm/detecting-vulnerabilities.md#detection-methods) to discover security weaknesses.

## Exploring security issues

To explore and manage the found security issues, in Wallarm Console, go to the **Security Issues** section.

![Security Issues](../images/api-attack-surface/security-issues.png)

Here, the detailed information on found issues is presented, including:

* Full filterable list of issues with brief and [detailed description](#issue-details-and-lifecycle) of each
* Top vulnerable hosts list
* Distribution of security issues by type
* [Risk level](#issue-risk-level) evaluation and distribution of security issues by these levels
* Monthly historical information on detected and resolved issues for the last 6 month

## Issue details and lifecycle

Wallarm provides detailed information on each detected security issues to allow clear understanding of what is happening and what can be done. 

### Issue details

Click the issue in the list to open its details, such as:

* Basic info (type, host and url, first and last seen time)
* Detailed **Description**
* Measures for **Mitigation**
* Information on linked CVEs ranked by risk as **Additional information**

![Security issues details - Details](../images/api-attack-surface/security-issue-details.png)

### Issue lifecycle

Once a security issue is detected, it obtains the **Open** status meaning some measures are required to mitigate it. In the issue details, you can close it (means it was resolved) or mark as false.

It is useful to provide comment on each status change, giving others the full view of what is the reason of change. Author and time of change are tracked automatically.

Security issues can be closed by Wallarm automatically after next automatic or manual rescan in the following cases:

* Port not found during last scan
* Network service has changed
* New version of the product detected
* Vulnerable version no longer present
* Vulnerability not detected during last scan

Issues can be re-opened automatically after next rescan or manually. Note that issues marked as false are never re-opened automatically.

![Security issues - lifecycle diagram](../images/api-attack-surface/security-issue-lifecycle.png)

### Changing risk level

If you re-evaluate the [risk level](#issue-risk-level) of the issue, go to its details and select new risk level from the list.

### Adding comments

While it is always useful to provide comment on status change (closing, re-opening), you can add any comments to the issue at any moment without changing anything else. To do so, use the **Add comment** button: your comment will become the part of **Status history**.

### Status history

For you to be on track, the full history of changes and comments is displayed in the **Status history** section of the security issue.

![Security issues - lifecycle diagram](../images/api-attack-surface/aasm-sec-issue-history.png)

## Issue risk level

Each discovered security issue is automatically assessed by how much risk it poses as described in the table.

| Risk | Description | Examples |
| ----- | ----- | ----- |
|  **Critical** | The vulnerability's presence may lead to a system compromise, allowing an attacker to remotely execute code or cause a denial of service (DoS) or service degradation. Immediate reaction is required. | <ul><li>Remote code execution</li><li>Indicator of compromise (e.g., publicly accessible web shell)</li></ul> |
|  **High** | The presence of the vulnerability may lead to partial system compromise, such as database access or limited access to the filesystem. In specific circumstances (e.g., if special requirements are met or if chained with other vulnerabilities), the vulnerability may lead to system compromise (e.g., remote code execution). | <ul><li>Path traversal</li><li>XML external entity (XXE) injection</li><li>Vulnerable software version with CVEs of critical and high risk<sup>*</sup></li></ul> |
|  **Medium** | The vulnerability may lead to bypassing security controls, limited exposure or access, but without full compromise. It can allow access to sensitive data or configurations and potentially be leveraged in a more complex attack chain. | <ul><li>Cross-site scripting</li><li>GraphQL misconfigurations</li><li>Exposure of configuration files</li><li>API leak of long-lived credentials (passwords, API keys)</li><li>Vulnerable software version with CVEs of high risk<sup>*</sup></li></ul> |
|  **Low** | The vulnerability has minimal impact and does not directly lead to significant damage or exploitation as requirements/conditions are too complex. However, it can be combined with other vulnerabilities to escalate an attack. | <ul><li>TLS/SSL misconfigurations</li><li>API leak of short-lived authentication tokens (e.g., JWT tokens)</li></ul> |
|  **Info** | The issue does not pose an immediate security risk but should still be reviewed for potential manual validation. It often involves exposure of non-critical data or violation of best practices. | <ul><li>Exposure of OpenAPI schema</li><li>Leakage of personally identifiable information (PII), such as emails or usernames</li></ul> |

<small><sup>*</sup> If the software version contains multiple CVEs, including critical ones, the overall risk level is assessed as high. The risk level is reduced by one level because the presence of a vulnerable version does not explicitly indicate the existence of the vulnerability. For example, the vulnerability may occur only in a specific, non-default configuration or require certain conditions to be met.</small>

You can re-evaluate and manually adjust the risk level at any moment.

## Security issue reports

You can get report on all or filtered security issues in CSV or JSON format using the **Download report** button.

![Security issues details - Lifecycle controls](../images/api-attack-surface/security-issues-report.png)

## Notifications

--8<-- "../include/api-attack-surface/aasm-notifications.md"

<!--Commented out as we do not have info on what exactly from Security Issues scope can be extracted via IP calls - this is a separate task.

## API call to get vulnerabilities

To get vulnerability details, you can [call the Wallarm API directly](../api/overview.md) besides using the Wallarm Console UI. Below is the example of the corresponding API call.

To get the first 50 vulnerabilities in the status **Active** within the last 24 hours, use the following request replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format:

--8<-- "../include/api-request-examples/get-vulnerabilities.md"-->