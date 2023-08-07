# メールレポート

予定された [PDF レポート](../../../user-guides/search-and-filters/custom-report.md) および即時通知を配信するために使用される追加のメールアドレスを設定することができます。メッセージの送信は、デフォルトで主メールアドレスに設定されています。

* 予定されたPDFレポートは、日次、週次、または月次で送信することが可能です。PDFレポートには、選択した期間にシステムで検出された脆弱性、攻撃、およびインシデントに関する詳細情報が含まれます。
* 通知には、トリガーされたイベントの簡略な詳細が含まれます：
    --8<-- "../include/integrations/events-for-integrations-mail.md"

## インテグレーションの設定

1. **インテグレーション** セクションを開きます。
2. **メールレポート** ブロックをクリックするか、**インテグレーションを追加** ボタンをクリックし、**メールレポート** を選択します。 
3. インテグレーションの名前を入力します。
4. コンマを使用してメールアドレスを入力します。
5. セキュリティレポートを送信する頻度を選択します。頻度が選ばれない場合、レポートは送信されません。
6. 通知をトリガーするイベントの種類を選択します。イベントが選ばれない場合、通知は送信されません。
7. [インテグレーションをテスト](#テスト-インテグレーション)し、設定が正しいことを確認します。
8. **インテグレーションを追加** をクリックします。

    ![!メールレポートのインテグレーション](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-with-email.md"

テスト通知の例：

![!テストメールメッセージ](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.md"