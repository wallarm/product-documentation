[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

#   Splunk

以下のイベントがトリガーされた際に、WallarmがSplunkにアラートを送信するように設定できます：

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

##  インテグレーションの設定

Splunk UIで：

1. **設定** ➝ **データの追加** ➝ **モニター**を開きます。
2. **HTTPイベントコレクター**のオプションを選択し、インテグレーション名を入力し、**次へ**をクリックします。
3. **入力設定**ページでデータタイプの選択をスキップし、**設定の確認**に進みます。
4. 設定を確認して**提出**します。
5. 提供されたトークンをコピーします。

Wallarm UIで：

1. **インテグレーション**セクションを開きます。
2. **Splunk**ブロックをクリックするか、**インテグレーションを追加**ボタンをクリックして**Splunk**を選択します。
3. インテグレーション名を入力します。
4. コピーしたトークンを**HECトークン**フィールドに貼り付けます。
5. SplunkインスタンスのHEC URIとポート番号を**HEC URI:PORT**フィールドに貼り付けます。例：`https://hec.splunk.com:8088`。
6. 通知をトリガーするイベントタイプを選択します。イベントが選択されない場合、Splunkへのアラートは送信されません。
7. [インテグレーションをテスト](#テスト-インテグレーション)し、設定が正しいことを確認します。
8. **インテグレーションを追加**をクリックします。

![Splunk integration](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

--8<-- "../include-ja/cloud-ip-by-request.md"

## ダッシュボードにイベントを整理する

--8<-- "../include-ja/integrations/application-for-splunk.md"

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration-advanced-data.md"

JSON形式でのSplunk通知をテストします：

```json
{
    summary:"[テストメッセージ] [テストパートナー(US)] 新しい脆弱性が検出されました",
    description:"通知タイプ： vuln

                システムに新しい脆弱性が検出されました。

                ID: 
                タイトル： テスト
                ドメイン： example.com
                パス： 
                メソッド： 
                発見者： 
                パラメータ： 
                タイプ： Info
                脅威： Medium

                詳細： https://us1.my.wallarm.com/object/555


                クライアント： TestCompany
                クラウド： US
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

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"