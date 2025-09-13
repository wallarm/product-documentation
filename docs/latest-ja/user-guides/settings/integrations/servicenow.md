# ServiceNow

[ServiceNow](https://www.servicenow.com/)は、エンタープライズ向けに幅広いITサービスマネジメント（ITSM）およびビジネスプロセス自動化ソリューションを提供するクラウドベースのプラットフォームです。Wallarmを設定してServiceNowにトラブルチケットを作成できます。

## 要件

ServiceNowは、企業の業務運用におけるデジタルワークフローの管理を支援するプラットフォームです。これらのアプリをWallarmと統合するには、貴社が保有するServiceNowの[インスタンスおよびその中で構築されたワークフローアプリ](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html)が必要です。

## 統合の設定

ServiceNow UIで：

1. ご利用の[ServiceNowインスタンス](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html)名を確認します。
1. インスタンスにアクセスするためのユーザー名とパスワードを確認します。
1. OAuth認証を有効化し、[こちら](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html)の説明に従ってclient IDとsecretを取得します。

Wallarm UIで：

1. Wallarm Console → **Integrations** → **ServiceNow**を開きます。
1. 統合名を入力します。
1. ServiceNowインスタンス名を入力します。
1. 指定したインスタンスにアクセスするためのユーザー名とパスワードを入力します。
1. OAuth認証データ（client IDとsecret）を入力します。
1. 通知をトリガーするイベントタイプを選択します。

    ![ServiceNow統合](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

    利用可能なイベントの詳細：
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. 構成の正しさ、Wallarm Cloudの到達性、および通知形式を確認するために**Test integration**をクリックします。

    これにより、接頭辞`[Test message]`が付いたテスト通知が送信されます。

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および統合パラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"