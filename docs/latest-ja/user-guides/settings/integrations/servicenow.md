# ServiceNow

[ServiceNow](https://www.servicenow.com/)は企業向けのITサービス管理（ITSM）およびビジネスプロセス自動化ソリューションを提供するクラウドベースのプラットフォームです。Wallarmと統合してServiceNowでトラブルチケットを生成できるように設定できます。

## 要件

ServiceNowは企業のオペレーションのためのデジタルワークフロー管理を支援するプラットフォームです。Wallarmとこれらのアプリを統合するためには、自社所有のServiceNowの[インスタンスおよびその中で構築されたワークフローアプリ](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html)が必要です。

## 統合の設定

ServiceNow UIにて:

1. [ServiceNowインスタンス](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html)の名前を取得します。
1. インスタンスにアクセスするためのユーザー名およびパスワードを取得します。
1. OAuth認証を有効にして、[こちら](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html)に記載のとおり、クライアントIDおよびシークレットを取得します。

Wallarm UIにて:

1. Wallarm Consoleを開いて → **Integrations** → **ServiceNow**を選択します。
1. 統合名を入力します。
1. ServiceNowインスタンス名を入力します。
1. 指定されたインスタンスにアクセスするためのユーザー名およびパスワードを入力します。
1. OAuth認証情報（クライアントIDおよびシークレット）を入力します。
1. 通知をトリガーするイベントタイプを選択します。

    ![ServiceNow統合](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

    利用可能なイベントの詳細:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. **Test integration**をクリックして、設定の正確性、Wallarm Cloudの利用可能性、通知形式を確認します。

    これにより、プレフィックス `[Test message]` を付与したテスト通知が送信されます。

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 統合の無効化および削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および統合パラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"