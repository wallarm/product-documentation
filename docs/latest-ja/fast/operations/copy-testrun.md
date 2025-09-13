[doc-tr-information]:   internals.md
[doc-testrecord]:       internals.md#test-record
[doc-state-description]:  check-testrun-status.md

[doc-create-testrun]:       create-testrun.md

[img-similar-tr-item]:              ../../images/fast/operations/common/copy-testrun/create-similar-testrun-item.png
[img-similar-tr-sidebar]:           ../../images/fast/operations/common/copy-testrun/create-similar-testrun-sidebar.png

#   テスト実行のコピー

!!! info "必要なデータ"
    API呼び出しでテスト実行をコピーするには、次のデータが必要です:
    
    * トークン
    * 既存のテストレコード識別子

    Webインターフェイスでテスト実行をコピーするには、Wallarmアカウントが必要です。

    トークンおよびテストレコードの詳細は[こちら][doc-tr-information]をご覧ください。
    
    本ドキュメントでは次の値を例として使用します:

    * `token_Qwe12345` をトークンとして使用します。
    * `rec_0001` をテストレコードとして使用します。

テスト実行をコピーする際には、既存の[テストレコード][doc-testrecord]を再利用します。

このテスト実行の作成方法は、すでに記録済みのベースラインリクエストを使用して対象アプリケーションをテストする必要がある場合に使用します。


##  テスト実行のコピーに関するルール

テスト実行をコピーする際の留意点は次のとおりです:
* コピーしたテスト実行で使用するテストポリシーは任意に指定できます。このポリシーは元のテスト実行で使用したポリシーと異なっていてもかまいません。
* 次の状態のテスト実行をコピーできます: `failed`, `interrupted`, `passed`, `paused`, `running`。これらのテスト実行の状態の説明は[こちら][doc-state-description]にあります。 
* ベースラインリクエストが1件も含まれていない空のテストレコードを使用してテスト実行をコピーすることはできません。
* テストレコードにベースラインリクエストを記録中の場合、そのレコードはテスト実行のコピーに使用できません。
 
    未完了のテストレコードに基づいてテスト実行をコピーしようとすると、APIサーバーから`400`エラーコード（`Bad Request`）と、以下のようなエラーメッセージが返されます:

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
    
    記録プロセスが停止されていない限り、Webインターフェイスからテスト実行をコピーすることはできません。

##  API経由でテスト実行をコピーする

テスト実行をコピーして実行するには、URL `https://us1.api.wallarm.com/v1/test_run` にPOSTリクエストを送信します:

--8<-- "../include/fast/operations/api-copy-testrun.md"

APIサーバーへのリクエストが成功すると、サーバーからのレスポンスが返されます。レスポンスには以下のような有用な情報が含まれます:

1.  `id`: テスト実行のコピーの識別子（例: `tr_1234`）。
    
    テスト実行の実行ステータスを制御するには`id`パラメータの値が必要です。
    
2.  `state`: テスト実行の状態。
    
    コピー直後のテスト実行は`running`状態です。
    
    `state`パラメータのすべての値の詳細な説明は[こちら][doc-state-description]をご覧ください。

    
##  Webインターフェイスでテスト実行をコピーする    

WallarmポータルのWebインターフェイスでテスト実行をコピーして実行するには:
1.  Wallarmアカウントでポータルにログインし、「Test runs」タブに移動します。
2.  コピーするテスト実行を選択し、そのテスト実行の右側にあるアクションメニューを開きます。
3.  「Create similar testrun」メニュー項目を選択します。 

    ![「Create similar test run」メニュー項目][img-similar-tr-item]

4.  開いたサイドバーで次の項目を選択します:
    * テスト実行のコピーの名前
    * テスト実行のコピーで使用するポリシー
    * テスト実行のコピーを実行するノード
    
    ![「Test run」サイドバー][img-similar-tr-sidebar]
    
    必要に応じて「Advanced settings」を選択して追加の設定を構成できます:
    
--8<-- "../include/fast/test-run-adv-settings.md"
    
5.  「Use baselines from `<the name of the test record to reuse>`」オプションがチェックされていることを確認します。

    !!! info "テストレコードの再利用"
        このオプションに表示されるのはテスト実行名ではなくテストレコード名ですのでご注意ください。
        
        [テスト実行を作成する][doc-create-testrun]際に`test_record_name`パラメータを指定しない場合など、テストレコード名が省略されることはよくあります。この場合、テストレコード名はテスト実行名と同じになります。
        
        上図のコピー画面では、過去にこのテストレコードを使用したテスト実行の名前と一致しないテストレコード名が表示されています（`MY TEST RECORD`というテストレコードは`DEMO TEST RUN`というテスト実行で使用されました）。 

6.  「Create and run」ボタンをクリックしてテスト実行を開始します。    