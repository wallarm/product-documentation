# Visão geral da implantação fora da banda do Wallarm

O Wallarm pode ser implantado como uma solução de segurança fora da banda (OOB), inspecionando solicitações por meio de um espelho do tráfego. Este artigo explica a abordagem em detalhes.

A abordagem OOB envolve a colocação da solução Wallarm em um segmento de rede separado, onde pode inspecionar o tráfego de entrada sem afetar o caminho de dados principal e, portanto, o desempenho do aplicativo. Todas as solicitações de entrada, incluindo as maliciosas, chegam aos servidores para os quais foram destinadas.

## Casos de uso

O espelhamento de tráfego é um componente chave da abordagem OOB. Uma cópia (espelho) do tráfego de entrada é enviada para a solução OOB do Wallarm, que opera na cópia, e não no tráfego real.

Como a solução OOB apenas registra atividades maliciosas, mas não as bloqueia, é uma maneira eficaz de implementar a segurança de aplicações web e APIs para organizações com requisitos de proteção em tempo real menos rigorosos. A solução OOB é adequada para os seguintes casos de uso:

* Obter conhecimento sobre todas as ameaças potenciais que as aplicações web e APIs podem encontrar, sem afetar o desempenho do aplicativo.
* Treinar a solução Wallarm na cópia do tráfego antes de executar o módulo [em linha](../inline/overview.md).
* Capturar registros de segurança para fins de auditoria. O Wallarm oferece [integrações nativas](../../user-guides/settings/integrations/integrations-intro.md) com muitos sistemas SIEM, mensageiros, etc.

O diagrama abaixo fornece uma representação visual do fluxo geral de tráfego em uma implantação fora da banda do Wallarm. O diagrama pode não capturar todas as possíveis variações de infraestrutura. O espelho de tráfego pode ser gerado em qualquer camada de suporte da infraestrutura e enviado para os nós do Wallarm. Além disso, configurações específicas podem envolver vários balanceamentos de carga e outras configurações de nível de infraestrutura.

![Esquema OOB](../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## Vantagens e limitações

A abordagem OOB para a implantação do Wallarm apresenta várias vantagens sobre outros métodos de implantação, como as implantações em linha:

* Não apresenta latência ou outros problemas de desempenho que podem ocorrer quando a solução de segurança opera em linha com o caminho de dados principal.
* Oferece flexibilidade e facilidade de implantação, já que a solução pode ser incluída ou removida da rede sem afetar o caminho de dados principal.

Apesar da segurança da abordagem de implantação OOB, tem algumas limitações:

* O Wallarm não bloqueia instantaneamente as solicitações maliciosas, pois a análise de tráfego prossegue independentemente do fluxo de tráfego real.

    O Wallarm apenas observa os ataques e fornece a você os [detalhes no console do Wallarm](../../user-guides/events/analyze-attack.md).
* A descoberta de vulnerabilidades usando o método de [detecção passiva](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) não funciona corretamente. A solução determina se uma API é vulnerável ou não com base nas respostas do servidor a solicitações maliciosas típicas das vulnerabilidades que testa.
* A [Descoberta de API do Wallarm](../../api-discovery/overview.md) não explora o inventário de API com base no seu tráfego, pois as respostas do servidor necessárias para a operação do módulo não são espelhadas.
* A [proteção contra a navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md) não está disponível, pois exige a análise do código de resposta, o que atualmente não é viável.

## Opções de implantação suportadas

O Wallarm oferece o opções de implantação fora da banda (OOB) para tráfego espelhado por serviços como NGINX, Envoy, Istio, etc. Eles geralmente oferecem módulos integrados ou recursos para espelhamento de tráfego.

Caso esteja buscando uma solução de segurança OOB para analisar o tráfego espelhado por tais soluções, consulte a [visão geral da opção de implantação apropriada do Wallarm](web-server-mirroring/overview.md).