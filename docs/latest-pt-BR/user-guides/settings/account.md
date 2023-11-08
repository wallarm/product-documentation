[link-2fa-android-app]:     https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en
[link-2fa-ios-app]:         https://apps.apple.com/app/google-authenticator/id388497605

[img-profile]:              ../../images/user-guides/settings/profile.png
[img-2fa-page]:             ../../images/user-guides/settings/2fa-page.png

# Verificando Seu Perfil

Para ver os dados e configurações do seu perfil, vá para **Configurações** → guia **Perfil**.

No seu perfil, você pode verificar as informações da sua conta:

* Email
* [Função](users.md#user-roles) atribuída - **Admin**, **Analista**, ou **Somente leitura**
* Nome e telefone
* Formato de data e hora preferido a ser usado no sistema Wallarm
* Segurança: última mudança de dados da sua senha e status de autenticação de dois fatores. Alguns elementos podem não estar disponíveis se você usar autenticação SSO.
* Histórico de logins

Você pode clicar no botão *Sair* para sair da sua conta Wallarm.

![Visão geral do perfil][img-profile]

Se necessário, você pode editar as informações da conta na mesma página.

## Mudando Sua Senha

!!! info "Indisponível se usar SSO"
    Se você está usando a autenticação SSO, a autenticação de email/senha está indisponível e você não pode usar ou alterar sua senha. A seção de alteração de senha estará indisponível.

1. Clique no botão *Alterar*.
1. No formulário que aparece, insira sua senha atual, sua nova senha e uma confirmação da nova senha.
1. Clique no botão *Alterar senha*

## Habilitando Autenticação de Dois Fatores

Você pode usar o Google Authenticator (ou aplicativos semelhantes que suportam TOTP) para habilitar a autenticação de dois fatores.

!!! info "Indisponível se usar SSO"
    Se você está usando a autenticação SSO, a autenticação de dois fatores não pode ser ativada. A seção **Autenticação de dois fatores** estará indisponível.

1. Instale o aplicativo *Google Authenticator* ([Android][link-2fa-android-app], [iOS][link-2fa-ios-app]) ou qualquer um compatível.
1. Clique em *Habilitar* na configuração de Autenticação de Dois Fatores.
1. Digitalize o código QR que aparece (ou clique no link *entrada manual* e use a opção de entrada manual).
1. Insira o código de verificação de 6 dígitos gerado pelo seu aplicativo.
1. Insira sua senha.
1. Clique em *Confirmar*.

Sempre que você fizer login, será solicitado o código do seu segundo fator após ultrapassar a solicitação de senha. Obtenha este código do seu aplicativo Google Authenticator. 

A senha é necessária se você quiser desativar a autenticação de dois fatores.

![Visão geral da página de autenticação de dois fatores][img-2fa-page]

!!! info "Compatibilidade"
    Você pode usar qualquer aplicativo ou dispositivo que suporte o Algoritmo de Senha Única Baseado no Tempo (RFC6238) para gerar códigos únicos de uso.