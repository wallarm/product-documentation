# Filtrando tráfego espelhado

Uma das abordagens de implementação do nó Wallarm é uma implementação baseada em assincronia para a filtração de tráfego HTTP espelhado. Este artigo instrui você sobre a configuração necessária para esta implementação e oferece alguns exemplos.

O espelhamento de tráfego permite que o tráfego de entrada original seja enviado para vários backends em paralelo. A instalação de um nó Wallarm como backend adicional permite que você execute a filtragem do espelho de tráfego (cópia) sem impacto nos clientes - quaisquer solicitações de entrada alcançarão os servidores aos quais estão endereçados.

Aqui está um exemplo do diagrama de fluxo de tráfego com a opção de espelhamento ativada:

![Esquema Espelho](../../../images/waf-installation/aws/terraform/wallarm-for-mirrored-traffic.png)

## Casos de uso da abordagem

Instalar o nó Wallarm para filtrar o tráfego espelhado é útil para:

* Ter certeza de que a solução de segurança não afetará o desempenho do aplicativo.
* Treinar a solução Wallarm na cópia do tráfego antes de executar o módulo no sistema de produção.

## Limitações da filtragem de tráfego espelhado

Apesar da segurança da abordagem de implementação, ela tem algumas limitações:

* Apenas nós Wallarm baseados em NGINX suportam a filtragem de tráfego espelhado.
* O nó Wallarm não bloqueia instantaneamente solicitações maliciosas, pois a análise de tráfego prossegue independentemente do fluxo de tráfego real.
* Wallarm não detecta [vulnerabilidades](../../../about-wallarm/detecting-vulnerabilities.md) de aplicação e API já que o nó só tem cópias das solicitações de entrada, e as respostas do servidor não podem ser espelhadas.
* A solução requer um componente adicional - o servidor web fornecendo o espelhamento de tráfego ou uma ferramenta similar (por exemplo, NGINX, Envoy, Istio, Traefik, módulo personalizado Kong, etc).

## Configuração

Para implementar o Wallarm para filtrar o tráfego espelhado:

1. Configure seu servidor web para espelhar o tráfego de entrada para um backend adicional.
1. [Instale](../../../installation/supported-deployment-options.md) o nó Wallarm como o backend adicional e configure-o para filtrar o tráfego espelhado.

O espelhamento de tráfego é suportado por muitos servidores web. Dentro dos seguintes links, você encontrará a **configuração exemplo** para os mais populares deles:

* [NGINX](nginx-example.md)
* [Traefik](traefik-example.md)
* [Envoy](envoy-example.md)
* [Istio](istio-example.md)