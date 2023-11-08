# Bloqueando Solicitações com Tokens Comprometidos

O Wallarm API Firewall oferece um recurso para prevenir o uso de tokens de autenticação vazados. Este guia descreve como habilitar este recurso usando o contêiner Docker do Firewall API para [REST API](../installation-guides/docker-container.md) ou [GraphQL API](../installation-guides/graphql/docker-container.md).

Essa capacidade depende dos dados fornecidos por você sobre tokens comprometidos. Para ativá-la, monte um arquivo .txt contendo esses tokens para o contêiner Docker de firewall, e depois defina a variável de ambiente correspondente. Para uma visão mais aprofundada deste recurso, leia nossa [postagem do blog](https://lab.wallarm.com/oss-api-firewall-unveils-new-feature-blacklist-for-compromised-api-tokens-and-cookies/).

Para REST API, caso algum dos tokens sinalizados apareça em uma solicitação, o Firewall API responderá utilizando o código de status especificado na variável de ambiente [`APIFW_CUSTOM_BLOCK_STATUS_CODE`](../installation-guides/docker-container.md#apifw-custom-block-status-code). Para a API GraphQL, qualquer solicitação contendo um token sinalizado será bloqueada, mesmo que esteja de acordo com o esquema montado.

Para habilitar o recurso de lista de negações:

1. Redija um arquivo .txt com os tokens comprometidos. Cada token deve estar em uma nova linha. Aqui está um exemplo:

    ```txt
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODIifQ.CUq8iJ_LUzQMfDTvArpz6jUyK0Qyn7jZ9WCqE0xKTCA
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODMifQ.BinZ4AcJp_SQz-iFfgKOKPz_jWjEgiVTb9cS8PP4BI0
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZDk5OTk5ODQifQ.j5Iea7KGm7GqjMGBuEZc2akTIoByUaQc5SSX7w_qjY8
    ```
1. Monte o arquivo da lista de negações no contêiner Docker do firewall. Por exemplo, no seu `docker-compose.yaml`, faça a seguinte modificação:

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_LEAKED_TOKEN_FILE>:<CONTAINER_PATH_TO_LEAKED_TOKEN_FILE>
    ...
    ```
1. Insira as seguintes variáveis de ambiente ao iniciar o contêiner Docker:

| Variável de ambiente | Descrição |
| -------------------- | ----------- |
| `APIFW_DENYLIST_TOKENS_FILE` | Caminho no recipiente para o arquivo de negação montado. Exemplo: `/auth-data/tokens-denylist.txt`. |
| `APIFW_DENYLIST_TOKENS_COOKIE_NAME` | Nome do Cookie que carrega o token de autenticação. |
| `APIFW_DENYLIST_TOKENS_HEADER_NAME` | Nome do Cabeçalho transmitindo o token de autenticação. Se ambos os `APIFW_DENYLIST_TOKENS_COOKIE_NAME` e `APIFW_DENYLIST_TOKENS_HEADER_NAME` forem especificados, o Firewall API verifica ambos em sequência. |
| `APIFW_DENYLIST_TOKENS_TRIM_BEARER_PREFIX` | Indica se o prefixo `Bearer` deve ser removido do cabeçalho de autenticação durante a comparação com a lista de negações. Se os tokens na lista de negações não possuírem este prefixo, mas o cabeçalho de autenticação possuir, os tokens podem não ser correspondidos corretamente. Aceita `true` ou `false` (padrão). |