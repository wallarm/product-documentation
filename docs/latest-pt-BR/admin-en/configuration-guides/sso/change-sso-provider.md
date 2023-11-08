#   Alterando a Autenticação SSO Configurada

[img-disable-sso-provider]:     ../../../images/admin-guides/configuration-guides/sso/disable-sso-provider.png

[doc-setup-sso-gsuite]:     gsuite/overview.md
[doc-setup-sso-okta]:       okta/overview.md

[anchor-edit]:      #editing
[anchor-disable]:   #disabling
[anchor-remove]:    #removing

Você pode [editar][anchor-edit], [desabilitar][anchor-disable] ou [remover][anchor-remove] a autenticação SSO configurada.

!!! warning "Atenção: o SSO será desativado para todos os usuários"
    Note que, quando você desativa ou remove a autenticação SSO, isso será desativado para todos os usuários. Os usuários serão notificados de que a autenticação SSO está desativada e que a senha precisa ser restaurada.

## Editando

Para editar a autenticação SSO configurada:

1. Vá para **Configurações → Integração** no UI do Wallarm.
2. Selecione a opção **Editar** no menu do fornecedor SSO configurado.
3. Atualize os detalhes do fornecedor SSO e **Salve as alterações**.

##  Desativando

Para desativar o SSO, vá para *Configurações → Integração*. Clique no bloco do correspondente fornecedor SSO e, em seguida, no botão *Desativar*.

![disabling-sso-provider][img-disable-sso-provider]

Na janela pop-up, é necessário confirmar a desativação do fornecedor SSO, bem como a desativação da autenticação SSO de todos os usuários.
Clique em *Sim, desative*.

Após a confirmação, o fornecedor SSO será desconectado, mas suas configurações serão salvas e você poderá habilitar este fornecedor novamente no futuro. Além disso, após a desativação, você poderá conectar outro fornecedor SSO (outro serviço como um provedor de identidade).

##  Removendo

!!! warning "Atenção: Sobre a remoção do fornecedor SSO"
    Em comparação com a desativação, a remoção do fornecedor SSO causará a perda de todas as suas configurações sem a possibilidade de recuperação.
    
    Se você precisar reconectar seu fornecedor, terá que reconfigurá-lo.


Remover o fornecedor SSO é semelhante a desativá-lo.

Vá para *Configurações → Integração*. Clique no bloco do correspondente fornecedor SSO e, em seguida, no botão *Remover*.

Na janela pop-up, é necessário confirmar a remoção do fornecedor, bem como desativar a autenticação SSO de todos os usuários.
Clique em *Sim, remova*.

Após a confirmação, o fornecedor SSO selecionado será removido e não estará mais disponível. Além disso, você poderá se conectar a outro fornecedor SSO.