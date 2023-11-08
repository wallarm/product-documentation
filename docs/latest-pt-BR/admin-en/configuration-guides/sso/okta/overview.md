# Conectando SSO com Okta

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-okta]:                        https://www.okta.com/

Este guia cobrirá o processo de conectar o serviço [Okta][link-okta] como um provedor de identidade ao Wallarm, que atua como um provedor de serviços.

!!! nota

    Por padrão, a conexão SSO no Wallarm não está disponível sem ativar o serviço apropriado. Para ativar o serviço SSO, entre em contato com o seu gerente de conta ou a [equipe de suporte do Wallarm](mailto:support@wallarm.com).
    
    Depois de ativar o serviço
    
    *   você poderá realizar o seguinte procedimento de conexão SSO, e
    *   os blocos relacionados ao SSO estarão visíveis na aba "Integrações".
    
    Além disso, você precisa de contas com direitos de administração tanto para o Wallarm quanto para o Okta.

O processo de conexão SSO com Okta consiste nas seguintes etapas:
1.  [Gerando Parâmetros do Lado Wallarm.][doc-setup-sp]
2.  [Criando e Configurando um Aplicativo em Okta.][doc-setup-idp]
3.  [Transferindo Metadados Okta para o Assistente de Configuração Wallarm.][doc-metadata-transfer]
4.  [Permitindo Acesso ao Aplicativo Wallarm no Lado Okta][doc-allow-access-to-wl]

Depois disso, [configure a autenticação SSO][doc-employ-sso] para os usuários Wallarm.