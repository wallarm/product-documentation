					# Datadog

Wallarmを設定することで、[Datadog API key](https://docs.datadoghq.com/account_management/api-app-keys/)をWallarmコンソールで適切に統合を作成することで、検出されたイベントの通知を直接Datadog Logsサービスに送信することができます。

次のイベントをDatadogに送信することを選択できます：

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## 統合の設定

1. Datadog UIを開きます → **組織設定** → **APIキー** を選択して、Wallarmとの統合のためのAPIキーを生成します。
1. Wallarmコンソールを開きます → **インテグレーション** を選択して、**Datadog** の統合設定に進みます。
1. 統合名を入力します。
1. **APIキー** フィールドにDatadog APIキーを貼り付けます。
1. [Datadog region](https://docs.datadoghq.com/getting_started/site/)を選択します。
1. 通知をトリガするイベントタイプを選択します。 イベントが選択されていない場合、通知は送信されません。
1. [統合をテスト](#testing-integration)して、設定が正しいことを確認します。
1. **統合を追加**をクリックします。

![!Datadog統合](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

## 統合のテスト

--8<-- "../include-ja/integrations/test-integration-advanced-data.md"

テスト用のDatadogログ：

![!テスト用Datadogログ](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

他の記録の中からWallarmのログを見つけるために、Datadog Logsサービスで`source:wallarm_cloud`の検索タグを使用することができます。

## 統合の更新

--8<-- "../include-ja/integrations/update-integration.md"

## 統合の無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## 統合の削除

--8<-- "../include-ja/integrations/remove-integration.md"