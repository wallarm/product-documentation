統合テストにより、設定の正確さ、Wallarmクラウドの利用可能性、および通知形式を確認できます。統合をテストするためには、統合の作成または編集時に **統合をテストする** ボタンを使用できます。

統合の検証は次のように行われます:

* 接頭辞が `[テストメッセージ]` のテスト通知が、選択したシステムに送信されます。
* テスト通知は次のイベントをカバーします（それぞれが単一のレコード内）：

    * 会社アカウントの新規ユーザー
    * 会社の範囲内で新たに発見されたIP
    * 会社アカウントの新規トリガー
    * 新たに発見されたセキュリティ上の脆弱性
* テスト通知はテストデータを含みます。