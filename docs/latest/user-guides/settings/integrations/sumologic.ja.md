# Sumo Logic

次のイベントがトリガーされたときに、WallarmがSumo Logicにメッセージを送信するように設定できます：

--8<-- "../include/integrations/advanced-events-for-integrations.ja.md"

## インテグレーションの設定

Sumo Logic UI内：

1. [指示](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector)に従ってホストされたコレクターを設定します。
2. [指示](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source)に従ってHTTP ログ＆メトリクスソースを設定します。
3. 提供された **HTTP Source Address (URL)** をコピーします。

Wallarm UI内：

1. **インテグレーション**セクションをオープンします。
2. **Sumo Logic** ブロックをクリックするか、 **インテグレーションを追加** ボタンをクリックして **Sumo Logic** を選択します。
3. インテグレーション名を入力します。
4. コピーしたHTTP Source Address (URL)を **HTTP Source Address (URL)** フィールドに貼り付けます。
5. Sumo Logicにメッセージを送信するためのイベントタイプを選択します。イベントが選択されなければ、メッセージは送信されません。
6. [インテグレーションをテスト](#testing-integration)して、設定が正しいことを確認します。
7. **インテグレーションを追加** をクリックします。

![!Sumo Logicインテグレーション](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-advanced-data.ja.md"

Sumo Logic通知のテスト：

```json
{
    summary:"[テストメッセージ] [テストパートナー（US）] 新しい脆弱性検出",
    description:"通知タイプ：vuln

                あなたのシステムで新しい脆弱性が検出されました。

                ID: 
                タイトル：テスト
                ドメイン：example.com
                パス： 
                メソッド： 
                発見者： 
                パラメータ： 
                タイプ：情報
                脅威：中程度

                詳細：https://us1.my.wallarm.com/object/555


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
            title:"テスト",
            discovered_by:null,
            threat:"中程度",
            type:"情報"
        }
    }
}
```
## インテグレーションの更新

--8<-- "../include/integrations/update-integration.ja.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.ja.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.ja.md"
