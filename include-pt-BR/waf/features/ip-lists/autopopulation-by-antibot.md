O módulo [Prevenção de Abuso de API](../../api-abuse-prevention/overview.md) da Wallarm também preenche automaticamente a lista cinza ou a lista de negação com os IPs dos bots maliciosos.

Os IPs dos bots são distinguidos pelo **Motivo** `Bot` e os detalhes sobre sua natureza, incluindo a [taxa de confiança](../../api-abuse-prevention/overview.md#how-api-abuse-prevention-works), por exemplo:

![IPs de bots na lista de negação](../../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)