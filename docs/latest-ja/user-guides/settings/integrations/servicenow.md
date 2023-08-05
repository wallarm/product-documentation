# ServiceNow

以下のイベントがトリガーされたときに、Wallarmで[ServiceNow](https://www.servicenow.com/)に問題チケットを作成するよう設定できます：

--8<-- "../include/integrations/events-for-integrations-mail.md"

## 前提条件

ServiceNowは、企業の業務のデジタルワークフローを管理するためのプラットフォームです。Wallarmとアプリケーションを統合するには、自社が所有するServiceNow [インスタンスと、その中に構築されたワークフローアプリケーション](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html)が必要です。

## 統合の設定

ServiceNowのUI内で：

1. [ServiceNowのインスタンス名](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html)を取得します。
1. インスタンスへのアクセス用のユーザー名とパスワードを取得します。
1. OAuth認証を有効にし、[ここ](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html)で説明されているようにクライアントIDとシークレットを取得します。

WallarmのUI内で：

1. Wallarmコンソール → **インテグレーション** → **ServiceNow**を開きます。
1. 統合の名前を入力します。
1. ServiceNowのインスタンス名を入力します。
1. 指定したインスタンスにアクセスするためのユーザー名とパスワードを入力します。
1. OAuth認証データ（クライアントIDとシークレット）を入力します。
1. 通知をトリガーするイベントの種類を選択します。何も選択しない場合、ServiceNowの問題チケットは作成されません。
1. [統合をテスト](#統合のテスト)し、設定が正しいことを確認します。
1. **統合を追加**をクリックします。

![!ServiceNow integration](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

## 統合のテスト

--8<-- "../include/integrations/test-integration-basic-data.md"

## 統合の更新

--8<-- "../include/integrations/update-integration.md"

## 統合の無効化

--8<-- "../include/integrations/disable-integration.md"

## 統合の削除

--8<-- "../include/integrations/remove-integration.md"