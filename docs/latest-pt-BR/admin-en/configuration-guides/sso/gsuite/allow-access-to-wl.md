# Passo 4: Permitindo Acesso à Aplicação Wallarm pelo Lado do G Suite

[img-gsuite-console]:           ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-console.png
[img-user-list]:                ../../../../images/admin-guides/configuration-guides/sso/gsuite/user-list.png
[img-gsuite-navigation-saml]:   ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-navigation-saml.png
[img-app-page]:                 ../../../../images/admin-guides/configuration-guides/sso/gsuite/gsuite-app-page.png

[doc-use-user-auth]:            ../employ-user-auth.md

Para autenticar através do G Suite, uma conta deve ser criada no lado do G Suite, e o usuário deve ter direitos de acesso à aplicação Wallarm. A sequência necessária de ações para conceder direitos de acesso é descrita abaixo.

Vá até a seção de gerenciamento de usuários do G Suite clicando no bloco *Usuários*.

![G Suite console][img-gsuite-console]

Certifique-se de que o usuário que você está prestes a dar acesso à aplicação através de autenticação SSO está na lista de usuários da sua organização.

![G Suite user list][img-user-list]

Vá até a seção de aplicações SAML clicando no item de menu *Aplicações SAML* conforme mostrado abaixo.

![Navigate to the SAML applications][img-gsuite-navigation-saml]

Insira as configurações da aplicação desejada e certifique-se de que o status da aplicação seja "ON para todos". Se o status da aplicação for "OFF para todos", clique no botão *Editar serviço*.

![Application page in G Suite][img-app-page]

Selecione o status "ON para todos" e clique em *Salvar*.

Depois disso, você receberá uma mensagem de que o status do serviço foi atualizado. A aplicação Wallarm agora está disponível para autenticação SSO para todos os usuários de sua organização no G Suite.


## Configuração Concluída

Esta é a configuração final do SSO baseado no G Suite, e agora você pode começar a configurar a autenticação SSO [específica do usuário][doc-use-user-auth] pelo lado da Wallarm.