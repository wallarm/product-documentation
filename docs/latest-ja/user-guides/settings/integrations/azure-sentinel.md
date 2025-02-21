# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/) は、MicrosoftがAzureクラウドプラットフォームの一部として提供するソリューションで、組織がクラウドおよびオンプレミス環境全体でセキュリティ脅威やインシデントを監視、検出、調査、対応するのに役立ちます。Wallarmを設定することで、Microsoft Sentinelにイベントを記録できます。

## 統合の設定

Microsoft UIで:

1. [WorkspaceでMicrosoft Sentinelを実行する](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-).
1. Sentinel Workspaceの設定 → **Agents** → **Log Analytics agent instructions** に進み、以下のデータをコピーします:

    * ワークスペースID
    * プライマリキー

WallarmコンソールUIで:

1. **Integrations** セクションを開きます。
1. **Microsoft Sentinel** ブロックをクリックするか、**Add integration** ボタンをクリックして **Microsoft Sentinel** を選択します。
1. 統合の名前を入力します。
1. コピーしたワークスペースIDとプライマリキーを貼り付けます。
1. オプションで、Wallarmイベント用のAzure Sentinelテーブルを指定できます。存在しない場合は自動的に作成されます。  
   名前を指定しない場合、各イベントタイプごとに別々のテーブルが作成されます。
1. 通知をトリガーするイベントタイプを選択します。

    ![Sentinel integration](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. **Test integration** をクリックして、設定の正確性、Wallarm Cloudの利用可能性、および通知フォーマットを確認します。

    Microsoft Workspaceの **Logs** → **Custom Logs** でWallarmログを確認できます。たとえば、Microsoft Sentinelのテスト `create_user_CL` ログは以下のようになります:

    ![Test Sentinel message](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

    !!! info "新しいワークスペースへのデータ送信の遅延"
        Wallarm統合用のSentinelでワークスペースを作成するには、すべてのサービスが機能するまで最大1時間かかる場合があります。この遅延により、統合のテストや使用中にエラーが発生することがあります。すべての統合設定が正しいにもかかわらずエラーが続く場合は、1時間後に再試行してください。

1. **Add integration** をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## Wallarmログの種類

全体として、WallarmはSentinelに次の種類のレコードをログとして記録できます:

| イベント | Sentinel log type |
| ------- | ----------------- |
| 新しい[ヒット](../../../glossary-en.md#hit) | `new_hits_CL` |
| 企業アカウントへの新しい[ユーザー](../../../user-guides/settings/users.md) | `create_user_CL` |
| 企業アカウントからのユーザー削除 | `delete_user_CL` |
| ユーザー権限の更新 | `update_user_CL` |
| [統合](integrations-intro.md)の削除 | `delete_integration_CL` |
| 統合の無効化 | `disable_integration_CL` または、設定不備により無効化された場合は `integration_broken_CL` |
| 新しい[アプリケーション](../../../user-guides/settings/applications.md) | `create_application_CL` |
| アプリケーションの削除 | `delete_application_CL` |
| アプリケーション名の更新 | `update_application_CL` |
| 高リスクの新しい[脆弱性](../../../glossary-en.md#vulnerability) | `vuln_high_CL` |
| 中リスクの新しい脆弱性 | `vuln_medium_CL` |
| 低リスクの新しい脆弱性 | `vuln_low_CL` |
| 新しい[ルール](../../../user-guides/rules/rules.md) | `rule_create_CL` |
| ルールの削除 | `rule_delete_CL` |
| 既存ルールの変更 | `rule_update_CL` |
| 新しい[トリガー](../../../user-guides/triggers/triggers.md) | `trigger_create_CL` |
| トリガーの削除 | `trigger_delete_CL` |
| 既存トリガーの変更 | `trigger_update_CL` |
| 公開アセット内のホスト、サービス、およびドメインの更新 | `scope_object_CL` |
| APIインベントリの変更(対応する[トリガー](../../triggers/triggers.md)が有効な場合) | `api_structure_changed_CL` |
| 攻撃数が閾値を超えた場合(対応する[トリガー](../../triggers/triggers.md)が有効な場合) | `attacks_exceeded_CL` |
| 新たに拒否リストに登録されたIP(対応する[トリガー](../../triggers/triggers.md)が有効な場合) | `ip_blocked_CL` |

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および不正な統合パラメータ

--8<-- "../include/integrations/integration-not-working.md"