# Firewall de API de Código Aberto da Wallarm [![Black Hat Arsenal USA 2022](https://github.com/wallarm/api-firewall/blob/main/images/BHA2022.svg?raw=true)](https://www.blackhat.com/us-22/arsenal/schedule/index.html#open-source-api-firewall-new-features--functionalities-28038)

O Firewall de API é um proxy de alto desempenho com validação de solicitação e resposta de API baseada nos esquemas [OpenAPI](https://wallarm.github.io/api-firewall/installation-guides/docker-container/) e [GraphQL](https://wallarm.github.io/api-firewall/installation-guides/graphql/docker-container/). Ele foi projetado para proteger endpoints da API REST e GraphQL em ambientes nativos da nuvem. O Firewall de API fornece proteção da API com o uso de um modelo de segurança positivo permitindo chamadas que correspondem a uma especificação de API predefinida para solicitações e respostas, rejeitando todo o resto.

Os **principais recursos** do API Firewall são:

* Garantir a segurança dos endpoints de API REST e GraphQL bloqueando solicitações maliciosas
* Evitar violações de dados da API bloqueando respostas de API malformadas
* Descobrir endpoints de Shadow API
* Validar tokens de acesso JWT para autenticação baseada no protocolo OAuth 2.0
* Negar listas de tokens de API comprometidos, chaves e Cookies

O produto é **open source**, disponível no DockerHub e já obteve 1 bilhão (!!!) de pulls. Para apoiar este projeto, você pode dar uma estrela para o [repositório](https://hub.docker.com/r/wallarm/api-firewall).

## Modos de operação

Firewall de API da Wallarm oferece vários modos de operação:

* [`PROXY`](https://wallarm.github.io/api-firewall/installation-guides/docker-container/): valida solicitações e respostas HTTP contra OpenAPI 3.0 e proxy de solicitações correspondentes para o backend.
* [`API`](https://wallarm.github.io/api-firewall/installation-guides/api-mode/): valida solicitações individuais contra OpenAPI 3.0 sem mais proxy.
* [`graphql`](https://wallarm.github.io/api-firewall/installation-guides/graphql/docker-container/): valida solicitações HTTP e WebSocket contra o esquema GraphQL e o proxy de solicitações correspondentes para o backend.

## Casos de uso

### Rodando no modo de bloqueio

* Bloquear solicitações maliciosas que não correspondem à especificação
* Blocar respostas de API malformadas para parar violações de dados e exposição de informações sensíveis

### Rodando no modo de monitoramento

* Descobrir APIs Sombra e endpoints de API não documentados
* Registrar solicitações e respostas malformadas que não correspondem à especificação

## Validação do esquema da API e modelo de segurança positivo

Ao iniciar o Firewall de API, você deve fornecer a especificação REST ou da API GraphQL do aplicativo a ser protegido com o Firewall de API. O Firewall de API iniciado operará como um proxy reverso e validará se as solicitações e respostas correspondem ao esquema definido na especificação.

O tráfego que não corresponde ao esquema será registrado usando os [serviços `STDOUT` e `STDERR` Docker](https://docs.docker.com/config/containers/logging/) ou bloqueado (dependendo do modo de operação do Firewall de API configurado). Ao operar no modo de registro na API REST, o Firewall da API também registra os chamados endpoints da shadow API, aqueles que não estão cobertos na especificação da API, mas respondem às solicitações (exceto para endpoints que retornam o código `404`).

![Esquema do Firewall de API](https://github.com/wallarm/api-firewall/blob/main/images/Firewall%20opensource%20-%20vertical.gif?raw=true)

Permitindo que você defina os requisitos de tráfego com a especificação da API, o Firewall de API depende de um modelo de segurança positivo.

## Dados técnicos

[Firewall de API funciona](https://www.wallarm.com/what/the-concept-of-a-firewall) como um proxy reverso com um validador de solicitação e resposta OpenAPI 3.0 ou GraphQL incorporado. Ele é escrito em Golang e usando o proxy fasthttp. O projeto é otimizado para desempenho extremo e latência adicionada próxima a zero.

## Inicializando o Firewall de API

Para baixar, instalar e iniciar o Firewall de API no Docker, consulte:

* [Guia da API REST](https://wallarm.github.io/api-firewall/installation-guides/docker-container/)
* [Guia da API GraphQL](https://wallarm.github.io/api-firewall/installation-guides/graphql/docker-container/)

## Demos

Você pode testar o Firewall da API executando o ambiente de demonstração que implanta um aplicativo de exemplo protegido com o Firewall de API. Existem dois ambientes de demonstração disponíveis:

* [Demonstração do Firewall de API com Docker Compose](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose)
* [Demonstração do Firewall de API com Kubernetes](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes)

## Artigos do blog da Wallarm relacionados ao Firewall de API

* [Descobrindo APIs Sombra com o Firewall de API](https://lab.wallarm.com/discovering-shadow-apis-with-a-api-firewall/)
* [Firewall de API da Wallarm supera o NGINX em um ambiente de produção](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/)
* [Garantindo APIs REST gratuitamente com OSS APIFW](https://lab.wallarm.com/securing-rest-with-free-api-firewall-how-to-guide/)

## Desempenho

Ao criar o Firewall de API, priorizamos velocidade e eficiência para garantir que nossos clientes teriam as APIs mais rápidas possíveis. Nossos últimos testes demonstram que o tempo médio necessário para o Firewall de API processar uma solicitação é 1.339 ms, que é 66% mais rápido que o Nginx:

```
Firewall de API 0.6.2 com validação JSON

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1:8282/test/signup

Pedidos por segundo:    13005.81 [#/seg] (média)
Tempo por pedido:       15.378 [ms] (média)
Tempo por pedido:       0.077 [ms] (média, em todos os pedidos concurrentes)

NGINX 1.18.0 sem validação JSON

$ ab -c 200 -n 10000 -p ./large.json -T application/json http://127.0.0.1/test/signup

Pedidos por segundo:    7887.76 [#/seg] (média)
Tempo por pedido:       25.356 [ms] (média)
Tempo por pedido:       0.127 [ms] (média, em todos the pedidos concurrentes)
```

Esses resultados de desempenho não são os únicos que obtivemos durante o teste do Firewall de API. Outros resultados, juntamente com os métodos usados para melhorar o desempenho do Firewall de API, são descritos neste [artigo do blog da Wallarm](https://lab.wallarm.com/wallarm-api-firewall-outperforms-nginx-in-a-production-environment/).
