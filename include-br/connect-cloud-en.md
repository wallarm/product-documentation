[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

!!! info "Acesso à API"
    A escolha da API para o seu nó de filtragem depende da nuvem que você está usando. Por favor, selecione a API de acordo:

    * Se você estiver usando <https://my.wallarm.com/>, seu nó requer acesso ao `https://api.wallarm.com:444`.
    * Se você estiver usando <https://us1.my.wallarm.com/>, seu nó requer acesso ao `https://us1.api.wallarm.com:444`.
  
    Certifique-se de que o acesso não está sendo bloqueado por um firewall.

O nó de filtragem interage com a Wallarm Cloud. 

Para conectar o nó à nuvem usando as credenciais da sua conta na nuvem, siga os seguintes passos:

1. Verifique se a sua conta Wallarm tem a função de **Administrador** ou **Deploy** habilitada e a autenticação de dois fatores desabilitada, o que permite conectar um nó de filtragem à Nuvem. 

    Você pode verificar os parâmetros mencionados acima navegando para a lista de contas do usuário no Console Wallarm.
    
    * Se você estiver usando <https://my.wallarm.com/>, proceda para o [link seguinte][link-wl-console-users-eu] para verificar suas configurações de usuário.
    * Se você estiver usando <https://us1.my.wallarm.com/>, proceda para o [link seguinte][link-wl-console-users-us] para verificar as configurações do usuário.

    ![Lista de usuários no console Wallarm][img-wl-console-users]

        
2.  Execute o script `addnode` em uma máquina na qual você está instalando o nó de filtragem:

    !!! info
        Você deve escolher o script para executar, dependendo da Nuvem que está usando.
    
        * Se você estiver usando <https://us1.my.wallarm.com/>, execute o script na aba **US Cloud** abaixo.
        * Se estiver usando <https://my.wallarm.com/>, execute o script na aba **EU Cloud** abaixo.

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
    Para especificar o nome do nó criado, use a opção `-n <nome do nó>`. Além disso, o nome do nó pode ser alterado no Console Wallarm → **Nós**.

3.  Forneça o e-mail e a senha da sua conta Wallarm quando solicitado.