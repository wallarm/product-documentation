統合テストでは、構成の正確性、Wallarm Cloudの利用可能性、および通知フォーマットを確認できます。統合をテストするには、統合の作成や編集時に**Test integration**ボタンを使用できます。

統合テストは以下のように実行されます:

* プリフィックス`[Test message]`を含むテスト通知が選択されたシステムに送信されます。
* テスト通知は、次の各イベントを個別のレコードで含みます:

    * 企業アカウントでの新規ユーザー
    * 新規検出ヒット
    * 企業スコープ内での新規検出IP
    * 企業アカウントでの新規トリガー
    * 新規検出セキュリティ脆弱性
* テスト通知にはテストデータが含まれます。