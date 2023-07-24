# メールレポート

スケジュールされた[PDFレポート](../../../user-guides/search-and-filters/custom-report.md)や瞬時の通知の配信に使用される追加のメールアドレスを設定できます。メッセージの送信は、デフォルトでプライマリメールに設定されています。

* スケジュールされたPDFレポートは、毎日、毎週、または毎月の間隔で送信できます。PDFレポートには、選択した期間中にシステムで検出された脆弱性、攻撃、およびインシデントに関する詳細情報が含まれています。
* 通知には、トリガーされたイベントの簡単な詳細が含まれます:
    --8<-- "../include-ja/integrations/events-for-integrations-mail.md"

## インテグレーションの設定

1. **インテグレーション** セクションを開きます。
2. **メールレポート** ブロックをクリックするか、**インテグレーションを追加** ボタンをクリックして、**メールレポート** を選択します。
3. インテグレーション名を入力します。
4. カンマを区切りとしてメールアドレスを入力します。
5. セキュリティレポートの送信頻度を選択します。頻度が選択されていない場合、レポートは送信されません。
6. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
7. [インテグレーションをテスト](#testing-integration)して、設定が正しいことを確認します。
8. **インテグレーションを追加** をクリックします。

    ![!メールレポートインテグレーション](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration.md"

テスト通知の例：

![!テストメールメッセージ](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"
