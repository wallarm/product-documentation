#   Attack and Vulnerability Types

[cwe-20]:   https://cwe.mitre.org/data/definitions/20.html
[cwe-22]:   https://cwe.mitre.org/data/definitions/22.html
[cwe-78]:   https://cwe.mitre.org/data/definitions/78.html
[cwe-79]:   https://cwe.mitre.org/data/definitions/79.html
[cwe-88]:   https://cwe.mitre.org/data/definitions/88.html
[cwe-89]:   https://cwe.mitre.org/data/definitions/89.html
[cwe-90]:   https://cwe.mitre.org/data/definitions/90.html
[cwe-93]:   https://cwe.mitre.org/data/definitions/93.html
[cwe-94]:   https://cwe.mitre.org/data/definitions/94.html
[cwe-113]:  https://cwe.mitre.org/data/definitions/113.html
[cwe-96]:   https://cwe.mitre.org/data/definitions/96.html
[cwe-97]:   https://cwe.mitre.org/data/definitions/97.html
[cwe-150]:  https://cwe.mitre.org/data/definitions/150.html
[cwe-159]:  https://cwe.mitre.org/data/definitions/159.html
[cwe-200]:  https://cwe.mitre.org/data/definitions/200.html
[cwe-209]:  https://cwe.mitre.org/data/definitions/209.html
[cwe-215]:  https://cwe.mitre.org/data/definitions/215.html
[cwe-288]:  https://cwe.mitre.org/data/definitions/288.html
[cwe-307]:  https://cwe.mitre.org/data/definitions/307.html
[cwe-352]:  https://cwe.mitre.org/data/definitions/352.html
[cwe-409]:  https://cwe.mitre.org/data/definitions/409.html
[cwe-425]:  https://cwe.mitre.org/data/definitions/425.html
[cwe-444]:  https://cwe.mitre.org/data/definitions/444.html
[cwe-511]:  https://cwe.mitre.org/data/definitions/511.html
[cwe-521]:  https://cwe.mitre.org/data/definitions/521.html
[cwe-538]:  https://cwe.mitre.org/data/definitions/538.html
[cwe-541]:  https://cwe.mitre.org/data/definitions/541.html
[cwe-548]:  https://cwe.mitre.org/data/definitions/548.html
[CWE-598]:  https://cwe.mitre.org/data/definitions/598.html
[cwe-601]:  https://cwe.mitre.org/data/definitions/601.html
[cwe-611]:  https://cwe.mitre.org/data/definitions/611.html
[cwe-776]:  https://cwe.mitre.org/data/definitions/776.html
[cwe-799]:  https://cwe.mitre.org/data/definitions/799.html
[cwe-639]:  https://cwe.mitre.org/data/definitions/639.html
[cwe-918]:  https://cwe.mitre.org/data/definitions/918.html
[cwe-943]:  https://cwe.mitre.org/data/definitions/943.html
[cwe-1270]: https://cwe.mitre.org/data/definitions/1270.html
[cwe-1294]: https://cwe.mitre.org/data/definitions/1294.html
[cwe-937]:  https://cwe.mitre.org/data/definitions/937.html
[cwe-1035]: https://cwe.mitre.org/data/definitions/1035.html
[cwe-1104]: https://cwe.mitre.org/data/definitions/1104.html

[link-cwe]: https://cwe.mitre.org/

[link-owasp-xxe-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html
[link-owasp-xss-cheatsheet]:                https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
[link-owasp-idor-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html
[link-owasp-ssrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
[link-owasp-auth-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
[link-owasp-ldapi-cheatsheet]:              https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html
[link-owasp-sqli-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
[link-owasp-inputval-cheatsheet]:           https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html

[link-ptrav-mitigation]:                    https://www.checkmarx.com/knowledge/knowledgebase/path-traversal
[link-wl-process-time-limit-directive]:     admin-en/configure-parameters-en.md#wallarm_process_time_limit

[doc-vpatch]:   user-guides/rules/vpatch-rule.md

[anchor-brute]: #brute-force-attack
[anchor-rce]:   #remote-code-execution-rce
[anchor-ssrf]:  #serverside-request-forgery-ssrf

[link-imap-wiki]:                                https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol
[link-smtp-wiki]:                                https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol
[ssi-wiki]:     https://en.wikipedia.org/wiki/Server_Side_Includes
[link-owasp-csrf-cheatsheet]:               https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html

This article lists and briefly describes attacks and vulnerabilities the Wallarm filtering node can detect including those presented in the [OWASP Top 10](https://owasp.org/www-project-top-ten/) and [OWASP API Top 10](https://owasp.org/www-project-api-security/) security risk lists. Most of the vulnerabilities and attacks on the list are accompanied by one or more codes from the list of software weakness types, also known as the [Common Weakness Enumeration][link-cwe] or CWE.

Wallarm **automatically detects** listed vulnerabilities and attacks and performs action in accordance with the [filtration mode](admin-en/configure-wallarm-mode.md). Note that there can be modifications to the default behavior made by your custom [rules](user-guides/rules/rules.md) and [triggers](user-guides/triggers/triggers.md).

!!! info "Required configuration for some attack types"
    Some attacks and vulnerabilities, such as behavioral ([brute force](#brute-force-attack), [forced browsing](#forced-browsing), [BOLA](#broken-object-level-authorization-bola)), [API abuse](#api-abuse-suspicious-api-activity), [GraphQL](#graphql-attack) and [credential stuffing](#credential-stuffing) are not detected by default. For such attacks/vulnerabilities, required configuration is specifically defined.

??? info "Watch video about how Wallarm protects against OWASP Top 10"
    <div class="video-wrapper">
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/27CBsTQUE-Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

## API abuse - suspicious API activity

**Attack**

**Wallarm code:** `api_abuse`

**Description:**

A set of basic bot types that includes server response time increase, fake account creation, and scalping.

**Required configuration:**

Wallarm detects and mitigates API abuse attacks only if it has the [API Abuse Prevention](api-abuse-prevention/overview.md) module enabled and properly configured.

The **API Abuse Prevention** module uses the complex bot detection model to detect the following bot types:

* API abuse targeted at server response time increase or server unavailability. Usually, it is achieved by malicious traffic spikes.
* [Fake account creation](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation) and [Spamming](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming) are creation of fake accounts or confirmation of fake content (e.g. feedback). Usually, it does not result in service unavailability but slows down or degrades regular business processes, e.g.:

    * Processing of real user requests by the support team
    * Collecting real user statistics by the marketing team

* [Scalping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping) is characterized by bots making online store products unavailable for real customers, e.g. by reserving all items so that they become out of stock but do not make any profit.

If the metrics point to bot attack signs, the module [denylists or graylists](api-abuse-prevention/setup.md#creating-profiles) the source of the anomaly traffic for 1 hour.

**In addition to Wallarm protection:**

* Get familiar with the [OWASP description for automated threats](https://owasp.org/www-project-automated-threats-to-web-applications/) to web applications.
* Denylist IP addresses of regions and sources (like Tor), definitely not related to your application.
* Configure server-side rate limit for requests.
* Use additional CAPTCHA solutions.
* Search your application analytics for the bot attack signs.

## API abuse - account takeover

**Attack**

**Wallarm code:** `account_takeover` (`api_abuse` before 4.10.6)

**Description:**

A type of cyber attack where a malicious actor gains access to someone else’s account without their permission or knowledge. Once they have access to the account, they can use it for various purposes, such as stealing sensitive information, conducting fraudulent transactions, or spreading spam or malware.

**Required configuration:**

Wallarm detects and mitigates the account takeover attacks only if it has the [API Abuse Prevention](api-abuse-prevention/overview.md) module enabled and properly configured.

[API Abuse Prevention](api-abuse-prevention/overview.md) detects bots performing a [credential cracking](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-007_Credential_Cracking.html) usually performed as a brute force attack on the critical endpoints or/and endpoints that are related to authentication and/or registration endpoints. The automatic threshold of acceptable behavior metrics is calculated based on legitimate traffic for 1 hour.

**In addition to Wallarm protection:**

* Get familiar with the [OWASP description for automated threats](https://owasp.org/www-project-automated-threats-to-web-applications/) to web applications.
* Use strong passwords.
* Do not use the same passwords for different resources.
* Enable two-factor authentication.
* Use additional CAPTCHA solutions.
* Monitor accounts for suspicious activities.

## API abuse - scraping

**Attack**

**Wallarm code:** `scraping` (`api_abuse` before 4.10.6)

**Description:**

Web scraping, also known as data scraping or web harvesting, is the process of automatically extracting data from websites. It involves using software or code to retrieve and extract data from web pages and save it in a structured format such as a spreadsheet or database.

Web scraping can be used for malicious purposes. For example, scrapers can be used to steal sensitive information such as login credentials, personal information, or financial data from websites. Scrapers can also be used to spam or scrape data from a website in a way that degrades its performance, causing denial of service (DoS) attacks.

**Required configuration:**

Wallarm detects and mitigates the scraping attacks only if it has the [API Abuse Prevention](api-abuse-prevention/overview.md) module enabled and properly configured.

The **API Abuse Prevention** module uses the complex bot detection model to detect the [scraping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-011_Scraping) bot type which is collecting accessible data and/or processed output from the application that may result in private or non-free content becoming available for any user.

**In addition to Wallarm protection:**

* Get familiar with the [OWASP description for automated threats](https://owasp.org/www-project-automated-threats-to-web-applications/) to web applications.
* Use additional CAPTCHA solutions.
* Use robots.txt file to tell search engine crawlers which pages they can and cannot crawl.
* Monitor your traffic to look for patterns that may indicate malicious activity.
* Implement rate limiting.
* Obfuscate or encrypt data.
* Take legal action.

## API abuse - security crawlers

**Attack**

**Wallarm code:** `security_crawlers` (`api_abuse` before 4.10.6)

**Description:**

While security crawlers are designed to scan websites and detect vulnerabilities and security issues, they can also be used for malicious purposes. Malicious actors may use them to identify vulnerable websites and exploit them for their own gain.

Furthermore, some security crawlers may be poorly designed and inadvertently cause harm to websites by overwhelming servers, causing crashes, or creating other types of disruptions.

**Required configuration:**

Wallarm detects and mitigates the security crawlers attacks only if it has the [API Abuse Prevention](api-abuse-prevention/overview.md) module enabled and properly configured.

The **API Abuse Prevention** module uses the complex bot detection model to detect the following security crawlers bot types:

* [Fingerprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-004_Fingerprinting.html) exploits specific requests which are sent to the application eliciting information in order to profile the application.
* [Footprinting](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-018_Footprinting.html) is an information gathering with the objective of learning as much as possible about the composition, configuration and security mechanisms of the application.
* [Vulnerability scanning](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning) is characterized by service vulnerability search.

**In addition to Wallarm protection:**

* Get familiar with the [OWASP description for automated threats](https://owasp.org/www-project-automated-threats-to-web-applications/) to web applications.
* Use SSL certificates.
* Use additional CAPTCHA solutions.
* Implement rate limiting.
* Monitor your traffic to look for patterns that may indicate malicious activity.
* Use robots.txt file to tell search engine crawlers which pages they can and cannot crawl.
* Regularly update software.
* Use a content delivery network (CDN).

## Attack on XML external entity (XXE)

**Vulnerability/Attack**

**CWE code:** [CWE-611][cwe-611]

**Wallarm code:** `xxe`

**Description:**

The XXE vulnerability allows an attacker to inject an external entity in an XML document to be evaluated by an XML parser and then executed on the target web server.

As the result of a successful attack, an attacker will be able to:

*   Get access to the web application's confidential data
*   Scan internal data networks
*   Read the files located on the web server
*   Perform an [SSRF][anchor-ssrf] attack
*   Perform a Denial of Service (DoS) attack

This vulnerability occurs due to a lack of restriction on the parsing of XML external entities in a web application.

**In addition to Wallarm protection:**

*   Disable the parsing of XML external entities when working with the XML documents supplied by a user.
*   Apply the recommendations from the [OWASP XXE Prevention Cheat Sheet][link-owasp-xxe-cheatsheet].

## Authentication bypass

**Vulnerability**

**CWE code:** [CWE-288][cwe-288]

**Wallarm code:** `auth`

**Description:**

Despite having authentication mechanisms in place, a web application can have alternative authentication methods that allow either bypassing the main authentication mechanism or exploiting its weaknesses. This combination of factors may result in an attacker gaining access with user or administrator permissions.

A successful authentication bypass attack potentially leads to disclosing users' confidential data or taking control of the vulnerable application with administrator permissions.

**In addition to Wallarm protection:**

* Improve and strengthen existing authentication mechanisms.
* Eliminate any alternative authentication methods that may allow attackers to access an application while bypassing the required authentication procedure via pre‑defined mechanisms.
* Apply the recommendations from the [OWASP Authentication Cheat Sheet][link-owasp-auth-cheatsheet].

## Broken object level authorization (BOLA)

**Vulnerability/Attack**

**CWE code:** [CWE-639][cwe-639]

**Wallarm code:** `idor` for vulnerabilities, `bola` for attacks

**Description:**

Attackers can exploit API endpoints that are vulnerable to broken object level authorization by manipulating the ID of an object that is sent within the request. This may lead to unauthorized access to sensitive data.

This issue is extremely common in API-based applications because the server component usually does not fully track the client’s state, and instead, relies more on parameters like object IDs, that are sent from the client to decide which objects to access.

Depending on the API endpoint logic, an attacker can either just read data on web applications, APIs and users or modify them.

This vulnerability is also known as IDOR (Insecure Direct Object Reference).

[More details on the vulnerability](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/)

**Required configuration:**

Wallarm automatically discovers vulnerabilities of this type. To detect and block BOLA attacks, do one or all of the following: 

* Enable [API Discovery](api-discovery/overview.md) and configure [automatic BOLA protection](admin-en/configuration-guides/protecting-against-bola.md) for endpoints discovered by this module
* Configure one or more [**BOLA** triggers](admin-en/configuration-guides/protecting-against-bola.md)

**In addition to Wallarm protection:**

* Implement a proper authorization mechanism that relies on the user policies and hierarchy.
* Prefer to use random and unpredictable values as [GUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) for objects' IDs.
* Write tests to evaluate the authorization mechanism. Do not deploy vulnerable changes that break the tests.

## Brute-force attack

**Attack**

**CWE codes:** [CWE-307][cwe-307], [CWE-521][cwe-521], [CWE-799][cwe-799]

**Wallarm code:** `brute`

**Description:**

A brute-force attack occurs when a massive number of requests with a predefined payload are sent to the server. These payloads may be generated by some means or taken from a dictionary. The server's response is then analyzed to find the right combination of the data in the payload.

A successful brute‑force attack can potentially bypass authentication and authorization mechanisms and/or reveal a web application's hidden resources (such as directories, files, website parts, etc.), thus granting the ability to conduct other malicious actions.

**Required configuration:**

Wallarm detects and mitigates brute-force attacks only if it has one or more configured [brute-force triggers](admin-en/configuration-guides/protecting-against-bruteforce.md) and/or [rate limit rules](user-guides/rules/rate-limiting.md).

**In addition to Wallarm protection:**

*   Limit the number of requests per a certain time period for a web application.
*   Limit the number of authentication/authorization attempts per a certain time period for a web application.
*   Block new authentication/authorization attempts after a certain number of the failed attempts.
*   Restrict a web application from accessing any files or directories on the server it runs on, except those within the scope of the application.

## Credential stuffing

**Attack**

**Wallarm code:** `credential_stuffing`

**Description:**

A cyber attack where hackers use lists of compromised user credentials to gain unauthorized access to user accounts on multiple websites. This attack is hazardous because many people reuse the same username and password across different services or use popular weak passwords. A successful credential stuffing attack requires fewer attempts, so attackers can send requests much less frequently, which makes standard measures like brute force protection ineffective. 

**Required configuration:**

Wallarm detects the credential stuffing attempts only if the filtering node has version 4.10 or above and the [Credential Stuffing Detection](about-wallarm/credential-stuffing.md) functionality is enabled and properly configured.

**In addition to Wallarm protection:**

* Get familiar with the [OWASP credential stuffing description](https://owasp.org/www-community/attacks/Credential_stuffing), including the "Credential Stuffing Prevention Cheat Sheet".
* Force users to use strong passwords.
* Recommend users not to use the same passwords for different resources.
* Enable two-factor authentication.
* Use additional CAPTCHA solutions.

## CRLF injection

**Vulnerability/Attack**

**CWE code:** [CWE-93][cwe-93]

**Wallarm code:** `crlf`

**Description:**

CRLF injections represent a class of attacks that allow an attacker to inject the Carriage Return (CR) and Line Feed (LF) characters into a request to a server (e.g. HTTP request).

Combined with other factors, such CR/LF character injection can help to exploit a variety of vulnerabilities (e.g. HTTP Response Splitting [CWE-113][cwe-113], HTTP Response Smuggling [CWE-444][cwe-444]).

A successful CRLF injection attack may give an attacker the ability to bypass firewalls, perform cache poisoning, replace legitimate web pages with malicious ones, perform the "Open redirect" attack, and plenty of other actions. 

This vulnerability occurs due to the incorrect validation and parsing of user input.

**In addition to Wallarm protection:**

* Sanitize and filter all user input to prevent an entity in the input from being executed.

## Cross-site request forgery (CSRF)

**Vulnerability**

**CWE code:** [CWE-352][cwe-352]

**Wallarm code:** `csrf`

**Description:**

Cross-site request forgery (CSRF) is an attack that forces an end user to execute unwanted actions on a web application in which they’re currently authenticated. With a little help of social engineering (such as sending a link via email or chat), an attacker may trick the users of a web application into executing actions of the attacker’s choosing.

The corresponding vulnerability occurs due to the user's browser automatically adding user’s session cookies that are set for the target domain name while performing the cross-site request.

For most sites, these cookies include credentials associated with the site. Therefore, if the user is currently authenticated to the site, the site will have no way to distinguish between the forged request sent by the victim and a legitimate request sent by the victim.

As a result, the attacker can send a request to the vulnerable web application from a malicious website by posing as a legitimate user who is authenticated on the vulnerable site; the attacker does not even need to have access to that user's cookies.

Wallarm only discovers CSRF vulnerabilities, but does not detect and thus does not block CSRF attacks. CSRF problem is solved in all modern browsers via content security policies (CSP).

**Protection:**

CSRF is solved by browsers, other protection methods are less useful but still can be used:

*   Employ anti-CSRF protection mechanisms, such as CSRF tokens and others.
*   Set the `SameSite` cookie attribute.
*   Apply the recommendations from the [OWASP CSRF Prevention Cheat Sheet][link-owasp-csrf-cheatsheet].

## Cross‑site scripting (XSS)

**Vulnerability/Attack**

**CWE code:** [CWE-79][cwe-79]

**Wallarm code:** `xss`

**Description:**

A cross‑site scripting attack allows an attacker to execute a prepared arbitrary code in a user's browser.

There are a few XSS attack types:

*   Stored XSS is when a malicious code is pre‑embedded in the web application's page.

    If the web application is vulnerable to the stored XSS attack, then it is possible for an attacker to inject a malicious code into the web application's HTML page; moreover, this code will persist and be executed by the browser of any user who requests the infected webpage.
    
*   Reflected XSS is when an attacker tricks a user into opening a specially crafted link.      

*   DOM‑based XSS is when a JavaScript code snippet built into the web application's page parses the input and executes it as a JavaScript command due to errors in this code snippet.

Exploiting any of the vulnerabilities listed above leads to the execution of an arbitrary JavaScript code. Provided that the XSS attack was successful, an attacker may steal a user's session or credentials, make requests on behalf of the user, and perform other malicious actions.

This class of vulnerabilities occurs due to the incorrect validation and parsing of user input.

**In addition to Wallarm protection:**

* Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
* While forming the web application's pages, sanitize and escape any entities that are formed dynamically.
* Apply the recommendations from the [OWASP XSS Prevention Cheat Sheet][link-owasp-xss-cheatsheet].

## Data bomb

**Attack**

**CWE code:** [CWE-409][cwe-409], [CWE-776][cwe-776]

**Wallarm code:** `data_bomb`

**Description:**

Wallarm marks a request as the Data bomb attack if it contains the Zip or XML bomb:

* [Zip bomb](https://en.wikipedia.org/wiki/Zip_bomb)  is a malicious archive file designed to crash or render useless the program or system reading it. Zip bomb allows the program to work as intended, but the archive is crafted so that unpacking it requires inordinate amounts of time, disk space and/or memory.
* [XML bomb (billion laughs attack)](https://en.wikipedia.org/wiki/Billion_laughs_attack) is the DoS attack type that is aimed at parsers of XML documents. An attacker sends malicious payloads in XML entities.

    For example, `entityOne` can be defined as 20 `entityTwo`, which themselves can be defined as 20 `entityThree`. If the same pattern is continued until `entityEight`, the XML parser will unfold a single occurrence of `entityOne` to 1 280 000 000 `entityEight` — taking up 5 GB of memory.

**In addition to Wallarm protection:**

* Limit the size of incoming requests so it could not harm the system.

## DDoS (distributed denial of service) attack

A DDoS (Distributed Denial of Service) attack is a type of cyber attack in which an attacker seeks to make a website or online service unavailable by overwhelming it with traffic from multiple sources.

There are many techniques that attackers can use to launch a DDoS attack, and the methods and tools they use can significantly vary. Some attacks are relatively simple and use low-level techniques such as sending large numbers of connection requests to a server, while others are more sophisticated and use complex tactics such as spoofing IP addresses or exploiting vulnerabilities in network infrastructure.

[Read our guide on protecting resources against DDoS](admin-en/configuration-guides/protecting-against-ddos.md)

## Email injection

**Attack**

**CWE code:** [CWE-20][cwe-20], [CWE-150][cwe-150], [CWE-88][cwe-88]

**Wallarm code:** `mail_injection`

**Description:**

Email Injection is a malicious [IMAP][link-imap-wiki]/[SMTP][link-smtp-wiki] expression usually sent via the web application contact form to change standard email server behavior.

Vulnerability to this attack occurs due to poor validation of the data inputted in the contact form. Email Injection allows bypassing email client restrictions, stealing user data and sending spam.

**In addition to Wallarm protection:**

* Sanitize and filter all user input to prevent malicious payloads in the input from being executed.
* Apply the recommendations from the [OWASP Input Validation Cheatsheet][link-owasp-inputval-cheatsheet].

## Forced browsing

**Attack**

**CWE code:** [CWE-425][cwe-425]

**Wallarm code:** `dirbust`

**Description:**

This attack belongs to the class of brute‑force attacks. The purpose of this attack is to detect a web application's hidden resources, namely directories and files. This is achieved by trying different file and directory names that are either generated based on some template or extracted from a prepared dictionary file.

A successful forced browsing attack potentially grants access to hidden resources that are not explicitly available from the web application interface but are exposed when accessed directly.

**Required configuration:**

Wallarm detects and mitigates forced browsing only if it has one or more configured [forced browsing triggers](admin-en/configuration-guides/protecting-against-forcedbrowsing.md).

**In addition to Wallarm protection:**

*   Restrict or limit users' access to those resources that they are not supposed to have direct access to (e.g., by employing some authentication or authorization mechanisms).
*   Limit the number of requests per a certain time period for the web application.
*   Limit the number of authentication/authorization attempts per a certain time period for the web application.
*   Block new authentication/authorization attempts after a certain number of failed attempts.
*   Set necessary and sufficient access rights for the web application's files and directories.

## GraphQL attack

**Attack**

**Wallarm code:** `graphql_attacks`

**Description:**

GraphQL has peculiarities that allow implementing the protocol specific attacks related to excessive information exposure and DoS, for example:

* An attacker may attempt to perform a Denial of Service (DoS) or cause other issues by exploiting how the server handles excessively large inputs.
* An attacker may send request with an excessively long string value for a variable or argument to overwhelm the server's resources (Excessive Value Length attack).
* Queries can be nested, which allows requesting complex data structures in one go; however, this flexibility can be exploited to create a deeply nested query that could potentially overwhelm the server.
* Aliases offer the capability to rename the result fields to prevent conflicts and enable better data organization; however, an attacker may exploit this feature to launch a Resource Exhaustion or Denial of Service (DoS) attack.
* Multiple queries (operations) can be batched together in a single HTTP-request; by combining multiple operations into a single request, an attacker organize batching attack and try to bypass security measures such as rate limiting.
* An attacker may leverage the introspection system to uncover details about the schema of the GraphQL API; by querying the system, an attacker may potentially gain knowledge about all types, queries, mutations, and fields that are available in the API, and use this data to construct more precise and damaging queries.
* When debug mode is left turned on by developers, an attacker may gather precious information from excessive error reporting messages such as entire stack traces or tracebacks. An attacker may get access to the debug mode via “debug=1“ parameter in URI.

An adequate measure for preventing these type of threats is setting limits for GraphQL requests, such as request and value sizes, query depth, allowed number of batched queries, etc. In Wallarm, you set these limits in [GraphQL policy](api-protection/graphql-rule.md) - any GraphQL requests exceeding limits are considered to be a GraphQL attack.

**Required configuration:**

Wallarm detects and mitigates GraphQL attacks only if it has one or more configured [Detect GraphQL attacks rules](api-protection/graphql-rule.md) (requires node 4.10.3 of higher).

**In addition to Wallarm protection:**

* Require authentication for accessing sensitive or restricted GraphQL APIs.
* Sanitize inputs and outputs to prevent injection attacks and protect against malicious input values.
* Implement comprehensive logging mechanisms to track and analyze GraphQL query activity, including request details and response data.
* Run GraphQL servers in secure execution environments with restricted permissions and access controls. 

## Information exposure

**Vulnerability/Attack**

**CWE codes:** [CWE-200][cwe-200] (see also: [CWE-209][cwe-209], [CWE-215][cwe-215], [CWE-538][cwe-538], [CWE-541][cwe-541], [CWE-548][cwe-548], [CWE-598][cwe-598])

**Wallarm code:** `infoleak`

**Description:**

This vulnerability involves the unauthorized disclosure of sensitive information by an application, potentially providing attackers with sensitive data for further malicious activities.

Some types of sensitive information:

* Private, personal information, such as emails, financial data, contact details, etc.
* Technical information disclosed in error messages, stack trace
* System status and environment, such as the operating system and installed packages
* Source code or internal state

Wallarm detects information exposure in two ways:

* Server response analysis: Wallarm employs [techniques](about-wallarm/detecting-vulnerabilities.md#vulnerability-detection-methods) such as passive detection, vulnerability scanning, and active threat verification to analyze server responses. These methods are aimed at identifying vulnerabilities by checking if application responses inadvertently expose sensitive information.
* API Discovery insights: When endpoints identified by the [API Discovery](api-discovery/overview.md) module transfer Personally Identifiable Information (PII) in query parameters of GET requests, Wallarm recognizes these as vulnerable.

Wallarm does not specifically classify `infoleak` attacks but detects and records the corresponding security incidents as they happen. However, incidents are infrequent. Wallarm's detection mechanisms alert you promptly if such exposure begins, allowing for quick vulnerability remediation. Additionally, using Wallarm's filtering node in [blocking mode](admin-en/configure-wallarm-mode.md#available-filtration-modes) helps prevent exposures by blocking any attack attempts, significantly reducing the likelihood of data leaks.

**In addition to Wallarm protection:**

* Prohibit web applications from having the ability to display any sensitive information.
* Preferably use the POST HTTP method instead of GET for transmitting sensitive data, such as in registration and login forms.

## LDAP injection

**Vulnerability/Attack**

**CWE code:** [CWE-90][cwe-90]

**Wallarm code:** `ldapi`

**Description:**

LDAP injections represent a class of attacks that allow an attacker to alter LDAP search filters by modifying requests to an LDAP server.

A successful LDAP injection attack potentially grants access to the read and write operations on confidential data about LDAP users and hosts.

This vulnerability occurs due to the incorrect validation and parsing of user input.

**In addition to Wallarm protection:**

In addition to the protection measures performed by Wallarm, you may follow these recommendations:

*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Apply the recommendations from the [OWASP LDAP Injection Prevention Cheat Sheet][link-owasp-ldapi-cheatsheet].

## Mass assignment

**Attack**

**Wallarm code:** `mass_assignment`

**Description:**

During a mass assignment attack, attackers try to bind HTTP request parameters into program code variables or objects. If an API is vulnerable and allows binding, attackers may change sensitive object properties that are not intended to be exposed, which could lead to privilege escalation, bypassing security mechanisms, and more.

APIs vulnerable to Mass Assignment attacks allow converting client input to internal variables or object properties without proper filtering. This vulnerability is included in the [OWASP API Security Top 10 2023 (API3:2023 Broken Object Property Level Authorization)](https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/) list of most serious API security risks.

**In addition to Wallarm protection:**

* Avoid using functions that automatically bind a client’s input into code variables or object properties.
* Use built-in function features to whitelist only the properties that should be updated by the client and blacklist private properties.
* If applicable, explicitly define and enforce schemas for the input data payloads.

## NoSQL injection

**Vulnerability/Attack**

**CWE code:** [CWE-943][cwe-943]

**Wallarm code:** `nosqli`

**Description:**

Vulnerability to this attack occurs due to insufficient filtering of user input. A NoSQL injection attack is performed by injecting a specially crafted query to a NoSQL database.

**In addition to Wallarm protection:**

* Sanitize and filter all user input to prevent an entity in the input from being executed.

## Open redirect

**Vulnerability/Attack**

**CWE code:** [CWE-601][cwe-601]

**Wallarm code:** `redir`

**Description:**

An attacker can use an open redirect attack to redirect a user to a malicious web page via a legitimate web application.

Vulnerability to this attack occurs due to incorrect filtering of URL inputs.

**In addition to Wallarm protection:**

*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Notify users about all pending redirects, and ask for explicit permission.

## Overlimiting of computational resources

**Attack**

**Wallarm code:** `overlimit_res`

**Description:**

There are two scenarios the Wallarm node marks a request as the `overlimit_res` attack:

* The Wallarm node is configured in such a way that it should spend no more than `N` milliseconds on incoming requests processing (default value: `1000`). If the request is not processed during the specified timeframe, then the processing of the request will be stopped and the request marked as an `overlimit_res` attack. 

    You can specify the custom time limit and change the default node behavior when the limit is exceeded using the [rule **Fine-tune the overlimit_res attack detection**](user-guides/rules/configure-overlimit-res-detection.md).

    Limiting the request processing time prevents the bypass attacks aimed at the Wallarm nodes. In some cases, the requests marked as `overlimit_res` can indicate insufficient resources allocated for the Wallarm node modules that lead to long request processing time.
* The request uploads the gzip file weighing more than 512 MB.

## Path traversal

**Vulnerability/Attack**

**CWE code:** [CWE-22][cwe-22]

**Wallarm code:** `ptrav`

**Description:**

A path traversal attack allows an attacker to access files and directories with confidential data stored in the file system where the vulnerable web application resides by altering existing paths via the web application's parameters.

Vulnerability to this attack occurs due to insufficient filtering of user input when a user requests a file or directory via the web application.

**In addition to Wallarm protection:**

In addition to the protection measures performed by Wallarm, you may follow these recommendations:

*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Additional recommendations for mitigating such attacks are available [here][link-ptrav-mitigation].

## Remote code execution (RCE)

**Vulnerability/Attack**

**CWE codes:** [CWE-78][cwe-78], [CWE-94][cwe-94] and others

**Wallarm code:** `rce`

**Description:**

An attacker can inject malicious code into a request to a web application, and the application will execute this code. Also, the attacker can try to execute certain commands for the operating system that the vulnerable web application runs on. 

Provided that an RCE attack is successful, an attacker can perform a wide range of actions, including:

*   Compromising the confidentiality, accessibility, and integrity of the vulnerable web application's data.
*   Taking control of the operating system and the server that the web application runs on.
*   Other possible actions.

This vulnerability occurs due to incorrect validation and parsing of user input.

**In addition to Wallarm protection:**

* Sanitize and filter all user input to prevent an entity in the input from being executed.


## Resource scanning

**Attack**

**CWE code:** none

**Wallarm code:** `scanner`

**Description:**    

The `scanner` code is assigned to an HTTP request if this request is believed to be part of third‑party scanner software activity that is targeted to attack or scan a protected resource. The Wallarm Scanner's requests are not considered to be a resource scanning attack. This information may be used later to attack these services.

**In addition to Wallarm protection:**

*   Limit the possibility of a network perimeter scan by employing IP address allowlisting and denylisting along with authentication/authorization mechanisms.
*   Minimize the scan surface by placing the network perimeter behind a firewall.
*   Define a necessary and sufficient set of ports to be opened for your services to operate.
*   Restrict the usage of ICMP protocol on the network level.
*   Periodically update your IT infrastructure hard- and software.

## Server‑side request forgery (SSRF)

**Vulnerability/Attack**

**CWE code:** [CWE-918][cwe-918]

**Wallarm code:** `ssrf`

**Description:**

A successful SSRF attack may allow an attacker to make requests on behalf of the attacked web server; this potentially leads to revealing the web application's network ports in use, scanning the internal networks, and bypassing authorization.

**In addition to Wallarm protection:**

*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Apply the recommendations from the [OWASP SSRF Prevention Cheat Sheet][link-owasp-ssrf-cheatsheet].

## Server‑side template injection (SSTI)

**Vulnerability/Attack**

**CWE codes:** [CWE-94][cwe-94], [CWE-159][cwe-159]

**Wallarm code:** `ssti`

**Description:**

An attacker can inject an executable code into a user‑filled form on a web server vulnerable to SSTI attacks so that code will be parsed and executed by the web server.

A successful attack may render a vulnerable web server completely compromised, potentially allowing an attacker to execute arbitrary requests, explore the server's file systems, and, under certain conditions, remotely execute arbitrary code (see [RCE attack][anchor-rce] for details), as well as many other things.   

This vulnerability arises from the incorrect validation and parsing of user input.

**In addition to Wallarm protection:**

* Sanitize and filter all user input to prevent an entity in the input from being executed.

## SSI injection

**Attack**

**CWE code:** [CWE-96][cwe-96], [CWE-97][cwe-97]

**Wallarm code:** `ssi`

**Description:**

[SSI (Server Side Includes)][ssi-wiki] is a simple interpreted server-side scripting language most useful for including the contents of one or more files into a web page on a web server. It is supported by the web servers Apache and NGINX.

SSI Injection allows the exploitation of a web application by injecting malicious payloads in HTML pages or executing arbitrary codes remotely. It can be exploited through manipulation of SSI in use in the application or force its use through user input fields.

**Example:**

An attacker can change the message output and change the user behavior. SSI Injection example:

```bash
<!--#config errmsg="Access denied, please enter your username and password"-->
```

**In addition to Wallarm protection:**

* Sanitize and filter all user input to prevent malicious payloads in the input from being executed.
* Apply the recommendations from the [OWASP Input Validation Cheatsheet][link-owasp-inputval-cheatsheet].

## SQL injection

**Vulnerability/Attack**

**CWE code:** [CWE-89][cwe-89]

**Wallarm code:** `sqli`

**Description:**

Vulnerability to this attack occurs due to insufficient filtration of user input. An SQL injection attack is performed by injecting a specially crafted query to an SQL database.

An SQL injection attack allows an attacker to inject arbitrary SQL code into an [SQL query](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1). This potentially leads to the attacker being granted access to read and modify confidential data as well as to DBMS administrator rights.

**In addition to Wallarm protection:**

In addition to the protection measures performed by Wallarm, you may follow these recommendations:

*   Sanitize and filter all parameters that a web application receives as input to prevent an entity in the input from being executed.
*   Apply the recommendations from the [OWASP SQL Injection Prevention Cheat Sheet][link-owasp-sqli-cheatsheet].

## Unsafe XML header

**Attack**

**Wallarm code:** `invalid_xml`

**Description:**  

A request is marked as an `invalid_xml` if its body contains an XML document and the document encoding differs from the encoding stated in the XML header.

## Virtual patch

**Attack**

**Wallarm code:** `vpatch`

**Description:**     

A request is marked as a `vpatch` if it is part of an attack that was mitigated by the [virtual patch mechanism][doc-vpatch].

**Required configuration:**

Virtual patching is blocking specific or all requests to some endpoint that is performed regardless the current [filtration mode](admin-en/configure-wallarm-mode.md). Virtual patches are custom rules that you create [manually][doc-vpatch].

**In addition to Wallarm protection:**

* Analyze the vulnerability mitigated by the patch and remove it so that the patch is not needed any more.

## Vulnerable component

**Vulnerability**

**CWE codes:** [CWE-937][cwe-937], [CWE-1035][cwe-1035], [CWE-1104][cwe-1104]

**Wallarm code:** `vuln_component`

**Description:**

This vulnerability occurs if your web application or API uses a vulnerable or outdated component. This can include an OS, web/application server, database management system (DBMS), runtime environments, libraries and other components.

This vulnerability is mapped with [A06:2021 – Vulnerable and Outdated Components](https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components).

**In addition to Wallarm protection:**

* Remove unused dependencies, unnecessary features, components, files, and documentation.
* Continuously inventory the versions of both client-side and server-side components (e.g., frameworks, libraries) and their dependencies using tools like OWASP Dependency Check, retire.js, etc.
* Continuously monitor sources like Common Vulnerability and Exposures (CVE) and National Vulnerability Database (NVD) for vulnerabilities in the components.
* Only obtain components from official sources over secure links. Prefer signed packages to reduce the chance of including a modified, malicious component.
* Monitor for libraries and components that are unmaintained or do not create security patches for older versions. If patching is not possible, consider deploying a virtual patch to monitor, detect, or protect against the discovered issue.

## Weak JWT

**Vulnerability**

**CWE code:** [CWE-1270][cwe-1270], [CWE-1294][cwe-1294]

**Wallarm code:** `weak_auth`

**Description:**

[JSON Web Token (JWT)](https://jwt.io/) is a popular authentication standard used to exchange data between resources like APIs securely.

JWT compromisation is a common aim of attackers as breaking authentication mechanisms provides them full access to web applications and APIs. The weaker JWTs, the higher chance for it to be compromised.

Wallarm considers JWTs to be weak if they are:

* Unencrypted - there is no signing algorithm (the `alg` field is `none` or absent).
* Signed using compromised secret keys.

Once a weak JWT is detected, Wallarm records the corresponding [vulnerability](user-guides/vulnerabilities.md).

**In addition to Wallarm protection:**

* Apply the recommendations from the [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
* [Check if your JWT implementation is vulnerable for well-known secrets](https://lab.wallarm.com/340-weak-jwt-secrets-you-should-check-in-your-code/)
