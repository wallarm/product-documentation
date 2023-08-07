1. 次のコマンドを使用して、Podのリストを取得します：

    ```
    kubectl get pods
    ```

    Pod内のコンテナの数は増え、Podのステータスは**Running**であるはずです。

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. 下記のリンクを通じてWallarm Console → **Nodes**に移動し、新規に表示されているノードを確認します。この作成されたノードは、アプリケーションに対するリクエストをフィルタリングするために使用されます。
    * [US Cloud](../../../about-wallarm/overview.md#us-cloud)の場合：https://us1.my.wallarm.com/nodes/ 
    * [EU Cloud](../../../about-wallarm/overview.md#eu-cloud)の場合：https://my.wallarm.com/nodes/ 
3. これらの[指示書](../../../admin-en/installation-check-operation-en.md#2-run-a-test-attack)に記述されているように、アプリケーションに対してテスト攻撃リクエストを送信します。
4. 下記のリンクを通じてWallarm Console → **Events**に移動し、リストに攻撃が表示されていることを確認します：
    * [US Cloud](../../../about-wallarm/overview.md#us-cloud)の場合：https://us1.my.wallarm.com/events/ 
    * [EU Cloud](../../../about-wallarm/overview.md#eu-cloud)の場合：https://my.wallarm.com/events/