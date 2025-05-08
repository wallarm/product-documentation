[file-ips-list-us]: ../downloads/scanner-ip-addresses-us.txt
[file-ips-list-eu]: ../downloads/scanner-ip-addresses-eu.txt

# Vulnerability Scanning IPs <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This document provides the lists of IP addresses for US and EU Clouds from which Wallarm scans company resources for vulnerabilities with [API Attack Surface Management](../api-attack-surface/security-issues.md) and [Threat Replay Testing](../vulnerability-detection/threat-replay-testing/overview.md).

It is recommended to add addresses from the corresponding list to the **whitelists** of your software or hardware facilities (besides Wallarm) that you use to automatically filter and block traffic. This will prevent Wallarm components from being blocked by these facilities.

## US Cloud

The list of IP addresses for US Cloud (https://us1.my.wallarm.com) from which Wallarm scans company resources for vulnerabilities:

--8<-- "../include/scanner-ip-request-us.md"

!!! info "Get the list of IP addresses"
    [Download the plain text file containing list of Wallarm's vulnerability scanning IPs.][file-ips-list-us]

## EU Cloud

The list of IP addresses for EU Cloud (https://my.wallarm.com) from which Wallarm scans company resources for vulnerabilities:

--8<-- "../include/scanner-ip-request.md"

!!! info "Get the list of IP addresses"
    [Download the plain text file containing list of Wallarm's vulnerability scanning IPs.][file-ips-list-eu]