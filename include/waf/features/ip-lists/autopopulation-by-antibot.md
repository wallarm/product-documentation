The Wallarm's [API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md) module also automatically populates either the graylist or denylist with the malicious bots' IPs.

Bots' IPs are distinguished by the `Bot` **Reason** and the details on its nature including the [confidence rate](../../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works), e.g.:

![Denylisted bot IPs](../../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)
