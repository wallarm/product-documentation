# Validando Tokens de Autenticação de Requisição

Ao aproveitar o OAuth 2.0 para autenticação, o Firewall da API pode ser configurado para validar tokens de acesso antes de direcionar as solicitações para o servidor de aplicativo. O Firewall espera o token de acesso no cabeçalho de solicitação `Authorization: Bearer`.

O Firewall da API considera o token válido se os escopos definidos na [especificação](https://swagger.io/docs/specification/authentication/oauth2/) e nas informações de metadados do token forem os mesmos. Se o valor de `APIFW_REQUEST_VALIDATION` for `BLOCK`, o Firewall da API bloqueia solicitações com tokens inválidos. No modo `LOG_ONLY`, solicitações com tokens inválidos são apenas registradas.

!!! info "Disponibilidade do recurso"
    Este recurso está disponível apenas ao executar o Firewall da API para filtragem de solicitação [REST API](../installation-guides/docker-container.md).

Para configurar o fluxo de validação do token OAuth 2.0, use as seguintes variáveis ​​de ambiente:

| Variável de ambiente | Descrição |
| -------------------- | ----------- |
| `APIFW_SERVER_OAUTH_VALIDATION_TYPE` | O tipo de validação do token de autenticação:<ul><li>`JWT` se estiver usando JWT para autenticação de solicitação. Configure mais detalhes por meio das variáveis `APIFW_SERVER_OAUTH_JWT_*`.</li><li>`INTROSPECTION` se estiver usando outros tipos de token que podem ser validados pelo serviço específico de introspecção de token. Configure mais detalhes por meio das variáveis `APIFW_SERVER_OAUTH_INTROSPECTION_*`.</li></ul> |
| `APIFW_SERVER_OAUTH_JWT_SIGNATURE_ALGORITHM` | O algoritmo usado para assinar JWTs: `RS256`, `RS384`, `RS512`, `HS256`, `HS384` ou `HS512`.<br><br>JWTs assinados usando o algoritmo `ECDSA` não podem ser validados pelo Firewall da API. |
| `APIFW_SERVER_OAUTH_JWT_PUB_CERT_FILE` | Se os JWTs forem assinados usando o algoritmo RS256, RS384 ou RS512, o caminho para o arquivo com a chave pública RSA (`*.pem`). Este arquivo deve ser montado no contêiner Docker do Firewall da API. |
| `APIFW_SERVER_OAUTH_JWT_SECRET_KEY` | Se os JWTs forem assinados usando o algoritmo HS256, HS384 ou HS512, o valor da chave secreta usado para assinar os JWTs. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT` | [Endpoint de introspecção de token](https://www.oauth.com/oauth2-servers/token-introspection-endpoint/). Exemplos de endpoints:<ul><li>`https://www.googleapis.com/oauth2/v1/tokeninfo` se estiver usando o Google OAuth</li><li>`http://example.com/restv1/introspection` para tokens OAuth 2.0 do Gluu</li></ul> |
| `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD` | O método das solicitações ao endpoint de introspecção de token. Pode ser `GET` ou `POST`.<br><br>O valor padrão é `GET`. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_TOKEN_PARAM_NAME` | O nome do parâmetro com o valor do token nas solicitações ao endpoint de introspecção. Dependendo do valor do `APIFW_SERVER_OAUTH_INTROSPECTION_ENDPOINT_METHOD`, o Firewall da API considera automaticamente o parâmetro como parâmetro de consulta ou corpo. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_CLIENT_AUTH_BEARER_TOKEN` | O valor do token Bearer para autenticar as solicitações ao endpoint de introspecção. |
| <a name="apifw-server-oauth-introspection-content-type"></a>`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE` | O valor do cabeçalho `Content-Type` indicando o tipo de mídia do serviço de introspecção de token. O valor padrão é `application/octet-stream`. |
| `APIFW_SERVER_OAUTH_INTROSPECTION_REFRESH_INTERVAL` | Tempo de vida dos metadados do token armazenados em cache. O Firewall da API armazena em cache os metadados do token e, se receber solicitações com os mesmos tokens, obtém seus metadados do cache.<br><br>O intervalo pode ser definido em horas (`h`), minutos (`m`), segundos (`s`) ou no formato combinado (por exemplo, `1h10m50s`).<br><br>O valor padrão é `10m` (10 minutos).  |