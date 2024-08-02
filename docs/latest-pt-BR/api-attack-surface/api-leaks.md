# Remediação de Vazamentos de API

O módulo **Vazamentos de API** da plataforma Wallarm verifica ativamente milhares de repositórios e fontes públicas para verificar vazamentos de tokens de API e permitir que você bloqueie o uso das credenciais vazadas por meio do [nó(s)](../installation/supported-deployment-options.md) Wallarm implantado(s). Este artigo apresenta uma visão geral dos Vazamentos de API: problemas tratados por ele, seu propósito e principais possibilidades.

Para informações sobre como usar o módulo **Vazamentos de API**, consulte o respectivo [guia do usuário](../user-guides/api-leaks.md).

![Vazamentos de API](../images/api-attack-surface/api-leaks.png)

## Problemas abordados pelos Vazamentos de API

Sua organização pode usar vários tokens de API para fornecer acesso às diferentes partes da sua API. Se esses tokens vazarem, eles se tornam uma ameaça à segurança.

Para proteger suas APIs, você precisa monitorar repositórios públicos para encontrar tokens de API vazados, sem perder um único exemplo - caso contrário, você ainda está em risco. Para isso, você tem que analisar constantemente uma enorme quantidade de dados, uma e outra vez.

Se segredos de API vazados forem encontrados, é necessária uma resposta multifacetada para evitar danos às suas APIs. Isso envolve encontrar todos os locais onde os segredos vazados são usados, regenerá-los em todos esses lugares e bloquear o uso das versões comprometidas - e isso deve ser feito rapidamente e com 100% de completude. Isso é difícil de realizar manualmente.

O módulo **Vazamentos de API** do Wallarm ajuda a resolver esses problemas fornecendo o seguinte:

* Detecção automática de vazamento de tokens de API de recursos públicos e registro de vazamentos detectados na UI do Console Wallarm.
* Detecção do nível de risco.
* Capacidade de adicionar vazamentos manualmente.
* Capacidade de tomar suas próprias decisões sobre como os problemas de dados vazados devem ser remediados em cada caso.

## Visualização dos vazamentos encontrados

A seção **Vazamentos de API** fornece uma rica representação visual para sua situação atual em relação aos vazamentos de API encontrados. Esta representação é interativa: você pode clicar em elementos do diagrama para filtrar vazamentos por níveis de risco e fontes.

![Vazamentos de API - Visualização](../images/api-attack-surface/api-leaks-visual.png)

## Acesso a Vazamentos de API

* Para a mitigação da ameaça de tokens de API vazados, o [nó(s)](../user-guides/nodes/nodes.md) do Wallarm deve ser implantado.
* Por padrão, o módulo de Vazamentos de API está desativado. Para obter acesso ao módulo, envie uma solicitação para o [suporte técnico da Wallarm](mailto:support@wallarm.com).
