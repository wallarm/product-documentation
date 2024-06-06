# Painéis do OWASP API Security Top 10

O [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) é o padrão ouro para a avaliação do risco de segurança em APIs. Para ajudá-lo a medir a postura de segurança da sua API contra essas ameaças de API, a Wallarm oferece os painéis que fornecem visibilidade clara e métricas para a mitigação de ameaças.

Os painéis cobrem os riscos do OWASP API Security Top 10 das versões de [2019](https://owasp.org/API-Security/editions/2019/en/0x00-header/) e [2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/).

Ao usar esses painéis, você pode avaliar o estado geral de segurança e abordar proativamente os problemas de segurança descobertos configurando controles de segurança apropriados.

=== "Painel OWASP API Top 10 2019"
    ![OWASP API Top 10 2019](../../images/user-guides/dashboard/owasp-api-top-ten-2019-dash.png)
=== "Painel OWASP API Top 10 2023"
    ![OWASP API Top 10 2023](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Avaliação de ameaças

A Wallarm estima o risco para cada ameaça de API com base nos **controles de segurança** aplicados e vulnerabilidades descobertas:

* **Vermelho** - ocorre se não houver controles de segurança aplicados ou se suas APIs tiverem vulnerabilidades ativas de alto risco.
* **Amarelo** - ocorre se os controles de segurança forem aplicados apenas parcialmente ou se suas APIs tiverem vulnerabilidades ativas de risco médio ou baixo.
* **Verde** indica que suas APIs estão protegidas e não têm vulnerabilidades abertas.

Para cada ameaça do OWASP API Top 10, você pode encontrar informações detalhadas sobre a ameaça, controles de segurança disponíveis, vulnerabilidades correspondentes e investigar ataques relacionados:

![OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash-details.png)

## Controles de segurança da Wallarm para OWASP API 2019

A plataforma de segurança da Wallarm fornece proteção completa contra o OWASP API Security Top 10 2019 pelos seguintes controles de segurança:

| Ameaças do OWASP API Top 10 2019 | Controles de Segurança da Wallarm |
| ----------------------- | ------------------------ |
| [API1:2019 Autorização de Nível de Objeto Quebrada](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md) | <ul><li>[Mitigação automática de BOLA](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) para criar gatilhos automaticamente para proteger endpoints vulneráveis</li></ul> |
| [API2:2019 Autenticação de Usuário Quebrada](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa2-broken-user-authentication.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li><li>[Gatilho de força bruta](../../admin-en/configuration-guides/protecting-against-bruteforce.md) para mitigar ataques de força bruta direcionados a endpoints de autenticação</li><li>[Detecção de JWT Fraco](../triggers/trigger-examples.md#detect-weak-jwts) gatilho para descobrir vulnerabilidades de autenticação fracas baseado em solicitações com JWTs fracos</li></ul> |
| [API3:2019 Exposição Excessiva de Dados](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa3-excessive-data-exposure.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li></ul> |
| [API4:2019 Falta de Recursos e Limitação de Taxa](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa4-lack-of-resources-and-rate-limiting.md) | <ul><li>[Gatilho de força bruta](../../admin-en/configuration-guides/protecting-against-bruteforce.md) para mitigar ataques de força bruta que geralmente levam a DoS, tornando a API irresponsiva ou até indisponível</li><li>[Prevenção de abuso de API](../../api-abuse-prevention/overview.md) para mitigar ações de bots maliciosos que geralmente levam a DoS, tornando a API irresponsiva ou até indisponível</li></ul> |
| [API5:2019 Autorização de Nível de Função Quebrada](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa5-broken-function-level-authorization.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li><li>[Gatilho de navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md) para mitigar tentativas de navegação forçada que também são uma maneira de exploração dessa ameaça</li></ul> |
| [API6:2019 Mass Assignment](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md) | <ul><li>Ataques de Mass Assignment são detectados automaticamente, controles de segurança específicos não são necessários</li></ul> |
| [API7:2019 Má Configuração de Segurança](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa7-security-misconfiguration.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li><li>Autoverificações do nó Wallarm para manter as versões do nó e as políticas de segurança atualizadas (veja [como resolver os problemas](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa8-injection.md) | <ul><li>Injeções maliciosas são detectadas automaticamente, controles de segurança específicos não são necessários</li></ul> |
| [API9:2019 Gerenciamento Improper de Ativos](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa9-improper-assets-management.md) | <ul><li>[Descoberta de API](../../about-wallarm/api-discovery.md) para descobrir automaticamente o inventário real da API com base no tráfego real</li></ul> |
| [API10:2019 Registro e Monitoramento Insuficientes](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xaa-insufficient-logging-monitoring.md) | <ul><li>[Integrações com SIEMs, SOAPs, mensageiros, etc.](../settings/integrations/integrations-intro.md) para receber notificações e relatórios em tempo hábil sobre o status de segurança da sua API</li></ul> |

## Controles de segurança da Wallarm para OWASP API 2023

A plataforma de segurança da Wallarm fornece proteção completa contra o OWASP API Security Top 10 2023 pelos seguintes controles de segurança:

| Ameaças do OWASP API Top 10 2023 | Controles de Segurança da Wallarm |
| ----------------------- | ------------------------ |
| [API1:2023 Autorização de Nível de Objeto Quebrada](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[Mitigação automática de BOLA](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) para criar gatilhos automaticamente para proteger endpoints vulneráveis</li></ul> |
| [API2:2023 Autenticação Quebrada](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li><li>[Gatilho de força bruta](../../admin-en/configuration-guides/protecting-against-bruteforce.md) para mitigar ataques de força bruta direcionados a endpoints de autenticação</li><li>[Detecção de JWT Fraco](../triggers/trigger-examples.md#detect-weak-jwts) gatilho para descobrir vulnerabilidades de autenticação fracas com base em solicitações com JWTs fracos</li></ul> |
| [API3:2023 Autorização de Nível de Propriedade de Objeto Quebrada](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li></ul> |
| [API4:2023 Consumo Irrestrito de Recursos](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[Gatilho de força bruta](../../admin-en/configuration-guides/protecting-against-bruteforce.md) para mitigar ataques de força bruta que geralmente levam a DoS (Denial of Service), tornando a API irresponsiva ou até indisponível</li></ul> |
| [API5:2023 Autorização de Nível de Função Quebrada](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li><li>[Gatilho de navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md) para mitigar tentativas de navegação forçada que também são uma maneira de exploração dessa ameaça</li></ul> |
| [API6:2023 Acesso Irrestrito a Fluxos de Negócios Sensíveis](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[Prevenção de abuso de API](../../api-abuse-prevention/overview.md) para mitigar ações de bots maliciosos</li></ul> |
| [API7:2023 Falsificação de Solicitação do Lado do Servidor](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li></ul> |
| [API8:2023 Má Configuração de Segurança](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li><li>Autoverificações do nó Wallarm para manter as versões do nó e as políticas de segurança atualizadas (veja [como resolver os problemas](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API9:2023 Gerenciamento Improper de Inventário](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[Descoberta de API](../../about-wallarm/api-discovery.md) para descobrir automaticamente o registro atual da API com base no tráfego real</li></ul> |
| [API10:2023 Consumo Inseguro de APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>[Scanner de Vulnerabilidade](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) para descobrir vulnerabilidades ativas do tipo correspondente</li></ul> |

## Comparação do OWASP API Top 10 2019 e 2023

De acordo com o projeto OWASP, as principais ameaças de segurança para 2023 são em grande parte semelhantes às identificadas em 2019, com algumas exceções notáveis:

* A ameaça [API6:2019 Atribuição em Massa](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md) foi combinada com [API3:2023 Autorização de Nível de Propriedade de Objeto Quebrada](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md).
* A ameaça [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa8-injection.md) não é mais listada separadamente e foi incluída na nova categoria [API10:2023 Consumo Inseguro de APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md).
* A ameaça [API10:2019 Registro e Monitoramento Insuficientes](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xaa-insufficient-logging-monitoring.md) foi removida do OWASP API Security Top 10.
* A lista agora inclui duas novas ameaças de API, a saber [API6:2023 Acesso Irrestrito a Fluxos de Negócios Sensíveis](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md), que introduz ameaças automatizadas, e [API7:2023 Falsificação de Solicitação do Lado do Servidor](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md), ressaltando a importância dessas ameaças.