1. A solicitação com teste de ataque [Path Traversal][ptrav-attack-docs] para um endereço do balanceador de carga ou da máquina com o nó Wallarm:

    ```
    curl http://<ENDEREÇO>/etc/passwd
    ```
2. Abra o Console Wallarm → seção **Eventos** na [Nuvem dos EUA](https://us1.my.wallarm.com/attacks) ou [Nuvem da UE](https://my.wallarm.com/attacks) e certifique-se de que o ataque está exibido na lista.
    ![Ataques na interface][attacks-in-ui-image]

Como a Wallarm opera no modo de monitoramento, o nó Wallarm não bloqueia o ataque, mas o registra.