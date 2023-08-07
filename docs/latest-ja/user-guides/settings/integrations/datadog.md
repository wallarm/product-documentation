# Datadog

Wallarmを設定して、適切な統合を作成することにより、検出されたイベントの通知を直接Datadog Logsサービスに送信できます。[Datadog APIキー](https://docs.datadoghq.com/account_management/api-app-keys/)をWallarm Consoleで取得します。

以下のイベントをDatadogに送信することを選択できます：

--8<-- "../include/integrations/advanced-events-for-integrations.md"

## 統合設定

1. Datadog UIを開きます → **組織設定** → **APIキー**  そして Wallarm との接続のための API キーを生成します。
1. Wallarm Console を開きます → **統合** そして **Datadog** の統合設定に進みます。
1. 統合名を入力します。
1.  **APIキー** フィールドにDatadog APIキーを貼り付けます。
1. [Datadog地域](https://docs.datadoghq.com/getting_started/site/) を選択します。
1. 通知をトリガーするイベントタイプを選択します。イベントが選ばれていない場合、通知は送信されません。
1. [統合テスト](#統合のテスト) を行い、設定が正しいことを確認します。
1. **統合を追加** をクリックします。

![!Datadog integration](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

## 統合テスト

--8<-- "../include/integrations/test-integration-advanced-data.md"

Datadogのテストログ：

![!The test Datadog log](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

他のレコードの中にWallarmのログを見つけるために、Datadog Logsサービスで `source:wallarm_cloud` 検索タグを絨毯できます。

## 統合の更新

--8<-- "../include/integrations/update-integration.md"

## 統合の無効化

--8<-- "../include/integrations/disable-integration.md"

## 統合の削除

--8<-- "../include/integrations/remove-integration.md"