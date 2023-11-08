# Passo 2: Criando e Configurando um Aplicativo no G Suite

[img-gsuite-console]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-gsuite-add-app]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-add-app.png
[img-fetch-metadata]:       ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fetch-metadata.png
[img-fill-in-sp-data]:      ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-fill-in-sp-data.png
[img-app-page]:             ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png
[img-create-attr-mapping]:  ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-attr-mapping.png

[doc-setup-sp]:             setup-sp.md
[doc-metadata-transfer]:    metadata-transfer.md

[link-gsuite-adm-console]:  https://admin.google.com

!!! info "Pré-requisitos"
    Os seguintes valores são utilizados como valores de demonstração neste guia:

    * `WallarmApp` como um valor para o parâmetro **Nome do Aplicativo** (no G Suite).
    * `https://sso.online.wallarm.com/acs` como um valor para o parâmetro **URL ACS** (No G Suite).
    * `https://sso.online.wallarm.com/entity-id` como um valor para o parâmetro **ID da Entidade** (no G Suite).

!!! warning
    Certifique-se de substituir os valores de exemplo para os parâmetros **URL ACS** e **ID da Entidade** pelos reais obtidos no [passo anterior][doc-setup-sp].

Faça login no [console de administração do Google][link-gsuite-adm-console]. Clique no bloco *Apps*.

![Console de administração do G Suite][img-gsuite-console]

Clique no bloco *SAML apps*. Adicione um novo aplicativo clicando no link *Adicione um serviço/aplicativo ao seu domínio* ou no botão “+” no canto inferior direito.

Clique no botão *Configurar meu próprio aplicativo personalizado*.

![Adicionando um novo aplicativo ao G Suite][img-gsuite-add-app]

As informações (metadados) fornecidas pelo G Suite, como seu provedor de identidade, são:
*   **URL SSO**
*   **ID da Entidade**
*   **Certificado** (X.509)

Os metadados são um conjunto de parâmetros que descrevem as propriedades do provedor de identidade (semelhantes aos gerados para o provedor de serviço no [Passo 1][doc-setup-sp]) que são necessários para configurar o SSO.

Você pode transferi-los para o assistente de configuração do SSO Wallarm de duas maneiras:
*   Copie cada parâmetro e baixe o certificado, já anexá-lo nos campos correspondentes do assistente de configuração do Wallarm.
*   Baixe um arquivo XML com metadados e faça upload do mesmo no lado do Wallarm.

Salve os metadados de qualquer forma que preferir e vá para a próxima etapa de configuração do aplicativo clicando em *Próximo*. O preenchimento dos metadados do provedor de identidade no lado do Wallarm será descrito no [Passo 3][doc-metadata-transfer].

![Salvando metadados][img-fetch-metadata]

A próxima etapa da configuração do aplicativo é fornecer os metadados do provedor de serviços (Wallarm). Campos obrigatórios:
*   **URL ACS** corresponde ao parâmetro **URL do Serviço de Consumidor de Asserções** gerado no lado do Wallarm.
*   **ID da Entidade** corresponde ao parâmetro **ID da Entidade Wallarm** gerado no lado do Wallarm.

Preencha os demais parâmetros, se necessário. Clique em *Próximo*.

![Preenchendo informações do provedor de serviços][img-fill-in-sp-data]

Na etapa final da configuração do aplicativo, você será solicitado a fornecer mapeamentos entre os atributos do provedor de serviços para os campos de perfil do usuário disponíveis. Wallarm (como um provedor de serviço) requer que você crie um mapeamento de atributos.

Clique em *Adicionar novo mapeamento* e mapeie o atributo `email` para o campo de perfil do usuário “Email Principal” (no grupo “Informações Básicas”).

![Criando um mapeamento de atributos][img-create-attr-mapping]

Clique em *Finalizar*.

Depois disso, você será informado na janela pop-up de que as informações fornecidas foram salvas e, para completar a configuração do SAML SSO, você precisará fazer upload dos dados sobre o provedor de identidade (Google) no painel de administração do provedor de serviços (Wallarm). Clique em *Ok*.

Depois disso, você será redirecionado para a página do aplicativo criado.
Uma vez criado o aplicativo, ele estará desabilitado para todas as suas organizações no G Suite. Para ativar o SSO para este aplicativo, clique no botão *Editar Serviço*.

![Página do aplicativo no G Suite][img-app-page]

Selecione *ON para todos* para o parâmetro **Status do serviço** e clique em *Salvar*.

Agora você pode [continuar a configuração do SSO][doc-metadata-transfer] no lado do Wallarm.