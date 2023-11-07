# Painel de Prevenção de Ameaças

O Wallarm coleta automaticamente métricas do tráfego processado e as representa na seção **Painéis → Prevenção de Ameaças** do Console Wallarm. O painel permite que qualquer usuário analise as tendências de tráfego malicioso e legítimo e obtenha o status de vulnerabilidade do aplicativo por um período de tempo.

As métricas são apresentadas nos seguintes widgets:

* Estatísticas para o mês atual e a velocidade de encontro dos pedidos
* Tráfego normal e malicioso
* Tipos de ataque
* Protocolos de API
* Fontes de ataque
* Alvos de ataque
* Scanner de Vulnerabilidade

Você pode filtrar os dados do widget por [aplicações](../settings/applications.md) e período de tempo. Por padrão, os widgets representam estatísticas em todas as aplicações do último mês.

Qualquer widget permite abrir a [lista de eventos](../events/check-attack.md) em que as estatísticas foram coletadas.

!!! info "Começando com o Wallarm"
    Se você registrou a conta Wallarm no [Cloud](../../about-wallarm/overview.md#cloud) dos EUA, você poderá explorar os principais recursos do Wallarm na **Zona de testes** com acesso somente leitura às seções do Console Wallarm. Use-o para experimentar os principais recursos da plataforma Wallarm sem ter que implantar nenhum componente em seu ambiente.
    
    A seção Painel também inclui o botão **Começar** para novos usuários. Quando você clica no botão, você receberá uma lista de opções de descoberta de produtos úteis com o seguinte entre eles:
    
    * A opção **Tour de integração** fornecerá opções de implantação suportadas pela Wallarm e links para instruções de implantação relevantes.
    * A opção **Zona de testes da Wallarm** o direcionará para a zona de testes do Console Wallarm com acesso somente leitura às suas seções. Esta opção está disponível apenas para usuários do Cloud nos EUA.

## Estatísticas para o mês atual e a velocidade de encontro dos pedidos

O widget exibe os seguintes dados:

* A cota mensal de solicitação especificada no [plano de assinatura](../../about-wallarm/subscription-plans.md)
* O número de [acertos](../../about-wallarm/protecting-against-attacks.md#hit) detectados e [bloqueados](../../admin-en/configure-wallarm-mode.md) durante o mês atual
* A velocidade em tempo real com que as solicitações e acertos são encontrados

![Estatísticas do mês atual](../../images/user-guides/dashboard/current-month-stats.png)

## Tráfego normal e malicioso por um período

O widget exibe as estatísticas resumidas para o tráfego processado durante o período selecionado:

* O gráfico representa a distribuição de dados ao longo do tempo, permitindo que você rastreie os períodos de atividade mais ativa
* O número total de solicitações processadas, [acertos](../../glossary-en.md#hit) e [incidentes](../../glossary-en.md#security-incident), e o número de acertos bloqueados
* Tendências: mudança no número de eventos para um período selecionado e o mesmo período anterior

![Tráfego normal e malicioso](../../images/user-guides/dashboard/traffic-stats.png)

## Tipos de ataque

Este widget exibe os [principais tipos de ataques detectados](../../attacks-vulns-list.md) que ajudam a analisar os padrões de tráfego malicioso e o comportamento do agressor.

Usando esses dados, você pode analisar a vulnerabilidade de seus serviços a diferentes tipos de ataque e tomar medidas apropriadas para melhorar a segurança do serviço.

![Tipos de ataque](../../images/user-guides/dashboard/attack-types.png)

## Protocolos de API

Este widget exibe estatísticas sobre os protocolos da API usados pelos invasores. O Wallarm pode identificar os seguintes protocolos de API:

* GraphQL
* gRPC
* WebSocket
* API REST
* SOAP
* XML-RPC
* JSON-RPC
* WebDAV

Usando o widget, você pode analisar solicitações maliciosas enviadas por meio de certos protocolos e avaliar a vulnerabilidade de seu sistema a tais solicitações.

![Protocolos de API](../../images/user-guides/dashboard/api-protocols.png)

## CVEs

O widget **CVEs** exibe o topo das vulnerabilidades CVE que os invasores exploraram durante o período de tempo selecionado. Alterando o tipo de classificação, você pode estar ciente dos CVEs mais recentes e pode rastrear os CVEs mais atacados.

Cada CVE é acompanhado pelos detalhes, como pontuação CVSS v3.0, complexidade de ataque, privilégios necessários e outros recebidos do [banco de dados de vulnerabilidades](https://vulners.com/). As vulnerabilidades registradas antes de 2015 não são fornecidas com a pontuação CVSS v3.0.

![CVE](../../images/user-guides/dashboard/cves.png)

Você pode revisar seu sistema em busca de vulnerabilidades destacadas e, se encontradas, implementar as recomendações de remediação apropriadas para eliminar o risco de exploração da vulnerabilidade.

## Autenticação

Este widget exibe os métodos de autenticação que os agressores usaram durante o período de tempo especificado, por exemplo:

* Chave de API
* Autenticação básica
* Token de portador
* Autenticação de cookie, etc.

![Auth](../../images/user-guides/dashboard/authentication.png)

Essas informações permitem que você identifique métodos de autenticação fracos e, em seguida, tome medidas preventivas.

## Fontes de ataque

Este widget exibe as estatísticas sobre os grupos de fontes de ataque:

* Localizações
* Tipos, por exemplo, Tor, Proxy, VPN, AWS, GCP, etc.

Esses dados podem ajudar a definir fontes de ataque abusivas e permitir o bloqueio de solicitações originadas delas usando as [listas cinzas ou negras de endereços IP](../ip-lists/overview.md).

Você pode ver dados de cada grupo de fontes em abas separadas.

![Fontes de ataque](../../images/user-guides/dashboard/attack-sources.png)

## Alvos de ataque

Este widget exibe domínios e [aplicações](../settings/applications.md) sendo atacados com mais frequência. As seguintes métricas são exibidas para cada objeto:

* O número de incidentes detectados
* O número de acertos detectados
* Tendências: mudança no número de acertos para um período selecionado e para o mesmo período anterior. Por exemplo: se você verificar as estatísticas do último mês, a tendência exibirá a diferença no número de acertos entre os últimos e os meses anteriores como uma porcentagem

Você pode ver os dados sobre domínios e aplicações em abas separadas.

![Alvos de ataque](../../images/user-guides/dashboard/attack-targets.png)

## Scanner de Vulnerabilidades

O widget Scanner mostra estatísticas sobre vulnerabilidades detectadas em [ativos públicos](../scanner.md):

* O número de vulnerabilidades de todos os níveis de risco detectados ao longo do período selecionado
* O número de vulnerabilidades ativas de todos os níveis de risco no final do período selecionado
* Mudanças no número de vulnerabilidades de todos os níveis de risco para o período selecionado

![Widget Scanner](../../images/user-guides/dashboard/dashboard-scanner.png)