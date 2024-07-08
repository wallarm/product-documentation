[variability-in-endpoints-docs]:       ../../api-discovery/overview.md#variability-in-endpoints
[changes-in-api-docs]:       ../../api-discovery/exploring.md#tracking-changes-in-api
[bola-protection-for-endpoints-docs]:  ../../api-discovery/overview.md#automatic-bola-protection

# Configuração da proteção BOLA (IDOR)

Ataques comportamentais como [Autorização em Nível de Objeto Quebrado (BOLA)](../../attacks-vulns-list.md#broken-object-level-authorization-bola) exploram a vulnerabilidade de mesmo nome. Esta vulnerabilidade possibilita que um invasor acesse um objeto através de sua identificação via uma solicitação de API e leia ou modifique seus dados, contornando um mecanismo de autorização. Este artigo orienta você sobre como proteger suas aplicações contra ataques BOLA.

Por padrão, a Wallarm descobre automaticamente apenas as vulnerabilidades do tipo BOLA (também conhecida como IDOR), mas não detecta tentativas de exploração.

Com a Wallarm, você tem as seguintes opções para detectar e bloquear ataques BOLA:

* [Criação manual do gatilho **BOLA**](#criacao-manual-do-gatilho-BOLA)
* [Utilização do módulo de descoberta de API com a proteção automática BOLA - ativada através da interface do usuário do console Wallarm](#protecao-automatica-BOLA-para-endpoints-descobertos-pela-descoberto-de-API)

!!! Aviso "Restrições de proteção BOLA"
    Apenas o nó Wallarm 4.2 e superior suporta a detecção de ataques BOLA.

    O nó Wallarm 4.2 e superior analisa apenas as seguintes solicitações em busca de sinais de ataque BOLA:

    * Solicitações enviadas via protocolo HTTP.
    * Solicitações que não contêm sinais de outros tipos de ataque, por exemplo, as solicitações não são consideradas como um ataque BOLA se:

        * Essas solicitações contêm sinais de [ataques de validação de entrada](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks).
        * Essas solicitações coincidem com a expressão regular especificada na [regra **Criar indicador de ataque baseado em expressão regular**](../../user-guides/rules/regex-rule.md#adding-a-new-detection-rule).

## Requisitos

Para proteger os recursos contra ataques BOLA, certifique-se de que o seu ambiente cumpre os seguintes requisitos:

* Você tem o nó Wallarm 4.2 ou superior.
* Se o nó de filtragem estiver implantado atrás de um servidor proxy ou balanceador de carga, [configure](../using-proxy-or-balancer-en.md) a exibição dos endereços IP reais dos clientes.

## Criação manual do gatilho BOLA

Para o nó Wallarm identificar os ataques BOLA:

1. Abra o console Wallarm → **Gatilhos** e proceda à configuração do gatilho **BOLA**.
1. Defina as condições para definir as solicitações como um ataque BOLA:

    * O número de **Solicitações do mesmo IP** para um determinado período de tempo.
    * **URI** para ser protegido contra ataques BOLA e receber o número especificado de solicitações. O valor deve ser um endpoint da API apontando para um objeto por seu identificador, pois este tipo de endpoint é potencialmente vulnerável a ataques BOLA.

        Para especificar o parâmetro PATH que identifica um objeto, utilize o símbolo `*`, exemplo:

        ```bash
        example.com/lojas/*/informacoes_financeiras
        ```

        O URI pode ser configurado através do [construtor de URI](../../user-guides/rules/rules.md#uri-constructor) ou [formulário de edição avançada](../../user-guides/rules/rules.md#advanced-edit-form) na janela de criação de gatilho.

    * (Opcional) [**Aplicação**](../../user-guides/settings/applications.md) para ser protegida contra ataques BOLA e receber o número especificado de solicitações.

        Se você usa o mesmo nome para vários domínios, este filtro é recomendado para apontar para a aplicação a qual o domínio no filtro **URI** está atribuído.

    * (Opcional) Um ou mais **IPs** originando as solicitações.
1. Selecione reações aos gatilhos:

    * **Marcar como BOLA**. Solicitações que ultrapassam o limite são marcadas como um ataque BOLA e exibidas na seção **Eventos** do console Wallarm. O nó Wallarm NÃO bloqueia estas solicitações maliciosas.
    * [**Bloquear endereço de IP**](../../user-guides/ip-lists/denylist.md) originando solicitações maliciosas e o período de bloqueio.
    
        O nó Wallarm bloqueará as solicitações tanto legítimas quanto maliciosas (inclusive ataques BOLA) originadas do IP bloqueado.
    
    * [**Lista de IPs em estado de alerta**](../../user-guides/ip-lists/graylist.md) originando solicitações maliciosas e o período de bloqueio.
    
        O nó Wallarm bloqueará solicitações originadas de IPs em estado de alerta somente se contiverem indícios de [validação de entrada](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [o `vpatch`](../../user-guides/rules/vpatch-rule.md) ou [sinais de ataque personalizados](../../user-guides/rules/regex-rule.md).
        
        !!! informação "Ataques BOLA originados de IPs em estado de alerta"
            Ataques BOLA originados de IPs em estado de alerta não são bloqueados.
1. Salve o gatilho e aguarde a [conclusão da sincronização entre o Cloud e o nó](../configure-cloud-node-synchronization-en.md) (geralmente leva de 2 a 4 minutos).

Exemplo do gatilho para detectar e bloquear ataques BOLA direcionados aos dados financeiros da loja (o endpoint da API é `https://example.com/lojas/{id_loja}/informacoes_financeiras`):

![Gatilho BOLA](../../images/user-guides/triggers/trigger-example7.png)

Você pode configurar vários gatilhos com diferentes filtros para a proteção BOLA.

## Proteção automática BOLA para endpoints descobertos pelo recurso de Descoberta de API <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

A proteção automática BOLA está disponível se você utilizar o módulo **[Descoberta de API](../../api-discovery/overview.md)**.

Para habilitar a autoproteção, vá para o console Wallarm → **Proteção BOLA** e ative a opção:

![Gatilho BOLA](../../images/user-guides/bola-protection/trigger-enabled-state.png)

--8<-- "../include-pt-BR/waf/features/bola-mitigation/bola-auto-mitigation-logic.md"

A seção **Proteção BOLA** da interface do usuário permite que você ajuste o comportamento padrão da Wallarm (incluindo o bloqueio de ataques BOLA) [editando o modelo de autodetecção BOLA](../../user-guides/bola-protection.md).

## Testando a configuração da proteção BOLA

1. Envie o número de solicitações que excede o limite configurado para o URI protegido. Por exemplo, 50 solicitações com diferentes valores de `{id_loja}` para o endpoint `https://example.com/lojas/{id_loja}/informacoes_financeiras`:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/lojas/$i/informacoes_financeiras ; done
    ```
1. Se a reação ao gatilho for **Bloquear o endereço de IP**, abra Wallarm Console → **Listas de IPs** → **Lista de bloqueios** e verifique se o endereço de IP fonte está bloqueado.

    Se a reação ao gatilho for **Lista de IPs em estado de alerta**, verifique a seção **Listas de IPs** → **Lista de Alerta** do Console Wallarm.
1. Abra a seção **Eventos** e verifique se as solicitações estão exibidas na lista como um ataque BOLA.

    ![Ataque BOLA na interface do usuário](../../images/user-guides/events/bola-attack.png)

    O número de solicitações exibidas corresponde ao número de solicitações enviadas após ter excedido o limite do gatilho ([mais detalhes sobre a detecção de ataques comportamentais](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). Se este número for superior a 5, a amostragem de solicitações é aplicada e os detalhes da solicitação são exibidos apenas para os 5 primeiros hits ([mais detalhes sobre a amostragem das solicitações](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    Para buscar ataques BOLA, você pode utilizar a tag de busca `bola`. Todos os filtros estão descritos nas [instruções sobre o uso de pesquisa](../../user-guides/search-and-filters/use-search.md).