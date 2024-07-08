# Implantando Wallarm com Conectores

O deploy de API pode ser feito de várias maneiras, incluindo a utilização de ferramentas externas como Azion Edge, Akamai Edge, Mulesoft, Apigee e AWS Lambda. Se você está procurando uma maneira de proteger essas APIs com Wallarm, oferecemos uma solução na forma de "conectores" especificamente projetados para tais casos.

## Como funciona

A solução envolve a implantação do nó Wallarm externamente e a injeção de código ou políticas personalizadas na plataforma específica. Isso permite que o tráfego seja direcionado para o nó Wallarm externo para análise e proteção contra possíveis ameaças. Referidos como conectores Wallarm, eles servem como a ligação essencial entre as plataformas e o nó Wallarm externo.

O seguinte esquema demonstra o fluxo de tráfego de alto nível no [modo](../../admin-en/configure-wallarm-mode.md) de bloqueio Wallarm:

![imagem](../../images/waf-installation/general-traffic-flow-for-connectors.png)

O tráfego é analisado em linha, o script Wallarm injetado captura solicitações e as encaminha para o nó para análise. Dependendo da resposta do nó, as atividades maliciosas são bloqueadas e apenas solicitações legítimas têm permissão para acessar as APIs.

Alternativamente, o modo de monitoramento permite que os usuários adquiram conhecimento sobre possíveis ameaças que as aplicações web e APIs podem encontrar. Neste modo, a lógica do fluxo de tráfego permanece a mesma, mas o nó não bloqueia ataques, apenas os registra e os grava no Wallarm Cloud, acessível através do console Wallarm.

## Casos de uso

* Protegendo todas as APIs implantadas com Azion Edge, Akamai Edge, Mulesoft, Apigee, AWS Lambda ou ferramenta similar, criando apenas um componente na infraestrutura atual - o componente como o código/política/proxy Wallarm dependendo da solução utilizada.
* Necessidade de uma solução de segurança que oferece observação abrangente de ataques, relatórios e bloqueio instantâneo de solicitações maliciosas.

## Limitações

A solução tem certas limitações, pois só funciona com solicitações de entrada:

* A descoberta de vulnerabilidades usando o método de [detecção passiva](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) não funciona adequadamente. A solução determina se uma API é vulnerável ou não com base nas respostas do servidor a solicitações maliciosas típicas das vulnerabilidades que testa.
* [Descoberta da API Wallarm](../../api-discovery/overview.md) não pode explorar o inventário da API com base no seu tráfego, pois a solução depende da análise da resposta.
* A [proteção contra navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md) não está disponível, pois requer análise do código de resposta.

## Opções de implantação suportadas

Atualmente, Wallarm oferece conectores para as seguintes plataformas:

* [Mulesoft](mulesoft.md)
* [Apigee](apigee.md)
* [Akamai EdgeWorkers](akamai-edgeworkers.md)
* [Azion Edge](azion-edge.md)
* [AWS Lambda](aws-lambda.md)

Se você não pôde encontrar o conector que está procurando, por favor sinta-se à vontade para contatar nossa [equipe de vendas](mailto:sales@wallarm.com) para discutir seus requisitos e explorar possíveis soluções.