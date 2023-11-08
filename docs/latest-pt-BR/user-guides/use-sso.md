[img-basic-auth]:       ../images/user-guides/sso/basic-auth.png
[img-sso-login-form]:   ../images/user-guides/sso/sso-login-form.png       
[img-idp-auth-pages]:   ../images/user-guides/sso/idp-auth-pages.png    
[img-wl-dashboard]:     ../images/user-guides/dashboard/dashboard.png

[link-gsuite]:      https://gsuite.google.com/
[link-okta]:        https://www.okta.com/


#   Usando o login único no portal Wallarm

Este guia abordará o processo de autenticação de usuário no portal Wallarm usando a tecnologia de login único (Single Sign-On, SSO).

!!! info "Pré-requisitos"
    Se a autenticação SSO foi ativada e o papel da sua conta não é de *Admin*, então agora você só pode usar a autenticação SSO para fazer login no portal Wallarm.
    
    Este guia presume que você já tem uma conta com um dos provedores de identidade, como [Okta][link-okta] ou [G Suite][link-gsuite]. Se esse não for o caso, por favor, entre em contato com o seu administrador.

Para se autenticar usando SSO, vá para a página de login do Wallarm.

Se você usa um endereço como `<algum_domínio>.wallarm.com` (por exemplo, `meu.wallarm.com`) para fazer login no Wallarm, então você precisará clicar no link *Entrar com SAML SSO* para fazer login com SSO (o par login/senha é considerado prioridade).

![A página de login de “login/senha”][img-basic-auth]

Se você usa um endereço como `<domínio_da_empresa>.wallarm.io` (o domínio alocado para a empresa à qual sua conta pertence) para fazer login no Wallarm, então o método de login prioritário é o login SSO, e o formulário de login será diferente do anterior.

![Formulário de login SSO][img-sso-login-form]

Para fazer login no Wallarm usando SSO, você precisa inserir seu e-mail.

Se o e-mail inserido estiver registrado e a autenticação SSO estiver configurada para ele, você será redirecionado para um serviço de provedor de identidade (IdP), como Okta ou G Suite. Se você também não estiver autorizado por este provedor, você será redirecionado para a página de login. As páginas de login para os serviços Okta e G Suite estão mostradas abaixo.

![Páginas de login do Okta e G Suite][img-idp-auth-pages]

Digite seu e-mail e senha (opções adicionais com autenticação de dois fatores). Após a autenticação bem-sucedida pelo provedor de identidade e a verificação dos direitos de acesso ao recurso solicitado (Wallarm), o provedor o redireciona para o portal Wallarm. Ao mesmo tempo, o provedor envia uma solicitação ao lado do Wallarm confirmando que você é um usuário legítimo, bem como outros parâmetros necessários. Assim, você estará logado no portal Wallarm e a página do painel será aberta.

![Painel do portal Wallarm][img-wl-dashboard]

Isso conclui o processo de autenticação SSO.