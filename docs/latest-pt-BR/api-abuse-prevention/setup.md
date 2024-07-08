# Gerenciamento do perfil de Prevenção de Abuso de API <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Na seção **Prevenção de Abuso de API** do Console Wallarm, você pode gerenciar perfis de abuso de API necessários para a configuração do módulo [**Prevenção de Abuso de API**](../api-abuse-prevention/overview.md).

A seção só está disponível para os usuários dos seguintes [funções](../user-guides/settings/users.md#user-roles):

* **Administrador** ou **Analista** para as contas regulares.
* **Administrador Global** ou **Analista Global** para as contas com o recurso de multilocação.

## Criação de perfil de abuso de API

Para criar um perfil de abuso de API:

1. No Console Wallarm → **Prevenção de Abuso de API**, clique em **Criar perfil**.
1. Selecione os aplicativos a proteger.
1. Selecione o nível de [tolerância](../api-abuse-prevention/overview.md#tolerance).
1. Se necessário, na seção **Proteger de**, limite os [tipos de bots](../api-abuse-prevention/overview.md#automated-threats-blocked-by-api-abuse-prevention) para proteger.
1. Selecione a [reação apropriada aos bots maliciosos](../api-abuse-prevention/overview.md#reaction-to-malicious-bots).
1. Se o a reação é adicionar à lista de negação ou cinza, defina o tempo durante o qual o IP estará na lista. O valor padrão é `Adicionar por um dia`.
1. Defina um nome e, opcionalmente, uma descrição.

    ![Perfil de Prevenção de Abuso de API](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

    Uma vez que o perfil de abuso de API está configurado, o módulo iniciará a [análise de tráfego e bloqueio de ameaças automatizadas suportadas](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works).

## Desabilitando o perfil de abuso de API

Perfis desabilitados são aqueles que o módulo **Prevenção de Abuso de API** não utiliza durante a análise de tráfego, mas que ainda são exibidos na lista de perfis. Você pode reativar perfis desativados a qualquer momento. Se não houver perfis habilitados, o módulo não bloqueará bots maliciosos.

Você pode desabilitar o perfil usando a opção **Desativar** correspondente.

## Excluindo o perfil de abuso de API

Perfis excluídos são aqueles que não podem ser restaurados e que o módulo **Prevenção de Abuso de API** não utiliza durante a análise de tráfego.

Você pode excluir o perfil usando a opção **Excluir** correspondente.

## Explorando bots maliciosos bloqueados e seus ataques

O módulo **Prevenção de Abuso de API** bloqueia bots adicionando-os à [lista de negação](../user-guides/ip-lists/denylist.md) ou [lista cinza](../user-guides/ip-lists/graylist.md) por 1 hora.

Você pode explorar os IPs de bots bloqueados no Console Wallarm → **Listas de IP** → **Lista de negação** ou **Lista cinza**. Explore IPs adicionados com o **Motivo** `Bot`.

![IPs de bots na lista de negação](../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)

!!! info "Confiança"
    Como resultado do [trabalho dos detectores](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works), cada bot detectado obtém **porcentagem de confiança**: o quanto temos certeza de que isso é um bot. Em cada tipo de bot, os detectores têm importância relativa diferente / número de votos. Assim, a porcentagem de confiança é os votos ganhos de todos os votos possíveis neste tipo de bot (fornecido por detectores que trabalharam).

Você pode intervir no processo de proteção de bot. Se o IP listado como negação ou cinza não for realmente usado por um bot malicioso, você pode excluir o IP da lista ou [lista de permissões](../user-guides/ip-lists/allowlist.md). O Wallarm não bloqueia solicitações originadas de IPs na lista de permissões, incluindo as maliciosas.

Você também pode explorar ataques de abuso de API de bot realizados por bots na seção **Eventos** do Console Wallarm. Use a chave de pesquisa `api_abuse` ou selecione `Abuso de API` no filtro **Tipo**.

![Eventos de abuso de API](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

A informação do bot é visualizada em três mapas de calor. Em todos os mapas, quanto maior a bolha, mais próxima ela está da cor vermelha e do canto superior direito - mais razões para considerar este IP como um bot.

Nos mapas de calor, você também pode comparar seu bot atual (**este bot**) com os outros bots que atacaram o mesmo aplicativo nas últimas 24 horas. Se muitos bots fizeram isso, apenas os 30 mais suspeitos serão exibidos.

Os mapas de calor:

* **Performance** visualiza a performance dos bots atuais e outros detectados, incluindo sua não unicidade de solicitação, solicitações programadas, RPS e intervalo de solicitação.
* **Comportamento** visualiza a pontuação de comportamento suspeito do bot atual e outros detectados, incluindo seu grau de comportamento suspeito, quantidade de solicitações para endpoints críticos ou sensíveis, RPS e o número de detectores de bot que os detectaram como bots.
* **Erros HTTP** visualiza os erros de API causados pelas atividades dos bots, incluindo o número de diferentes endpoints que eles atingem, o número de solicitações inseguras que fazem, seu RPS e o número de códigos de resposta de erro que recebem.

Cada mapa de calor inclui uma descrição detalhada do tamanho, cor e posição da bolha (use **Mostrar mais**). Você pode ampliar o mapa de calor desenhando um retângulo ao redor da área necessária.

O módulo **Prevenção de Abuso de API** compila o tráfego do cliente em padrões de URL. O padrão de URL pode ter os seguintes segmentos:

| Segmento | Contém | Exemplo |
|---|---|---|
| SENSIBLE | Partes da URL que fornecem acesso às funções ou recursos críticos do aplicativo, como o painel de administração. Eles devem ser mantidos confidenciais e restritos ao pessoal autorizado para prevenir potenciais violações de segurança. | `wp-admin` |
| IDENTIFICADOR | Vários identificadores como identificadores numéricos, UUIDs, etc. | - |
| ESTÁTICO | As pastas que contêm arquivos estáticos de diferentes tipos. | `images`, `js`, `css` |
| ARQUIVO | Nomes de arquivos estáticos. | `image.png` |
| CONSULTA | Parâmetros de consulta. | - |
| AUTENTICAÇÃO | Conteúdo relacionado aos endpoints de autenticação/autorização. | - |
| LÍNGUA | Partes relacionadas à língua. | `en`, `fr` |
| VERIFICAÇÃO DE DISPONIBILIDADE | Conteúdo relacionado aos endpoints de verificação de disponibilidade. | - |
| DIVERSOS | O segmento é marcado como DIVERSOS se for impossível atribuí-lo a outras categorias. Uma parte variável do caminho da URL. | - |

## Trabalhando com a lista de exceções

Para marcar alguns IPs como associados a bots ou rastreadores legítimos para evitar o bloqueio deles pela Prevenção de Abuso de API, use a [**Lista de exceções**](../api-abuse-prevention/overview.md#exception-list).

Você adiciona o endereço IP ou o intervalo à lista de exceções e especifica o aplicativo de destino: isso faz com que qualquer solicitação desses endereços para o aplicativo de destino não resulte em marcar esses endereços como bots maliciosos e eles não serão adicionados à [lista de negação](../user-guides/ip-lists/denylist.md) ou [lista cinza](../user-guides/ip-lists/graylist.md) pela Prevenção de Abuso de API.

Existem duas maneiras de adicionar endereços IP à lista de exceções:

* A partir da seção **Prevenção de Abuso de API** → guia **Lista de exceções** por meio de **Adicionar exceção**. Aqui, além dos IPs e sub-redes, você pode adicionar localizações e tipos de fonte que devem ser ignorados pela Prevenção de Abuso de API.

    ![Prevenção de abuso de API - adicionando itens de dentro da lista de exceções](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

* A partir da seção **Eventos**: use a chave de pesquisa `api_abuse` ou selecione `Abuso de API` no filtro **Tipo**, em seguida, expanda o evento requerido e clique em **Adicionar à lista de exceções**.

    ![Prevenção de abuso de API - adicionando itens de dentro da lista de exceções](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

Quando o endereço IP é adicionado à lista de exceções, o endereço é automaticamente removido da [lista de negação](../user-guides/ip-lists/denylist.md) ou [lista cinza](../user-guides/ip-lists/graylist.md), mas somente se foi adicionado lá pela própria Prevenção de Abuso de API (tem um motivo `Bot`).

!!! info "Bloqueando outros tipos de ataque do IP"
    Se um IP da lista de exceções produz outros [tipos de ataque](../attacks-vulns-list.md), como ataques de força bruta ou de validação de entrada e outros, o Wallarm bloqueia essas solicitações.

Por padrão, o IP é adicionado à lista de exceções para sempre. Você pode alterar isso e definir o tempo em que o endereço deve ser removido da lista de exceções. Você também pode remover este endereço das exceções imediatamente a qualquer momento.

A guia **Lista de exceções** fornece os dados históricos - você pode ver os itens que foram apresentados na lista dentro do período de tempo selecionado no passado.

## Trabalhando com exceções para URLs alvo e solicitações específicas

Além de marcar os IPs de bots bons por meio da [lista de exceções](#working-with-exception-list), você pode desativar a proteção bot tanto para as URLs que as solicitações visam como para os tipos de solicitação específicos, por exemplo, para solicitações que contenham cabeçalhos específicos.

Observe que, em comparação com outras configurações de Prevenção de Abuso de API, essa capacidade é configurada **não** dentro do perfil de Abuso de API, mas separadamente - com a ajuda da regra [**Definir modo de Prevenção de Abuso de API**](../api-abuse-prevention/exceptions.md).