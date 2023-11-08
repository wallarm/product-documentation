!!! info "Se você implantar vários nós do Wallarm"
    Todos os nós do Wallarm implantados no seu ambiente devem ser das **mesmas versões**. Os módulos de pós-análise instalados em servidores separados também devem ser das **mesmas versões**.

    Antes da instalação do nó adicional, certifique-se de que sua versão corresponda à versão dos módulos já implantados. Se a versão do módulo implantado estiver [descontinuada ou será descontinuada em breve (`4.0` ou inferior)][versioning-policy], atualize todos os módulos para a versão mais recente.

    Para verificar a versão instalada do nó de filtragem e da pós-análise instalados no mesmo servidor:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS ou Amazon Linux 2.0.2021x e inferior"
        ```bash
        yum list wallarm-node
        ```

    Para verificar as versões do nó de filtragem e da pós-análise instalados em servidores diferentes:

    === "Debian"
        ```bash
        # execute do servidor com o nó de filtragem Wallarm instalado
        apt list wallarm-node-nginx
        # execute do servidor com a pós-análise instalada
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # execute do servidor com o nó de filtragem Wallarm instalado
        apt list wallarm-node-nginx
        # execute do servidor com a pós-análise instalada
        apt list wallarm-node-tarantool
        ```
    === "CentOS ou Amazon Linux 2.0.2021x e inferior"
        ```bash
        # execute do servidor com o nó de filtragem Wallarm instalado
        yum list wallarm-node-nginx
        # execute do servidor com a pós-análise instalada
        yum list wallarm-node-tarantool
        ```