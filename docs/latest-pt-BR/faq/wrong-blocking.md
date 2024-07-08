# Solicitação legítima está sendo bloqueada

Se o seu usuário relatar que uma solicitação legítima está sendo bloqueada apesar das medidas do Wallarm, você pode revisar e avaliar suas solicitações conforme explicado neste artigo.

Para resolver o problema de uma solicitação legítima ser bloqueada pelo Wallarm, siga estas etapas:

1. Peça ao usuário para fornecer **em formato de texto** (não um print de tela) as informações relacionadas à solicitação bloqueada, que é uma das seguintes:

    * Informações fornecidas pela página de [bloqueio do Wallarm](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) se estiver configurada (pode incluir o endereço IP do usuário, UUID da solicitação e outros elementos pré-configurados).

        ![Página de bloqueio do Wallarm](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

        !!! aviso "Uso da página de bloqueio"
            Se você não usa a página de bloqueio padrão ou personalizada do Wallarm, é altamente recomendável [configurá-la](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) para obter informações adequadas do usuário. Lembre-se de que até mesmo uma página de exemplo coleta e permite a fácil cópia de informações significativas relacionadas à solicitação bloqueada. Além disso, você pode personalizar ou reconstruir completamente esta página para retornar aos usuários a mensagem informativa de bloqueio.
    
    * Cópia da solicitação e resposta do cliente do usuário. O código fonte da página do navegador ou a entrada e saída textual do cliente do terminal são adequados.

1. No Console Wallarm → seção [**Eventos**](../user-guides/events/check-attack.md), [pesquise](../user-guides/search-and-filters/use-search.md) pelo evento relacionado à solicitação bloqueada. Por exemplo, [pesquise por ID de solicitação](../user-guides/search-and-filters/use-search.md#search-by-request-identifier):

    ```
    ataques incidentes request_id:<requestId>
    ```

1. Examine o evento para determinar se indica um bloqueio errado ou legítimo.
1. Se for um bloqueio errado, resolva o problema aplicando uma ou uma combinação de medidas:

    * Medidas contra [falsos positivos](../user-guides/events/false-attack.md)
    * Reconfigurando [regras](../user-guides/rules/rules.md)
    * Reconfigurando [gatilhos](../user-guides/triggers/triggers.md)
    * Modificando [listas de IP](../user-guides/ip-lists/overview.md)

1. Se as informações inicialmente fornecidas pelo usuário forem incompletas ou você não tiver certeza sobre as medidas que podem ser aplicadas com segurança, compartilhe os detalhes com o [suporte do Wallarm](mailto:support@wallarm.com) para obter assistência e investigação adicionais.