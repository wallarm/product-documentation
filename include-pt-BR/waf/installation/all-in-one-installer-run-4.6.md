1. Execute o script baixado:

    === "Token de API"
        ```bash
        # Se estiver usando a versão x86_64:
        sudo env WALLARM_LABELS='group=<GRUPO>' sh wallarm-4.6.14.x86_64-glibc.sh

        # Se estiver usando a versão ARM64:
        sudo env WALLARM_LABELS='group=<GRUPO>' sh wallarm-4.6.14.aarch64-glibc.sh
        ```        

        A variável `WALLARM_LABELS` define o grupo ao qual o nó será adicionado (usado para agrupamento lógico de nós na interface do usuário do Wallarm Console).

    === "Token de nó"
        ```bash
        # Se estiver usando a versão x86_64:
        sudo sh wallarm-4.6.14.x86_64-glibc.sh

        # Se estiver usando a versão ARM64:
        sudo sh wallarm-4.6.14.aarch64-glibc.sh
        ```

1. Selecione [Nuvem US](https://us1.my.wallarm.com/) ou [Nuvem EU](https://my.wallarm.com/).
1. Insira o token Wallarm.