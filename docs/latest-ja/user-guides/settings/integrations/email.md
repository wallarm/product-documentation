# Email Report

スケジュール[PDFレポート](../../../user-guides/search-and-filters/custom-report.md)と即時通知の配信に使用する追加のメールアドレスを設定できます。primary emailへの送信はデフォルトで設定されています。

スケジュールPDFレポートは、日次、週次、または月次で送信できます。PDFレポートには、選択期間内にシステムで検出された脆弱性、攻撃、インシデントに関する詳細情報が含まれます。通知には、トリガーされたイベントの簡単な詳細が含まれます。

## 設定の統合

1. **Integrations** セクションを開きます。
1. **Email report** ブロックをクリックするか、**Add integration** ボタンをクリックして **Email report** を選択します。
1. 統合名を入力します。
1. コンマを区切り文字としてメールアドレスを入力します。
1. セキュリティレポートの送信頻度を選択します。頻度が選択されていない場合、レポートは送信されません。
1. 通知をトリガーするイベントの種類を選択します。

    ![Email report integration](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

    利用可能なイベントの詳細：

    --8<-- "../include/integrations/events-for-integrations-mail.md"

    !!! info "無効にできない通知"
        Wallarmはユーザーメールにも、無効にできないいくつかの通知を送信します：

        * [Subscription](../../../about-wallarm/subscription-plans.md)通知
        * [API token expiration](../../../user-guides/settings/api-tokens.md#token-expiration)通知
        * [Hit sampling](../../../user-guides/events/grouping-sampling.md#sampling-of-hits)通知

1. **Test integration** をクリックして、設定の正確性、Wallarm Cloudの利用可能性、ならびに通知フォーマットを確認します。

    これにより、プレフィックス`[Test message]`が付いたテスト通知が送信されます：

    ![Test email message](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

1. **Add integration** をクリックします。

## 追加アラートの設定

* 時間間隔（日、時間など）ごとの[攻撃](../../../glossary-en.md#attack)、[hit](../../../glossary-en.md#hit)またはインシデントの数が設定値を超える
* [APIの変更](../../../api-discovery/track-changes.md)が発生した
* 会社アカウントに新しいユーザーが追加された

## 統合の無効化および削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可状態および不適切な統合パラメータ

--8<-- "../include/integrations/integration-not-working.md"