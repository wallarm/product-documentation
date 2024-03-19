# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/)で次のイベントをログに記録するようにWallarmを設定できます：

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## 統合の設定

MicrosoftのUIでは：

1. [ワークスペースでMicrosoft Sentinelを実行します](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-)。
1. Sentinel Workspace設定へ進みます → **エージェント** → **Log Analyticsエージェントの手順** そして次のデータをコピーします：

    * ワークスペースID
    * 主要なキー 

Wallarm ConsoleのUIでは：

1. **統合** セクションを開きます。
1. **Microsoft Sentinel** ブロックをクリックするか、**統合を追加**ボタンをクリックして **Microsoft Sentinel** を選択します。
1. 統合名を入力します。
1. コピーしたWorkspace IDとPrimary keyを貼り付けます。
1. Microsoft Sentinelでログに記録するイベントの種類を選択します。イベントが選ばれていない場合、ログは送信されません。
1. [統合をテストします](#testing-integration) し、設定が正しいことを確認します。

    !!! info "新しいワークスペースへのデータ送信の遅延"
        Wallarm統合のためのSentinelでのワークスペース作成は、すべてのサービスが機能するまでに最大1時間かかる可能性があります。この遅延は統合のテストと使用中にエラーを引き起こすことがあります。すべての統合設定が正しく、それでもエラーが続く場合は、1時間後にもう一度お試しください。
1. **統合を追加** をクリックします。

    ![Sentinel integration](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

## 統合のテスト

--8<-- "../include-ja/integrations/test-integration-advanced-data.md"

Microsoft Workspace → **ログ** → **カスタムログ** でWallarmのログを見つけることができます。例えば、Microsoft Sentinelのテスト `create_user_CL` ログは次のように表示されます：

![Test Sentinel message](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

## Wallarmログの種類

全般的に、WallarmはSentinelに次の種類のレコードをログに記録することができます：

| イベント | Sentinelのログタイプ |
| ----- | ----------------- |
| 新しい [ヒット](../../../glossary-en.md#hit) | `new_hits_CL` |
| 会社のアカウントに新しい [ユーザー](../../../user-guides/settings/users.md) | `create_user_CL` |
| 会社のアカウントからユーザーを削除 | `delete_user_CL` |
| ユーザーロールの更新 | `update_user_CL` |
| [統合](integrations-intro.md) の削除 | `delete_integration_CL` |
| 統合の無効化 | `disable_integration_CL` または設定が不正確で無効化された場合は `integration_broken_CL` |
| 新しい [アプリケーション](../../../user-guides/settings/applications.md) | `create_application_CL` |
| アプリケーションの削除 | `delete_application_CL` |
| アプリケーション名の更新 | `update_application_CL` |
| 高リスクの新しい [脆弱性](../../../glossary-en.md#vulnerability) | `vuln_high_CL` |
| 中リスクの新しい脆弱性 | `vuln_medium_CL` |
| 低リスクの新しい脆弱性 | `vuln_low_CL` |
| 新しい [ルール](../../../user-guides/rules/rules.md) | `rule_create_CL` |
| ルールの削除 | `rule_delete_CL` |
| 既存のルールの変更 | `rule_update_CL` |
| 新しい [トリガー](../../../user-guides/triggers/triggers.md) | `trigger_create_CL` |
| トリガーの削除 | `trigger_delete_CL` |
| 既存のトリガーの変更 | `trigger_update_CL` |
| [露出した資産](../../scanner.md)のホスト、サービス、ドメインの更新 | `scope_object_CL` |
| APIインベントリの変更（対応する [トリガー](../../triggers/triggers.md) がアクティブな場合） | `api_structure_changed_CL` |
| 攻撃の量が閾値を超える（対応する [トリガー](../../triggers/triggers.md) がアクティブな場合） | `attacks_exceeded_CL` |
| 新たにブラックリストに追加されたIP（対応する [トリガー](../../triggers/triggers.md) がアクティブな場合） | `ip_blocked_CL` |

## 統合の更新

--8<-- "../include-ja/integrations/update-integration.md"

## 統合の無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## 統合の削除

--8<-- "../include-ja/integrations/remove-integration.md"