[user-roles-article]:    ../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:   ../images/api-tokens-edit.png

# Visão geral da API Wallarm

A API Wallarm fornece a interação entre os componentes do sistema Wallarm. Você pode usar os métodos da API Wallarm para criar, obter ou atualizar as seguintes instâncias:

* vulnerabilidades
* ataques
* incidentes
* usuários
* clientes
* nós de filtro
* etc.

A descrição dos métodos da API é fornecida no **Console da API Wallarm** disponível no Console Wallarm → canto superior direito → `?` → **Console da API Wallarm** ou diretamente por este link:

* https://apiconsole.us1.wallarm.com/ para o [US cloud](../about-wallarm/overview.md#us-cloud)
* https://apiconsole.eu1.wallarm.com/ para a [EU cloud](../about-wallarm/overview.md#eu-cloud)

![Console da API Wallarm](../images/wallarm-api-reference.png)

## Ponto de extremidade da API

As solicitações de API são enviadas para o seguinte URL:

* `https://us1.api.wallarm.com/` para o [US cloud](../about-wallarm/overview.md#us-cloud)
* `https://api.wallarm.com/` para a [EU cloud](../about-wallarm/overview.md#eu-cloud)

## Autenticação de solicitações de API

Você deve ser um usuário verificado para fazer solicitações da API Wallarm. O método de autenticação de solicitações de API depende do cliente que envia a solicitação:

* [Referência UI da API](#api-reference-ui)
* [Seu próprio cliente de API](#your-own-api-client)

### Console da API Wallarm

Um token é usado para autenticação do pedido. O token é gerado após a autenticação bem-sucedida na sua conta Wallarm.

1. Faça login no seu Console Wallarm usando o link:
    * https://us1.my.wallarm.com/ para a nuvem dos EUA
    * https://my.wallarm.com/ para a nuvem da UE
2. Atualize a página do Console da API Wallarm usando o link:
    * https://apiconsole.us1.wallarm.com/ para a nuvem dos EUA
    * https://apiconsole.eu1.wallarm.com/ para a nuvem da UE
3. Vá até o método de API necessário → seção **Experimente**, insira os valores dos parâmetros e **Execute** a solicitação.

### Seu próprio cliente de API

Para autenticar solicitações do seu próprio cliente de API para a API Wallarm:

1. Faça login na sua conta Wallarm na [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem da UE](https://my.wallarm.com/) → **Configurações** → **Tokens de API**.
1. [Crie](../user-guides/settings/api-tokens.md#configuring-tokens) um token para acessar a API Wallarm.
1. Abra seu token e copie o valor da seção **Token**.
1. Envie a solicitação de API necessária, passando o valor do **Token** no parâmetro de cabeçalho `X-WallarmApi-Token`.

[Mais detalhes sobre tokens da API →](../user-guides/settings/api-tokens.md)

<!-- ## Restrições da API

A Wallarm limita o número de chamadas à API a 500 solicitações por segundo. -->

## Abordagem Wallarm para o desenvolvimento e documentação da API

A Referência da API Wallarm é um aplicativo de página única (SPA) com todos os dados exibidos sendo buscados dinamicamente da API. Este design leva a Wallarm a usar a abordagem [API-first](https://swagger.io/resources/articles/adopting-an-api-first-approach/) quando novos dados e funcionalidades são inicialmente disponibilizados na API pública e, como próxima etapa, são descritos na Referência da API. Geralmente, todas as novas funcionalidades são lançadas simultaneamente na API pública e na Referência da API, mas às vezes as mudanças na API são lançadas antes das mudanças na Referência da API, e algumas funcionalidades estão disponíveis apenas por meio da API pública.

A Referência da API Wallarm é gerada a partir do arquivo Swagger usando a ferramenta [Swagger UI](https://swagger.io/tools/swagger-ui/). A Referência da API fornece uma maneira fácil de aprender sobre os pontos de extremidade, métodos e estruturas de dados disponíveis da API. Também oferece uma maneira simples de testar todos os pontos finais disponíveis.