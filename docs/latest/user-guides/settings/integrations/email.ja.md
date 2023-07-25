# メールレポート

予定された[PDFレポート](../../../user-guides/search-and-filters/custom-report.ja.md)とインスタント通知を配信するために使用される追加のメールアドレスを設定することができます。メッセージの送信は、デフォルトで設定されたプライマリメールに対して行われます。

* スケジュールされたPDFレポートは、毎日、毎週、または毎月送信されることができます。PDFレポートには、選択した期間中にシステムで検出された脆弱性、攻撃、およびインシデントについての詳細な情報が含まれます。
* 通知には、トリガーされたイベントの簡単な詳細が含まれています：
    --8<-- "../include/integrations/events-for-integrations-mail.ja.md"

## インテグレーションの設定

1. **インテグレーション**セクションを開きます。
2. **メールレポート**ブロックをクリックするか、**インテグレーションの追加**ボタンをクリックして**メールレポート**を選択します。
3. インテグレーションの名前を入力します。
4. コンマを使用してメールアドレスを入力します。
5. セキュリティレポートを送信する頻度を選択します。頻度が選択されていない場合、レポートは送信されません。
6. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
7. [インテグレーションをテスト](#テスト-インテグレーション)し設定が正しいことを確認します。
8. **インテグレーションの追加**をクリックします。

    ![!メールレポートインテグレーション](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-with-email.ja.md"

テスト通知の例：

![!テストメールメッセージ](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.ja.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.ja.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.ja.md"