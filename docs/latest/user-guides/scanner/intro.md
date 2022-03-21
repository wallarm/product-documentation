[link-work-with-scope]:     check-scope.md
[link-configure-scanner]:   configure-scanner.md
[link-rfc]:                 https://tools.ietf.org/html/rfc5936
[link-scanner]:             https://my.wallarm.com/scanner
[link-api]:                 https://console.eu1.wallarm.com

[anchor1]:  #network-scope-scanning
[anchor2]:  #searching-for-typical-vulnerabilities-and-security-issues
[anchor3]:  #active-threat-verification
[anchor4]:  #updating-the-status-of-previously-detected-vulnerabilities

# Scanner Overview

Scanner performs the following tasks:
* [Network scope scanning][anchor1]
* [Searching for typical vulnerabilities and security issues][anchor2]
* [Active threat verification][anchor3]
* [Updating the status of previously detected vulnerabilities][anchor4]


## Network Scope Scanning

A **network scope** is a company's public resources (domains and IP addresses) connected to public networks.
It defines an area to be scanned for typical vulnerabilities and is the cornerstone of the security process.

As the project develops, the number of resources in the scope steadily increases and control over them inevitably decreases.

The resources may be located not only in the company's data centers but also on shared hostings — for example, your marketers will create new landing pages and start new campaigns. These resources are placed on subdomains of the main project and can jeopardize the project's security.

Hackers always choose the least protected resources on the company's scope and attempt to compromise these resources first.

Wallarm integrates all the scope discovery mechanisms used by white hat hackers when assessing a company's security and running penetration tests.

The scope discovery does not end at the domain and IP address mapping but also discovers the network resources that can be accessed from the Internet. To do this, Wallarm first scans ports and then detects the network resources on these ports.

Various methods are used in the continuous process of collecting and updating scope data:

* Automatic modes
    * DNS zone transfer ([AXFR][link-rfc])
    * NS and MX records receiving
    * SPF records data receiving
    * Subdomain dictionary search
    * SSL certificate parsing

* Manual data entry via [web interface][link-scanner] or Wallarm [API][link-api].

This results in a map of the company's resources that is of the same quality as the one done by white hat hackers when doing penetration testing.

## Searching for Typical Vulnerabilities and Security Issues

After collecting the network scope, the scanner checks all IP addresses and domains within it for any typical vulnerabilities.

## Active Threat Verification

The scanner will automatically [reproduce each attack](../../about-wallarm-waf/detecting-vulnerabilities.md#active-threat-verification) from the traffic. This mechanism allows the detection of vulnerabilities that could have been exploited during the attack.

For safety reasons, when reproducing attacks from requests, the authentication data (cookies, basic-auth, viewstate) is deleted. Correct operation of this functionality may require additional configuration from the application side.

## Updating the Status of Previously Detected Vulnerabilities

The scanner regularly checks the status of vulnerabilities and automatically marks them as fixed or, on the contrary, reopens newly reproduced ones.

Current vulnerabilities and vulnerabilities fixed less than a month ago are checked once a day.

Vulnerabilities that were fixed more than a month ago are checked once a week.

Vulnerabilities marked as false are not checked.

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/CiF2oLmxBac" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>