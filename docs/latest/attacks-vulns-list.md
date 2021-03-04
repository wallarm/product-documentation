#   Attack and Vulnerability Types 

[cwe-22]:   https://cwe.mitre.org/data/definitions/22.html
[cwe-78]:   https://cwe.mitre.org/data/definitions/78.html
[cwe-79]:   https://cwe.mitre.org/data/definitions/79.html
[cwe-89]:   https://cwe.mitre.org/data/definitions/89.html
[cwe-90]:   https://cwe.mitre.org/data/definitions/90.html
[cwe-93]:   https://cwe.mitre.org/data/definitions/93.html
[cwe-94]:   https://cwe.mitre.org/data/definitions/94.html
[cwe-113]:  https://cwe.mitre.org/data/definitions/113.html
[cwe-159]:  https://cwe.mitre.org/data/definitions/159.html
[cwe-200]:  https://cwe.mitre.org/data/definitions/200.html
[cwe-209]:  https://cwe.mitre.org/data/definitions/209.html
[cwe-215]:  https://cwe.mitre.org/data/definitions/215.html
[cwe-288]:  https://cwe.mitre.org/data/definitions/288.html
[cwe-307]:  https://cwe.mitre.org/data/definitions/307.html
[cwe-352]:  https://cwe.mitre.org/data/definitions/352.html
[cwe-425]:  https://cwe.mitre.org/data/definitions/425.html
[cwe-444]:  https://cwe.mitre.org/data/definitions/444.html
[cwe-511]:  https://cwe.mitre.org/data/definitions/511.html
[cwe-521]:  https://cwe.mitre.org/data/definitions/521.html
[cwe-538]:  https://cwe.mitre.org/data/definitions/538.html
[cwe-541]:  https://cwe.mitre.org/data/definitions/541.html
[cwe-548]:  https://cwe.mitre.org/data/definitions/548.html
[cwe-601]:  https://cwe.mitre.org/data/definitions/601.html
[cwe-611]:  https://cwe.mitre.org/data/definitions/611.html
[cwe-799]:  https://cwe.mitre.org/data/definitions/799.html
[cwe-639]:  https://cwe.mitre.org/data/definitions/639.html
[cwe-918]:  https://cwe.mitre.org/data/definitions/918.html
[cwe-943]:  https://cwe.mitre.org/data/definitions/943.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-xxe-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]:              https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

[link-ptrav-mitigation]:                    https://www.checkmarx.com/knowledge/knowledgebase/path-traversal
[link-wl-process-time-limit-directive]:     admin-en/configure-parameters-en.md#wallarm_process_time_limit

[doc-vpatch]:   user-guides/rules/vpatch-rule.md

[anchor-main-list]:     #the-main-list-of-attacks-and-vulnerabilities        
[anchor-special-list]:  #the-list-of-special-attacks-and-vulnerabilities

[anchor-brute]: #bruteforce-attack
[anchor-rce]:   #remote-code-execution-rce
[anchor-ssrf]:  #server-side-request-forgery-ssrf

The Wallarm filter node can detect many attacks and vulnerabilities. These attacks and vulnerabilities are listed [below][anchor-main-list].

Each entity in the list
*   is tagged with either “Attack,” “Vulnerability,” or both.

    The name of a particular attack can be the same as the name of the vulnerability this attack exploits. In this case, such an entity will be tagged with the combined “Vulnerability/Attack” tag.

*   has the Wallarm code that corresponds to this entity.   

Most of the vulnerabilities and attacks on this list are also accompanied by one or more codes from the list of software weakness types, also known as the [Common Weakness Enumeration][link-cwe] or CWE.

Additionally, the Wallarm filter node employs several special attack and vulnerability types for the internal purpose of marking processed traffic. Such entities are not accompanied by CWE codes but are [listed separately][anchor-special-list]. 

??? info "Watch Wallarm video about how WAF protects against OWASP Top 10"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

##  The Main List of Attacks and Vulnerabilities


### Attack on XML External Entity (XXE)

**Vulnerability/Attack**<br>
**CWE code:** [CWE-611][cwe-611]<br>
**Wallarm code:** `xxe`

**Description:**

The XXE vulnerability allows an attacker to inject an external entity in an XML document to be evaluated by an XML parser and then executed on the target web server.

As the result of a successful attack, an attacker will be able to
*   get access to the web application's confidential data
*   scan internal data networks
*   read the files located on the web server
*   perform an [SSRF][anchor-ssrf] attack
*   perform a Denial of Service (DoS) attack

This vulnerability occurs due to a lack of restriction on the parsing of XML external entities in a web application.

**Remediation:**

You may follow these recommendations:
*   Disable the parsing of XML external entities when working with the XML documents supplied by a user.
*   Apply the recommendations from the [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet].


### Brute‑Force Attack

**Attack**<br> 
**CWE codes:** [CWE-307][cwe-307], [CWE-521][cwe-521], [CWE-799][cwe-799]<br>
**Wallarm code:** `brute`

**Description:**

A brute‑force attack occurs when a massive number of requests with a predefined payload are sent to the server. These payloads may be generated by some means or taken from a dictionary. The server's response is then analyzed to find the right combination of the data in the payload.

A successful brute‑force attack can potentially bypass authentication and authorization mechanisms and/or reveal a web application's hidden resources (such as directories, files, website parts, etc.), thus granting the ability to conduct other malicious actions.

**Remediation:**

You may follow these recommendations:
*   Limit the number of requests per a certain time period for a web application.
*   Limit the number of authentication/authorization attempts per a certain time period for a web application.
*   Block new authentication/authorization attempts after a certain number of the failed attempts.
*   Restrict a web application from accessing any files or directories on the server it runs on, except those within the scope of the application. 

[How to configure Wallarm WAF to protect applications from brute force →](admin-en/configuration-guides/protecting-against-bruteforce.md)

??? info "Watch Wallarm video about brute‑force attacks"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/0R_2wL5_a-I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

### Resource Scanning

**Attack**<br>
**CWE code:** none<br>
**Wallarm code:** `scanner`

**Description:**    

The `scanner` code is assigned to an HTTP request if this request is believed to be part of third‑party scanner software activity that is targeted to attack or scan a protected resource. The Wallarm scanner's requests are not considered to be a resource scanning attack.  For example, an intruder can use *port scanner software* to enumerate all open network ports and then map services to well‑known port numbers. This information may be used later to attack these services.

**Remediation:**

You may follow these recommendations:
*   Limit the possibility of a network perimeter scan by employing IP address whitelisting and blacklisting along with authentication/authorization mechanisms.
*   Minimize the scan surface by placing the network perimeter behind a firewall.
*   Define a necessary and sufficient set of ports to be opened for your services to operate.
*   Restrict the usage of ICMP protocol on the network level.
*   Periodically update your IT infrastructure equipment. This includes
    *   firmware of servers and other equipment
    *   operating systems
    *   other software


### Server‑Side Template Injection (SSTI)

**Vulnerability/Attack**<br>
**CWE codes:** [CWE-94][cwe-94], [CWE-159][cwe-159]<br>
**Wallarm code:** `ssti`

**Description:**

An intruder can inject an executable code into a user‑filled form on a web server vulnerable to SSTI attacks so that code will be parsed and executed by the web server.

A successful attack may render a vulnerable web server completely compromised, potentially allowing an intruder to execute arbitrary requests, explore the server's file systems, and, under certain conditions, remotely execute arbitrary code (see [“RCE attack”][anchor-rce] for details), as well as many other things.   

This vulnerability arises from the incorrect validation and parsing of user input.

**Remediation:**

You may follow the recommendation to sanitize and filter all user input to prevent an entity in the input from being executed.


### Logic Bomb

**Attack**<br>
**CWE code:** [CWE-511][cwe-511]<br>
**Wallarm code:** `logic_bomb`

**Description:**

A logic bomb is a piece of malicious code that runs under certain conditions to perform some malicious actions. A “time bomb” is a variety of logic bomb that goes off at a certain time or date.

An example of a logic bomb is a program that is in control of a company's salary calculation system and which attacks the company if a particular employee gets fired.

**Remediation:**

You may follow these recommendations:
*   Use both static and dynamic code analyzers to inspect the produced code.
*   Meticulously audit all code that is not covered by tests. 
*   Validate the integrity of any software being installed (e.g., check the software's digital signature).

### Cross‑site Scripting (XSS)

**Vulnerability/Attack**<br>
**CWE code:** [CWE-79][cwe-79]<br>
**Wallarm code:** `xss`

**Description:**

A cross‑site scripting attack allows an intruder to execute a prepared arbitrary code in a user's browser.

There are a few XSS attack types:
*   Stored XSS is when a malicious code is pre‑embedded in the web application's page.

    If the web application is vulnerable to the stored XSS attack, then it is possible for an attacker to inject a malicious code into the web application's HTML page; moreover, this code will persist and be executed by the browser of any user who requests the infected webpage.
    
*   Reflected XSS is when an intruder tricks a user into opening a specially crafted link.      

*   DOM‑based XSS is when a JavaScript code snippet built into the web application's page parses the input and executes it as a JavaScript command due to errors in this code snippet.

Exploiting any of the vulnerabilities listed above leads to the execution of an arbitrary JavaScript code. Provided that the XSS attack was successful, an intruder may steal a user's session or credentials, make requests on behalf of the user, and perform other malicious actions. 

This class of vulnerabilities occurs due to the incorrect validation and parsing of user input.


**Remediation:**

You may follow these recommendations:
*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   While forming the web application's pages, sanitize and escape any entities that are formed dynamically.
*   Apply the recommendations from the [OWASP XXS Prevention Cheat Sheet][link-owasp-xss-cheatsheet].


### Insecure Direct Object References (IDOR)

**Vulnerability**<br>
**CWE code:** [CWE-639][cwe-639]<br>
**Wallarm code:** `idor`

**Description:**

With the IDOR vulnerability, the authentication and authorization mechanisms of a vulnerable web application do not prevent a user from accessing the data or resources of another user. 

This vulnerability occurs due to the web application granting the ability to access an object (e.g., a file, a directory, a database entry) by changing part of the request string and not implementing proper access control mechanisms.  

To exploit this vulnerability, an intruder manipulates the request string to gain unauthorized access to confidential information that belongs either to the vulnerable web application or to its users. 

**Remediation:**

You may follow these recommendations:
*   Implement proper access control mechanisms for the web application's resources.
*   Implement role‑based access control mechanisms to grant access to resources based on roles that are assigned to the users.
*   Use indirect object references.
*   Apply the recommendations from the [OWASP IDOR Prevention Cheat Sheet][link-owasp-idor-cheatsheet].


### Open Redirect

**Attack**<br>
**CWE code:** [CWE-601][cwe-601]<br>
**Wallarm code:** `redir`

**Description:**

An intruder can use an open redirect attack to redirect a user to a malicious web page via a legitimate web application.

Vulnerability to this attack occurs due to incorrect filtering of URL inputs.

**Remediation:**

You may follow these recommendations:
*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Notify users about all pending redirects, and ask for explicit permission.


### Server‑Side Request Forgery (SSRF)

**Vulnerability/Attack**<br>
**CWE code:** [CWE-918][cwe-918]<br>
**Wallarm code:** `ssrf`

**Description:**

A successful SSRF attack may allow an intruder to make requests on behalf of the attacked web server; this potentially leads to revealing the web application's network ports in use, scanning the internal networks, and bypassing authorization.  

**Remediation:**

You may follow these recommendations:
*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Apply the recommendations from the [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet].


### Forced Browsing

**Attack**<br>
**CWE code:** [CWE-425][cwe-425]<br>
**Wallarm code:** `dirbust`

**Description:**

This attack belongs to the class of brute‑force attacks. The purpose of this attack is to detect a web application's hidden resources, namely directories and files. This is achieved by trying different file and directory names that are either generated based on some template or extracted from a prepared dictionary file.

A successful forced browsing attack potentially grants access to hidden resources that are not explicitly available from the web application interface but are exposed when accessed directly.

**Remediation:**

You may follow these recommendations:
*   Restrict or limit users' acess to those resources they are not supposed to have direct access to (e.g., by employing some authentication or authorization mechanisms).
*   Limit the number of requests per a certain time period for the web application.
*   Limit the number of authentication/authorization attempts per a certain time period for the web application.
*   Block new authentication/authorization attempts after a certain number of failed attempts.
*   Set necessary and sufficient access rights for the web application's files and directories.

[How to configure Wallarm WAF to protect applications from brute force →](admin-en/configuration-guides/protecting-against-bruteforce.md)

??? info "Watch Wallarm video about brute‑force attacks"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/0R_2wL5_a-I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

### Information Exposure

**Vulnerability/Attack**<br>
**CWE codes:** [CWE-200][cwe-200] (see also: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548])<br>
**Wallarm code:** `infoleak`

**Description:**

The application either intentionally or unintentionally discloses sensitive information to a subject that is not authorized to access it.

The vulnerability of this type can be detected only by the method of [passive detection](about-wallarm-waf/detecting-vulnerabilities.md#passive-detection). If the response to the request discloses sensitive information, Wallarm records an incident and an active vulnerability of the **Information Exposure** type. Some kinds of sensitive information that can be detected by Wallarm include:

* System and environment status (for example: stack trace, warnings, fatal errors)
* Network status and configuration
* The application code or internal state
* Metadata (for example, logging of connections or message headers)

**Remediation:**

You may follow the recommendation to prohibit a web application from having the ability to display any sensitive information.


### Remote Code Execution (RCE)

**Vulnerability/Attack**<br>
**CWE codes:** [CWE-78][cwe-78], [CWE-94][cwe-94] and others<br>
**Wallarm code:** `rce`

**Description:**

An intruder can inject malicious code into a request to a web application, and the application will execute this code. Also, the intruder can try to execute certain commands for the operating system that the vulnerable web application runs on. 

Provided that an RCE attack is successful, an intruder can perform a wide range of actions, including
*   Compromising the confidentiality, accessibility, and integrity of the vulnerable web application's data.
*   Taking control of the operating system and the server that the web application runs on.
*   Other possible actions.

This vulnerability occurs due to incorrect validation and parsing of user input.

**Remediation:**

You may follow the recommendation to sanitize and filter all user input to prevent an entity in the input from being executed.


### Authentication Bypass

**Vulnerability**<br>
**CWE code:** [CWE-288][cwe-288]<br>
**Wallarm code:** `auth`

**Description:**

Despite having authentication mechanisms in place, a web application can have alternative authentication methods that allow either bypassing the main authentication mechanism or exploiting its weaknesses. This combination of factors may result in an attacker gaining access with user or administrator permissions.

A successful authentication bypass attack potentially leads to disclosing users' confidential data or taking control of the vulnerable application with administrator permissions.

**Remediation:**

You may follow these recommendations:
*   Improve and strengthen existing authentication mechanisms.
*   Eliminate any alternative authentication methods that may allow attackers to access an application while bypassing the required authentication procedure via pre‑defined mechanisms.
*   Apply the recommendations from the [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet].


### CRLF Injection

**Attack**<br>
**CWE code:** [CWE-93][cwe-93]<br>
**Wallarm code:** `crlf`

**Description:**

CRLF injections represent a class of attacks that allow an intruder to inject the Carriage Return (CR) and Line Feed (LF) characters into a request to a server (e.g., HTTP request).

Combined with other factors, such CR/LF character injection can help to exploit a variety of vulnerabilities (e.g., “HTTP Response Splitting” [CWE-113][cwe-113], “HTTP Response Smuggling” [CWE-444][cwe-444]).

A successful CRLF injection attack may give an intruder the ability to bypass firewalls, perform cache poisoning, replace legitimate web pages with malicious ones, perform the an “Open Redirect” attack, and plenty of other actions. 

This vulnerability occurs due to the incorrect validation and parsing of user input.

**Remediation:**

You may follow the recommendation to sanitize and filter all user input to prevent an entity in the input from being executed.


### LDAP Injection

**Vulnerability/Attack**<br>
**CWE code:** [CWE-90][cwe-90]<br>
**Wallarm code:** `ldapi`

**Description:**

LDAP injections represent a class of attacks that allow an intruder to alter LDAP search filters by modifying requests to an LDAP server.

A successful LDAP injection attack potentially grants access to the read and write operations on confidential data about LDAP users and hosts.

This vulnerability occurs due to the incorrect validation and parsing of user input.

**Remediation:**

You may follow these recommendations:
*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Apply the recommendations from the [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet].


### NoSQL Injection

**Vulnerability/Attack**<br>
**CWE code:** [CWE-943][cwe-943]<br>
**Wallarm code:** `nosqli`

**Description:**

Vulnerability to this attack occurs due to insufficient filtering of user input. A NoSQL injection attack is performed by injecting a specially crafted query to a NoSQL database.

**Remediation:**

You may follow the recommendation to sanitize and filter all user input to prevent an entity in the input from being executed.


### Path Traversal

**Vulnerability/Attack**<br>
**CWE code:** [CWE-22][cwe-22]<br>
**Wallarm code:** `ptrav`

**Description:**

A path traversal attack allows an intruder to access files and directories with confidential data stored in the file system where the vulnerable web application resides by altering existing paths via the web application's parameters.

Vulnerability to this attack occurs due to insufficient filtering of user input when a user requests a file or directory via the web application.

**Remediation:**

You may follow these recommendations:
*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Additional recommendations for mitigating such attacks are available [here][link-ptrav-mitigation].


### SQL Injection

**Vulnerability/Attack**<br>
**CWE code:** [CWE-89][cwe-89]<br>
**Wallarm code:** `sqli`

**Description:**

Vulnerability to this attack occurs due to insufficient filtration of user input. An SQL injection attack is performed by injecting a specially crafted query to an SQL database.

An SQL injection attack allows an intruder to inject arbitrary SQL code into an SQL query. This potentially leads to the attacker being granted access to read and modify confidential data as well as to DBMS administrator rights. 

**Remediation:**

You may follow these recommendations:
*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Apply the recommendations from the [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet].



##  The List of Special Attacks and Vulnerabilities


### Anomaly Request

**Vulnerability**<br>
**Wallarm code:** `anomaly`

**Description:**

A request is marked as an `anomaly` if the filter node considers it anomalous for the given application under protection. An encountered anomalous request may signal that the application is under attack. 


### Virtual Patch

**Attack**<br>
**Wallarm code:** `vpatch`

**Description:**     

A request is marked as a `vpatch` if it is part of an attack that was mitigated by the [virtual patch mechanism][doc-vpatch].


### Unsafe XML Header

**Attack**<br>
**Wallarm code:** `xml_unsafe_header`

**Description:**  

A request is marked as an `xml_unsafe_header` if its body contains an XML document and the document encoding differs from the encoding stated in the XML header.

### Overlimiting of Computational Resources

**Attack**<br>
**Wallarm code:** `overlimit_res`

**Description:**

The filter node is configured in such a way that it should spend no more than `N` milliseconds on incoming request processing (default value: `1000`). If the request is not processed during the specified timeframe, then the processing of the request will be stopped and the request marked as an `overlimit_res` attack. 

You can specify the desired timeframe for the request to be processed by using the [`wallarm_process_time_limit`][link-wl-process-time-limit-directive] Wallarm directive.
