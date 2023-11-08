1. Exclua o módulo postanalytics antigo no Console Wallarm → **Nós** selecionando seu nó do módulo postanalytics e clicando em **Excluir**.
2. Confirme a ação.

   Quando o nó do módulo postanalytics é excluído da Cloud, ele deixará de participar da filtragem de solicitações para suas aplicações. A exclusão não pode ser desfeita. O nó do módulo postanalytics será excluído permanentemente da lista de nós.

3. Exclua a máquina com o módulo postanalytics antigo ou simplesmente limpe-a dos componentes do módulo postanalytics do Wallarm:

   === "Debian"
       ```bash
       sudo apt remove wallarm-node-tarantool
       ```
   === "Ubuntu"
       ```bash
       sudo apt remove wallarm-node-tarantool
       ```
   === "CentOS ou Amazon Linux 2.0.2021 e inferior"
       ```bash
       sudo yum remove wallarm-node-tarantool
       ```
   === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
       ```bash
       sudo yum remove wallarm-node-tarantool
       ```
   === "RHEL 8.x"
       ```bash
       sudo yum remove wallarm-node-tarantool
       ```