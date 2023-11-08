# Página de status do serviço Wallarm

Este guia contém detalhes sobre a página de status do serviço Wallarm.

## A Wallarm possui uma página que exibe o status de disponibilidade do serviço Wallarm?

Sim, a página de status da Wallarm está disponível em https://status.wallarm.com. A página exibe dados ao vivo e históricos sobre a disponibilidade dos serviços Wallarm Console e Wallarm API para cada Wallarm Cloud:

* **Wallarm US Cloud**
* **Wallarm EU Cloud**

![Página de status da Wallarm](../images/status-page.png)

## Receberei uma notificação quando o status de um serviço mudar?

Sim, se você estiver inscrito para atualizações. Para se inscrever, clique em **SUBSCREVER ATUALIZAÇÕES** e selecione o canal de inscrição:

* **Email** para receber notificações quando a Wallarm cria, atualiza ou resolve um incidente.
* **SMS** para receber notificações quando a Wallarm cria ou resolve um incidente.
* **Slack** para receber atualizações de incidentes e mensagens de status de manutenção.
* **Webhook** para receber notificações quando a Wallarm cria um incidente, atualiza um incidente, resolve um incidente ou altera o status de um serviço.

## O que significam os status dos serviços?

* **Desempenho degradado** significa que o serviço está funcionando, mas está lento ou de alguma outra forma impactado de maneira menor.
* **Interrupção parcial** significa que os serviços estão completamente quebrados para um subconjunto de clientes.
* **Grande interrupção** significa que os serviços estão completamente indisponíveis.

## Quando um incidente é criado?

Os incidentes são criados quando os serviços estão inativos. Durante um evento relacionado à inatividade, adicionamos uma página descrevendo o problema, o que estamos fazendo a respeito e quando esperamos que o problema seja resolvido.

Com o passar do tempo, a causa do incidente é identificada, o incidente identificado é então reparado e o status do incidente é atualizado para refletir o status atual.