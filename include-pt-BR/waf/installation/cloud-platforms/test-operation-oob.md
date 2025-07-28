1. A solicitação com teste de ataque [Path Traversal][ptrav-attack-docs] para um endereço da web ou do servidor proxy que espelha o tráfego ou a máquina com o nó Wallarm:

    ```
    curl http://<ENDEREÇO>/etc/passwd
    ```
2. Abra a Wallarm Console → seção **Eventos** na [Nuvem dos EUA](https://us1.my.wallarm.com/attacks) ou [Nuvem da UE](https://my.wallarm.com/attacks) e certifique-se de que o ataque está listado.
    ![Ataques na interface][attacks-in-ui-image]

Como o Wallarm OOB opera no modo de monitoramento, o nó Wallarm não bloqueia o ataque, mas o registra.