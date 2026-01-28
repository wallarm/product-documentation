[link-aasm-security-issue-risk-level]:  #issue-risk-level
[link-integrations-intro]:              ../user-guides/settings/integrations/integrations-intro.md
[link-integrations-email]:              ../user-guides/settings/integrations/email.md

# Managing Security Issues

Security issues (vulnerabilities) are security flaws in an infrastructure that may be exploited by attackers to perform unauthorized malicious actions with your system. Wallarm employs [various techniques](../about-wallarm/detecting-vulnerabilities.md#detection-methods) to discover security issues. This article describes how to analyze and manage security in Wallarm Console.

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

### Grouped view

By default, alike security issues are grouped (**Grouped view**), if they:

* Have the same title (**Security issue** column)
* Have the same risk level (**Risk** column)
* Discovered by the same tool (**Discovered by** column)

You can:

* See the number of issues in the group (**Count** column)
* See all statuses within the group
* Click group to expand
* Open each issue in a new window
* Disable/re-enable grouped view with **Grouped view** switcher

![Security issues - grouped view](../images/api-attack-surface/si-grouped-view.png)

### Issue details

Open issue to see its details, such as:

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

### Risk level

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

### Presence of incidents

[Incidents](../user-guides/events/check-incident.md) are attacks that successfully exploited the security issue (vulnerability). These attacks were detected, but not blocked by Wallarm due to the current settings (`monitoring` [filtration mode](../admin-en/configure-wallarm-mode.md) or others).

Presence of incidents indicates jump from a theoretical risk to a live threat and requires prioritizing fixes of these security issues:

* Once a vulnerability is successfully exploited, it often becomes public knowledge in the hacker community.
* If one attacker succeeds, others will use the same method. An incident indicates that your system is now a confirmed target.
* Incidents are the subject of investigation to find out data losses or other damages.

Analyze incidents presence and impact:

* Pay attention to the issues having `Incident` tag in the **Security issue** column.
* Set the **Incident** filter to `Incident detected` to see all issues with incidents. Go to issue details, view the **Related incidents** section. From here, you can go to every incident details.

![Incidents in Security Issues](../images/user-guides/vulnerabilities/si-incidents.png)

## Security issue reports

You can get report on all or filtered security issues in CSV or JSON format using the **Download report** button.

![Security issues details - Lifecycle controls](../images/api-attack-surface/security-issues-report.png)

## Notifications

### Email

You automatically receive notifications to your personal email (the one you use to log in) about discovered hosts and security issues, including:

* **Daily critical security issues (new only)** - all [critical][link-aasm-security-issue-risk-level] security issues opened for the day, sent once a day with a detailed description of each issue and instructions on how to mitigate it.
* **Daily security issues (new only)** - statistics for security issues opened for the day, sent once a day with information on how many issues of every [risk level][link-aasm-security-issue-risk-level] were found and general action items for mitigation.

Additionally, information about security issues found specifically by [API Attack Surface Management (AASM)](../api-attack-surface/overview.md) are sent within additional AASM-specific report:

* **Weekly AASM statistics** - information about hosts, APIs, and statistics for security issues discovered for your configured domains within last week.

The notifications are enabled by default. You can unsubscribe at any moment and configure any additional emails to get all or some of these notifications in Wallarm Console → **Configuration** → **Integrations** → **Email and messengers** → **Personal email** (your email) or **Email report** (extra emails) as described [here][link-integrations-email].

### Instant notification

You can configure instant notification for the new and re-opened security issues. Select all or only some risk levels that should trigger notification. Separate message will be sent for each security issue.

Example:

```
[Wallarm System] New security issue detected
Notification type: security_issue
New security issue was detected in your system.
ID: 106279
Title: Vulnerable version of Nginx: 1.14.2
Host: <HOST_WITH_ISSUE>
Path:
Port: 443
URL: <URL_WITH_ISSUE>
Method:
Discovered by: AASM
Parameter:
Type: Vulnerable component
Risk: Medium
More details: 
Client: <YOUR_COMPANY_NAME>
Cloud: US
```

You can configure instant notification for the security issues in Wallarm Console → **Configuration** → **Integrations** → YOUR_INTEGRATION as described in [your integration][link-integrations-intro] documentation.

<!--Commented out as we do not have info on what exactly from Security Issues scope can be extracted via IP calls - this is a separate task.

## API call to get vulnerabilities

To get vulnerability details, you can [call the Wallarm API directly](../api/overview.md) besides using the Wallarm Console UI. Below is the example of the corresponding API call.

To get the first 50 vulnerabilities in the status **Active** within the last 24 hours, use the following request replacing `TIMESTAMP` with the date 24 hours ago converted to the [Unix Timestamp](https://www.unixtimestamp.com/) format:

--8<-- "../include/api-request-examples/get-vulnerabilities.md"-->