# Datadog

Wallarmを設定して、適切な統合を作成することで、検出されたイベントの通知を直接Datadog Logsサービスに送信できます。[Datadog APIキー](https://docs.datadoghq.com/account_management/api-app-keys/)をWallarmコンソールで使用してください。

以下のイベントをDatadogに送信することができます:

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## インテグレーションの設定

1. Datadog UIを開き、**組織設定** → **APIキー**に移動し、Wallarmとのインテグレーション用にAPIキーを生成します。
1. Wallarmコンソールを開き、**インテグレーション**に進み、**Datadog**のインテグレーション設定を行います。
1. インテグレーション名を入力します。
1. **APIキー**フィールドにDatadog APIキーを貼り付けます。
1. [Datadogリージョン](https://docs.datadoghq.com/getting_started/site/) を選択します。
1. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
1. [インテグレーションをテスト](#testing-integration)し、設定が正しいことを確認してください。
1. **インテグレーションを追加**をクリックします。

![!Datadog integration](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration.md"

テストDatadogログ:

![!The test Datadog log](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

Datadog Logsサービスで`source:wallarm_cloud`検索タグを使用して、他のレコードの中からWallarmログを見つけることができます。

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"