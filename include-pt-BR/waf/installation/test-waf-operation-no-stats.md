1. Envie a solicitação com o ataque de teste [Path Traversal][ptrav-attack-docs] para um endereço de recurso protegido:

    ```
    curl http://localhost/etc/passwd
    ```
2. Abra o Console Wallarm → seção **Eventos** na [Nuvem dos EUA](https://us1.my.wallarm.com/attacks) ou [Nuvem da UE](https://my.wallarm.com/attacks) e certifique-se de que o ataque está exibido na lista.
    ![Ataques na interface][attacks-in-ui-image]