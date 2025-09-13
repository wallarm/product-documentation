[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

#   Splunk

[Splunk](https://www.splunk.com/)は、ログ、イベント、その他の運用・業務データなどの機械生成データを検索、監視、分析するために設計されたプラットフォームです。Wallarmを設定してSplunkにアラートを送信できます。

##  インテグレーションの設定

Splunk UIで:

1. **Settings** ➝ **Add Data** ➝ **Monitor**を開きます。
2. **HTTP Event Collector**オプションを選択し、インテグレーション名を入力して**Next**をクリックします。
3. Input Settingsページではデータタイプの選択をスキップし、Review Settingsへ進みます。
4. 設定内容を確認して**Submit**します。
5. 表示されたトークンをコピーします。

Wallarm UIで:

1. **Integrations**セクションを開きます。
1. **Splunk**ブロックをクリックするか、**Add integration**ボタンをクリックして**Splunk**を選択します。
1. インテグレーション名を入力します。
1. コピーしたトークンを**HEC token**フィールドに貼り付けます。
1. SplunkインスタンスのHEC URIとポート番号を**HEC URI:PORT**フィールドに貼り付けます。例えば: `https://hec.splunk.com:8088`。
1. 通知をトリガーするイベントタイプを選択します。

    ![Splunkインテグレーション](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. 構成の正しさ、Wallarm Cloudへの接続可否、通知形式を確認するには、**Test integration**をクリックします。

    JSON形式のSplunk通知のテスト:

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

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## ダッシュボードにイベントを整理する

--8<-- "../include/integrations/application-for-splunk.md"

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可およびインテグレーションパラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"