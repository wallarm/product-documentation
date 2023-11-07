# Configurando autenticação SSO para usuários

[img-enable-sso-for-user]:  ../../../images/admin-guides/configuration-guides/sso/enable-sso-for-user.png
[img-disable-sso-for-user]: ../../../images/admin-guides/configuration-guides/sso/disable-sso-for-user.png

[doc-allow-access-gsuite]:  gsuite/allow-access-to-wl.md
[doc-allow-access-okta]:    okta/allow-access-to-wl.md

[doc-user-sso-guide]:       ../../../user-guides/use-sso.md
[doc-disable-sso]:          change-sso-provider.md   

[anchor-enable]:            #ativando-autenticação-sso-para-usuários 
[anchor-disable]:           #desativando-autenticação-sso-para-usuários      

Você pode [ativar][anchor-enable] ou [desativar][anchor-disable] a autenticação SSO para usuários do portal Wallarm.

##   Ativando autenticação SSO para usuários

!!! Aviso
    *   Ao ativar a autenticação SSO para usuários, o mecanismo de login/senha e a autenticação de dois fatores não estarão disponíveis. Quando a autenticação SSO é ativada, a senha do usuário é apagada e a autenticação de dois fatores é desativada.
    *   Presume-se que você já tenha concedido aos usuários do grupo necessário acesso ao aplicativo Wallarm configurado no [Okta][doc-allow-access-okta] ou na [G Suite][doc-allow-access-gsuite].

Para ativar a autenticação SSO para usuários Wallarm:

1. Vá para **Configurações** → **Usuários**.
1. No menu do usuário, selecione **Ativar login SSO**.

![Ativando SSO para usuário Wallarm][img-enable-sso-for-user]

Na janela pop-up, será solicitado que você envie uma notificação ao usuário de que a autenticação SSO está ativada. Clique no botão **Enviar notificação**. Se a notificação não for necessária, clique em **Cancelar**.

Depois disso, o usuário [pode se autenticar][doc-user-sso-guide] através do provedor de identidade.

Observe que você também pode habilitar o SSO para todos os usuários da conta da empresa usando o modo [SSO Estrito](#modo-estricto-sso).

##  Desativando autenticação SSO para usuários

Para desativar a autenticação SSO para usuários Wallarm:

1. Vá para **Configurações** → **Usuários**.
1. No menu do usuário, selecione **Desativar SSO**.

![Desativando SSO para usuário Wallarm][img-disable-sso-for-user]

Depois disso, o usuário será notificado por e-mail de que o login usando SSO está desativado com uma sugestão (link) para restaurar a senha para fazer login com o par login/senha. Além disso, a autenticação de dois fatores se torna disponível para o usuário.

## Autenticação SSO e API

Quando o SSO está ativado para o usuário, a autenticação para [solicitações à API Wallarm](../../../api/overview.md#your-own-client) se torna indisponível para este usuário. Para obter credenciais de API funcionais, você tem duas opções:

* Se o modo **SSO estrito** não for usado, crie o usuário sem a opção SSO em sua conta da empresa e crie [token(s) de API](../../../api/overview.md#your-own-client).
* Se o modo **SSO estrito** for usado, você pode habilitar a autenticação da API para os usuários do SSO com a função **Administrador**. Para fazer isso, selecione **Ativar acesso à API** no menu deste usuário. O método de autenticação `SSO+API` é ativado para o usuário, permitindo a criação de tokens de API.

    Mais tarde, você pode desativar a autenticação da API para o usuário selecionando **Desativar acesso à API**. Se isso for feito, todos os tokens de API existentes serão excluídos e, em uma semana, removidos.

## Modo estrito de SSO

A Wallarm suporta o modo **SSO estrito** que difere do SSO regular, pois ativa a autenticação SSO para todos os usuários da conta da empresa de uma vez. Outras características do modo estrito de SSO são:

* O método de autenticação para todos os usuários existentes da conta é alterado para SSO.
* Todos os novos usuários recebem o SSO como método de autenticação por padrão.
* O método de autenticação não pode ser alterado para algo diferente de SSO para qualquer usuário.

Para ativar ou desativar o modo estrito de SSO, entre em contato com a [equipe de suporte da Wallarm](mailto:support@wallarm.com).

!!! info "Como as sessões ativas são tratadas ao ativar o SSO estrito"
    Se houver algum usuário conectado à conta da empresa quando ela for alterada para o modo estrito de SSO, essas sessões permanecerão ativas. Após o deslog, os usuários serão solicitados a usar o SSO.

## Resolução de problemas de autenticação SSO

Se o usuário não conseguir fazer login via SSO, a mensagem de erro é exibida com um dos códigos de erro descritos na tabela abaixo. Na maioria dos casos, o administrador da conta da empresa pode corrigir esses erros:

| Código de erro | Descrição | Como corrigir |
|--|--|--|
| `saml_auth_not_found + userid` | O usuário não tem SSO ativado. | Ative o SSO conforme descrito na seção [acima](#ativando-autenticação-sso-para-usuários). |
| `saml_auth_not_found + clientid` | O cliente não possui uma integração SSO na seção **Integrações**. | Siga as instruções na [documentação de integração com o SAML SSO](intro.md). |
| `invalid_saml_response` ou `no_mail_in_saml_response` | O provedor de SSO deu uma resposta inesperada. Pode ser um sinal de uma integração SSO mal configurada. | Faça uma das seguintes:<br><ul><li>Certifique-se de que não existem erros na integração SSO configurada na seção **Integrações** do Console Wallarm.</li><li>Certifique-se de que não existem erros na configuração do lado do provedor de SSO.</li></ul> |
| `user_not_found` | Wallarm não encontrou o usuário com o e-mail especificado. | Crie um usuário com este e-mail no Console Wallarm. |
| `client_not_found` | A conta da empresa não foi encontrada na Wallarm. | Crie uma conta de usuário com um domínio de e-mail apropriado, que criará a conta da empresa imediatamente. |

 Se necessário, o administrador pode entrar em contato com a [equipe de suporte da Wallarm](mailto:support@wallarm.com) para obter ajuda na correção de qualquer um desses erros.
