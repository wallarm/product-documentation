# Registro de Mudanças do API Firewall

Esta página descreve novas versões do API Firewall da Wallarm.

## v0.6.13 (2023-09-08)

* [Suporte para validação de solicitações de API GraphQL](installation-guides/graphql/docker-container.md)

## v0.6.12 (2023-08-04)

* Capacidade de definir o modo geral do API Firewall usando a variável de ambiente `APIFW_MODE`. O valor padrão é `PROXY`. Quando definido para API, você pode [validar solicitações de API individuais com base em uma especificação OpenAPI fornecida sem mais proxy](installation-guides/api-mode.md).
* Introduziu a capacidade de permitir solicitações `OPTIONS` para endpoints especificados no OpenAPI, mesmo que o método `OPTIONS` não seja explicitamente definido. Isso pode ser alcançado usando a variável `APIFW_PASS_OPTIONS`. O valor padrão é `false`.
* Introduziu um recurso que permite controlar se as solicitações devem ser identificadas como não correspondendo à especificação se seus parâmetros não estiverem alinhados com os descritos na especificação OpenAPI. Está definido como `true` por padrão.

    Isso pode ser controlado por meio da variável `APIFW_SHADOW_API_UNKNOWN_PARAMETERS_DETECTION` no modo `PROXY` e por meio da variável `APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION` no modo `API`.
* O novo modo de nível de log `TRACE` para registrar solicitações recebidas e respostas do API Firewall, incluindo seu conteúdo. Este nível pode ser definido usando a variável de ambiente `APIFW_LOG_LEVEL`.
* Atualizações de dependências
* Correção de erros

## v0.6.11 (2023-02-10)

* Adicione a variável de ambiente `APIFW_SERVER_DELETE_ACCEPT_ENCODING`. Se estiver definido como `true`, o cabeçalho `Accept-Encoding` é excluído das solicitações com proxy. O valor padrão é `false`.
* https://github.com/wallarm/api-firewall/issues/56
* https://github.com/wallarm/api-firewall/issues/57
* Adicione descompressão para o corpo da solicitação e o corpo da resposta

## v0.6.10 (2022-12-15)

* https://github.com/wallarm/api-firewall/issues/54
* Atualizar dependências

## v0.6.9 (2022-09-12)

* Atualização do Go para 1.19
* Atualizar outras dependências
* Corrigir bugs da detecção de API Shadow e processamento de denylist
* Excluir o cabeçalho `Apifw-Request-Id` das respostas retornadas pelo API Firewall
* Adicione compatibilidade do objeto Ingress com o Kubernetes 1.22
* Encerre o registro de solicitações de entrada correspondentes à especificação da API no nível de log INFO

## v0.6.8 (2022-04-11)

### Novos recursos

* Capacidade de especificar o endereço URL da especificação OpenAPI 3.0 em vez de montar o arquivo de especificação no contêiner Docker (por meio da variável de ambiente [`APIFW_API_SPECS`](installation-guides/docker-container.md#apifw-api-specs)).
* Capacidade de usar o cabeçalho `Content-Type` personalizado ao enviar solicitações para o serviço de introspecção de token (por meio da variável de ambiente [`APIFW_SERVER_OAUTH_INTROSPECTION_CONTENT_TYPE`](configuration-guides/validate-tokens.md)).
* [Suporte para a denylists de tokens de autenticação](configuration-guides/denylist-leaked-tokens.md).

## v0.6.7 (2022-01-25)

O API Firewall da Wallarm agora é de código aberto. Existem as seguintes alterações relacionadas nesta [versão](https://github.com/wallarm/api-firewall/releases/tag/v0.6.7):

* O código fonte do API Firewall e a licença de código aberto relacionada são publicados
* Fluxo de trabalho do GitHub para construção de binário, gráfico Helm e imagem Docker é implementado

## v0.6.6 (2021-12-09)

### Novos recursos

* Suporte para [validação de token OAuth 2.0](configuration-guides/validate-tokens.md).
* [Conexão](configuration-guides/ssl-tls.md) aos servidores assinados com os certificados CA personalizados e suporte para a flag de conexão insegura.

### Correções de erros

* https://github.com/wallarm/api-firewall/issues/27

## v0.6.5 (2021-10-12)

### Novos recursos

* Configuração do número máximo de clientes fasthttp (por meio da variável de ambiente `APIFW_SERVER_CLIENT_POOL_CAPACITY`).
* Verificação de saúde na porta 9667 do contêiner API Firewall (a porta pode ser alterada por meio da variável de ambiente `APIFW_HEALTH_HOST`).

[Instruções sobre a execução do API Firewall com novas variáveis de ambiente](installation-guides/docker-container.md)

### Correções de erros

* https://github.com/wallarm/api-firewall/issues/15
* Alguns outros bugs

## v0.6.4 (2021-08-18)

### Novos recursos

* Adicionada monitoramento para endpoints de API Shadow. O API Firewall funcionando no modo `LOG_ONLY` para ambas as solicitações e respostas marca todos os endpoints que não estão incluídos na especificação e que estão retornando o código diferente de `404` como sombra. Você pode excluir códigos de resposta indicando endpoints sombra usando a variável de ambiente `APIFW_SHADOW_API_EXCLUDE_LIST`.
* Configuração do código de status de resposta HTTP retornado pelo API Firewall para solicitações bloqueadas (por meio da variável de ambiente `APIFW_CUSTOM_BLOCK_STATUS_CODE`).
* Capacidade de retornar o cabeçalho contendo o motivo do bloqueio da solicitação (por meio da variável de ambiente `APIFW_ADD_VALIDATION_STATUS_HEADER`). Este recurso é **experimental**.
* Configuração do formato de log do API Firewall (por meio da variável de ambiente `APIFW_LOG_FORMAT`).

[Instruções sobre a execução do API Firewall com novas variáveis de ambiente](installation-guides/docker-container.md)

### Otimizações

* Validação otimizada da especificação OpenAPI 3.0 devido ao parser `fastjson` adicionado.
* Adicionado suporte para fasthttp.

## v0.6.2 (2021-06-22)

* O primeiro lançamento!