[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Splunk

[Splunk](https://www.splunk.com/)は、ログ、イベント、その他の運用およびビジネスデータなど、マシン生成データの検索、監視、解析のためのプラットフォームです。Wallarmを使用してSplunkにアラートを送信するように設定できます。

## 統合の設定

Splunk UIにて:

1. **Settings** ➝ **Add Data** ➝ **Monitor**を開いてください。
2. **HTTP Event Collector**オプションを選択し、統合名を入力して**Next**をクリックしてください。
3. **Input Settings**ページでデータタイプの選択をスキップし、**Review Settings**に進んでください。
4. 設定内容を確認し、**Submit**をクリックしてください。
5. 表示されたトークンをコピーしてください。

Wallarm UIにて:

1. **Integrations**セクションを開いてください。
2. **Splunk**ブロックをクリックするか、**Add integration**ボタンをクリックして**Splunk**を選択してください。
3. 統合名を入力してください。
4. コピーしたトークンを**HEC token**フィールドに貼り付けてください。
5. HEC URIおよびSplunkインスタンスのポート番号を**HEC URI:PORT**フィールドに貼り付けてください。例: `https://hec.splunk.com:8088`。
6. 通知をトリガーするイベントタイプを選択してください。

    ![Splunk integration](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

7. **Test integration**をクリックして、設定の正確性、Wallarm Cloudの可用性、および通知形式を確認してください。

    JSON形式でSplunk通知のテスト:

    ```json
    {
        summary:"[Test message] [Test partner(US)] New vulnerability detected",
        description:"Notification type: vuln

                    New vulnerability was detected in your system.

                    ID: 
                    Title: Test
                    Domain: example.com
                    Path: 
                    Method: 
                    Discovered by: 
                    Parameter: 
                    Type: Info
                    Threat: Medium

                    More details: https://us1.my.wallarm.com/object/555


                    Client: TestCompany
                    Cloud: US
                    ",
        details:{
            client_name:"TestCompany",
            cloud:"US",
            notification_type:"vuln",
            vuln_link:"https://us1.my.wallarm.com/object/555",
            vuln:{
                domain:"example.com",
                id:null,
                method:null,
                parameter:null,
                path:null,
                title:"Test",
                discovered_by:null,
                threat:"Medium",
                type:"Info"
            }
        }
    }
    ```

8. **Add integration**をクリックしてください。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## イベントをダッシュボードに整理する

--8<-- "../include/integrations/application-for-splunk.md"

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システム利用不可および統合パラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"