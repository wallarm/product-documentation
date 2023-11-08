[img-wl-console-users]:         ../images/check-users.png

[link-wl-console-us]:              https://us1.my.wallarm.com/
[link-wl-console-eu]:              https://my.wallarm.com/
[link-wl-console-users-us]:        https://us1.my.wallarm.com/settings/users
[link-wl-console-users-eu]:        https://my.wallarm.com/settings/users

[anchor-token]:                      #connecting-using-the-filtering-node-token
[anchor-credentials]:                      #connecting-using-your-email-and-password

O nó de filtragem interage com a Wallarm Cloud. Existem duas maneiras de conectar o nó à nuvem:
* [Usando o token do nó de filtragem][anchor-token]
* [Usando seu email e senha da conta Wallarm][anchor-credentials]

!!! info "Direitos de acesso necessários"
    Certifique-se de que sua conta Wallarm tem a função **Administrador** ou **Deploy** habilitada e a autenticação de dois fatores desativada, permitindo assim que você conecte um nó de filtragem à nuvem.

    Você pode verificar os parâmetros acima navegando até a lista de contas de usuário no Console Wallarm.
    
    * Se você está usando <https://my.wallarm.com/>, siga para o [link a seguir][link-wl-console-users-eu] para verificar suas configurações de usuário.
    * Se você está usando <https://us1.my.wallarm.com/>, siga para o [link a seguir][link-wl-console-users-us] para verificar suas configurações de usuário.
    ![Lista de usuários no console Wallarm][img-wl-console-users]

#### Conectando usando o token do nó de filtragem

Para conectar o nó à nuvem usando o token, prossiga com as seguintes etapas:

1. Crie um novo nó na seção **Nós** do Console Wallarm.
    1. Clique no botão **Criar novo nó**.
    2. Crie o **Nó Wallarm**.
2. Copie o token do nó.
3. Na máquina virtual, execute o script `addcloudnode`:
    
    !!! info
        Você precisa escolher qual script executar dependendo da nuvem que está usando.
        
        * Se você está usando <https://us1.my.wallarm.com/>, execute o script na aba **Nuvem US** abaixo.
        * Se você está usando <https://my.wallarm.com/>, execute o script na aba **Nuvem EU** abaixo.
    
    === "Nuvem US"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode -H us1.api.wallarm.com
        ```
    === "Nuvem EU"
        ``` bash
        sudo /usr/share/wallarm-common/addcloudnode
        ```
        
4. Cole o token do nó de filtragem copiado anteriormente. 

Seu nó agora sincronizará com a nuvem a cada 2-4 minutos, de acordo com a configuração de sincronização padrão.

!!! info "Configuração de sincronização do nó de filtragem e nuvem"
    Após executar o script `addcloudnode`, o arquivo `/etc/wallarm/syncnode` contendo as configurações de sincronização do nó de filtragem e da nuvem será criado. As configurações de sincronização do nó de filtragem e da nuvem podem ser alteradas por meio do arquivo `/etc/wallarm/syncnode`.
    
    [Mais detalhes sobre a configuração de sincronização do nó de filtragem e Wallarm Cloud →](configure-cloud-node-synchronization-en.md#cloud-node-and-wallarm-cloud-synchronization)

#### Conectando usando seu email e senha

Para conectar o nó à Wallarm Cloud usando suas credenciais da conta, prossiga com as seguintes etapas:

1.  Na máquina virtual, execute o script `addnode`:
    
    !!! info
        Você precisa escolher qual script executar dependendo da nuvem que está usando.
        
        * Se você está usando <https://us1.my.wallarm.com/>, execute o script na aba **Nuvem US** abaixo.
        * Se você está usando <https://my.wallarm.com/>, execute o script na aba **Nuvem EU** abaixo.
    
    === "Nuvem US"
        ```bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "Nuvem EU"
        ```bash
        sudo /usr/share/wallarm-common/addnode
        ```
    
2.  Forneça seu email e senha da conta Wallarm quando solicitado.

!!! info "Acesso à API"
    A escolha da API para o seu nó de filtragem depende da nuvem que você está usando. Por favor, selecione a API de acordo:
    
    * Se você está usando <https://my.wallarm.com/>, seu nó requer acesso a `https://api.wallarm.com:444`.
    * Se você está usando <https://us1.my.wallarm.com/>, seu nó requer acesso a `https://us1.api.wallarm.com:444`.
    
    Certifique-se de que o acesso não está bloqueado por um firewall.

Seu nó agora sincronizará com a nuvem a cada 2-4 minutos, de acordo com a configuração de sincronização padrão.

!!! info "Configuração de sincronização do nó de filtragem e nuvem"
    Após executar o script `addnode`, o arquivo `/etc/wallarm/node.yaml` contendo as configurações de sincronização do nó de filtragem e da nuvem e outras configurações necessárias para a operação correta do nó Wallarm será criado. As configurações de sincronização do nó de filtragem e da nuvem podem ser alteradas por meio do arquivo `/etc/wallarm/node.yaml` e variáveis de ambiente do sistema.
    
    [Mais detalhes sobre a configuração de sincronização do nó de filtragem e Wallarm Cloud →](configure-cloud-node-synchronization-en.md#regular-node-and-wallarm-cloud-synchronization)