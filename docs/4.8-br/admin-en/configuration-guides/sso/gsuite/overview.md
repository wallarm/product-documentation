#   Conectando o SSO com G Suite

[doc-setup-sp]:                     setup-sp.md
[doc-setup-idp]:                    setup-idp.md    
[doc-metadata-transfer]:            metadata-transfer.md
[doc-allow-access-to-wl]:           allow-access-to-wl.md

[doc-user-sso-guide]:               ../../../../user-guides/use-sso.md

[doc-employ-sso]:                   ../employ-user-auth.md
[doc-disable-sso]:                  ../change-sso-provider.md

[link-gsuite]:                      https://gsuite.google.com/

Este guia cobrirá o processo de conectar o serviço [G Suite][link-gsuite] (Google) como um provedor de identidade ao Wallarm, que atua como o provedor de serviço.

!!! nota
    Por padrão, a conexão SSO no Wallarm não está disponível sem ativar o serviço apropriado. Para ativar o serviço SSO, entre em contato com o gerente da sua conta ou com a [equipe de suporte do Wallarm](mailto:support@wallarm.com).
    
    Após a ativação do serviço
    
    * você poderá realizar o seguinte procedimento de conexão SSO e
    * os blocos relacionados ao SSO serão visíveis na aba “Integrações”.
    
    Além disso, você precisa de contas com direitos de administração tanto para Wallarm quanto para o G Suite.

O processo de conexão do SSO com o G Suite compreende as seguintes etapas:
1.  [Geração de Parâmetros do Lado do Wallarm.][doc-setup-sp]
2.  [Criação e Configuração de um Aplicativo no G Suite.][doc-setup-idp]
3.  [Transferência de Metadados do G Suite para o Assistente de Configuração do Wallarm.][doc-metadata-transfer]
4.  [Permitindo o Acesso ao Aplicativo Wallarm pelo Lado do G Suite][doc-allow-access-to-wl]

Depois disso, [configure a autenticação SSO][doc-employ-sso] para os usuários Wallarm.