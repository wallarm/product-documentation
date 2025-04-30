### Email

You automatically receive notifications to your personal email (the one you use to log in) about discovered hosts and security issues, including:

* **Daily critical security issues (new only)** - all [critical][link-aasm-security-issue-risk-level] security issues opened for the day, sent once a day with a detailed description of each issue and instructions on how to mitigate it.
* **Daily security issues (new only)** - statistics for security issues opened for the day, sent once a day with information on how many issues of every [risk level][link-aasm-security-issue-risk-level] were found and general action items for mitigation.
* **Weekly AASM statistics** - information about hosts, APIs, and statistics for security issues discovered for your configured domains within last week.

The notifications are enabled by default. You can unsubscribe at any moment and configure any additional emails to get all or some of these notifications in Wallarm Console → **Configuration** → **Integrations** → **Email and messengers** → **Personal email** (you email) or **Email report** (extra emails) as described [here][link-integrations-email].

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