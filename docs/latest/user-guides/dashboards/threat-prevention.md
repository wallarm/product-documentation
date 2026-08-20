# Threat Prevention Dashboard

Review the malicious traffic characteristics for the period of time with the **Threat Prevention** dashboard. Get a clear view of the malicious traffic volume and its distribution by attack types, sources, protocols, authentication methods, etc.

The dashboard helps in identifying the threat patterns. A clear view of how attackers are trying to exploit the system enables faster detection of threats and better-informed responses. This contributes to overall security posture improvement and helps in taking proactive measures.

As different attack types (e.g., DDoS, SQL injection, brute force) and protocols (e.g., HTTP, HTTPS, FTP) may require different defense strategies, knowing the distribution of attack methods and traffic, security teams can implement specific countermeasures (e.g., rate-limiting, firewall rules, WAAP configurations, etc.) that prevent further incidents.

The information is presented in the following widgets:

* Speed of request encountering
* Normal and malicious traffic
* Summary for a period
* Attack sources
* Attack targets
* Attack types
* CVEs
* Attacks on API protocols
* Authentication in attacks

![Threat Prevention dashboard](../../images/threat-prev-dashboard.png)

Consider the following:

* [Hit](../../about-wallarm/protecting-against-attacks.md#hit) is a malicious request plus metadata added by node
* Number of blocked hits may be less than detected ones as [traffic filtration mode](../../admin-en/configure-wallarm-mode.md) may be just `monitoring` for some locations
* You can read attack type descriptions [here](../../attacks-vulns-list.md)
