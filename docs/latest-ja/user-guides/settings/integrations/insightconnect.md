# InsightConnect

[InsightConnect](https://www.rapid7.com/products/insightconnect/) はサイバーセキュリティ運用の効率化と自動化を実現するセキュリティオーケストレーション、自動化、および対応 (SOAR) プラットフォームです。これにより、セキュリティインシデントや脅威の検知、調査、対応が容易になります。Wallarmを設定して、通知をInsightConnectに送信できるようにします。

## 統合の設定

まず、APIキーを生成してコピーします。以下の手順に従ってください：

1. InsightConnectのUIを開き、**Settings** → [**API Keys** page](https://insight.rapid7.com/platform#/apiKeyManagement) に進み、**New User Key**をクリックします。
2. APIキーの名前（例：`Wallarm API`）を入力し、**Generate**をクリックします。
3. 生成されたAPIキーをコピーします。
4. Wallarm UIの**Integrations**に移動します。[US](https://us1.my.wallarm.com/integrations/)または[EU](https://my.wallarm.com/integrations/)クラウドで、**InsightConnect**をクリックします。
4. 以前コピーしたAPIキーを**API key**フィールドに貼り付けます。

次に、API URLを生成してコピーします。以下の手順に従ってください：

1. InsightConnectのUIに戻り、**Automation** → **Workflows**ページを開いて、Wallarm通知用の新しいワークフローを作成します。
2. トリガーを選択するよう求められたら、**API Trigger**を選択します。
3. 生成されたURLをコピーします。
4. Wallarm UIの**InsightConnect**設定に戻り、以前コピーしたAPI URLを**API URL**フィールドに貼り付けます。

最後に、Wallarm UIでのセットアップを完了します：

1. 統合の名前を入力します。
1. 通知をトリガーするイベントタイプを選択します。

    ![InsightConnect統合](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

    利用可能なイベントに関する詳細：

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. 設定の正確性、Wallarm Cloudの利用可能状況、および通知形式を確認するため、**Test integration**をクリックします。

    これにより、接頭辞`[Test message]`を付けたテスト通知が送信されます：

    ![Test InsightConnect通知](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## 統合の無効化および削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および統合パラメータの不正な設定

--8<-- "../include/integrations/integration-not-working.md"