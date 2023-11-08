# Construção e descarregamento de um conjunto de regras personalizado

Um conjunto de regras personalizado define as especificidades do processamento do tráfego de cliente particular (por exemplo, permite a configuração de regras personalizadas para detecção de ataques ou mascaramento de dados sensíveis). O nó Wallarm se baseia no conjunto de regras personalizado durante a análise de solicitações recebidas.

As alterações das regras personalizadas NÃO entram em vigor imediatamente. As alterações são aplicadas ao processo de análise de solicitação somente após a **construção** do conjunto de regras personalizado e o **descarregamento para o nó de filtragem** estarem concluídos.

## Construção de um conjunto de regras personalizado

Adicionar uma nova regra, excluir ou alterar regras existentes no Console Wallarm → **Regras** inicia a construção de um conjunto de regras personalizado. Durante o processo de construção, as regras são otimizadas e compiladas em um formato adotado para o nó de filtragem. O processo de construção de um conjunto de regras personalizado geralmente leva de alguns segundos para um pequeno número de regras a até uma hora para árvores de regras complexas.

O status de construção do conjunto de regras personalizado e o tempo de conclusão esperado são exibidos no Console Wallarm. Se não houver construção em andamento, a interface exibe a data da última construção concluída.

![Status de construção](../../images/user-guides/rules/build-rules-status.png)

## Descarregando um conjunto de regras personalizado para o nó de filtragem

A construção do conjunto de regras personalizado é descarregada para o nó de filtragem durante a sincronização do nó de filtragem e da nuvem Wallarm. Por padrão, a sincronização do nó de filtragem e da nuvem Wallarm é lançada a cada 2-4 minutos. [Mais detalhes sobre a configuração de sincronização do nó de filtragem e da nuvem Wallarm →](../../admin-en/configure-cloud-node-synchronization-en.md)

O status do descarregamento de um conjunto de regras personalizado para o nó de filtragem é registrado no arquivo `/var/log/wallarm/syncnode.log`.

Todos os nós Wallarm conectados à mesma conta Wallarm recebem o mesmo conjunto de regras padrão e personalizadas para filtragem de tráfego. Você ainda pode aplicar regras diferentes para diferentes aplicativos usando os IDs de aplicação apropriados ou parâmetros de solicitação HTTP exclusivos, como cabeçalhos, parâmetros de string de consulta, etc.