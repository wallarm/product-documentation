```markdown
[doc-tr-information]:   internals.md
[doc-testrecord]:       internals.md#test-record
[doc-state-description]:  check-testrun-status.md

[doc-create-testrun]:       create-testrun.md

[img-similar-tr-item]:              ../../images/fast/operations/common/copy-testrun/create-similar-testrun-item.png
[img-similar-tr-sidebar]:           ../../images/fast/operations/common/copy-testrun/create-similar-testrun-sidebar.png

# テストランのコピー

!!! info "必須データ"
    APIコールでテストランをコピーする場合、以下の情報が必要です:
    
    * token
    * 既存のtest record識別子

    Webインターフェースでテストランをコピーする場合、Wallarmアカウントが必要です。

    tokenやtest recordの詳細な情報については[こちら][doc-tr-information]を参照してください。
    
    本ドキュメントでは以下の値を例として使用します:

    * tokenとして`token_Qwe12345`
    * test recordとして`rec_0001`

テストランをコピーする際、既存の[test record][doc-testrecord]が再利用されます。

事前に記録されたベースラインリクエストを使用してターゲットアプリケーションをテストする必要がある場合、このテストラン作成方法を使用してください。

## テストランコピーのルール

テストランをコピーする際に留意すべき点は以下の通りです:
* コピーされたテストランに対して任意のテストポリシーを指定できます。このポリシーは元のテストランで使用されたポリシーと異なる場合があります。
* コピー可能なテストランの状態は`failed`、`interrupted`、`passed`、`paused`、`running`です。これらのテストラン状態の説明は[こちら][doc-state-description]に記載されています。
* ベースラインリクエストが一切含まれていない空のtest recordを使用してテストランをコピーすることはできません。
* test recordにベースラインリクエストが記録されている場合、そのrecordを使用してテストランをコピーすることはできません。
 
    未完了のtest recordに基づいてテストランをコピーしようとすると、APIサーバーから`400`エラーコード（Bad Request）と以下に類似したエラーメッセージが返されます:
    
    ```
    {
        "status": 400,
        "body": {
            "test_record_id": {
            "error": "not_ready_for_cloning",
            "value": rec_0001
            }
        }
    }
    ```
    
    記録プロセスが停止していない限り、Webインターフェースからテストランをコピーすることはできません。

## APIによるテストランのコピー

テストランをコピーして実行するには、POSTリクエストをURL `https://us1.api.wallarm.com/v1/test_run` に送信してください:

--8<-- "../include/fast/operations/api-copy-testrun.md"

APIサーバーへのリクエストが成功すると、サーバーからの応答が返されます。応答には以下の有用な情報が含まれます:

1.  `id`: テストランコピーの識別子（例: `tr_1234`）。
    
    テストランの実行状態を制御するには、`id`パラメータの値が必要です。
    
2.  `state`: テストランの状態。
    
    新たにコピーされたテストランは`running`状態になります。
    
    `state`パラメータの全ての値に関する詳細な説明は[こちら][doc-state-description]に記載されています。

## Webインターフェースによるテストランのコピー    

WallarmポータルのWebインターフェースからテストランをコピーして実行するには、以下の手順を行ってください:
1.  Wallarmアカウントでポータルにログインし、次に「Test runs」タブに移動してください。
2.  コピーするテストランを選択し、そのテストランの右側にあるアクションメニューを開いてください。
3.  「Create similar testrun」メニュー項目を選択してください。 

    ![The “Create similar test run” menu entry][img-similar-tr-item]

4.  開いたサイドバーで以下の項目を選択してください:
    * テストランコピーの名前
    * テストランコピーに使用するポリシー
    * テストランコピーを実行するノード
    
    ![The “Test run” sidebar][img-similar-tr-sidebar]
    
    必要に応じて、「Advanced settings」を選択することで追加の設定を行うことができます:
    
--8<-- "../include/fast/test-run-adv-settings.md"
    
5.  「Use baselines from `<the name of the test record to reuse>`」オプションにチェックが入っていることを確認してください。

    !!! info "Test Recordの再利用"
        オプションに表示されるのはテストラン名ではなく、test recordの名前である点に注意してください。
        
        test record名が省略される場合もあります: 例えば、[テストランが作成される際][doc-create-testrun]に`test_record_name`パラメータが指定されなかった場合、test recordの名前はテストランの名前と同一になります。
        
        上記の図は、過去にtest recordが使用されたテストラン（`DEMO TEST RUN`テストランが使用した`MY TEST RECORD`）とは異なる名前のtest recordが記載されているコピーのダイアログを示しています。

6.  「Create and run」ボタンをクリックしてテストランを実行してください。
```