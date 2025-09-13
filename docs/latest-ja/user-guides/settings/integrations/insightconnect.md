# InsightConnect

[InsightConnect](https://www.rapid7.com/products/insightconnect/)は、組織がサイバーセキュリティ運用を効率化・自動化し、セキュリティインシデントや脅威の検知・調査・対応を容易にするために設計されたセキュリティオーケストレーション、オートメーション、レスポンス（SOAR）プラットフォームです。WallarmからInsightConnectへ通知を送信するよう設定できます。

## インテグレーションの設定

まず、以下の手順でAPI keyを生成してコピーします。

1. InsightConnectのUI → **Settings** → [**API Keys**ページ](https://insight.rapid7.com/platform#/apiKeyManagement)を開き、**New User Key**をクリックします。
2. API key名（例：`Wallarm API`）を入力し、**Generate**をクリックします。
3. 生成されたAPI keyをコピーします。
4. WallarmのUI → **Integrations**（[US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)のクラウド）に移動し、**InsightConnect**をクリックします。
4. 先ほどコピーしたAPI keyを**API key**フィールドに貼り付けます。

次に、以下の手順でAPI URLを生成してコピーします。

1. InsightConnectのUIに戻り、**Automation** → **Workflows**ページを開き、Wallarmの通知用に新しいワークフローを作成します。
2. トリガーの選択を求められたら、**API Trigger**を選択します。
3. 生成されたURLをコピーします。
4. WallarmのUI → **InsightConnect**の設定に戻って、先ほどコピーしたAPI URLを**API URL**フィールドに貼り付けます。

最後に、WallarmのUIで設定を完了します:

1. インテグレーション名を入力します。
1. 通知をトリガーするイベントタイプを選択します。

    ![InsightConnectインテグレーション](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. 設定の正しさ、Wallarm Cloudの可用性、通知の形式を確認するには、**Test integration**をクリックします。

    これにより、先頭に`[Test message]`という接頭辞が付いたテスト通知が送信されます:

    ![InsightConnectのテスト通知](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加のアラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可と誤ったインテグレーションパラメータ

--8<-- "../include/integrations/integration-not-working.md"