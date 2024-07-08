# Painel de Descoberta API <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

O painel de **Descoberta API** da Wallarm resume dados sobre sua API coletados pelo módulo [Descoberta API](../../api-discovery/overview.md). Ele fornece uma visão abrangente do inventário da sua API com base nas métricas:

* Número de terminais por nível de risco
* Os terminais [mais arriscados](../../api-discovery/overview.md#endpoint-risk-score) entre todo o inventário de API e entre os terminais recém-descobertos nos últimos 7 dias

    Os terminais mais arriscados são os mais propensos a serem um alvo de ataque devido a vulnerabilidades ativas, terminais sendo [novos](../../api-discovery/overview.md#tracking-changes-in-api) ou [ocultos](../../api-discovery/overview.md#shadow-orphan-and-zombie-apis), e outros fatores de risco. Cada terminal arriscado é fornecido com o número de acertos direcionados.
            
* Mudanças na sua API nos últimos 7 dias por tipo (APIs novas, alteradas, não usadas)
* Número total de terminais descobertos e quantos deles são externos e internos
* Dados sensíveis na API por grupos (pessoal, financeiro, etc.) e por tipos
* Inventário da API: número de terminais pelo host da API e pelo aplicativo

![Widget de Descoberta API](../../images/user-guides/dashboard/api-discovery-widget.png)

O painel pode revelar anomalias, como terminais frequentemente usados arriscados ou alto volume de dados sensíveis que a sua API transfere. Além disso, ele chama a atenção para as mudanças na API que você sempre precisa verificar para excluir riscos de segurança. Isso ajuda a implementar controles de segurança para evitar que terminais sejam alvos de ataques.

Clique nos elementos do widget para ir à seção **Descoberta API** e visualizar os dados filtrados. Se clicar no número de hits, você será direcionado para a [lista de eventos](../events/check-attack.md) com os dados de ataque dos últimos 7 dias.