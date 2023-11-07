1. Execute o script baixado:

   === "Token da API"
       ```bash
       # Se estiver usando a versão x86_64:
       sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.x86_64-glibc.sh

       # Se estiver usando a versão ARM64:
       sudo env WALLARM_LABELS='group=<GROUP>' sh wallarm-4.8.0.aarch64-glibc.sh
       ```        

       A variável `WALLARM_LABELS` define o grupo ao qual o nó será adicionado (usado para agrupar logicamente os nós na interface do usuário do Console Wallarm).

   === "Token do nó"
       ```bash
       # Se estiver usando a versão x86_64:
       sudo sh wallarm-4.8.0.x86_64-glibc.sh

       # Se estiver usando a versão ARM64:
       sudo sh wallarm-4.8.0.aarch64-glibc.sh
       ```

1. Selecione [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem da EU](https://my.wallarm.com/).
1. Insira o token Wallarm.