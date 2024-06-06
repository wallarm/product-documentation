# Prevenção de Abuso de API <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

O módulo **Prevenção de Abuso de API** da plataforma Wallarm oferece detecção e mitigação de bots que realizam abuso de API, como preenchimento de credenciais, criação de contas falsas, raspagem de conteúdo e outras ações maliciosas voltadas para suas APIs.

## Ameaças automatizadas bloqueadas pela Prevenção de Abuso de API

O módulo **Prevenção de Abuso de API** detecta os seguintes tipos de bots por padrão:

* [Abuso de API](../attacks-vulns-list.md#api-abuse)
* [Tomada de conta](../attacks-vulns-list.md#api-abuse-account-takeover)
* [Rastreadores de segurança](../attacks-vulns-list.md#api-abuse-security-crawlers)
* [Raspagem](../attacks-vulns-list.md#api-abuse-scraping)

Durante a [configuração do perfil de abuso de API](../api-abuse-prevention/setup.md#creating-api-abuse-profile), você pode configurar o módulo **Prevenção de Abuso de API** para proteger contra todos os tipos de bots ou limitar a proteção apenas para ameaças específicas.

## Como funciona a Prevenção de Abuso de API?

O módulo **Prevenção de Abuso de API** usa o modelo complexo de detecção de bot que envolve métodos baseados em ML, bem como métodos de busca de anomalias estatísticas e matemáticas e casos de abuso direto. O módulo aprende por si mesmo o perfil de tráfego normal e identifica comportamento dramaticamente diferente como anomalias.

A Prevenção de Abuso de API usa vários detectores para identificar os bots maliciosos. O módulo fornece estatísticas sobre quais detectores estiveram envolvidos na marcação dos.

Os seguintes detectores podem estar envolvidos:

* **Intervalo de solicitação** analisando os intervalos de tempo entre solicitações consecutivas para encontrar falta de aleatoriedade, que é o sinal de comportamento de bot.
* **Unicidade da solicitação** analisando o número de endpoints únicos visitados durante uma sessão. Se um cliente visita consistentemente uma baixa porcentagem de endpoints únicos, como 10% ou menos, é provável que seja um bot em vez de um usuário humano.
* **Taxa de solicitação** analisando o número de solicitações feitas em um intervalo de tempo específico. Se um cliente de API faz consistentemente uma alta porcentagem de solicitações acima de um determinado limite, é provável que seja um bot em vez de um usuário humano.
* **Agente do usuário ruim** analisando os cabeçalhos `User-Agent` incluídos nas solicitações. Este detector verifica assinaturas específicas, incluindo aquelas pertencentes a rastreadores, raspadores e verificadores de segurança.
* **Navegador desatualizado** analisando o navegador e a plataforma usados nas solicitações. Se um cliente está usando um navegador ou plataforma desatualizado ou não compatível, é provável que seja um bot em vez de um usuário humano.
* **Pontuação de comportamento suspeito** analisando solicitações de API de lógica de negócios usuais e incomuns realizadas durante uma sessão.
* **Pontuação de lógica de negócios** analisando o uso de pontos finais de API críticos ou sensíveis dentro do contexto do comportamento de sua aplicação.
* **Amplo escopo** analisando a amplitude da atividade IP para identificar comportamentalmente bots semelhantes a rastreadores.

!!! info "Confiança"
    Como resultado do trabalho dos detectores, todos os bots [detectados] (../api-abuse-prevention/setup.md#exploring-blocked-malicious-bots-and-their-attacks) obtêm uma **porcentagem de confiança**: quão certos estamos de que este é um bot. Em cada tipo de bot, os detectores têm importância / número de votos diferentes. Assim, a porcentagem de confiança é os votos ganhos fora de todos os votos possíveis neste tipo de bot (fornecido por detectores que funcionaram).

![Estatísticas de prevenção de abuso de API](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

Se um ou vários detectores apontarem para [sinais de ataque de bot](#automated-threats-blocked-by-api-abuse-prevention), o módulo [denylists ou graylists](#reaction-to-malicious-bots) a fonte do tráfego de anomalia por 1 hora. Wallarm conta IPs de bot que foram negados e listados em cinza dentro de 30 dias e exibe quantos por cento essas quantidades aumentaram ou diminuíram em relação ao período de 30 dias anterior.

A solução observa profundamente as anomalias de tráfego antes de atribuí-las como ações de bot malicioso e bloquear suas origens. Como a coleta e análise de métricas levam algum tempo, o módulo não bloqueia bots maliciosos em tempo real uma vez que a primeira solicitação maliciosa se originou, mas reduz significativamente a atividade anormal em média.

## Ativando a Prevenção de Abuso de API

O módulo **Prevenção de Abuso de API** no estado desativado é fornecido com [todas as formas do nó Wallarm 4.2 e acima](../installation/supported-deployment-options.md) incluindo o nó CDN.

Para ativar a Prevenção de Abuso de API:

1. Verifique se seu tráfego é filtrado pelo nó Wallarm 4.2 ou posterior.
1. Certifique-se de que seu [plano de assinatura](subscription-plans.md#subscription-plans) inclui **Prevenção de Abuso de API**. Para alterar o plano de assinatura, envie um pedido para [sales@wallarm.com](mailto:sales@wallarm.com).
1. No Console Wallarm → **Prevenção de Abuso de API**, crie ou habilite pelo menos um [perfil de Abuso de API](../api-abuse-prevention/setup.md).

    !!! info "Acesso às configurações de Prevenção de Abuso de API"
        Apenas [administradores](../user-guides/settings/users.md#user-roles) da conta da empresa Wallarm podem acessar a seção **Prevenção de Abuso de API**. Entre em contato com o administrador se você não tiver esse acesso.

    ![Perfil de prevenção de abuso de API](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

## Tolerância

Você pode configurar com que rigidez os sinais de um bot malicioso são monitorados e, assim, controlar o número de detecções falsas positivas. Isso é definido com o parâmetro **Tolerância** dentro [perfis de Abuso de API](../api-abuse-prevention/setup.md#creating-api-abuse-profile).

Há três níveis disponíveis:

* **Baixa** tolerância a bots significa que MENOS bots acessam suas aplicações, mas isso pode bloquear algumas solicitações legítimas devido a falsos positivos.
* **Normal** a tolerância usa regras ótimas para evitar muitos falsos positivos e prevenir que a maioria das solicitações de bot malicioso cheguem às APIs.
* **Alta** tolerância a bots significa que MAIS bots acessam suas aplicações, mas nenhum pedido legítimo será descartado.

## Reação aos bots maliciosos

Você pode configurar a Prevenção de Abuso de API para reagir aos bots maliciosos de uma das seguintes maneiras:

* **Adicionar à lista de negação**: Wallarm [listará em negrito](../user-guides/ip-lists/denylist.md) os IPs dos bots pelo tempo selecionado (valor padrão é `Adicionar por um dia` - 24 horas) e bloqueará todo o tráfego que esses IPs produzem.
* **Adicionar à lista cinza**: Wallarm [listará em cinza](../user-guides/ip-lists/graylist.md) os IPs dos bots pelo tempo selecionado (o valor padrão é `Adicionar por um dia` - 24 horas) e bloqueará apenas as solicitações que se originam desses IPs e contêm os sinais dos seguintes ataques:

    * [Ataques de validação de entrada](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
    * [Ataques do tipo vpatch](../user-guides/rules/vpatch-rule.md)
    * [Ataques detectados com base em expressões regulares](../user-guides/rules/regex-rule.md)

* **Somente monitorar**: Wallarm exibirá a atividade do bot detectada na seção [**Eventos**](../user-guides/events/check-attack.md), mas não adicionará o IP do bot nem à lista de negação nem à lista cinza.

    A partir desses detalhes de eventos, você pode bloquear rapidamente o bot com o botão **Adicionar IP de origem à lista de negação**. O IP é adicionado à lista de negação para sempre, mas na seção **IP Lists** você pode excluí-lo ou alterar o tempo de permanência na lista.

## Explorando bots maliciosos e seus ataques

Você pode explorar a atividade dos bots na interface do usuário do Console Wallarm da seguinte maneira:

* Explore bots maliciosos na seção **Listas de IP**
* Veja o abuso de API realizado por bots na seção **Eventos**

[Aprenda como explorar a atividade dos bots →](../api-abuse-prevention/setup.md#exploring-blocked-malicious-bots-and-their-attacks)

## Lista de exceções

Uma lista de exceções é uma lista de endereços IP, sub-redes, locais e tipos de fonte que são conhecidos por estarem associados a bots ou rastreadores legítimos e, portanto, estão isentos de serem bloqueados ou restringidos pelo módulo de Prevenção de Abuso de API.

Você pode adicionar endereços IP à lista de exceções com antecedência ou se eles já foram erroneamente sinalizados como sendo associados à atividade de bot malicioso. [Aprenda como trabalhar com a lista de exceções →](../api-abuse-prevention/setup.md#working-with-exception-list)

![Prevenção de abuso de API - Lista de exceções](../images/about-wallarm-waf/abi-abuse-prevention/exception-list.png)

## Desativando a proteção de bot para URLs e solicitações específicas

Além de marcar bons IPs de bots via [lista de exceções](#exception-list), você pode desativar a proteção de bot tanto para URLs que os pedidos visam quanto para os tipos de solicitação específicos, por exemplo, para solicitações contendo cabeçalhos específicos.

Isso pode ajudar a evitar detecções de falsos positivos e também pode ser útil no caso de testar suas aplicações quando você pode precisar desativar temporariamente a proteção do bot para alguns de seus endpoints.

Observe que, comparado a outra configuração de Prevenção de Abuso de API, essa habilidade é configurada **não** dentro do [perfil](../api-abuse-prevention/setup.md) de Abuso de API, mas separadamente - com a ajuda da regra [**Definir modo de Prevenção de Abuso de API**](../user-guides/rules/api-abuse-url.md).
