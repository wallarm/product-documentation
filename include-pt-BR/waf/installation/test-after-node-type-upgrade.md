1. Envie a solicitação com o teste de ataque [Path Traversal][ptrav-attack-docs] para o endereço do aplicativo:

    ```
    curl http://localhost/etc/passwd
    ```
1. Certifique-se de que o nó do novo tipo processe a solicitação da mesma forma que o nó **regular** fazia, por exemplo:

    * Bloqueia a solicitação se o [modo de filtração][waf-mode-instr] apropriado estiver configurado.
    * Retorna a [página de bloqueio personalizada][blocking-page-instr] se estiver configurada.
2. Abra o Console Wallarm → **Eventos** na [Nuvem EU](https://my.wallarm.com/attacks) ou [Nuvem US](https://us1.my.wallarm.com/attacks) e certifique-se de que:

    * O ataque é exibido na lista.
    * Detalhes do hit exibem o UUID do nó Wallarm.

    ![Ataques na interface][attacks-in-ui-image]