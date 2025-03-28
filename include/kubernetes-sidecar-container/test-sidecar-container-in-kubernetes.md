1. Get the list of pods using the following command:

    ```
    kubectl get pods
    ```

    The number of containers in the pod should increase, and the status of the pod should be **Running**.

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. Go to Wallarm Console → **Nodes** via the link below and make sure that a new node is displayed. This created node is used to filter requests to your application.
    * https://us1.my.wallarm.com/nodes/ for the [US Cloud](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/nodes/ for the [EU Cloud](../../../about-wallarm/overview.md#eu-cloud)
3. Send a test malicious request to the application as described in these [instructions](../../../admin-en/uat-checklist-en.md/#node-registers-attacks).
4. Go to Wallarm Console → **Attacks** via the link below and make sure that an attack is displayed in the list:
    * https://us1.my.wallarm.com/attacks/ for the [US Cloud](../../../about-wallarm/overview.md#us-cloud)
    * https://my.wallarm.com/attacks/ for the [EU Cloud](../../../about-wallarm/overview.md#eu-cloud)