1. Get the list of pods using the following command:

    ```
    kubectl get pods
    ```

    The number of containers in the pod should increase and the status of the pod should be "Running".

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. Go to your Wallarm account > *Nodes* by the link below and make sure that a new node is displayed. The created node is used to filter requests to your application.
    * https://my.wallarm.com/nodes/ for the [EU cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
    * https://us1.my.wallarm.com/nodes/ for the [US cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)
3. Send a malicious test attack request to the application as described in this [instruction](../../../quickstart-en/qs-check-operation-en.md#2-run-a-test-attack).
4. Go to your Wallarm account > *Events* by the link below and make sure that an attack is displayed in the list:
    * https://my.wallarm.com/events/ for the [EU cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
    * https://us1.my.wallarm.com/events/ for the [US cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)