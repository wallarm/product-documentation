1. Envie a solicitação com testes de ataques [SQLI][sqli-attack-docs] e [XSS][xss-attack-docs] para o endereço do recurso protegido:

    ```
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```
2. Abra o Console Wallarm → seção **Eventos** na [NUVEM DOS EUA](https://us1.my.wallarm.com/attacks) ou [NUVEM DA UE](https://my.wallarm.com/attacks) e certifique-se de que os ataques são mostrados na lista.
    ![Ataques na interface][attacks-in-ui-image]