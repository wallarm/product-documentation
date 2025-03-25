## Overview

Behavioral attacks such as [Broken Object Level Authorization (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) exploit the vulnerability of the same name. This vulnerability allows an attacker to access an object by its identifier via an API request and either read or modify its data bypassing an authorization mechanism. This article instructs you on protecting your applications against BOLA attacks.

By default, Wallarm automatically discovers only vulnerabilities of the BOLA type (also known as IDOR) but does not detect its exploitation attempts.

!!! warning "BOLA protection restrictions"
    Only Wallarm node 4.2 and above supports BOLA attack detection.

    Wallarm node 4.2 and above analyzes only the following requests for BOLA attack signs:

    * Requests sent via the HTTP protocol.
    * Requests that do not contain signs of other attack types, e.g. requests are not considered to be a BOLA attack if:

        * These requests contain signs of [input validation attacks](../../attacks-vulns-list.md#attack-types).
        * These requests match the regular expression specified in the [rule **Create regexp-based attack indicator**](../../user-guides/rules/regex-rule.md#creating-and-applying-rule).

## Requirements

To protect resources from BOLA attacks, make sure your environment meets the following requirements:

* If the filtering node is deployed behind a proxy server or load balancer, [configure](../using-proxy-or-balancer-en.md) displaying real clients' IP addresses.