O nó Wallarm interage com a nuvem Wallarm. Para conectar o nó de filtragem à nuvem:

1. Se o [módulo postanalytics instalado separadamente][install-postanalytics-instr]:

    1. Copie o token do nó gerado durante a instalação do módulo postanalytics separado.
    1. Prossiga para o 5º passo na lista abaixo. É **recomendado** usar um token para o nó processando o tráfego inicial e para o nó realizando a pós-análise.
1. Abra o Console Wallarm → **Nós** na [Nuvem dos EUA](https://us1.my.wallarm.com/nodes) ou [Nuvem da UE](https://my.wallarm.com/nodes) e crie o nó do tipo **nó Wallarm**.

    ![Criação de nó Wallarm][img-create-wallarm-node]
1. Copie o token gerado.
1. Execute o script `register-node` em uma máquina onde você instala o nó de filtragem:

    === "Nuvem dos EUA"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN_DO_NÓ> -H us1.api.wallarm.com
        ```
    === "Nuvem da UE"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <TOKEN_DO_NÓ>
        ```
    
    * `<TOKEN_DO_NÓ>` é o valor do token copiado.
    * Você pode adicionar o parâmetro `-n <NOME_DO_HOST>` para definir um nome personalizado para a sua instância de nó. O nome final da instância será: `NOME_DO_HOST_NodeUUID`.

!!! info "Usando um token para várias instalações"
    Você pode conectar vários nós Wallarm à nuvem usando um token, independentemente da opção de implantação selecionada. Esta opção permite agrupar logicamente as instâncias de nó na interface de usuário do Console Wallarm:

    ![Nó com várias instâncias][img-node-with-several-instances]
    
    Abaixo estão alguns exemplos de quando você pode optar por usar um token para várias instalações:

    * Você implanta vários nós Wallarm em um ambiente de desenvolvimento, cada nó está em sua própria máquina de propriedade de um determinado desenvolvedor
    * Os nós para processamento de tráfego inicial e módulos de pós-análise são instalados em servidores separados - é **recomendado** conectar esses módulos à nuvem Wallarm usando o mesmo token de nó