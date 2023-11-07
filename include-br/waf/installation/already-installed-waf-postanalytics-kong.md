!!! info "Se você implantar vários nós Wallarm"
    Todos os nós Wallarm implantados em seu ambiente devem ser das **mesmas versões**. Os módulos de pós-analítica instalados em servidores separados também devem ser das **mesmas versões**.

    Antes da instalação do nó adicional, por favor, certifique-se de que sua versão corresponde à versão dos módulos já implantados. Se a versão do módulo implantado estiver [desatualizada ou será desatualizada em breve (`4.0` ou inferior)][versioning-policy], atualize todos os módulos para a versão mais recente.

    Para verificar a versão do nó de filtragem e do módulo de pós-analítica implantados no mesmo servidor:

    === "Debian"
        ```bash
        apt list wallarm-node
        ```
    === "Ubuntu"
        ```bash
        apt list wallarm-node
        ```
    === "CentOS"
        ```bash
        yum list wallarm-node
        ```

    Para verificar a versão do nó de filtragem e do módulo de pós-analítica implantados em servidores diferentes:

    === "Debian"
        ```bash
        # executar do servidor com o nó de filtragem Wallarm instalado
        apt list wallarm-node-nginx
        # executar do servidor com o postanalytics instalado
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # executar do servidor com o nó de filtragem Wallarm instalado
        apt list wallarm-node-nginx
        # executar do servidor com o postanalytics instalado
        apt list wallarm-node-tarantool
        ```
    === "CentOS"
        ```bash
        # executar do servidor com o nó de filtragem Wallarm instalado
        yum list wallarm-node-nginx
        # executar do servidor com o postanalytics instalado
        yum list wallarm-node-tarantool
        ```