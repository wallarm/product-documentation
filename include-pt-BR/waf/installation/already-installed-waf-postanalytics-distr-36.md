!!! info "Se você implantar vários nós Wallarm"
    Todos os nós Wallarm implantados em seu ambiente devem ser das **mesmas versões**. Os módulos de pós-análises instalados em servidores separados também devem ser das **mesmas versões**.

    Antes da instalação do nó adicional, certifique-se de que sua versão corresponda à versão dos módulos já implantados. Se a versão do módulo implantado está [descontinuada ou será descontinuada em breve (`4.0` ou inferior)][versioning-policy], atualize todos os módulos para a versão mais recente.

    Para verificar a versão do nó de filtragem e o módulo de pós-análises implantados no mesmo servidor:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```
    
    Para verificar a versão do nó de filtragem e o módulo de pós-análises implantados em servidores diferentes:

    === "Debian"
        ```bash
        # execute a partir do servidor com o nó de filtragem Wallarm instalado
        apt list wallarm-node-nginx
        # execute a partir do servidor com pós-análises instaladas
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # execute a partir do servidor com o nó de filtragem Wallarm instalado
        yum list wallarm-node-nginx
        # execute a partir do servidor com pós-análises instaladas
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ```bash
        # execute a partir do servidor com o nó de filtragem Wallarm instalado
        yum list wallarm-node-nginx
        # execute a partir do servidor com pós-análises instaladas
        yum list wallarm-node-tarantool
        ```