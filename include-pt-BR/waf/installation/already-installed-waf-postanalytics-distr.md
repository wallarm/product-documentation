!!! info "Se você implantar vários nós Wallarm"
    Todos os nós Wallarm implantados em seu ambiente devem ser das **mesmas versões**. Os módulos de postanalíticos instalados em servidores separados também devem ser das **mesmas versões**.

    Antes da instalação do nó adicional, por favor, certifique-se de que sua versão corresponde à versão dos módulos já implantados. Se a versão do módulo implantado está [descontinuada ou será descontinuada em breve (`4.0` ou inferior)][versioning-policy], atualize todos os módulos para a versão mais recente.

    Para verificar a versão do nó de filtragem e do módulo de postanalíticos implantado no mesmo servidor:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    Para verificar a versão do nó de filtragem e do módulo de postanalíticos implantado em servidores diferentes:

    === "Debian"
        ```bash
        # execute a partir do servidor com o nó de filtragem Wallarm instalado
        apt list wallarm-node-nginx
        # execute a partir do servidor com o postanalíticos instalado
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # execute a partir do servidor com o nó de filtragem Wallarm instalado
        yum list wallarm-node-nginx
        # execute a partir do servidor com o postanalíticos instalado
        yum list wallarm-node-tarantool
        ```
