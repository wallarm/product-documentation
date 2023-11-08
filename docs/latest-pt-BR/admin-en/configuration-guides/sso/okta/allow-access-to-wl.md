# Passo 4: Permitindo o acesso ao aplicativo Wallarm no lado do Okta

[img-dashboard]:    ../../../../images/admin-guides/configuration-guides/sso/okta/okta-assign-app.png
[img-assignments]:  ../../../../images/admin-guides/configuration-guides/sso/okta/assignments.png
[img-user-list]:    ../../../../images/admin-guides/configuration-guides/sso/okta/user-list.png

[doc-use-user-auth]:   ../employ-user-auth.md

Para autenticar através do Okta, uma conta deve ser criada no lado do Okta e o usuário deve ter direitos de acesso ao aplicativo Wallarm. A sequência necessária de ações para conceder direitos de acesso é descrita abaixo.

Clique no botão *Admin* no canto superior direito do portal Okta. Na seção *Dashboard*, clique no link *Assign Applications*.

![Painel do Okta][img-dashboard]

Será solicitado que você atribua os aplicativos aos usuários corretos para dar a esses usuários acesso aos aplicativos selecionados. Para fazer isso, marque as caixas de seleção ao lado dos aplicativos e usuários necessários e clique em *Next*.

![Atribuindo usuários ao aplicativo][img-assignments]

Em seguida, será solicitado que você verifique e confirme as atribuições do aplicativo. Se tudo estiver correto, confirme as atribuições clicando no botão *Confirm Assignments*.

Depois disso, você pode ir para a página de configurações do aplicativo na guia *Assignments*. Aqui, você poderá ver uma lista de usuários que têm acesso ao aplicativo para o qual o SSO está configurado.

![Lista de usuários para o aplicativo Wallarm][img-user-list]

Os direitos de acesso ao aplicativo Wallarm agora estão configurados. Agora, os usuários atribuídos ao aplicativo podem acessar o aplicativo usando a autenticação SSO através do serviço Okta.

## Configuração Completa

Isso conclui a configuração do SSO baseado em Okta, e agora você pode começar a configurar a autenticação SSO [específica do usuário][doc-use-user-auth] do lado do Wallarm.