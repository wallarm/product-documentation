Para instalar o postanalytics separadamente com o instalador all-in-one, use:

=== "Token da API"
    ```bash
    # Se estiver usando a versão x86_64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh postanalytics

    # Se estiver usando a versão ARM64:
    sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh postanalytics
    ```        

    A variável `WALLARM_LABELS` define o grupo ao qual o nó será adicionado (usado para agrupamento lógico de nós no Wallarm Console UI).

=== "Token do nó"
    ```bash
    # Se estiver usando a versão x86_64:
    sudo sh wallarm-4.8.0.x86_64-glibc.sh postanalytics

    # Se estiver usando a versão ARM64:
    sudo sh wallarm-4.8.0.aarch64-glibc.sh postanalytics
    ```