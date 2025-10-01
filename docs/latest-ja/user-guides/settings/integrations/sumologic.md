# Sumo Logic

[Sumo Logic](https://www.sumologic.com/)は、IT運用、セキュリティ、アプリケーションパフォーマンスに関するリアルタイムの洞察を組織に提供するクラウドネイティブなマシンデータ分析プラットフォームです。WallarmからSumo Logicへメッセージを送信するように設定できます。

## インテグレーションの設定

Sumo LogicのUIで：

1. [手順](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector)に従ってHosted Collectorを構成します。
2. [手順](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source)に従ってHTTP Logs & Metrics Sourceを構成します。
3. 表示された**HTTP Source Address (URL)**をコピーします。

WallarmのUIで：

1. 「**Integrations**」セクションを開きます。
1. 「**Sumo Logic**」ブロックをクリックするか、「**Add integration**」ボタンをクリックして**Sumo Logic**を選択します。
1. インテグレーション名を入力します。
1. コピーしたHTTP Source Address (URL)の値を**HTTP Source Address (URL)**フィールドに貼り付けます。
1. 通知をトリガーするイベントタイプを選択します。

    ![Sumo Logicインテグレーション](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

    利用可能なイベントの詳細：

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. 構成が正しいか、Wallarm Cloudの可用性、および通知形式を確認するには、**Test integration**をクリックします。

    Sumo Logic通知のテスト：

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

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可とインテグレーションパラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"