1. Aşağıdaki komutu kullanarak podların listesini alın:

    ```
    kubectl get pods
    ```

    Pod'daki konteyner sayısı artmalı ve pod'un durumu **Running** olmalıdır.

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. Aşağıdaki bağlantıyı kullanarak Wallarm Konsolu → **Nodes**'a gidin ve yeni bir düğümün görüntülendiğinden emin olun. Bu oluşturulan düğüm, uygulamanıza yapılan istekleri filtrelemek için kullanılır.
    * https://us1.my.wallarm.com/nodes/ [US Bulutu](../../../about-wallarm/overview.md#us-cloud) için
    * https://my.wallarm.com/nodes/ [EU Bulutu](../../../about-wallarm/overview.md#eu-cloud) için
3. Uygulamaya bir deneme kötü amaçlı istek gönderin, [talimatlar](../../../admin-en/installation-check-operation-en.md#2-run-a-test-attack) bu durumu açıklar.
4. Aşağıdaki bağlantıyı kullanarak Wallarm Konsolu → **Events**'a gidin ve saldırının listeye eklendiğinden emin olun:
    * https://us1.my.wallarm.com/events/ [US Bulutu](../../../about-wallarm/overview.md#us-cloud) için
    * https://my.wallarm.com/events/ [EU Bulutu](../../../about-wallarm/overview.md#eu-cloud) için