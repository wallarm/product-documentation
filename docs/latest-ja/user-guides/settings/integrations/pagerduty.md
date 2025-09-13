[link-pagerduty-docs]: https://support.pagerduty.com/docs/services-and-integrations

#   PagerDuty

[PagerDuty](https://www.pagerduty.com/)は、組織がインシデントをより効果的に管理・解決し、デジタルオペレーションの信頼性を確保するためのインシデント管理・対応プラットフォームです。WallarmからPagerDutyにインシデントを送信するように設定できます。

##  連携の設定

PagerDuty UIで、既存のサービスのいずれかに対して[連携を設定][link-pagerduty-docs]するか、Wallarm専用の新しいサービスを作成します:

1. **Configuration** → **Services**に移動します。
2. 既存のサービスの設定を開くか、**New Service**ボタンをクリックします。
3. 新しい連携を作成します:

    * 既存のサービスの連携を設定する場合は、**Integrations**タブに移動し、**New Integration**ボタンをクリックします。
    * 新しいサービスを作成する場合は、サービス名を入力し、**Integration Settings**セクションに進みます。
4. 連携名を入力し、連携タイプとして**Use our API directly**オプションを選択します。
5. 設定を保存します:

    * 既存のサービスの連携を設定している場合は、**Add Integration**ボタンをクリックします。
    * 新しいサービスを作成している場合は、残りのセクションを設定し、**Add Service**ボタンをクリックします。
    
5. 提供された**Integration Key**をコピーします。

Wallarm UIでは:

1. **Integrations**セクションを開きます。
1. **PagerDuty**ブロックをクリックするか、**Add integration**ボタンをクリックして**PagerDuty**を選択します。 
1. 連携名を入力します。
1. **Integration Key**の値を該当フィールドに貼り付けます。
1. 通知をトリガーするイベントタイプを選択します。

    ![PagerDuty連携](../../../images/user-guides/settings/integrations/add-pagerduty-integration.png)

    利用可能なイベントの詳細:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. 設定が正しいか、Wallarm Cloudが利用可能か、通知の形式を確認するために**Test integration**をクリックします。

    これにより、接頭辞`[Test message]`付きのテスト通知が送信されます:

    ![PagerDutyのテスト通知](../../../images/user-guides/settings/integrations/test-pagerduty-scope-changed.png)

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

##  追加のアラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

##  連携の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

##  システムの利用不可および誤った連携パラメータ

--8<-- "../include/integrations/integration-not-working.md"