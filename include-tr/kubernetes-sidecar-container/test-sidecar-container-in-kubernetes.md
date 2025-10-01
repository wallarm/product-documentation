1. Aşağıdaki komutu kullanarak pod listesini alın:

    ```
    kubectl get pods
    ```

    Pod içindeki container sayısı artmalı ve pod'un durumu **Running** olmalıdır.

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. Aşağıdaki bağlantı üzerinden Wallarm Console → **Nodes** bölümüne gidin ve yeni bir node'un görüntülendiğinden emin olun. Bu oluşturulan node, uygulamanıza gelen istekleri filtrelemek için kullanılır.
    * https://us1.my.wallarm.com/nodes/ [ABD Bulutu](../../../about-wallarm/overview.md#us-cloud) için
    * https://my.wallarm.com/nodes/ [AB Bulutu](../../../about-wallarm/overview.md#eu-cloud) için
3. Bu [talimatlarda](../../../admin-en/uat-checklist-en.md/#node-registers-attacks) açıklandığı gibi uygulamaya test amaçlı kötü amaçlı bir istek gönderin.
4. Aşağıdaki bağlantı üzerinden Wallarm Console → **Attacks** bölümüne gidin ve listede bir saldırının görüntülendiğinden emin olun:
    * https://us1.my.wallarm.com/attacks/ [ABD Bulutu](../../../about-wallarm/overview.md#us-cloud) için
    * https://my.wallarm.com/attacks/ [AB Bulutu](../../../about-wallarm/overview.md#eu-cloud) için