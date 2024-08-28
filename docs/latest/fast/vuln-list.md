---
description: This document lists software vulnerabilities that FAST detects. Each entity in the list has the Wallarm code that corresponds to this vulnerability. Most vulnerabilities are also accompanied by the CWE codes.
---

[cwe-22]:   https://cwe.mitre.org/data/definitions/22.html
[cwe-78]:   https://cwe.mitre.org/data/definitions/78.html
[cwe-79]:   https://cwe.mitre.org/data/definitions/79.html
[cwe-89]:   https://cwe.mitre.org/data/definitions/89.html
[cwe-90]:   https://cwe.mitre.org/data/definitions/90.html
[cwe-94]:   https://cwe.mitre.org/data/definitions/94.html
[cwe-159]:  https://cwe.mitre.org/data/definitions/159.html
[cwe-200]:  https://cwe.mitre.org/data/definitions/200.html
[cwe-209]:  https://cwe.mitre.org/data/definitions/209.html
[cwe-215]:  https://cwe.mitre.org/data/definitions/215.html
[cwe-288]:  https://cwe.mitre.org/data/definitions/288.html
[cwe-352]:  https://cwe.mitre.org/data/definitions/352.html
[cwe-538]:  https://cwe.mitre.org/data/definitions/538.html
[cwe-541]:  https://cwe.mitre.org/data/definitions/541.html
[cwe-548]:  https://cwe.mitre.org/data/definitions/548.html
[cwe-601]:  https://cwe.mitre.org/data/definitions/601.html
[cwe-611]:  https://cwe.mitre.org/data/definitions/611.html
[cwe-639]:  https://cwe.mitre.org/data/definitions/639.html
[cwe-918]:  https://cwe.mitre.org/data/definitions/918.html
[cwe-943]:  https://cwe.mitre.org/data/definitions/943.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-csrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-xxe-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]:              https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

[link-ptrav-mitigation]:                    https://owasp.org/www-community/attacks/Path_Traversal

[anchor-vuln-list]:     #vulnerabilities-list

[anchor-rce]:   #remote-code-execution-rce
[anchor-ssrf]:  #server-side-request-forgery-ssrf

# Vulnerabilities That Can be Detected by FAST

This document lists software vulnerabilities that FAST detects. Each entity in the list has the Wallarm code that corresponds to this vulnerability. Most vulnerabilities are also accompanied by the [Common Weakness Enumeration (CWE)][link-cwe] codes.

Each entity in the list has the Wallarm code that corresponds to this vulnerability.

## Vulnerabilities List

### Anomaly

**CWE code:** none<br>
**Wallarm code:** `anomaly`

####    Description

Anomaly is characterized by an atypical reaction of the application to a received request.

The detected anomaly indicates a weak and potentially vulnerable area of the application. This vulnerability allows an attacker to either directly attack the application or to collect the data before the attack.

### Attack on XML External Entity (XXE)

**CWE code:** [CWE-611][cwe-611]<br>
**Wallarm code:** `xxe`

####    Description

The XXE vulnerability allows an attacker to inject an external entity in an XML document to be evaluated by an XML parser and then executed on the target web server.

As the result of a successful attack, an attacker will be able to
* get access to the web application's confidential data
* scan internal data networks
* read the files located on the web server
* perform an [SSRF][anchor-ssrf] attack
* perform a Denial of Service (DoS) attack

This vulnerability occurs due to a lack of restriction on the parsing of XML external entities in a web application.

####    Remediation

You may follow these recommendations:
* Disable the parsing of XML external entities when working with the XML documents supplied by a user.
* Apply the recommendations from the [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet].


### Server-Side Template Injection (SSTI)

**CWE codes:** [CWE-94][cwe-94], [CWE-159][cwe-159]<br>
**Wallarm code:** `ssti`

####    Description

An intruder can inject an executable code into a user-filled form on a web server vulnerable to SSTI attacks so that code will be parsed and executed by the web server.

A successful attack may render a vulnerable web server completely compromised, potentially allowing an intruder to execute arbitrary requests, explore the server's file systems, and, under certain conditions, remotely execute arbitrary code (see [“RCE attack”][anchor-rce] for details), as well as many other things.   

This vulnerability arises from the incorrect validation and parsing of user input.

####    Remediation

You may follow the recommendation to sanitize and filter all user input to prevent an entity in the input from being executed.


### Cross-Site Request Forgery (CSRF)

**CWE code:** [CWE-352][cwe-352]<br>
**Wallarm code:** `csrf`

####    Description

A CSRF attack allows an intruder to send requests to a vulnerable application on behalf of a legitimate user.

The corresponding vulnerability occurs due to the user's browser automatically adding cookies that are set for the target domain name while performing the cross-site request. 

As a result, the intruder can send a request to the vulnerable web application from a malicious website by posing as a legitimate user who is authenticated on the vulnerable site; the intruder does not even need to have access to that user's cookies.

####    Remediation

You may follow these recommendations:
* Employ anti-CSRF protection mechanisms, such as CSRF tokens and others.
* Set the `SameSite` cookie attribute.
* Apply the recommendations from the [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet].


### Cross-site Scripting (XSS)

**CWE code:** [CWE-79][cwe-79]<br>
**Wallarm code:** `xss`

####    Description

A cross-site scripting attack allows an intruder to execute a prepared arbitrary code in a user's browser.

There are a few XSS attack types:
* Stored XSS is when a malicious code is pre-embedded in the web application's page.

    If the web application is vulnerable to the stored XSS attack, then it is possible for an attacker to inject a malicious code into the web application's HTML page; moreover, this code will persist and be executed by the browser of any user who requests the infected webpage.
    
* Reflected XSS is when an intruder tricks a user into opening a specially crafted link.      

* DOM-based XSS is when a JavaScript code snippet built into the web application's page parses the input and executes it as a JavaScript command due to errors in this code snippet.

Exploiting any of the vulnerabilities listed above leads to the execution of an arbitrary JavaScript code. Provided that the XSS attack was successful, an intruder may steal a user's session or credentials, make requests on behalf of the user, and perform other malicious actions. 

This class of vulnerabilities occurs due to the incorrect validation and parsing of user input.


####    Remediation

You may follow these recommendations:
* Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
* While forming the web application's pages, sanitize and escape any entities that are formed dynamically.
* Apply the recommendations from the [OWASP XXS Prevention Cheat Sheet][link-owasp-xss-cheatsheet].


### Insecure Direct Object References (IDOR)

**CWE code:** [CWE-639][cwe-639]<br>
**Wallarm code:** `idor`

####    Description

With the IDOR vulnerability, the authentication and authorization mechanisms of a vulnerable web application do not prevent a user from accessing the data or resources of another user. 

This vulnerability occurs due to the web application granting the ability to access an object (e.g., a file, a directory, a database entry) by changing part of the request string and not implementing proper access control mechanisms.  

To exploit this vulnerability, an intruder manipulates the request string to gain unauthorized access to confidential information that belongs either to the vulnerable web application or to its users. 

####    Remediation

You may follow these recommendations:
* Implement proper access control mechanisms for the web application's resources.
* Implement role-based access control mechanisms to grant access to resources based on roles that are assigned to the users.
* Use indirect object references.
* Apply the recommendations from the [OWASP IDOR Prevention Cheat Sheet][link-owasp-idor-cheatsheet].


### Open Redirect

**CWE code:** [CWE-601][cwe-601]<br>
**Wallarm code:** `redir`

####    Description

An intruder can use an open redirect attack to redirect a user to a malicious web page via a legitimate web application.

Vulnerability to this attack occurs due to incorrect filtering of URL inputs.

####    Remediation

You may follow these recommendations:
* Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
* Notify users about all pending redirects, and ask for explicit permission.


### Server-Side Request Forgery (SSRF)

**CWE code:** [CWE-918][cwe-918]<br>
**Wallarm code:** `ssrf`

####    Description

A successful SSRF attack may allow an intruder to make requests on behalf of the attacked web server; this potentially leads to revealing the vulnerable web application's network ports in use, scanning the internal networks, and bypassing authorization.  

####    Remediation

You may follow these recommendations:
* Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
* Apply the recommendations from the [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet].


### Information Exposure

**CWE codes:** [CWE-200][cwe-200] (see also: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])<br>
**Wallarm code:** `info`

####    Description

The vulnerable web application either intentionally or unintentionally discloses confidential information to a subject that is not authorized to access it. 

####    Remediation

You may follow the recommendation to prohibit a web application from having the ability to display any confidential information.


### Remote Code Execution (RCE)

**CWE codes:** [CWE-78][cwe-78], [CWE-94][cwe-94] and others<br>
**Wallarm code:** `rce`

####    Description

An intruder can inject malicious code into a request to a web application, and the application will execute this code. Also, the intruder can try to execute certain commands for the operating system that the vulnerable web application runs on. 

Provided that an RCE attack is successful, an intruder can perform a wide range of actions, including
* Compromising the confidentiality, accessibility, and integrity of the vulnerable web application's data.
* Taking control of the operating system and the server that the web application runs on.
* Other possible actions.

This vulnerability occurs due to incorrect validation and parsing of user input.

####    Remediation

You may follow the recommendation to sanitize and filter all user input to prevent an entity in the input from being executed.


### Authentication Bypass

**CWE code:** [CWE-288][cwe-288]<br>
**Wallarm code:** `auth`

####    Description

Despite having authentication mechanisms in place, a web application can have alternative authentication methods that allow either bypassing the main authentication mechanism or exploiting its weaknesses. This combination of factors may result in an attacker gaining access with user or administrator permissions.

A successful authentication bypass attack potentially leads to disclosing users' confidential data or taking control of the vulnerable application with administrator permissions.

####    Remediation

You may follow these recommendations:
* Improve and strengthen existing authentication mechanisms.
* Eliminate any alternative authentication methods that may allow attackers to access an application while bypassing the required authentication procedure via pre-defined mechanisms.
* Apply the recommendations from the [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet].


### LDAP Injection

**CWE code:** [CWE-90][cwe-90]<br>
**Wallarm code:** `ldapi`

####    Description

LDAP injections represent a class of attacks that allow an intruder to alter LDAP search filters by modifying requests to an LDAP server.

A successful LDAP injection attack potentially grants access to the read and write operations on confidential data about LDAP users and hosts.

This vulnerability occurs due to the incorrect validation and parsing of user input.

####    Remediation

You may follow these recommendations:
* Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
* Apply the recommendations from the [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet].


### NoSQL Injection

**CWE code:** [CWE-943][cwe-943]<br>
**Wallarm code:** `nosqli`

####    Description

Vulnerability to this attack occurs due to insufficient filtering of user input. A NoSQL injection attack is performed by injecting a specially crafted query to a NoSQL database.

####    Remediation

You may follow the recommendation to sanitize and filter all user input to prevent an entity in the input from being executed.


### Path Traversal

**CWE code:** [CWE-22][cwe-22]<br>
**Wallarm code:** `ptrav`

####    Description

A path traversal attack allows an intruder to access files and directories with confidential data stored in the file system where the vulnerable web application resides by altering existing paths via the web application's parameters.

Vulnerability to this attack occurs due to insufficient filtering of user input when a user requests a file or directory via the web application.

####    Remediation

You may follow these recommendations:
* Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
* Additional recommendations for mitigating such attacks are available [here][link-ptrav-mitigation].


### SQL Injection

**CWE code:** [CWE-89][cwe-89]<br>
**Wallarm code:** `sqli`

####    Description

Vulnerability to this attack occurs due to insufficient filtration of user input. [An SQL injection attack](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1) is performed by injecting a specially crafted query to an SQL database.

An SQL injection attack allows an intruder to inject arbitrary SQL code into an SQL query. This potentially leads to the attacker being granted access to read and modify confidential data as well as to DBMS administrator rights. 

####    Remediation

You may follow these recommendations:
* Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
* Apply the recommendations from the [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet].
