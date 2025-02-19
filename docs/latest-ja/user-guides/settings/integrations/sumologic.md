# Sumo Logic

[Sumo Logic](https://www.sumologic.com/) はクラウドネイティブなマシンデータ分析プラットフォームで、組織にIT運用、セキュリティ、アプリケーションパフォーマンスに関するリアルタイムの洞察を提供します。Wallarmを設定して、Sumo Logicにメッセージを送ることができます。

## 統合の設定

Sumo Logic UIで:

1. [手順](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector) に従ってHosted Collectorを構成します。
2. [手順](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source) に従ってHTTP Logs & Metrics Sourceを構成します。
3. 提供された **HTTP Source Address (URL)** をコピーします。

Wallarm UIで:

1. **Integrations** セクションを開きます。
2. **Sumo Logic** ブロックをクリックするか、**Add integration** ボタンをクリックして **Sumo Logic** を選択します。
3. 統合名を入力します。
4. コピーしたHTTP Source Address (URL) の値を**HTTP Source Address (URL)** フィールドに貼り付けます。
5. 通知をトリガーするイベントタイプを選択します。

    ![Sumo Logic integration](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

6. **Test integration** をクリックして、構成の正確性、Wallarm Cloudの利用可能性、通知フォーマットを確認します。

    Sumologic通知のテスト:

    ```json
    {
        summary:"[テストメッセージ] [Test partner(US)] 新たな脆弱性が検出されました",
        description:"通知タイプ: vuln

                    システムで新たな脆弱性が検出されました。

                    ID: 
                    タイトル: テスト
                    ドメイン: example.com
                    パス: 
                    メソッド: 
                    検出者: 
                    パラメータ: 
                    タイプ: 情報
                    脅威: 中

                    詳細: https://us1.my.wallarm.com/object/555


                    クライアント: TestCompany
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
                title:"テスト",
                discovered_by:null,
                threat:"中",
                type:"情報"
            }
        }
    }
    ```

7. **Add integration** をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加のアラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## 統合の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および統合パラメータの不正

--8<-- "../include/integrations/integration-not-working.md"