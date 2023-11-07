!!! info "Se o módulo de pós-análise estiver instalado em um servidor separado"
    Se os módulos de processamento de tráfego inicial e de pós-análise estiverem instalados em servidores separados, é recomendado conectar esses módulos ao Wallarm Cloud usando o mesmo token de nó. A interface do usuário do Wallarm Console exibirá cada módulo como uma instância de nó separada, por exemplo:

    ![Nó com várias instâncias][img-node-with-several-instances]

    O nó Wallarm já foi criado durante a [instalação do módulo de pós-análise separado][install-postanalytics-instr]. Para conectar o módulo de processamento de tráfego inicial ao Cloud usando as mesmas credenciais do nó:

    1. Copie o token do nó gerado durante a instalação do módulo de pós-análise separado.
    1. Prossiga para a 4ª etapa na lista abaixo.

O nó Wallarm interage com o Wallarm Cloud. Para conectar o nó de filtragem ao Cloud:

1. Abra o Console Wallarm → **Nós** na [US Cloud](https://us1.my.wallarm.com/nodes) ou na [EU Cloud](https://my.wallarm.com/nodes) e crie o nó do tipo **Wallarm node**.

    ![Criando nó Wallarm][img-create-wallarm-node]
1. Copie o token gerado.
1. Execute o script `register-node` em uma máquina onde você instala o nó de filtragem:
    
    === "US Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN> -H us1.api.wallarm.com
        ```
    === "EU Cloud"
        ``` bash
        sudo /usr/share/wallarm-common/register-node -t <NODE_TOKEN>
        ```
    
    `<NODE_TOKEN>` é o valor do token copiado.

    !!! info "Se o módulo de pós-análise estiver instalado em um servidor separado"
        Se o módulo de pós-análise estiver instalado em um servidor separado, recomenda-se usar o token de nó gerado durante a [instalação do módulo de pós-análise separado][install-postanalytics-instr].