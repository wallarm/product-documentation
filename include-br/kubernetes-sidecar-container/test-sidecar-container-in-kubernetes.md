1. Obtenha a lista de pods usando o seguinte comando:

    ```
    kubectl get pods
    ```

    O número de contêineres no pod deve aumentar, e o status do pod deve ser **Running**.

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. Vá para Wallarm Console → **Nodes** através do link abaixo e certifique-se de que um novo nó está sendo exibido. Este nó criado é usado para filtrar solicitações para sua aplicação.
    * https://us1.my.wallarm.com/nodes/ para a [Nuvem US](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/nodes/ para a [Nuvem EU](../../../about-wallarm/overview.md#eu-cloud)
3. Envie um pedido malicioso de teste para o aplicativo conforme descrito nestas [instruções](../../../admin-en/installation-check-operation-en.md#2-run-a-test-attack).
4. Vá para Wallarm Console → **Events** através do link abaixo e certifique-se de que um ataque está sendo exibido na lista:
    * https://us1.my.wallarm.com/events/ para a [Nuvem US](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/events/ para a [Nuvem EU](../../../about-wallarm/overview.md#eu-cloud)