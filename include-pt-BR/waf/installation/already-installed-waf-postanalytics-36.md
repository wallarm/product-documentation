!!! info "Se você implantar vários nós do Wallarm"
    Todos os nós do Wallarm implantados no seu ambiente devem ser das **mesmas versões**. Os módulos de pós-análise instalados em servidores separados também devem ser das **mesmas versões**.

    Antes de instalar o nó adicional, por favor, certifique-se de que a versão dele corresponde à versão dos módulos já implantados. Se a versão do módulo implantado estiver [desatualizada ou em breve será desatualizada (`4.0` ou inferior)][política-de-versão], atualize todos os módulos para a versão mais recente.

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
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ```bash
        yum list wallarm-node
        ```

    Para conferir as versões do nó de filtragem e de pós-análise instaladas em servidores diferentes:

    === "Debian"
        ```bash
        # execute no servidor com o nó de filtragem Wallarm instalado
        apt list wallarm-node-nginx
        # execute no servidor com a pós-análise instalada
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # execute no servidor com o nó de filtragem Wallarm instalado
        apt list wallarm-node-nginx
        # execute no servidor com a pós-análise instalada
        apt list wallarm-node-tarantool
        ```
    === "CentOS ou Amazon Linux 2.0.2021x e inferior"
        ```bash
        # execute no servidor com o nó de filtragem Wallarm instalado
        yum list wallarm-node-nginx
        # execute no servidor com a pós-análise instalada
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ```bash
        # execute no servidor com o nó de filtragem Wallarm instalado
        yum list wallarm-node-nginx
        # execute no servidor com a pós-análise instalada
        yum list wallarm-node-tarantool
        ```