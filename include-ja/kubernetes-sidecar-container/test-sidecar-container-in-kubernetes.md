1. 次のコマンドでポッドの一覧を取得します:

    ```
    kubectl get pods
    ```

    ポッド内のコンテナ数が増えており、ポッドのステータスが**Running**になっているはずです。

    ```
    NAME                       READY   STATUS    RESTARTS   AGE
    mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
    ```
2. 以下のリンクからWallarm Console → **Nodes**に移動し、新しいノードが表示されていることを確認します。この作成されたノードは、アプリケーションへのリクエストをフィルタリングするために使用されます。
    * https://us1.my.wallarm.com/nodes/ [US Cloud](../../../about-wallarm/overview.md#us-cloud)向け
    * https://my.wallarm.com/nodes/ [EU Cloud](../../../about-wallarm/overview.md#eu-cloud)向け
3. これらの[手順](../../../admin-en/uat-checklist-en.md/#node-registers-attacks)に従ってアプリケーションにテスト用の悪意のあるリクエストを送信します。
4. 以下のリンクからWallarm Console → **Attacks**に移動し、リストに攻撃が表示されていることを確認します:
    * https://us1.my.wallarm.com/attacks/ [US Cloud](../../../about-wallarm/overview.md#us-cloud)向け
    * https://my.wallarm.com/attacks/ [EU Cloud](../../../about-wallarm/overview.md#eu-cloud)向け