# Visão geral da integração com a solução SAML SSO

[doc-admin-sso-gsuite]:     gsuite/overview.md
[doc-admin-sso-okta]:       okta/overview.md

[link-saml]:                https://wiki.oasis-open.org/security/FrontPage
[link-saml-sso-roles]:      https://www.oasis-open.org/committees/download.php/27819/sstc-saml-tech-overview-2.0-cd-02.pdf     

Você pode usar a tecnologia Single Sign‑On (SSO) para autenticar os usuários da sua empresa no portal do Wallarm se sua empresa já usa uma solução de SSO [SAML][link-saml].

O Wallarm pode ser integrado com qualquer solução que suporte o padrão SAML. Os guias de SSO descrevem a integração usando [Okta][doc-admin-sso-okta] ou [Google Suite (G Suite)][doc-admin-sso-gsuite] como exemplo.

Os documentos relacionados à configuração e operação do Wallarm com SSO assumem o seguinte:
*   Wallarm atua como um **provedor de serviço** (SP).
*   Google ou Okta atua como um **provedor de identidade** (IdP).

Mais informações sobre papéis no SAML SSO podem ser encontradas aqui ([PDF][link-saml-sso-roles]).

!!! warning "Ativação do serviço SSO"
    Por padrão, a conexão SSO no Wallarm não está disponível sem ativar o serviço apropriado. Para ativar o serviço SSO, entre em contato com o gerente da sua conta ou a [equipe de suporte do Wallarm](mailto:support@wallarm.com).
    
    Se nenhum serviço SSO estiver ativado, então os blocos relacionados ao SSO não estarão visíveis na seção **Integrações** na Wallarm Console.