# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/)は、MicrosoftがAzureクラウドプラットフォームの一部として提供するソリューションで、組織がクラウドおよびオンプレミス環境全体にわたるセキュリティ脅威やインシデントを監視、検知、調査、対応するのに役立つソリューションです。WallarmをMicrosoft Sentinelにイベントを記録するように設定できます。

## インテグレーションの設定

Microsoft UIで:

1. [WorkspaceでMicrosoft Sentinelを有効化する](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-)。
1. Sentinel Workspace settings → **Agents** → **Log Analytics agent instructions**に進み、以下のデータをコピーします:

    * Workspace ID
    * Primary key

Wallarm Console UIで:

1. **Integrations**セクションを開きます。
1. **Microsoft Sentinel**ブロックをクリックするか、**Add integration**ボタンをクリックして**Microsoft Sentinel**を選択します。
1. インテグレーション名を入力します。
1. コピーしたWorkspace IDとPrimary keyを貼り付けます。
1. 必要に応じて、Wallarmイベント用のAzure Sentinelのテーブルを指定します。存在しない場合は自動作成されます。 

    名前を指定しない場合、イベントタイプごとに個別のテーブルが作成されます。
1. 通知をトリガーするイベントタイプを選択します。

    ![Sentinelインテグレーション](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. **Test integration**をクリックして、設定の正しさ、Wallarm Cloudの到達性、および通知の形式を確認します。

    Microsoft Workspace → **Logs** → **Custom Logs**でWallarmのログを確認できます。例えば、Microsoft Sentinelのテスト`create_user_CL`ログは次のように表示されます:

    ![Sentinelのテストメッセージ](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

    !!! info "新しいWorkspaceへのデータ送信の遅延"
        Wallarmとのインテグレーション用にSentinel上でWorkspaceを作成してから、すべてのサービスが機能するまで最大1時間かかる場合があります。この遅延により、インテグレーションのテストや使用中にエラーが発生することがあります。インテグレーションの設定がすべて正しいにもかかわらずエラーが出続ける場合は、1時間後に再度お試しください。

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## Wallarmログの種類

全体として、WallarmはSentinelに以下の種類のレコードを記録できます。

| イベント | Sentinelのログタイプ |
| ----- | ----------------- |
| 新しい[hit](../../../glossary-en.md#hit) | `new_hits_CL` |
| 会社アカウント内の新しい[ユーザー](../../../user-guides/settings/users.md) | `create_user_CL` |
| 会社アカウントからのユーザーの削除 | `delete_user_CL` |
| ユーザーのロール更新 | `update_user_CL` |
| [インテグレーション](integrations-intro.md)の削除 | `delete_integration_CL` |
| インテグレーションの無効化 | `disable_integration_CL` または、設定の誤りにより無効化された場合は`integration_broken_CL` |
| 新しい[アプリケーション](../../../user-guides/settings/applications.md) | `create_application_CL` |
| アプリケーションの削除 | `delete_application_CL` |
| アプリケーション名の更新 | `update_application_CL` |
| 高リスクの新しい[脆弱性](../../../glossary-en.md#vulnerability) | `vuln_high_CL` |
| 中リスクの新しい脆弱性 | `vuln_medium_CL` |
| 低リスクの新しい脆弱性 | `vuln_low_CL` |
| 新しい[ルール](../../../user-guides/rules/rules.md) | `rule_create_CL` |
| ルールの削除 | `rule_delete_CL` |
| 既存のルールの変更 | `rule_update_CL` |
| 新しい[トリガー](../../../user-guides/triggers/triggers.md) | `trigger_create_CL` |
| トリガーの削除 | `trigger_delete_CL` |
| 既存のトリガーの変更 | `trigger_update_CL` |
| APIインベントリの変更（対応する[トリガー](../../triggers/triggers.md)がアクティブな場合） | `api_structure_changed_CL` |
| 攻撃数がしきい値を超える（対応する[トリガー](../../triggers/triggers.md)がアクティブな場合） | `attacks_exceeded_CL` |
| 新たに拒否リストに追加されたIP（対応する[トリガー](../../triggers/triggers.md)がアクティブな場合） | `ip_blocked_CL` |

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不能およびインテグレーションパラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"