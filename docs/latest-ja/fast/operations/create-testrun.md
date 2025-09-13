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
    
    Webインターフェイスでテストランを作成するには、Wallarmアカウントが必要です。
    
    トークンの詳細情報は[こちら][doc-token-information]をご覧ください。
    
    本ドキュメントでは例として`token_Qwe12345`というトークン値を使用します。

テストランを作成すると、新しい[テストレコード][doc-testrecord]も同時に作成されます。

このテストランの作成方法は、ベースラインリクエストを記録しながら対象アプリケーションをテストする必要がある場合に使用します。

## Creating a Test Run via API

テストランを作成するには、URL`https://us1.api.wallarm.com/v1/test_run`にPOSTリクエストを送信します:

--8<-- "../include/fast/operations/api-create-testrun.md"

APIサーバーへのリクエストが成功すると、サーバーからレスポンスが返されます。レスポンスには次のような有用な情報が含まれます:

1.  `id`: 新規作成されたテストランの識別子（例: `tr_1234`）。
    
    FASTをCI/CDに統合するために必要な次の操作を行うには、`id`パラメータの値が必要です:
    
    1.  FASTノードが記録プロセスを開始するのを確認します。
    2.  ベースラインリクエストの記録プロセスを停止します。
    3.  FASTのセキュリティテストが完了するのを待ちます。
    
2.  `state`: テストランの状態。
    
    新しく作成されたテストランは`running`状態です。
    `state`パラメータのすべての値の詳細な説明は[こちら][doc-state-description]をご覧ください。
    
3.  `test_record_id`: 新規作成されたテストレコードの識別子（例: `rec_0001`）。すべてのベースラインリクエストはこのテストレコードに格納されます。    

##  Webインターフェイスでテストランを作成する
      
Wallarmアカウントのインターフェイスからテストランを作成するには、次の手順に従います:

1. EUクラウドの場合は[このリンク](https://my.wallarm.com/testing/testruns)、USクラウドの場合は[このリンク](https://us1.my.wallarm.com/testing/testruns)から、Wallarmアカウント > **Test runs**に移動します。

2. **Create test run**ボタンをクリックします。

3. テストランの名前を入力します。

4. **Test policy**ドロップダウンリストからテストポリシーを選択します。新しいテストポリシーを作成するには[こちらの手順][link-create-policy]に従います。また、デフォルトポリシーを使用することもできます。

5. **Node**ドロップダウンリストからFASTノードを選択します。FASTノードを作成するには[こちらの手順][link-create-node]に従います。

    ![テストランの作成][img-test-run-creation]

6. 必要に応じて**Advanced settings**を追加します。この設定ブロックには次の項目が含まれます:

--8<-- "../include/fast/test-run-adv-settings.md"

    ![テストランのAdvanced settings][img-testrun-adv-settings]

7.  **Create and run**ボタンをクリックします。

## テストレコードの再利用

リクエスト送信元から対象アプリケーションにリクエストを送信し、[記録プロセスを停止][link-stopping-recording-chapter]した後、そのテストレコードを他のテストランで[再利用][doc-copying-testrun]できます。