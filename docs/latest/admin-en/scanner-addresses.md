[file-ips-list-us]: ../downloads/scanner-ip-addresses-us.txt
[file-ips-list-eu]: ../downloads/scanner-ip-addresses-eu.txt

# Wallarm Scanner Addresses <a href="../../about-wallarm/subscription-plans/#waap-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This document provides the lists of [Wallarm Scanner](../user-guides/scanner.md) IP addresses for US and EU Clouds.

It is recommended to add addresses from the corresponding list to the **whitelists** of your software or hardware facilities (besides Wallarm) that you use to automatically filter and block traffic. This will [prevent](../user-guides/scanner.md#preventing-scanner-from-being-blocked) Wallarm Scanner from being blocked by these facilities.

## US Cloud

The list of IP addresses for US Cloud (https://us1.my.wallarm.com) from which Wallarm scans company resources for [vulnerabilities](../glossary-en.md#vulnerability) and rechecks attacks and vulnerabilities:

--8<-- "../include/scanner-ip-request-us.md"

!!! info "Get the list of IP addresses"
    [Download the plain text file containing list of scanners' IP addresses.][file-ips-list-us]

## EU Cloud

The list of IP addresses for EU Cloud (https://my.wallarm.com) from which Wallarm scans company resources for [vulnerabilities](../glossary-en.md#vulnerability) and rechecks attacks and vulnerabilities:

--8<-- "../include/scanner-ip-request.md"

!!! info "Get the list of IP addresses"
    [Download the plain text file containing list of scanners' IP addresses.][file-ips-list-eu]