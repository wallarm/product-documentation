# Passo 2: Criando e Configurando um Aplicativo no Okta

[img-dashboard]:            ../../../../images/admin-guides/configuration-guides/sso/okta/dashboard.png
[img-general]:              ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-general.png  
[img-saml]:                 ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml.png
[img-saml-preview]:         ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-saml-preview.png
[img-feedback]:             ../../../../images/admin-guides/configuration-guides/sso/okta/wizard-feedback.png
[img-fetch-metadata-xml]:   ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-xml.png
[img-xml-metadata]:         ../../../../images/admin-guides/configuration-guides/sso/okta/xml-metadata-example.png
[img-fetch-metadata-manually]:  ../../../../images/admin-guides/configuration-guides/sso/okta/fetch-metadata-manually.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-okta-docs]:           https://help.okta.com/en/prod/Content/Topics/Apps/Apps_App_Integration_Wizard.htm

[anchor-general-settings]:  #1-general-settings
[anchor-configure-saml]:    #2-configure-saml
[anchor-feedback]:          #3-feedback
[anchor-fetch-metadata]:    #downloading-metadata  

!!! info "Pré-requisitos"
    Os seguintes valores são usados como valores de demonstração neste guia:

    *   `WallarmApp` como um valor para o parâmetro **Nome do aplicativo** (no Okta).
    *   `https://sso.online.wallarm.com/acs` como um valor para o parâmetro **URL de sign-on único** (no Okta).
    *   `https://sso.online.wallarm.com/entity-id` como um valor para o parâmetro **URI de público** (no Okta).

!!! warning
    Certifique-se de substituir os valores de exemplo para os parametros **URL de sign-on único** e **URI de público** pelos reais obtidos no [passo anterior][doc-setup-sp].

Faça login no serviço Okta (a conta deve ter direitos de administrador) e clique no botão *Administrador* no canto superior direito.

Na seção *Dashboard*, clique no botão *Adicionar Aplicações* à direita.

![Painel Okta][img-dashboard]

Na nova seção de aplicação, clique no botão *Criar Novo App* à direita.

Na janela pop-up, defina as seguintes opções:
1.  **Plataforma** → "Web".
2.  **Método de autenticação** → "SAML 2.0".

Clique no botão *Criar*.

Depois disso, você será levado para o assistente de integração SAML (*Criar integração SAML*). Para criar e configurar a integração SAML, você será solicitado a concluir três estágios:
1.  [Configurações Gerais.][anchor-general-settings]
2.  [Configurando o SAML.][anchor-configure-saml]
3.  [Feedback.][anchor-feedback]

Depois disso, os metadados [precisam ser baixados][anchor-fetch-metadata] para a integração recém-criada.


##  1.  Configurações Gerais

Insira o nome do aplicativo que você está criando no campo **Nome do aplicativo**.

Opcionalmente, você pode baixar o logo do aplicativo (**Logo do aplicativo**) e configurar a visibilidade do aplicativo para seus usuários na página inicial do Okta e no aplicativo móvel do Okta.

Clique no botão *Próximo*.

![Configurações gerais][img-general]


##  2.  Configurando o SAML

Nesta etapa, você precisará dos parâmetros gerados [anteriormente][doc-setup-sp] no lado da Wallarm:

*   **ID da Entidade Wallarm**
*   **URL do Serviço de Consumo de Asserção (URL do ACS)**

!!! info "Parâmetros do Okta"
    Este manual descreve apenas os parâmetros obrigatórios a serem preenchidos ao configurar o SSO com Okta.
    
    Para saber mais sobre o resto dos parâmetros (incluindo aqueles relacionados à configuração da assinatura digital e encriptação da mensagem SAML), consulte a [documentação do Okta][link-okta-docs].

Preencha os seguintes parâmetros básicos:
*   **URL de sign-on único**—insira o valor **URL do Serviço de Consumo de Asserção (URL do ACS)** anteriormente obtido no lado da Wallarm.
*   **URI do Público (ID da Entidade SP)**—insira o valor do **ID da Entidade Wallarm** recebido anteriormente do lado da Wallarm.

Os parâmetros restantes para a configuração inicial podem ser deixados como padrão.

![Configurando SAML][img-saml]

Clique em *Próximo* para continuar a configuração. Se quiser retornar ao passo anterior, clique em *Anterior*.

![Pré-visualização das configurações de SAML][img-saml-preview]


##  3.  Feedback

Nesta etapa, é solicitado que você forneça ao Okta informações adicionais sobre o tipo do seu aplicativo, se você é um cliente ou parceiro do Okta, e outros dados. É suficiente escolher "Sou um cliente do Okta adicionando um app interno" para o parâmetro **Você é um cliente ou parceiro**?

Se necessário, preencha os outros parâmetros disponíveis.

Depois disso, você pode finalizar o assistente de integração SAML clicando no botão *Concluir*. Para voltar ao passo anterior, clique no botão *Anterior*.

![Formulário de feedback][img-feedback]

Após esta etapa, você será levado para a página de configurações do aplicativo criado.

Agora você precisa [baixar os metadados][anchor-fetch-metadata] para a integração criada para [continuar configurando o provedor de SSO][doc-metadata-transfer] do lado da Wallarm.

Os metadados são um conjunto de parâmetros que descrevem as propriedades do provedor de identidade (como aqueles gerados para o provedor de serviço em [Passo 1][doc-setup-sp]) necessários para configurar o SSO.


##  Baixando Metadados

Você pode baixar os metadados como um arquivo XML ou "como está" em formato de texto (você precisará inserir os metadados manualmente ao configurá-los posteriormente).

Para baixar como um arquivo XML:
1.  Clique no link *Metadados do provedor de identidade* na página de configurações do aplicativo criado:

    ![Link para download dos metadados][img-fetch-metadata-xml]
    
    Como resultado, você será levado para uma nova aba no seu navegador com um conteúdo semelhante:
    
    ![Exemplo de metadados formatados em XML][img-xml-metadata]
    
2.  Salve o conteúdo em um arquivo XML (com o seu navegador ou outro método adequado).

Para baixar os metadados "como estão":
1.  Na página de configurações do aplicativo criado, clique no botão *Ver instruções de configuração*.

    ![Botão “Ver instruções de configuração”][img-fetch-metadata-manually]
    
2.  Copie todos os dados fornecidos.


Agora você pode [continuar configurando o SSO][doc-metadata-transfer] do lado da Wallarm.
