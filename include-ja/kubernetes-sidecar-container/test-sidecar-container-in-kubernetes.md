次のコマンドを使用して、ポッドのリストを取得します。

```
kubectl get pods
```

ポッド内のコンテナの数が増え、ポッドのステータスが**Running**になる必要があります。

```
NAME                       READY   STATUS    RESTARTS   AGE
mychart-856f957bbd-cr4kt   2/2     Running   0          3m48s
```

2. 以下のリンクからWallarm Console → **Nodes**に移動し、新しいノードが表示されていることを確認してください。この作成されたノードは、アプリケーションへのリクエストのフィルタリングに使用されます。
    * [USクラウド](../../../about-wallarm/overview.md#us-cloud)の場合：https://us1.my.wallarm.com/nodes/
    * [EUクラウド](../../../about-wallarm/overview.md#eu-cloud)の場合：https://my.wallarm.com/nodes/
3. この[指示](../../../admin-en/installation-check-operation-en.md#2-run-a-test-attack)に記載されているように、アプリケーションにテスト用の悪意のあるリクエストを送信します。
4. 以下のリンクからWallarm Console → **Events**に移動し、攻撃がリストに表示されていることを確認してください：
    * [USクラウド](../../../about-wallarm/overview.md#us-cloud)の場合：https://us1.my.wallarm.com/events/
    * [EUクラウド](../../../about-wallarm/overview.md#eu-cloud)の場合：https://my.wallarm.com/events/