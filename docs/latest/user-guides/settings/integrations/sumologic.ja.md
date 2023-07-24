# Sumo Logic

Wallarm を設定して、以下のイベントがトリガされたときに Sumo Logic にメッセージを送信できます。

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## インテグレーションの設定

Sumo Logic UIで：

1. [指示](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector)に従ってホストされたコレクターを設定します。
2. [指示](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source)に従って、HTTP ログ＆メトリックスソースを設定します。
3.提供された **HTTP Source Address（URL）** をコピーします。

Wallarm UIで：

1. **インテグレーション** セクションを開きます。
2. **Sumo Logic** ブロックをクリックするか、**インテグレーションを追加** ボタンをクリックして **Sumo Logic** を選択します。
3. インテグレーション名を入力します。
4. HTTP ソースアドレス（URL）のコピーされた値を **HTTP Source Address（URL）** フィールドに貼り付けます。
5. Sumo Logic にメッセージを送信するイベントタイプを選択します。 イベントが選択されていない場合、メッセージは送信されません。
6. [インテグレーションをテスト](#testing-integration)して、設定が正しいことを確認します。
7. **インテグレーションを追加** をクリックします。

![!Sumo Logic integration](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration.md"

Sumo Logic 通知のテスト：

```json
{
    summary:"[テストメッセージ] [Test partner(US)] 新しい脆弱性が検出されました",
    description:"通知タイプ: vuln

                システムで新しい脆弱性が検出されました。

                ID: 
                タイトル: テスト
                ドメイン: example.com
                パス: 
                方法: 
                検出者: 
                パラメータ: 
                タイプ: 情報
                脅威: 中

                詳細: https://us1.my.wallarm.com/object/555


                クライアント: TestCompany
                クラウド: US
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

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"