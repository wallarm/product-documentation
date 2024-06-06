# Melhores práticas para prevenção de ataques com Wallarm

Este artigo irá mostrar a você como usar o Wallarm, uma plataforma única que é como ter dois guardiões em um, para a prevenção de ataques. Ele não apenas protege websites como outras ferramentas (conhecidas como WAAP), mas também protege especificamente as APIs do seu sistema, garantindo que todas as partes técnicas do seu espaço online estejam seguras.

Com tantas ameaças que temos online, é crucial ter um escudo forte. O Wallarm pode interromper ameaças comuns, como injeção SQL, cross-site scripting, execução remota de código e Path Traversal por conta própria. Mas, para alguns perigos sorrateiros e casos de uso especializados, como a proteção contra ataques DoS, a tomada de conta, o abuso da API, podem ser necessários alguns ajustes. Vamos orientá-lo nessas etapas, garantindo que você obtenha a melhor proteção possível. Caso você seja um especialista em segurança experiente ou esteja apenas embarcando na sua jornada de cibersegurança, este artigo fornecerá informações valiosas para reforçar sua estratégia de segurança.

## Gerencie múltiplas aplicações e inquilinos

Se a sua organização usa múltiplas aplicações ou inquilinos separados, você provavelmente achará a plataforma Wallarm útil para um gerenciamento fácil. Ela permite que você veja eventos e estatísticas separadamente [para cada aplicação](../user-guides/settings/applications.md) e configure gatilhos ou regras específicas por aplicação. Caso precise, você pode criar um ambiente isolado [para cada inquilino](../installation/multi-tenant/overview.md) com controles de acesso separados.

## Estabeleça uma zona de confiança

Ao introduzir novas medidas de segurança, a operação ininterrupta das aplicações de negócios cruciais deve permanecer como uma prioridade principal. Para garantir que os recursos confiáveis não sejam desnecessariamente processados pela plataforma Wallarm, você tem a opção de alocá-los na [lista de permissões de IP](../user-guides/ip-lists/allowlist.md).

O tráfego originado pelos recursos da lista de permissões não é analisado ou registrado por padrão. Isso significa que os dados das solicitações ignoradas não estarão disponíveis para revisão. Portanto, o seu uso deve ser aplicado com cautela.

Para URLs que requerem tráfego irrestrito ou para os quais você deseja realizar supervisão manual, considere [configurar o nó Wallarm para o modo de monitoramento](../admin-en/configure-wallarm-mode.md). Isso irá capturar e registrar todas as atividades maliciosas direcionadas a esses URLs. Você pode subsequentemente revisar esses eventos através da UI do Console Wallarm, monitorar anomalias e, se necessário, tomar ações manuais como bloquear IPs específicos. 

## Controle os modos de filtragem de tráfego e excepções de processamento

Implemente as medidas de segurança gradualmente usando nossas opções flexíveis para gerenciar modos de filtragem e personalizar o processamento para se adequar às suas aplicações. Por exemplo, habilitar o modo de monitoramento para [nós específicos, aplicações](../admin-en/configure-wallarm-mode.md#specifying-the-filtration-mode-in-the-wallarm_mode-directive), ou [partes de uma aplicação](../user-guides/rules/wallarm-mode-rule.md#example-disabling-request-blocking-during-user-registration).

Se necessário, exceto [detectores personalizados para elementos específicos de solicitações](../user-guides/rules/ignore-attack-types.md).

## Configure a lista de denegação

Você pode proteger suas aplicações de fontes não confiáveis incorporando-as em uma [lista de denegação](../user-guides/ip-lists/denylist.md), bloqueando o tráfego de regiões ou fontes suspeitas, como VPNs, servidores Proxy ou redes Tor.

## Bloqueie os perpetradores de multi-ataques

Quando o Wallarm está no modo de bloqueio, ele bloqueia automaticamente todas as solicitações com cargas maliciosas, deixando passar apenas as solicitações legítimas. Se várias atividades maliciosas de um único endereço de IP forem detectadas em um curto período de tempo (muitas vezes referido como perpetradores de multi-ataques), considere [bloquear completamente o atacante usando um gatilho específico](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) que os coloca automaticamente na lista de denegação.

## Habilite a mitigação de força bruta

Mitigue ataques de força bruta limitando o número de tentativas de acesso a páginas autorizadas ou formulários de redefinição de senhas de um único endereço IP. Você pode fazer isso configurando um [gatilho específico](../admin-en/configuration-guides/protecting-against-bruteforce.md).

## Habilite a mitigação de navegação forçada

A navegação forçada é um ataque no qual um invasor tenta encontrar e utilizar recursos ocultos, como diretórios e arquivos com informações sobre a aplicação. Esses arquivos ocultos podem fornecer aos invasores informações que podem utilizar para realizar outros tipos de ataques. Você pode prevenir tais atividades maliciosas definindo limites para tentativas infrutíferas de alcançar recursos específicos por meio de um [gatilho específico](../admin-en/configuration-guides/protecting-against-bruteforce.md).

## Defina limites de taxa

Sem um limite adequado de quão frequentemente as APIs podem ser usadas, elas podem ser atingidas por ataques que sobrecarregam o sistema, como ataques DoS e de força bruta, ou sobrecarga de API. Ao usar a regra [**Definir limite de taxa**](../user-guides/rules/rate-limiting.md), você pode especificar o número máximo de conexões que podem ser feitas para um escopo específico, garantindo também que as solicitações de entrada sejam distribuídas de maneira uniforme.

## Ative a proteção BOLA

A vulnerabilidade BOLA (Broken Object Level Authorization) permite que um invasor acesse um objeto através do seu identificador através de uma solicitação de API e leia ou modifique seus dados, contornando um mecanismo de autorização. Para prevenir ataques BOLA, você pode especificar manualmente os endpoints vulneráveis e definir limites para conexões com eles, ou ligar o Wallarm para identificar e proteger automaticamente os endpoints vulneráveis. [Saiba mais](../admin-en/configuration-guides/protecting-against-bola.md)

## Empregue a Prevenção de Abuso de API

[Configure perfis de abuso de API](../api-abuse-prevention/setup.md) para parar e bloquear bots que realizam abusos de API como tomada de conta, raspagem, crawlers de segurança e outras ações maliciosas automatizadas direcionadas às suas APIs.

## Crie regras personalizadas de detecção de ataques

Em certos cenários, pode ser benéfico adicionar manualmente uma [assinatura de detecção de ataque ou criar um patch virtual](../user-guides/rules/regex-rule.md). O Wallarm, embora não dependa de expressões regulares para a detecção de ataques, permite que os usuários incluam assinaturas adicionais baseadas em expressões regulares.

## Mascare dados sensíveis

O nó Wallarm envia informações de ataque para a Nuvem Wallarm. Certos dados, como autorização (cookies, tokens, senhas), dados pessoais e credenciais de pagamento, devem permanecer dentro do servidor onde são processados. [Crie uma regra de mascaramento de dados](../user-guides/rules/sensitive-data-rule.md) para cortar o valor original de pontos de solicitação específicos antes de enviá-los para a Nuvem Wallarm, garantindo que os dados sensíveis permaneçam dentro do seu ambiente confiável.

## Integração contínua com SIEM/SOAR & Alertas instantâneos para eventos críticos

O Wallarm oferece integração contínua com [vários sistemas SIEM/SOAR](../user-guides/settings/integrations/integrations-intro.md) como Sumo Logic, Splunk e outros, permitindo que você exporte facilmente todas as informações de ataque para o seu SOC para gerenciamento centralizado.

As integrações do Wallarm em conjunto com a funcionalidade de [gatilhos](../user-guides/triggers/triggers.md) proporcionam uma excelente ferramenta para configurar relatórios e notificações em tempo real sobre ataques específicos, IPs da lista de denegação e volume geral de ataques em andamento. 

## Estratégia de defesa em camadas

Ao criar medidas de segurança robustas e confiáveis para suas aplicações, é crucial adotar uma estratégia de defesa em camadas. Isso envolve a implementação de um conjunto de medidas de proteção complementares que juntas formam uma postura de segurança robusta e resistente. Além das medidas oferecidas pela plataforma de segurança Wallarm, recomendamos as seguintes práticas:

* Utilize a proteção DDoS L3 do seu provedor de serviços em nuvem. A proteção DDoS L3 opera no nível de rede e ajuda a mitigar ataques distribuídos de negação de serviço. A maioria dos provedores de serviços em nuvem oferece proteção L3 como parte de seus serviços.
* Siga as recomendações de configuração segura para seus servidores web ou gateways de API. Por exemplo, certifique-se de obedecer às diretrizes de configuração segura se estiver usando o [NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html) ou [Kong](https://konghq.com/learning-center/api-gateway/secure-api-gateway).

Ao incorporar essas práticas adicionais juntamente com as [medidas de proteção DDoS L7 da Wallarm](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm), você pode melhorar significativamente a segurança geral das suas aplicações. 

## Verifique e aprimore a cobertura das principais ameaças API OWASP

O OWASP API Security Top 10 é um padrão ouro para a avaliação do risco de segurança em APIs. Para ajudá-lo a medir a postura de segurança da sua API contra essas ameaças de API, o Wallarm oferece os [painéis](../user-guides/dashboards/owasp-api-top-ten.md) que fornecem visibilidade clara e métricas para a mitigação das principais ameaças, tanto da versão de 2019 quanto da de 2023.

Estes painéis ajudam você a avaliar o estado geral de segurança e a abordar proativamente as questões de segurança descobertas configurando controles de segurança apropriados.