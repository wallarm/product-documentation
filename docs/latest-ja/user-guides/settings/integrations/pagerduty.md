[link-pagerduty-docs]: https://support.pagerduty.com/docs/services-and-integrations

# PagerDuty

[PagerDuty](https://www.pagerduty.com/)はインシデント管理とレスポンスプラットフォームであり、組織がインシデントをより効果的に管理および解決し、デジタル運用の信頼性を確保するのに役立ちます。Wallarmを設定してインシデントをPagerDutyに送信することができます。

## 統合の設定

PagerDuty UIにて、[set up an integration][link-pagerduty-docs]の手順に従い、既存のサービス向けに統合を設定するか、Wallarm専用の新しいサービスを作成します：

1. **Configuration** → **Services**に移動します。
1. 既存のサービスの設定を開くか、**New Service**ボタンをクリックします。
1. 新しい統合を作成します：
    * 既存サービスの統合設定の場合、**Integrations**タブに移動し、**New Integration**ボタンをクリックします。
    * 新しいサービスの場合、サービス名を入力し、**Integration Settings**セクションに進みます。
1. 統合名を入力し、統合タイプとして**Use our API directly**オプションを選択します。
1. 設定を保存します：
    * 既存サービスの統合設定の場合、**Add Integration**ボタンをクリックします。
    * 新しいサービスの場合、残りの設定セクションを構成し、**Add Service**ボタンをクリックします。
5. 提供された**Integration Key**をコピーします。

Wallarm UIにて：

1. **Integrations**セクションを開きます。
1. **PagerDuty**ブロックをクリックするか、**Add integration**ボタンをクリックし、**PagerDuty**を選択します。
1. 統合名を入力します。
1. 該当フィールドに**Integration Key**の値を貼り付けます。
1. 通知をトリガーするイベントタイプを選択します。

    ![PagerDuty統合](../../../images/user-guides/settings/integrations/add-pagerduty-integration.png)

    利用可能なイベントの詳細は下記の通りです：
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. **Test integration**をクリックして、設定の正確性、Wallarm Cloudの利用可能性、および通知フォーマットを確認します。

    これにより、プレフィックス`[Test message]`が付いたテスト通知が送信されます：

    ![Test PagerDuty通知](../../../images/user-guides/settings/integrations/test-pagerduty-scope-changed.png)

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および誤った統合パラメータ

--8<-- "../include/integrations/integration-not-working.md"