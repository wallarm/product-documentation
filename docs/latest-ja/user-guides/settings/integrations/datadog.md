# Datadog

[Datadog](https://www.datadoghq.com/)は現代のアプリケーションのパフォーマンス、可用性、およびセキュリティに関する包括的な可視性を提供する人気のクラウドベースのモニタリングおよび分析プラットフォームです。Wallarm Console上で[Datadog API key](https://docs.datadoghq.com/account_management/api-app-keys/)を介した適切な統合を作成することで、検出されたイベントの通知を直接Datadog Logsサービスに送信するようにWallarmを設定できます。

## 統合の設定

1. Datadog UIを開き、**Organization Settings**→**API Keys**に進み、Wallarmとの統合用のAPI keyを生成してください。
1. Wallarm Consoleを開き、**Integrations**に進み、**Datadog**統合の設定を進めてください。
1. 統合名を入力してください。
1. Datadog API keyを**API key**フィールドに貼り付けてください。
1. [Datadog region](https://docs.datadoghq.com/getting_started/site/)を選択してください。
1. 通知をトリガーするイベントタイプを選択してください。

    ![Datadog統合](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. **Test integration**をクリックし、設定の正しさ、Wallarm Cloudの可用性、および通知フォーマットを確認してください。

    テスト用Datadogログ:

    ![テスト用Datadogログ](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

    その他のレコードの中からWallarmログを見つけるには、Datadog Logsサービスで`source:wallarm_cloud`検索タグを使用してください。

1. **Add integration**をクリックしてください。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## 統合の無効化および削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および統合パラメーターの誤り

--8<-- "../include/integrations/integration-not-working.md"