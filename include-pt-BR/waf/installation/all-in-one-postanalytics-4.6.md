Para instalar o postanalytics separadamente com o instalador all-in-one, utilize:

=== "Token da API"
    ```bash
    # Se estiver usando a versão x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.14.x86_64-glibc.sh postanalytics

    # Se estiver usando a versão ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.6.14.aarch64-glibc.sh postanalytics
    ```       

    A variável `WALLARM_LABELS` define o grupo ao qual o nó será adicionado (utilizada para agrupamento lógico de nós na interface de usuário do Wallarm Console).

=== "Token do nó"
    ```bash
    # Se estiver usando a versão x86_64:
    sudo sh wallarm-4.6.14.x86_64-glibc.sh postanalytics

    # Se estiver usando a versão ARM64:
    sudo sh wallarm-4.6.14.aarch64-glibc.sh postanalytics
    ```