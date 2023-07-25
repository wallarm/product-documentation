# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/)で次のイベントを記録するようにWallarmを設定できます：

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## インテグレーションの設定

MicrosoftのUIで：

1. [ワークスペースでMicrosoft Sentinelを実行します](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-)。
1. Sentinel ワークスペースの設定 → **エージェント** → **ログ分析エージェントのインストラクション**に進み、以下のデータをコピーします：

    * ワークスペース ID
    * プライマリーキー

Wallarm Console UIで：

1. **インテグレーション**セクションを開きます。
1. **Microsoft Sentinel**ブロックをクリックするか、**インテグレーションを追加**ボタンをクリックして**Microsoft Sentinel**を選択します。
1. インテグレーション名を入力します。
1. コピーしたワークスペース IDとプライマリーキーを貼り付けます。
1. Microsoft Sentinelでログ化されるイベントタイプを選択します。 イベントが選択されていない場合、ログは送信されません。
1. [インテグレーションをテストします](#testing-integration) そして、設定が正しいことを確認します。

    !!! info "新しいワークスペースへのデータ送信の遅延"
        WallarmインテグレーションのためにSentinel上でワークスペースを作成するのには、すべてのサービスが機能するまで最大1時間かかることがあります。この遅延は、インテグレーションのテストや使用中にエラーを引き起こす可能性があります。すべてのインテグレーション設定が正しいにもかかわらずエラーが続く場合は、1時間後にもう一度お試しください。
1. **インテグレーションを追加**をクリックします。

    ![!Sentinel integration](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration-advanced-data.md"

Microsoft ワークスペース → **ログ** → **カスタムログ**で Wallarm のログを探すことができます。例えば、Microsoft Sentinelのテスト`create_user_CL`ログは以下のように表示されます：

![!Test Sentinel message](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

## Wallarmのログタイプ

全体として、WallarmはSentinelに以下のタイプのレコードをログすることができます：

| イベント | Sentinelのログタイプ |
| ----- | ----------------- |
| 新たな[ヒット](../../../glossary-en.md#hit) | `new_hits_CL` |
| 会社のアカウントで新たな[ユーザー](../../../user-guides/settings/users.md) | `create_user_CL` |
| 会社のアカウントからのユーザー削除 | `delete_user_CL` |
| ユーザー役割の更新 | `update_user_CL` |
| [インテグレーション](integrations-intro.md)の削除 | `delete_integration_CL` |
| インテグレーションの無効化 | `disable_integration_CL` または `integration_broken_CL`（設定が不正だったために無効化された場合） |
| 新たな[アプリケーション](../../../user-guides/settings/applications.md) | `create_application_CL` |
| アプリケーションの削除 | `delete_application_CL` |
| アプリケーション名の更新 | `update_application_CL` |
| 高リスクの新しい[脆弱性](../../../glossary-en.md#vulnerability) | `vuln_high_CL` |
| 中リスクの新しい脆弱性 | `vuln_medium_CL` |
| 低リスクの新しい脆弱性 | `vuln_low_CL` |
| 新たな[ルール](../../../user-guides/rules/intro.md) | `rule_create_CL` |
| ルールの削除 | `rule_delete_CL` |
| 既存ルールの変更 | `rule_update_CL` |
| 新たな[トリガー](../../../user-guides/triggers/triggers.md) | `trigger_create_CL` |
| トリガーの削除 | `trigger_delete_CL` |
| 既存トリガーの変更 | `trigger_update_CL` |
| [公開資産](../../scanner.md)のホスト、サービス、ドメインの更新 | `scope_object_CL` |
| APIインベントリの変更（対応する[トリガー](../../triggers/triggers.md)がアクティブな場合） | `api_structure_changed_CL` |
| 攻撃の数が閾値を超えた（対応する[トリガー](../../triggers/triggers.md)がアクティブな場合） | `attacks_exceeded_CL` |
| 新しいブラックリストIP（対応する[トリガー](../../triggers/triggers.md)がアクティブな場合） | `ip_blocked_CL` |

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"
