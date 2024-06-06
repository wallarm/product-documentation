# Planos de assinatura Wallarm

Ao assinar o Wallarm, você escolhe um plano que melhor atende às necessidades do seu negócio. Neste documento, você pode aprender sobre os planos de assinatura disponíveis e as funcionalidades que eles habilitam.

O Wallarm oferece os seguintes planos de assinatura:

* **Cloud Native WAAP (Proteção de Aplicativos e API da Web)** que é um WAF de próxima geração que fornece proteção contra ameaças comuns para aplicativos web e APIs.
* **Segurança de API Avançada** fornece descoberta abrangente de API e prevenção de ameaças em todo o seu portfólio, independentemente do protocolo.

  O plano de assinatura de Segurança Avançada de API é vendido como um complemento para o Cloud Native WAAP.

## Planos de assinatura

| Recurso | Cloud Native WAAP | WAAP + Segurança Avançada de API |
| ------- | ----------------- | --------------------- |
| **Cobertura OWASP** | | |
| [Top 10 do OWASP](https://owasp.org/www-project-top-ten/) | Sim | Sim |
| [Top 10 de API do OWASP](https://owasp.org/www-project-api-security/) | Parcialmente <sup>⁕</sup> | Sim |
| **Tipos de recursos protegidos** | | |
| Aplicações Web | Sim | Sim |
| APIs | Parcialmente <sup>⁕</sup> | Sim |
| **Suporte ao protocolo API** | | |
| Legado (SOAP, XML-RPC, WebDAV, WebForm) | Sim | Sim |
| Mainstream (REST, GraphQL) | Sim | Sim |
| Moderno e streaming (gRPC, WebSocket) | Não | Sim |
| **Prevenção de ameaças em tempo real** | | |
| [Ataques de validação de entrada](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), por exemplo, injeção SQL, RCE | Sim | Sim |
| [Correção virtual](../user-guides/rules/vpatch-rule.md) | Sim | Sim |
| [Filtragem geográfica](../user-guides/ip-lists/overview.md) | Sim | Sim |
| **Proteção contra ameaças automáticas** | | |
| [Proteção contra força bruta](../admin-en/configuration-guides/protecting-against-bruteforce.md) | Sim | Sim |
| [Proteção BOLA (IDOR)](../admin-en/configuration-guides/protecting-against-bola.md) | Configuração manual | Proteção automática |
| [Prevenção ao Abuso de API](../api-abuse-prevention/overview.md) | Não | Sim |
| **Opções de observabilidade** | | |
| [Descoberta de API](../about-wallarm/api-discovery.md) | Não | Sim |
| [Encontrando APIs sombra, órfãs e zumbis](../about-wallarm/api-discovery.md#shadow-orphan-and-zombie-apis) com a Descoberta de API | Não | Sim |
| [Detecção de dados sensíveis](../about-wallarm/api-discovery.md) | Não | Sim |
| **Testes de segurança e avaliação de vulnerabilidades** | | |
| [Verificação de ameaças ativas](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) | Não | Sim |
| [Scanner de Vulnerabilidades](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) | Não | Sim |
| **Monitoramento de eventos de segurança** | | |
| [Integrações](../user-guides/settings/integrations/integrations-intro.md) com SIEMs, messengers, etc | Todos | Todos |
| [Log de auditoria](../user-guides/settings/audit-log.md) | Sim | Sim |
| **Implementação** | | |
| [Opções de implementação](../installation/supported-deployment-options.md) | Todas | Todas |
| [Multitenant](../installation/multi-tenant/overview.md) | Sim (a pedido) | Sim (a pedido) |
| **Gerenciamento de usuários** | | |
| [Autenticação SSO (SAML) para usuários](../admin-en/configuration-guides/sso/intro.md) | Sim | Sim |
| **API Wallarm** | | |
| [Acesso à API Wallarm](../api/overview.md) | Sim | Sim |

`⁕` Os recursos podem operar parcialmente quando dependem de funcionalidades não disponíveis, por exemplo, o WAAP protege parcialmente as APIs porque analisa as solicitações enviadas por meio do conjunto limitado de protocolos de API.

Para ativar um plano de assinatura, envie um pedido para [sales@wallarm.com](mailto:sales@wallarm.com). O custo da assinatura será determinado com base no plano escolhido, em seu período e no [volume de tráfego de entrada](../admin-en/operation/learn-incoming-request-number.md).

As informações sobre um plano ativo são exibidas no Console Wallarm → **Configurações** → [**Assinaturas**](../user-guides/settings/subscriptions.md).

## Notificações de assinatura

O Wallarm notifica **Administradores** e **Administradores Globais** de sua conta por e-mail sobre quaisquer problemas com uma assinatura:

* Expiração do período de tempo da assinatura (60, 30, 15 dias antes e quando o período de tempo expirou)
* Excedência da cota mensal para solicitações processadas (quando 85% e 100% de uma cota foram alcançados)

Além disso, a interface do usuário do Console Wallarm exibe a mensagem sobre problemas de assinatura para todos os usuários.

## Plano de assinatura da camada gratuita (Nuvem dos EUA)

Quando um novo usuário é registrado no Console Wallarm do **[US Cloud](overview.md#cloud)**, uma nova conta de cliente com um plano de assinatura **Free Tier** é automaticamente criada no sistema Wallarm.

O plano de assinatura Free Tier inclui:

* Os recursos do Wallarm disponíveis gratuitamente até a cota de **500 mil solicitações por mês** sem limitação de tempo. A cota é reiniciada no primeiro dia de cada mês.
* Acesso à plataforma Wallarm como [Segurança Avançada de API](#subscription-plans), exceto para o seguinte:

    * Scanners de [Vulnerabilidade](detecting-vulnerabilities.md#vulnerability-scanner) e [Ativos Expostos](../user-guides/scanner.md)
    * O recurso [Prevenção de ameaças ativas](detecting-vulnerabilities.md#active-threat-verification)
    * O módulo [Prevenção de Abuso de API](../api-abuse-prevention/overview.md)
    * Implementação do tipo [Nó CDN](../installation/cdn-node.md)
    * Cobertura parcial do Top 10 de API do OWASP devido à indisponibilidade do Scanner de Vulnerabilidades
    * Acesso à API Wallarm

**O que acontece se a cota for excedida?**

Se a conta da empresa exceder 100% da cota mensal Free Tier, seu acesso ao Console Wallarm será desativado, assim como todas as integrações. Ao atingir 200%, a proteção em seus nós Wallarm será desativada.

Essas restrições estarão em vigor até o primeiro dia do próximo mês. Entre em contato com a equipe de vendas da Wallarm [sales@wallarm.com](mailto:sales@wallarm.com) para restaurar o serviço imediatamente, mudando para um dos planos de assinatura pagos.

As informações sobre o uso da assinatura da camada gratuita são exibidas no Console Wallarm → **Configurações** → [**Assinaturas**](../user-guides/settings/subscriptions.md).

Wallarm notifica **Administradores** e **Administradores Globais** de sua conta por e-mail quando 85%, 100%, 185% e 200% da cota de solicitações gratuitas foram excedidas.

## Período de teste (Cloud da EU)

Quando um novo usuário é registrado no Console Wallarm do **[EU Cloud](overview.md#cloud)**, uma nova conta de cliente com um período de teste ativo é criada automaticamente no sistema Wallarm.

* O período de teste é gratuito.
* O período de teste dura 14 dias.
* O período de teste do Wallarm oferece o conjunto máximo de módulos e recursos que podem ser incluídos no [plano](#subscription-plans) de Segurança de API.
* O período de teste pode ser prorrogado por mais 14 dias apenas uma vez.

    O período de teste pode ser prorrogado no Console Wallarm → **Configurações** → [**Assinaturas**](../user-guides/settings/subscriptions.md) seção e por meio do botão do e-mail notificando sobre o final do período de teste. O e-mail é enviado apenas para usuários com o [papel de **Administrador** e **Administrador Global**](../user-guides/settings/users.md#user-roles).
* Se o período de teste expirou:

    * A conta no Console Wallarm será bloqueada.
    * A sincronização entre o nó Wallarm e a Cloud Wallarm será interrompida.
    * O nó Wallarm irá operar localmente, mas não receberá nenhuma atualização da Cloud Wallarm e também não enviará dados para a Cloud.
    
    Quando uma assinatura paga para o Wallarm é ativada, o acesso à conta do cliente é restaurado para todos os usuários.

Informações sobre o período de teste são exibidas no Console Wallarm → **Configurações** → [**Assinaturas**](../user-guides/settings/subscriptions.md).
