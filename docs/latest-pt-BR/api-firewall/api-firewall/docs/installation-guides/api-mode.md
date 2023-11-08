# Validando Solicitações Individuais Sem Proxy

Se você precisa validar solicitações de API individuais com base em uma especificação OpenAPI fornecida, sem mais proxy, você pode utilizar o Wallarm API Firewall em um modo não-proxy. Nesse caso, a solução não valida as respostas.

!!! info "Disponibilidade do recurso"
    Este recurso está disponível para as versões 0.6.12 e posteriores do API Firewall, e é personalizado para a REST API.

Para fazer isso:

1. Em vez de [montar o arquivo de especificação OpenAPI](../installation-guides/docker-container.md) no contêiner, monte o [banco de dados SQLite](https://www.sqlite.org/index.html) contendo uma ou mais especificações OpenAPI 3.0 em `/var/lib/wallarm-api/1/wallarm_api.db`. O banco de dados deve aderir ao seguinte esquema:

    * `schema_id`, inteiro (auto-incremento) - ID da especificação.
    * `schema_version`, string - Versão da especificação. Você pode atribuir qualquer versão preferida. Quando este campo muda, o API Firewall presume que a especificação em si mudou e a atualiza de acordo.
    * `schema_format`, string - O formato da especificação, pode ser `json` ou `ya
    * `schema_content`, string - O conteúdo da especificação.
1. Execute o contêiner com a variável de ambiente `APIFW_MODE=API` e, se necessário, com outras variáveis projetadas especificamente para este modo:

    | Variável de ambiente | Descrição |
    | -------------------- | ----------- |
    | `APIFW_MODE` | Define o modo geral do API Firewall. Os valores possíveis são [`PROXY`](docker-container.md) (padrão), [`graphql`](graphql/docker-container.md) e `API`. |
    | `APIFW_SPECIFICATION_UPDATE_PERIOD` | Determina a frequência das atualizações da especificação. Se definido como `0`, a atualização da especificação está desativada. O valor padrão é `1m` (1 minuto). |
    | `APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION` | Especifica se deve retornar um código de erro se os parâmetros da solicitação não corresponderem aos definidos na especificação. O valor padrão é `true`. |
    | `APIFW_PASS_OPTIONS` | Quando definido como `true`, o API Firewall permite solicitações `OPTIONS` para endpoints na especificação, mesmo se o método `OPTIONS` não for descrito. O valor padrão é `false`. |

1. Ao avaliar se as solicitações estão alinhadas com as especificações montadas, inclua o cabeçalho `X-Wallarm-Schema-ID: <schema_id>` para indicar ao API Firewall qual especificação deve ser usada para validação.

O API Firewall valida solicitações da seguinte maneira:

* Se uma solicitação corresponder à especificação, uma resposta vazia com um código de status 200 é retornada.
* Se uma solicitação não corresponder à especificação, a resposta fornecerá um código de status 403 e um documento JSON explicando as razões da incompatibilidade.
* Se for incapaz de lidar ou validar uma solicitação, uma resposta vazia com um código de status 500 é retornada.