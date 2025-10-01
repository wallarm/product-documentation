Wallarm'ın [API Abuse Prevention](../../api-abuse-prevention/overview.md) modülü ayrıca kötü amaçlı botların IP'lerini otomatik olarak ya graylist'e ya da denylist'e ekler.

Botların IP'leri, `Bot` Reason değeri ve doğasına ilişkin ayrıntılar (örn. [güven oranı](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works)) ile ayırt edilir, örneğin:

![Denylist'e alınmış bot IP'leri](../../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)