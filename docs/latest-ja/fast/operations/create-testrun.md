[img-test-run-creation]:            ../../images/fast/operations/common/create-testrun/test-run-create.png
[img-testrun-adv-settings]:         ../../images/fast/operations/common/create-testrun/test-run-settings.png

[doc-token-information]:    internals.md#token
[doc-state-description]:    check-testrun-status.md
[doc-copying-testrun]:      copy-testrun.md
[doc-testrecord]:           internals.md#test-record

[link-stopping-recording-chapter]:  stop-recording.md
[link-create-policy]:               test-policy/general.md
[link-create-node]:                 create-node.md
[doc-inactivity-timeout]:           internals.md#test-run

#   テストランの作成

!!! info "必要なデータ"
    APIメソッドでテストランを作成するには、トークンが必要です。
    
    ウェブインターフェイスでテストランを作成するためには、Wallarmのアカウントが必要です。

    トークンに関する詳細な情報は[こちら][doc-token-information]をご覧ください。
    
    このドキュメントでは、例として `token_Qwe12345` の値を使用しています。

テストランを作成している時、新しい[テストレコード][doc-testrecord]も同時に作成されます。

このテストランの作り方は、目標となるアプリケーションのテストと共にベースラインリクエストの録音を必要とする場合に使われます。

## APIによるテストランの作成

テストランを作成するためには、URL `https://us1.api.wallarm.com/v1/test_run` へのPOSTリクエストを送信してください：

--8<-- "../include-ja/fast/operations/api-create-testrun.md"

APIサーバへのリクエストが成功すると、サーバーのレスポンスが表示されます。レスポンスには有用な情報が含まれています：

1.  `id`：新しく作成されたテストランの識別子（例： `tr_1234`）。

    次のアクションに必要なidパラメータの値が必要になります。これらのアクションは、FASTをCI/CDに統合するために必要です：

    1.  FASTノードが録音プロセスを開始するのを確認する。  
    2.  ベースラインリクエストの録音プロセスを停止する。
    3.  FASTセキュリティテストが終了するのを待つ。
    
2.  `state`：テストランの状態。
    
    新しく作成されたテストランの状態は `running` です。
    `state` パラメータのすべての値についての詳細な説明は[こちら][doc-state-description]で確認できます。
    
3.  `test_record_id`：新しく作成されたテストレコードの識別子（例： `rec_0001`）。すべてのベースラインリクエストはこのテストレコードに格納されます。

## ウェブインターフェイスを利用したテストランの作成

Wallarmアカウントのインターフェイスを通じてテストランを作成するには、以下の手順をご確認ください：

1. お持ちのWallarmアカウントにアクセスし、[このリンク](https://my.wallarm.com/testing/testruns)をEUクラウド向けに、または[このリンク](https://us1.my.wallarm.com/testing/testruns)をUSクラウド向けにクリックして**テストラン**に入ります。

2. **テストラン作成**ボタンを押します。

3. テストランの名前を入力します。

4. **テストポリシー**のドロップダウンリストからテストポリシーを選択します。新しいテストポリシーを作成するには、[この手順][link-create-policy]をご覧ください。また、デフォルトのポリシーを使用することも可能です。

5. **ノード**のドロップダウンリストからFASTノードを選択します。FASTノードを作成するには、[この説明][link-create-node]をご覧ください。

    ![テストラン作成][img-test-run-creation]

6.必要に応じて**詳細設定**を追加します。この設定ブロックには、以下の点が含まれています：

--8<-- "../include-ja/fast/test-run-adv-settings.md"

    ![テストラン詳細設定][img-testrun-adv-settings]

7.**作成と実行**ボタンを押します。

## テストレコードの再利用

リクエストソースからターゲットアプリケーションへのリクエストが送信され、[録画プロセスが停止][link-stopping-recording-chapter]した後、他のテストランで[テストレコードを再利用][doc-copying-testrun]することが可能です。