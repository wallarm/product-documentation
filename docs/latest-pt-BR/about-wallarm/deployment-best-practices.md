# Melhores práticas para a implantação e manutenção da solução Wallarm

Este artigo formula as melhores práticas para a implantação e manutenção da solução Wallarm.

## Entenda o poder do NGINX

A maioria das opções de implantação do nó de filtragem Wallarm usa NGINX como servidor proxy reverso (a base para o módulo Wallarm), que oferece uma ampla gama de funcionalidades, módulos e guias de desempenho/segurança. A seguir está uma coleção de artigos úteis da Internet:

* [Awesome NGINX](https://github.com/agile6v/awesome-nginx)
* [Apresentação de slides NGINX: noções básicas e melhores práticas](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [Como otimizar a configuração do NGINX](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [3 passos rápidos para otimizar o desempenho do seu servidor NGINX](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [Como construir um servidor NGINX resistente em 15 passos](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [Como ajustar e otimizar o desempenho do servidor Web NGINX](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [Formas poderosas de turbinar seu servidor NGINX e melhorar seu desempenho](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [Melhores práticas de implantação do TLS](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [Guia de segurança e fortificação do servidor Web NGINX](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [Ajuste do NGINX para melhor desempenho](https://github.com/denji/nginx-tuning)
* [Top 25 melhores práticas de segurança do servidor Web NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## Siga as etapas recomendadas para o onboarding

1. Saiba mais sobre as [opções de implantação do nó Wallarm disponíveis](../installation/supported-deployment-options.md).
2. Saiba mais sobre as opções disponíveis para [gerenciar separadamente a configuração do nó Wallarm para seus ambientes](../admin-en/configuration-guides/wallarm-in-separated-environments/how-wallarm-in-separated-environments-works.md) (se necessário).
3. Implante nós de filtragem Wallarm em seus ambientes de não produção com o [modo de operação](../admin-en/configure-wallarm-mode.md) definido como `monitorização`.
4. Saiba como operar, dimensionar e monitorar a solução Wallarm e confirme a estabilidade do novo componente de rede.
5. Implante nós de filtragem Wallarm em seu ambiente de produção com o [modo de operação](../admin-en/configure-wallarm-mode.md) definido como `monitorização`.
6. Implemente o gerenciamento de configuração apropriado e os [processos de monitorização](#enable-proper-monitoring-of-the-filtering-nodes) para o novo componente Wallarm.
7. Mantenha o tráfego fluindo por meio dos nós de filtragem em todos os seus ambientes (incluindo testes e produção) por 7 a 14 dias para dar tempo para o backend baseado em nuvem do Wallarm aprender sobre sua aplicação.
8. Ative o [modo](../admin-en/configure-wallarm-mode.md) `bloqueio` do Wallarm em todos os seus ambientes de não produção e use testes automatizados ou manuais para confirmar que a aplicação protegida está funcionando conforme o esperado.
9. Ative o [modo](../admin-en/configure-wallarm-mode.md) `bloqueio` do Wallarm no ambiente de produção e use os métodos disponíveis para confirmar que a aplicação está funcionando conforme o esperado.

## Implante os nós de filtragem não apenas no ambiente de produção, mas também nos ambientes de testes e homologação

A maioria dos contratos de serviço Wallarm não limita o número de nós Wallarm implantados pelo cliente, então não há motivo para não implantar os nós de filtragem em todos os seus ambientes, incluindo desenvolvimento, testes, homologação, etc.

Ao implantar e usar os nós de filtragem em todas as etapas de seu desenvolvimento de software e/ou atividades de operação de serviço, você tem uma chance melhor de testar corretamente todo o fluxo de dados e minimizar o risco de qualquer situação inesperada em seu ambiente de produção crítico.

## Ative a biblioteca libdetection

Analisar solicitações com a [biblioteca **libdetection**](protecting-against-attacks.md#library-libdetection) melhora significativamente a capacidade do nó de filtragem de detectar ataques SQLi. É altamente recomendado que todos os clientes da Wallarm [atualizem](/updating-migrating/general-recommendations/) para a versão mais recente do software do nó de filtragem e mantenham a biblioteca **libdetection** habilitada.

* Na versão 4.4 do nó de filtragem e superior, **libdetection** está habilitada por padrão.
* Nas versões inferiores, recomenda-se ativá-la usando a [abordagem](protecting-against-attacks.md#managing-libdetection-mode) para a sua opção de implantação.

## Configure o relatório apropriado dos endereços IP dos usuários finais

Para os nós de filtragem Wallarm localizados atrás de um balanceador de carga ou CDN, certifique-se de configurar seus nós de filtragem para relatar corretamente os endereços IP dos usuários finais (caso contrário, a [funcionalidade da lista de IP](../user-guides/ip-lists/overview.md), [Verificação de ameaça ativa](detecting-vulnerabilities.md#active-threat-verification) e alguns outros recursos não funcionarão):

* [Instruções para os nós Wallarm baseados em NGINX](../admin-en/using-proxy-or-balancer-en.md) (incluindo imagens AWS / GCP e contêiner de nó Docker)
* [Instruções para os nós de filtragem implantados como o controlador de entrada Wallarm Kubernetes](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Habilite a monitorização adequada dos nós de filtragem

É altamente recomendado habilitar a monitorização adequada dos nós de filtragem Wallarm.

O método para configurar a monitorização do nó de filtragem depende da opção de implantação:

* [Instruções para os nós de filtragem implantados como controlador de entrada Wallarm Kubernetes](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [Instruções para a imagem Docker baseada em NGINX](../admin-en/installation-docker-en.md#monitoring-configuration)

## Implemente a redundância adequada e a funcionalidade de failover automático

Como qualquer outro componente crítico em seu ambiente de produção, os nós Wallarm devem ser arquitetados, implantados e operados com o nível adequado de redundância e failover automático. Você deve ter **pelo menos dois nós de filtragem Wallarm ativos** manipulando solicitações críticas de usuários finais. Os seguintes artigos fornecem informações relevantes sobre o tópico:

* [Instruções para nós Wallarm baseados em NGINX](../admin-en/configure-backup-en.md) (incluindo imagens AWS / GCP, contêiner de nó Docker e sidecars Kubernetes)
* [Instruções para os nós de filtragem implantados como o controlador de entrada Wallarm Kubernetes](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## Saiba como usar a lista de permissões, a lista de negações e a lista cinza de endereços IP

Além de bloquear solicitações maliciosas individuais, os nós de filtragem Wallarm também podem bloquear endereços IP individuais de usuários finais. As regras para o bloqueio de IPs são configuradas usando listas de permissões, listas de negações e listas cinzas.

[Mais detalhes sobre o uso de listas de IP →](../user-guides/ip-lists/overview.md)

## Aprenda como realizar a implantação gradual das alterações de configuração do Wallarm

* Use políticas de gerenciamento de mudanças DevOps padrão e políticas de implantação gradual para alterações de configuração de baixo nível para nós de filtragem Wallarm em todos os formatos.
* Para regras de filtragem de tráfego, use um conjunto diferente de [IDs](../admin-en/configure-parameters-en.md#wallarm_application) de aplicação ou cabeçalhos de solicitação `Host`.
* Para a regra [Criar indicador de ataque com base em expressão regular](../user-guides/rules/regex-rule.md#adding-a-new-detection-rule), além da capacidade mencionada acima de ser associada a um ID de aplicação específico, ela pode ser ativada no modo de monitorização (caixa de seleção **Experimental**) mesmo quando o nó Wallarm está sendo executado no modo de bloqueio.
* A regra [Definir modo de filtragem](../user-guides/rules/wallarm-mode-rule.md) permite o controle do modo de operação do nó Wallarm (`monitorização`, `bloqueio seguro` ou `bloqueio`) a partir do Console Wallarm, semelhante à configuração [`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode) na configuração do NGINX (dependendo da configuração [`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override)).

## Configure as integrações disponíveis para receber notificações do sistema

O Wallarm fornece [integrações nativas](../user-guides/settings/integrations/integrations-intro.md) convenientes com Slack, Telegram, PagerDuty, Opsgenie e outros sistemas para enviar rapidamente para você diferentes notificações de segurança geradas pela plataforma, por exemplo:

* Vulnerabilidades de segurança recém-descobertas
* Mudanças no perímetro de rede da empresa
* Usuários adicionados recentemente à conta da empresa via Console Wallarm, etc

Você também pode usar a funcionalidade [Triggers](../user-guides/triggers/triggers.md) para configurar alertas personalizados sobre diferentes eventos ocorrendo no sistema.

## Conheça o poder da funcionalidade Triggers

Dependendo do seu ambiente específico, recomendamos que você configure os seguintes [gatilhos](../user-guides/triggers/triggers.md):

* Monitorização do aumento do nível de solicitações maliciosas detectadas pelos nós Wallarm. Este gatilho pode sinalizar um dos seguintes problemas potenciais:

    * Você está sob ataque e o nó Wallarm está bloqueando com sucesso solicitações maliciosas. Você pode considerar rever os ataques detectados e adicionar manualmente os endereços IP dos atacantes relatados à lista de negação (bloqueio).
    * Você tem um aumento no nível de ataques positivos falsos detectados pelos nós Wallarm. Você pode considerar escalar isso para a [equipe de suporte técnico do Wallarm](mailto:support@wallarm.com) ou [marcar manualmente as solicitações como falsos positivos](../user-guides/events/false-attack.md).
    * Se você teve o gatilho de [lista de negação](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) ativo, mas ainda recebe alertas sobre um aumento no nível de ataques, então o alerta pode sinalizar que o gatilho não está funcionando conforme o esperado.

    [Veja o exemplo de gatilho configurado →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* Notifique que um novo usuário foi adicionado à conta de sua empresa no Console Wallarm

    [Veja o exemplo de gatilho configurado →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* Marque as solicitações como ataque de força bruta ou navegação forçada e bloqueie os endereços IP de onde as solicitações foram originadas

    [Instruções sobre a configuração da proteção contra força bruta →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* Notifique que novos endereços IP foram bloqueados

    [Veja o exemplo de gatilho configurado →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* Adicione automaticamente endereços IP à [lista cinza](../user-guides/ip-lists/graylist.md) usada no modo de [bloqueio seguro](../admin-en/configure-wallarm-mode.md).

Para otimizar o processamento de tráfego e o envio de ataques, o Wallarm [pré-configura](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers) alguns gatilhos.

## Ative o SSO SAML para sua conta no Console Wallarm

Você pode usar um provedor de SSO SAML como G Suite, Okta ou OneLogin para centralizar a autenticação de usuários em sua conta do Console Wallarm.

Entre em contato com o gerente de conta do Wallarm ou a equipe de suporte técnico para ativar o SSO SAML para sua conta, e depois siga [estas instruções](../admin-en/configuration-guides/sso/intro.md) para realizar a configuração do SSO SAML.

## Use o provedor Terraform Wallarm para o gerenciamento de configuração do Wallarm Cloud

[O provedor oficial Terraform do Wallarm](../admin-en/managing/terraform-provider.md) permite que você gerencie a configuração do Wallarm Cloud (usuários, aplicativos, regras, integrações, etc) usando a moderna abordagem de Infraestrutura como Código (IaC).

## Tenha um plano para atualizar prontamente para as novas versões do nó Wallarm lançadas

Wallarm está constantemente trabalhando para melhorar o software do nó de filtragem, com novas versões disponíveis cerca de uma vez por trimestre. Por favor, leia [este documento](../updating-migrating/general-recommendations.md) para informações sobre a abordagem recomendada para realizar as atualizações, com riscos associados e procedimentos de atualização relevantes.

## Conheça as ressalvas conhecidas

* Todos os nós Wallarm conectados à mesma conta Wallarm receberão o mesmo conjunto de regras padrão e personalizadas para a filtragem de tráfego. Você ainda pode aplicar regras diferentes para diferentes aplicações usando IDs de aplicações adequadas ou parâmetros únicos de solicitação HTTP como cabeçalhos, parâmetros de string de consulta, etc.
* Se você tiver o gatilho configurado para bloquear automaticamente um endereço IP ([exemplo de gatilho](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)), o sistema bloqueará o IP para todas as aplicações em uma conta Wallarm.

## Siga as melhores práticas para Verificação de ameaça ativa <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border:none;margin-bottom:-4px;"></a>

Um dos métodos que o Wallarm usa para [detectar vulnerabilidades](../about-wallarm/detecting-vulnerabilities.md) é a **Verificação de ameaça ativa**.

A **Verificação de ameaça ativa** permite que você transforme atacantes em testadores de penetração e descubra possíveis problemas de segurança a partir de sua atividade enquanto eles sondam seus aplicativos/APIs em busca de vulnerabilidades. Este módulo encontra possíveis vulnerabilidades sondando os endpoints da aplicação usando dados reais de ataque do tráfego. Por padrão, este método está desativado.

[Conheça as melhores práticas para a configuração do módulo **Verificação de ameaça ativa** →](../vulnerability-detection/threat-replay-testing/setup.md)