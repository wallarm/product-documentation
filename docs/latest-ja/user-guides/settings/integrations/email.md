# Emailレポート

スケジュールされた[PDFレポート](../../../user-guides/search-and-filters/custom-report.md)および即時通知の配信に使用する追加のメールアドレスを設定できます。プライマリのメールアドレスへの送信は既定で設定されています。

スケジュールされたPDFレポートは日次、週次、または月次で送信できます。PDFレポートには、選択した期間にシステムで検出された脆弱性、攻撃、インシデントに関する詳細情報が含まれます。通知には、トリガーされたイベントの簡潔な概要が含まれます。

## インテグレーションの設定

1. **Integrations**セクションを開きます。
1. **Email report**ブロックをクリックするか、**Add integration**ボタンをクリックして**Email report**を選択します。 
1. インテグレーション名を入力します。
1. カンマ区切りでメールアドレスを入力します。
1. セキュリティレポートの送信頻度を選択します。頻度を選択しない場合、レポートは送信されません。
1. 通知をトリガーするイベントタイプを選択します。

    ![Email reportインテグレーション](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

    利用可能なイベントの詳細：

    --8<-- "../include/integrations/events-for-integrations-mail.md"

    !!! info "無効化できない通知"
        Wallarmは、無効化できない一部の通知をユーザーのメールアドレスにも送信します：

        * [サブスクリプション](../../../about-wallarm/subscription-plans.md)の通知
        * [APIトークンの有効期限切れ](../../../user-guides/settings/api-tokens.md#token-expiration)の通知
        * [Hit sampling](../../../user-guides/events/grouping-sampling.md#sampling-of-hits)の通知

1. **Test integration**をクリックして、設定の正しさ、Wallarm Cloudの到達性、通知形式を確認します。

    これにより、先頭に[Test message]が付いたテスト通知が送信されます：

    ![テストメールメッセージ](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

1. **Add integration**をクリックします。

## 追加アラートの設定

* 時間間隔（1日、1時間など）あたりの[攻撃](../../../glossary-en.md#attack)、[ヒット](../../../glossary-en.md#hit)またはインシデントの件数が設定した数を超えた場合
* [APIの変更](../../../api-discovery/track-changes.md)が発生した場合
* 会社アカウントに新しいユーザーが追加された場合

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可およびインテグレーションパラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"