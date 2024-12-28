Based on the initial detected attacks, the **Threat Replay Testing** module creates a lot of new test requests with different payloads attacking the same endpoint. This mechanism allows Wallarm to detect vulnerabilities that could be potentially exploited during attacks. The process of Threat Replay Testing will either confirm that the application is not vulnerable to the specific attack vectors or find actual application security issues.

[List of vulnerabilities that can be detected by the module](../attacks-vulns-list.md)

The **Threat Replay Testing** process uses the following logic to check the protected application for possible Web and API security vulnerabilities:

1. For every group of malicious request (every attack) detected by a Wallarm filtering node and uploaded to the connected Wallarm Cloud, the system analyzes which specific endpoint (URL, request string parameter, JSON attribute, XML field, etc) was attacked and which specific kind of vulnerability (SQLi, RCE, XSS, etc) the attacker was trying to exploit. For example, let's take a look at the following malicious GET request:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=UNION SELECT username, password
    ```

    From the request the system will learn the following details:
    
    * The attacked URL is `https://example.com/login`
    * The type of used attack is SQLi (according to the `UNION SELECT username, password` payload)
    * The attacked query string parameter is `user`
    * Additional piece of information provided in the request is the request string parameter `token=IyEvYmluL3NoCg` (it is probably used by the application to authenticate the user)
2. Using the collected information the **Threat Replay Testing** module will create a list of about 100-150 test requests to the originally targeted endpoint but with different types of malicious payloads for the same type of attack (like SQLi). For example:

    ```bash
    https://example.com/login?token=IyEvYmluL3NoCg&user=1')+WAITFOR+DELAY+'0 indexpt'+AND+('wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+SLEEP(10)--+wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1);SELECT+PG_SLEEP(10)--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1'+OR+SLEEP(10)+AND+'wlrm'='wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=1+AND+1=(SELECT+1+FROM+PG_SLEEP(10))
    https://example.com/login?token=IyEvYmluL3NoCg&user=%23'%23\x22%0a-sleep(10)%23
    https://example.com/login?token=IyEvYmluL3NoCg&user=1';+WAITFOR+DELAY+'0code:10'--
    https://example.com/login?token=IyEvYmluL3NoCg&user=1%27%29+OR+SLEEP%280%29+AND+%28%27wlrm%27%3D%27wlrm
    https://example.com/login?token=IyEvYmluL3NoCg&user=SLEEP(10)/*'XOR(SLEEP(10))OR'|\x22XOR(SLEEP(10))OR\x22*/
    ```

    !!! info "Malicious payloads do not harm your resources"
        Malicious payloads of generated requests do not include real malicious syntax, they are intended just to imitate the attack principle. As a result, they do not harm your resources.
3. The **Threat Replay Testing** module will send generated test requests to the application bypassing the Wallarm protection (using the [allowlisting feature][allowlist-scanner-addresses]) and verify that the application at the specific endpoint is not vulnerable to the specific attack type. If the module suspects that the application has an actual security vulnerability, it will create an event with type [incident](../user-guides/events/check-attack.md#incidents).

    !!! info "`User-Agent` HTTPS header value in the requests"
        The `User-Agent` HTTP header in the **Threat Replay Testing** module requests will have the value `Wallarm Threat-Verification (v1.x)`.
4. Detected security incidents are reported in Wallarm Console and are able to be dispatched to your security team via available third-party [Integrations](../user-guides/settings/integrations/integrations-intro.md) and [Triggers](../user-guides/triggers/triggers.md).
