1. Aşağıdaki komutu kullanarak pod'ların listesini alın:

    ```
    kubectl get pods
    ```

    Pod içindeki container sayısı artmalı ve pod'un durumu **Running** olmalıdır.

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. Aşağıdaki bağlantıyı kullanarak Wallarm Console → **Nodes** sayfasına gidin ve yeni bir node'un listede görüntülendiğinden emin olun. Bu oluşturulan node, uygulamanıza yapılan istekleri filtrelemek için kullanılır.
    * https://us1.my.wallarm.com/nodes/ for the [US Cloud](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/nodes/ for the [EU Cloud](../../../about-wallarm/overview.md#eu-cloud)
3. [Bu talimatlarda](../../../admin-en/installation-check-operation-en.md#2-run-a-test-attack) açıklandığı üzere uygulamaya test amaçlı kötü niyetli bir istek gönderin.
4. Aşağıdaki bağlantıyı kullanarak Wallarm Console → **Attacks** sayfasına gidin ve listede bir saldırının görüntülendiğinden emin olun:
    * https://us1.my.wallarm.com/attacks/ for the [US Cloud](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/attacks/ for the [EU Cloud](../../../about-wallarm/overview.md#eu-cloud)