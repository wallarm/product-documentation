O nó de filtragem interage com o Wallarm Cloud. Para conectar o nó ao Cloud:

1. Abra o Console Wallarm → **Nós** no [Cloud dos EUA](https://us1.my.wallarm.com/nodes) ou [Cloud da UE](https://my.wallarm.com/nodes) e crie o nó do tipo **Nó Wallarm**.

    ![Criação do nó Wallarm][img-create-wallarm-node]
1. Copie o token gerado.
1. Execute o script `register-node` em uma máquina onde você instala o nó de filtragem:
    
    === "Cloud dos EUA"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "Cloud da UE"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>` é o valor do token copiado.

    !!! info "Usando um token para várias instalações"
        Você pode usar um token em várias instalações, independentemente da [plataforma][deployment-platform-docs] selecionada. Isso permite o agrupamento lógico de instâncias de nó na interface do usuário do Console Wallarm. Exemplo: você implantar vários nós Wallarm em um ambiente de desenvolvimento, cada nó está em sua própria máquina pertencente a um determinado desenvolvedor.