O módulo [Prevenção de Abuso de API](../../about-wallarm/api-abuse-prevention.md) da Wallarm também preenche automaticamente a lista cinza ou a lista de negação com os IPs dos bots maliciosos.

Os IPs dos bots são distinguidos pelo **Motivo** `Bot` e os detalhes sobre sua natureza, incluindo a [taxa de confiança](../../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works), por exemplo:

![IPs de bots na lista de negação](../../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)