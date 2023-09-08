[doc-tr-information]:   internals.md
[doc-testrecord]:       internals.md#test-record
[doc-state-description]:  check-testrun-status.md

[doc-create-testrun]:       create-testrun.md

[img-similar-tr-item]:              ../../images/fast/operations/common/copy-testrun/create-similar-testrun-item.png
[img-similar-tr-sidebar]:           ../../images/fast/operations/common/copy-testrun/create-similar-testrun-sidebar.png

#   テストランのコピー

!!! info "必要なデータ"
    API呼び出しでテストランをコピーするためには、以下のデータが必要です:
    
    * トークン
    * 既存のテストレコード識別子

    Webインターフェースでテストランをコピーするためには、Wallarmアカウントが必要です。

    トークンとテストレコードに関する詳細な情報は、[こちら][doc-tr-information]から取得できます。
    
    この文書では以下の値を例として使用します:

    * トークンとして `token_Qwe12345`
    * テストレコードとして `rec_0001` 

テストランがコピーされる際、既存の[テストレコード][doc-testrecord]が再利用されます。

このテストラン作成方法は、すでに記録されているベースラインリクエストを使用して対象アプリケーションをテストする必要がある場合に使用する必要があります。


##  テストランのコピーのルール

テストランをコピーする際の考慮点は以下の通りです:
* コピーされたテストランで使用される任意のテストポリシーを指定することができます。このポリシーは、オリジナルのテストランで使用されたポリシーと異なる場合があります。
* 次の状態のテストランをコピーすることができます: `failed`, `interrupted`, `passed`, `paused`, `running`. これらのテストラン状態の詳細は[こちら][doc-state-description]で説明されています。
* ベースラインリクエストがない空のテストレコードを使用してテストランをコピーすることはできません。
* ベースラインリクエストがテストレコードに記録されている場合、このレコードはテストランのコピーには使用できません。
 
    未完のテストレコードに基づいてテストランをコピーしようとすると、APIサーバから`400`のエラーコード(`Bad Request`)と下記のようなエラーメッセージが返されます:

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
    
    録画プロセスがストップされていない限り、Webインターフェースからテストランをコピーすることはできません。

##  API経由でのテストランのコピー

テストランをコピーし実行するには、URL `https://us1.api.wallarm.com/v1/test_run` にPOSTリクエストを送信します:

--8<-- "../include-ja/fast/operations/api-copy-testrun.md"

APIサーバへのリクエストが成功すると、サーバの応答が表示されます。応答には以下の有用な情報が含まれています:

1.  `id`: テストランのコピーの識別子 (例えば、 `tr_1234`).
    
    テストラン実行状態を制御するためには`id`パラメータ値が必要となります。
    
2.  `state`: テストランの状態.
    
    新しくコピーされたテストランは `running` 状態にあります。
    
    `state` パラメータの全ての値についての詳細な説明は[こちら][doc-state-description]で見つけることができます。

    
##  Webインターフェース経由でのテストランのコピー    

WallarmポータルのWebインターフェースを通してテストランをコピーし実行するには以下の手順を実行します:
1.  Wallarmアカウントでポータルにログインし、”Test runs"タブに移動します。
2.  コピーするテストランを選択し、テストランの右側にある操作メニューを開きます。
3.  "Create similar testrun"メニューエントリを選択します。 

    ![“Create similar test run” menu entry][img-similar-tr-item]

4.  開いたサイドバーで以下の項目を選択します:
    * テストランのコピーの名前
    * テストランのコピーで使用するポリシー
    * テストランのコピーが実行されるノード
    
    ![“Test run” sidebar][img-similar-tr-sidebar]
    
    必要に応じて"Advanced settings"を選択することで追加の設定を行うことができます:
    
--8<-- "../include-ja/fast/test-run-adv-settings.md"
    
5.  ”Use baselines from `<the name of the test record to reuse>`” オプションがチェックされていることを確認します。

    !!! info "テストレコードの再利用"
        オプションに表示されるのはテストランの名前ではなく、テストレコードの名前であることに注意してください。
        
        テストレコードの名前はしばしば省略される: 例えば、[テストランが作成される][doc-create-testrun]際に`test_record_name` パラメータが指定されていない場合、テストレコードの名前はテストランの名前と同じです。
        
        上記の図は、過去のテストラン(`DEMO TEST RUN`)で使用されたテストレコード(`MY TEST RECORD`)の名前がテストランの名前と等しくないテストレコードを言及しているコピーのダイアログを示しています。 

6.  "Create and run"ボタンをクリックしてテストランを実行します。