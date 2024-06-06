# Desativando a proteção contra bots para URLs e solicitações específicas

O módulo [**Prevenção de Abuso de API**](../../api-abuse-prevention/overview.md) da plataforma Wallarm identifica e combate bots com base nos [perfis](../../api-abuse-prevention/setup.md) que definem as aplicações específicas a serem protegidas, os tipos de bots direcionados, o nível de tolerância, etc. Além disso, a regra **Definir modo de Prevenção de Abuso de API** mencionada neste artigo permite desativar a proteção contra bots para URLs e solicitações específicas.

Como o [construtor de URI](../../user-guides/rules/add-rule.md#uri-constructor) da regra inclui elementos de URL e solicitação, como cabeçalhos, você pode usar a regra para desativar a proteção contra bots tanto para URLs que os alvos de solicitação quanto para os tipos de solicitação específicos, por exemplo, para solicitações que contêm cabeçalhos específicos.

!!! info "Suporte de regra em diferentes versões de nó"
    Este recurso é suportado apenas pelas versões de nó 4.8 e superiores.

## Criando e aplicando a regra

Para desativar a proteção contra bots para URL ou tipo de solicitação específico:

1. Acesse o Console Wallarm → **Regras** → **Adicionar regra**.
1. Em **Se a solicitação for**, [descreva](../../user-guides/rules/add-rule.md#uri-constructor) as solicitações e/ou URLs para aplicar a regra.

    Para especificar a URL, se você usa o módulo [**Descoberta de API**](../../about-wallarm/api-discovery.md) e de seus endpoints foram descobertos, você também pode criar rapidamente a regra para o endpoint usando seu menu.

1. Em **Então**, escolha **Definir modo de Prevenção de Abuso de API** e configure:

   * **Padrão** - para o escopo descrito (URL ou solicitação específica), a proteção contra bots funcionará de uma maneira usual definida pelos perfis comuns de Prevenção de Abuso de API [perfis](../../api-abuse-prevention/setup.md).
   * **Não verificar a atividade do bot** - para a URL e/ou tipo de solicitação descrito, a verificação da atividade do bot não será realizada.
  
1. Opcionalmente, no comentário, especifique o motivo da criação da regra para esta URL/tipo de solicitação.

Observe que você pode desativar temporariamente a exceção para a URL e/ou tipo de solicitação sem excluir a regra: para fazer isso, selecione o modo **Padrão**. Você pode voltar para **Não verificar a atividade do bot** a qualquer momento posterior.

## Exemplos de regra

### Marcando bot legítimo pelos seus cabeçalhos de solicitação

Suponha que sua aplicação esteja integrada com a ferramenta de automação de marketing Klaviyo que tem vários IPs que enviam solicitações. Portanto, definimos que não devemos verificar as atividades automatizadas (bot) em solicitações GET do agente de usuário `Klaviyo/1.0` para URIs específicas:

![Não verifique a atividade dos bots para solicitações com cabeçalhos específicos](../../images/user-guides/rules/api-abuse-url-request.png)

### Desativando a proteção contra bots para o endpoint de teste

Vamos dizer que você tem um endpoint que pertence à sua aplicação. A aplicação deve ser protegida contra atividades de bots, mas o endpoint de teste deve ser uma exceção. Além disso, você tem seu inventário de API descoberto pelo módulo [**Descoberta de API**](../../about-wallarm/api-discovery.md). 

Neste caso, é mais fácil criar uma regra a partir da lista de endpoints do **Descoberta de API**. Vá até lá, encontre o seu endpoint e inicie a criação da regra a partir da sua página:

![Criando modo de Prevenção de Abuso de API para endpoint de Descoberta de API](../../images/user-guides/rules/api-abuse-url.png)
