# Sumo Logic

以下のイベントがトリガーされたときに、WallarmがSumo Logicにメッセージを送るよう設定できます：

--8<-- "../include/integrations/advanced-events-for-integrations.md"

## 統合の設定

Sumo Logic UIで：

1. ホストコレクターを[指示](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector)に従って設定します。
2. HTTPログ＆メトリクスソースを[指示](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source)に従って設定します。
3. 提供されている**HTTPソースアドレス（URL）**をコピーします。

Wallarm UIで：

1. **統合**セクションを開きます。
2. **Sumo Logic**ブロックをクリックするか、**統合を追加**ボタンをクリックして**Sumo Logic**を選択します。
3. 統合名を入力します。
4. コピーしたHTTPソースアドレス（URL）の値を**HTTPソースアドレス（URL）**フィールドに貼り付けます。
5. Sumo Logicへのメッセージ送信をトリガーするイベントタイプを選択します。 イベントが選択されなければ、メッセージは送信されません。
6. [統合をテスト](#testing-integration)し、設定が正しいことを確認します。
7. **統合を追加**をクリックします。

![!Sumo Logic統合](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

## 統合のテスト

--8<-- "../include/integrations/test-integration-advanced-data.md"

Sumo Logic通知のテスト：

```json
{
    summary:"[Test message] [Test partner(US)] 新しい脆弱性が検出されました",
    description:"通知タイプ: vuln

                システム内で新しい脆弱性が検出されました。

                ID: 
                タイトル: テスト
                ドメイン: example.com
                パス: 
                メソッド: 
                発見者: 
                パラメーター: 
                タイプ: 情報
                脅威: 中等

                詳細: https://us1.my.wallarm.com/object/555


                クライアント: テスト会社
                クラウド: US
                ",
    details:{
        client_name:"テスト会社",
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
            threat:"中等",
            type:"情報"
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
