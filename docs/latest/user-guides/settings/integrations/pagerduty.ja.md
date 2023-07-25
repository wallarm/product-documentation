[link-pagerduty-docs]: https://support.pagerduty.com/docs/services-and-integrations

# PagerDuty

Wallarmを設定して、以下のイベントがトリガーされるとPagerDutyにインシデントを送信できます：

--8<-- "../include/integrations/events-for-integrations.ja.md"

## インテグレーションの設定

PagerDutyのUIで、既存のサービスに対して[インテグレーションを設定する][link-pagerduty-docs]か、Wallarm専用の新しいサービスを作る：

1. **設定** → **サービス**に移動します。
2. 既存のサービスの設定を開くか、**新規サービス** ボタンをクリックします。
3. 新しいインテグレーションを作成します：

     *   既存のサービスのインテグレーションを設定する場合は、**インテグレーション**タブに移動し、**新規インテグレーション** ボタンをクリックします。
     *   新しいサービスを作成する場合、サービス名を入力し、**インテグレーション設定** セクションに進みます。
4. インテグレーション名を入力し、インテグレーションタイプとして **私たちのAPIを直接使用する** オプションを選択します。
5. 設定を保存します：

     *   既存のサービスのインテグレーションを設定する場合、**インテグレーションを追加** ボタンをクリックします。
     *   新しいサービスを作成する場合、設定セクションの残りを設定し、**サービスを追加** ボタンをクリックします。
    
5. 提供された **インテグレーションキー** をコピーします。

WallarmのUIにて：

1. **インテグレーション** セクションを開きます。
2. **PagerDuty** ブロックをクリックするか、**インテグレーションを追加** ボタンをクリックして **PagerDuty** を選びます。
3. インテグレーション名を入力します。
4. **インテグレーションキー** の値を適切なフィールドに貼り付けます。
5. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、PagerDutyのインシデントは追加されません。
6. [インテグレーションをテストする](#testing-integration) し設定が正しいことを確認します。
7. **インテグレーションを追加**をクリックします。

    ![PagerDutyのインテグレーション](../../../images/user-guides/settings/integrations/add-pagerduty-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-basic-data.ja.md"

PagerDuty 関連の通知をテストします：

![PagerDutyによる通知をテストします](../../../images/user-guides/settings/integrations/test-pagerduty-scope-changed.png)

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.ja.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.ja.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.ja.md"