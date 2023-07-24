[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

#   Splunk

以下のイベントがトリガーされると、WallarmはSplunkへのアラートを設定できます：

--8<-- "../include/integrations/advanced-events-for-integrations.md"

##  統合の設定

Splunk UIで：

1. **設定** ➝ **データの追加** ➝ **モニター**を開きます。
2. **HTTPイベントコレクター**のオプションを選択し、統合名を入力して**次へ**をクリックします。
3. **入力設定**ページでデータタイプの選択をスキップし、**設定の確認**に進みます。
4. 設定を**確認**し、**送信**します。
5. 提供されたトークンをコピーします。

Wallarm UIで：

1. **統合**セクションを開きます。
2. **Splunk**ブロックをクリックするか、**統合を追加**ボタンをクリックして**Splunk**を選択します。
3. 統合名を入力します。
4. コピーしたトークンを**HECトークン**フィールドに貼り付けます。
5. あなたのSplunkインスタンスのHEC URIおよびポート番号を**HEC URI:PORT**フィールドに貼り付けます。例：`https://hec.splunk.com:8088`。
6. 通知をトリガーするイベントタイプを選択します。イベントが選択されていない場合、Splunkへのアラートは送信されません。
7. [統合をテスト](#統合のテスト)して設定が正しいことを確認します。
8. **統合を追加**をクリックします。

![!Splunk統合](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

--8<-- "../include/cloud-ip-by-request.md"

## ダッシュボードにイベントを組織化する

--8<-- "../include/integrations/application-for-splunk.md"

## 統合のテスト

--8<-- "../include/integrations/test-integration-advanced-data.md"

JSON形式でのSplunk通知をテストします：

```json
{
    summary:"[テストメッセージ] [テストパートナー(US)] 新規脆弱性を検出",
    description:"通知タイプ：脆弱性

                システム内で新しい脆弱性が发现されました。

                ID: 
                タイトル：テスト
                ドメイン：example.com
                パス：
                メソッド: 
                発見者: 
                パラメーター: 
                タイプ: インフォ
                脅威: ミディアム

                詳細はこちら：https://us1.my.wallarm.com/object/555


                クライアント：TestCompany
                クラウド：US
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

## 統合の更新

--8<-- "../include/integrations/update-integration.md"

## 統合の無効化

--8<-- "../include/integrations/disable-integration.md"

## 統合の削除

--8<-- "../include/integrations/remove-integration.md"
