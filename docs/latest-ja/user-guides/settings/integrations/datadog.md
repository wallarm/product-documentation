# Datadog

[Datadog](https://www.datadoghq.com/)は、最新のアプリケーションのパフォーマンス、可用性、セキュリティを包括的に可視化できる、広く利用されているクラウドベースの監視・分析プラットフォームです。Wallarm Consoleで[Datadog APIキー](https://docs.datadoghq.com/account_management/api-app-keys/)を使用したインテグレーションを作成すると、検出されたイベントの通知をDatadog Logsサービスに直接送信するようにWallarmを設定できます。

## インテグレーションの設定

1. Datadog UIを開き、→ **Organization Settings** → **API Keys**でWallarmとのインテグレーション用のAPIキーを生成します。
1. Wallarm Consoleを開き、→ **Integrations**で**Datadog**インテグレーションの設定に進みます。
1. インテグレーション名を入力します。
1. DatadogのAPIキーを**API key**フィールドに貼り付けます。
1. [Datadogリージョン](https://docs.datadoghq.com/getting_started/site/)を選択します。
1. 通知をトリガーするイベントタイプを選択します。

    ![Datadogインテグレーション](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. **Test integration**をクリックして、構成が正しいこと、Wallarm Cloudの可用性、および通知の形式を確認します。

    テスト用のDatadogログ:

    ![テスト用のDatadogログ](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

    他のレコードの中からWallarmのログを見つけるには、Datadog Logsサービスで`source:wallarm_cloud`検索タグを使用できます。

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可およびインテグレーションパラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"