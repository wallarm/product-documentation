[link-false-vulns]:     false-vuln.md
[link-checking-vulns]:  check-vuln.md

[img-vuln-info]:            ../../images/user-guides/vulnerabilities/vuln-info.png

[glossary-vulnerability]:       ../../glossary-en.md#vulnerability

# Analyzing Vulnerabilities

Check [vulnerabilities][glossary-vulnerability] on the *Vulnerabilities* tab of the Wallarm interface.

## Analyze a Vulnerability

Click the vulnerability entry from the list to view detailed information about it.

![!Vulnerability detailed information][img-vuln-info]

Wallarm displays the detailed information about the vulnerability:

* Internal ID
* Method by which the vulnerability was discovered
* Risk level
* Vulnerability status
* Last check date
* Domain
* Target resource
* Discovery date and time
* Path
* Request method
* Request parameter
* Related incidents
* Detailed description
* Additional information
* Exploit example

If any malicious requests exploiting this vulnerability are discovered, the *Exploit example* field has the warning: *Attention. Found by incidents*.

Clicking the link displays the associated security incidents.


## Vulnerability Detection Method

Vulnerabilities can be detected in the protected applications by the following methods:
*   **Active Threat Verification**: the vulnerability was found during the attack verification process.
*   **Passive Detection**: the vulnerability was found due to the security incident that occurred.
*   **Vulnerability Scanner**: the vulnerability was found during the scope scanning process.
*   **Test Run**: the vulnerability was found during the test run conducted by FAST.

If the method by which the vulnerability was discovered is unknown, this information is not shown.
