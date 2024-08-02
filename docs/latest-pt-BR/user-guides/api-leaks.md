# Gerenciando vazamentos de API 

O módulo **API Leaks** verifica ativamente milhares de repositórios públicos e fontes em busca de vazamentos de tokens de API, e permite que você bloqueie qualquer token vazado para prevenir ataques ou outros danos ao seu portfólio de API. Este artigo proporciona informações sobre como gerenciar os vazamentos de API.

Para um resumo básico das capacidades, por favor, consulte a visão geral do módulo **API Leaks** [aqui](../api-attack-surface/api-leaks.md).

## Acessando API Leaks

No console Wallarm, use a seção **API Leaks** para trabalhar conforme descrito abaixo.

* Para ativar o módulo **API Leaks**, por favor, envie uma solicitação para o [suporte técnico da Wallarm](mailto:support@wallarm.com).
* Apenas usuários com a função de **Administrador** ou **Administrador Global** [aqui](../user-guides/settings/users.md#user-roles) podem acessar esta seção e gerenciar vazamentos.
* Usuários com a função de **Analista** ou **Analista Global** podem acessar esta seção, mas não podem gerenciar vazamentos.

## Novos vazamentos de API

Existem duas maneiras de registrar novos vazamentos:

* Automático - Wallarm verifica ativamente milhares de repositórios públicos e fontes e adiciona novos vazamentos à lista. Organize por **Status** e veja vazamentos `Abertos` - eles requerem sua atenção.
* Manual - adicione vazamentos de API manualmente. Cada um representa um conjunto de tokens vazados.

![API Leaks - Adicionando Manualmente](../images/api-attack-surface/api-leaks-add-manually.png)

## Visualização interativa

A seção **API Leaks** fornece uma rica representação visual para a sua situação atual com relação aos vazamentos de API encontrados. Use os gráficos para analisar rapidamente a situação atual com os vazamentos encontrados, clique nos elementos do diagrama para filtrar vazamentos por níveis de risco e fontes.

![API Leaks - Visualização](../images/api-attack-surface/api-leaks-visual.png)

## Tomando decisões

Independentemente de como o vazamento de API foi adicionado - automaticamente ou manualmente - a decisão sobre o que fazer é sempre sua. Você pode gerenciar essas decisões da seguinte maneira:

* Aplique um patch virtual para bloquear todas as tentativas de uso de tokens vazados.

    Uma [regra de patch virtual](../user-guides/rules/vpatch-rule.md) será criada.

* Marque o vazamento como falso se você achar que foi adicionado por engano.
* Feche vazamentos para interromper a proteção assim que todos os tokens vazados forem regenerados ou removidos. Isso removerá a regra de patch virtual.
* Mesmo que um vazamento seja fechado, ele não é excluído. Reabra e então aplique a remediação para iniciar a proteção novamente.

## Tentativas de uso de tokens vazados

No Console Wallarm → **Eventos**, ajuste o filtro **Tipo** para `Patch virtual` (`vpatch`) para ver todas as tentativas de uso de tokens vazados.

![Eventos - Vazamentos de API via vpatch](../images/api-attack-surface/api-leaks-in-events.png)

Por enquanto, você só pode rastrear as tentativas de uso de tokens vazados se o `vpatch` for aplicado.