# Fazendo upload de suas especificações de API <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Na seção **Especificações da API** da Wallarm Console UI, você pode manter suas especificações de API que a Wallarm usa para descobrir as APIs irregulares (sombra, órfã e zumbi). Este artigo fornece informações sobre como usar esta seção.

**Administradores** e **Administradores globais** podem adicionar, remover e baixar especificações e alterar as configurações de detecção de APIs irregulares. Os usuários de outros [papéis](../user-guides/settings/users.md#user-roles) só podem visualizar a lista de especificações carregadas.

## Revelando API sombra, órfã e zumbi

Com o [**API Discovery**](../api-discovery/overview.md) em uso, suas especificações de API carregadas na seção **Especificações da API** podem ser comparadas com o que foi automaticamente detectado pelo API Discovery. Como resultado dessa comparação, a Wallarm [encontra e mostra APIs irregulares (sombra, órfã e zumbi)](../api-discovery/overview.md#shadow-orphan-and-zombie-apis).

Para executar a comparação:

1. Navegue até a seção **Especificações da API** e clique em **Fazer upload de especificação**.
1. Selecione uma especificação para fazer upload. Ela deve estar no formato OpenAPI 3.0 JSON ou YAML.
1. Defina os parâmetros de comparação:

   * Aplicativo(s) e host(s) - apenas os endpoints relacionados às aplicações/hosts selecionados serão comparados. Se você selecionar **Comparar com todos os hosts de aplicativos descobertos atuais e futuros**, todos os hosts (dos aplicativos selecionados) conhecidos agora e todos os hosts que serão descobertos no futuro serão incluídos na comparação.

       Você pode alterar as configurações de comparação a qualquer momento depois - após isso a comparação será refeita fornecendo novos resultados.

   * De onde fazer o upload: sua máquina local ou URL. Para URLs, por meio dos campos de cabeçalho, você pode especificar um token para autenticação.
   * Se a comparação deve ser realizada uma vez após o upload da especificação ou a cada hora (a opção **Realizar comparação regular** é selecionada por padrão). A comparação por hora permite encontrar APIs irregulares adicionais à medida que o API Discovery descobre mais endpoints. A especificação carregada da URL é atualizada antes de cada comparação.

    ![API Discovery - Especificações da API - fazendo upload da especificação da API para encontrar APIs irregulares](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

    Saiba que você pode reiniciar a comparação a qualquer momento manualmente por meio do menu de especificação → **Reiniciar comparação**.

1. Inicie o upload.

    Quando o upload for concluído, o número de APIs irregulares (sombra, órfã e zumbi) será exibido para cada especificação na lista de **Especificações da API**. As APIs irregulares também serão [exibidas](api-discovery.md#displaying-shadow-orphan-and-zombie-api) na seção **API Discovery**.

    ![Seção Especificações da API](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png) 

## Baixar especificações previamente carregadas

Você pode baixar a especificação previamente carregada via **Especificações da API** → janela de detalhes da especificação → **Baixar especificação**.
