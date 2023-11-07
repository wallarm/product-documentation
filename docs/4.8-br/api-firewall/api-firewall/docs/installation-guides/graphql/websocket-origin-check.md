# Validação de Origem WebSocket

Quando um navegador inicia uma conexão WebSocket, ele inclui automaticamente um cabeçalho `Origin` que indica o domínio de origem da solicitação. Com o Wallarm API Firewall, você pode garantir que o valor do cabeçalho `Origin` corresponde à sua lista predefinida durante a fase de atualização da conexão WebSocket. Este artigo descreve os passos para habilitar a validação `Origin` para [consultas GraphQL](docker-container.md).

Por padrão, o recurso de validação de origem WebSocket está desativado. Para ativá-lo, configure as seguintes variáveis de ambiente:

| Variável de ambiente | Descrição |
| -------------------- | ----------- |
| `APIFW_GRAPHQL_WS_CHECK_ORIGIN` | Habilita a validação do cabeçalho `Origin` durante a fase de atualização do WebSocket. Padrão: `false`. |
| `APIFW_GRAPHQL_WS_ORIGIN` (necessário se `APIFW_GRAPHQL_WS_CHECK_ORIGIN` for `true`) | A lista de origens permitidas para conexões WebSocket. As origens são separadas por `;`. |

A variável `APIFW_GRAPHQL_WS_CHECK_ORIGIN` opera independentemente de [`APIFW_GRAPHQL_REQUEST_VALIDATION`](docker-container.md#apifw-graphql-request-validation). Solicitações WebSocket com cabeçalhos `Origin` incorretos serão bloqueadas, independentemente do modo de validação de solicitação.