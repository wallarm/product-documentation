O nó Wallarm interage com a Wallarm Cloud. Para conectar o nó de filtragem à Nuvem, siga as seguintes etapas:

1. Certifique-se de que sua conta Wallarm possui a função **Administrador** ou **Implantar** ativada e a autenticação de dois fatores desativada no Console Wallarm.

    Você pode verificar as configurações mencionadas navegando até a lista de usuários no [US Cloud](https://us1.my.wallarm.com/settings/users) ou [EU Cloud](https://my.wallarm.com/settings/users).

    ![Lista de usuários no console Wallarm][img-wl-console-users]

2. Execute o script `addnode` em um sistema com o nó Wallarm instalado:

    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/addnode
        ```
3. Insira o email e a senha para sua conta no Console Wallarm.
4. Insira o nome do nó de filtragem ou clique em Enter para usar um nome gerado automaticamente.

    O nome especificado pode ser alterado no Console Wallarm → **Nós** mais tarde.
5. Abra a seção Console Wallarm → **Nós** na [US Cloud](https://us1.my.wallarm.com/nodes) ou [EU Cloud](https://my.wallarm.com/nodes) e verifique se um novo nó de filtragem foi adicionado à lista.