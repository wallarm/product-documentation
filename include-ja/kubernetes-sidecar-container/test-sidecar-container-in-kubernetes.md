1. 以下のコマンドを実行してpod一覧を取得します:

    ```
    kubectl get pods
    ```

    pod内のコンテナの数が増加し、podのステータスが **Running** になっていることを確認します。

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. 以下のリンクからWallarm Console → **Nodes** に移動し、新しいノードが表示されていることを確認します。この作成されたノードはアプリケーションへのリクエストのフィルタリングに使用されます。
    * https://us1.my.wallarm.com/nodes/（[US Cloud](../../../about-wallarm/overview.md#us-cloud)の場合）
    * https://my.wallarm.com/nodes/（[EU Cloud](../../../about-wallarm/overview.md#eu-cloud)の場合）
3. 以下の[手順](../../../admin-en/installation-check-operation-en.md#2-run-a-test-attack)に記載されている方法で、アプリケーションに対してテスト用の悪意あるリクエストを送信します。
4. 以下のリンクからWallarm Console → **Attacks** に移動し、リストに攻撃が表示されていることを確認します:
    * https://us1.my.wallarm.com/attacks/（[US Cloud](../../../about-wallarm/overview.md#us-cloud)の場合）
    * https://my.wallarm.com/attacks/（[EU Cloud](../../../about-wallarm/overview.md#eu-cloud)の場合）