統合テストにより、設定の正確さ、Wallarmクラウドの可用性、および通知の形式を確認できます。統合をテストするためには、統合を作成または編集する際に **統合テスト** ボタンを使用できます。

統合は次のようにしてテストされます：

* 接頭辞が `[Test message]` のテスト通知が選択したシステムに送信されます。
* テスト通知は以下のイベントをカバーします（それぞれが1つのレコードに含まれます）：

    * 会社アカウントの新しいユーザー
    * 会社範囲の新たに見つけたIP
    * 新たに見つけたセキュリティの脆弱性
* テスト通知にはテストデータが含まれます。