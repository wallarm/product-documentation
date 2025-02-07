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
https://my.wallarm.com/testing/testruns
https://us1.my.wallarm.com/testing/testruns

# テストランの作成

!!! info "必要なデータ"
    APIメソッドを使用してテストランを作成するにはtokenが必要です。
    
    Webインターフェースを使用してテストランを作成するにはWallarmアカウントが必要です。
    
    tokenに関する詳細な情報は[こちら][doc-token-information]をご確認ください。
    
    このドキュメントでは例として`token_Qwe12345`を使用しています。

テストランが作成されると、新たに[test record][doc-testrecord]も作成されます。

このテストラン作成方法は、対象アプリケーションのテストと同時にベースラインリクエストの記録が必要な場合に使用します。

## APIを使用したテストランの作成

テストランを作成するには、`https://us1.api.wallarm.com/v1/test_run`にPOSTリクエストを送信します:

--8<-- "../include/fast/operations/api-create-testrun.md"

APIサーバーへのリクエストが成功した場合、サーバーの応答が返されます。応答には以下の有用な情報が含まれます:

1.  `id`: 新たに作成されたテストランの識別子（例：`tr_1234`）。
    
    このidパラメータ値は、FASTをCI/CDに統合するために必要な以下のアクションを実行する際に使用します:
    
    1.  FASTノードが記録プロセスを開始するか確認します。  
    2.  ベースラインリクエストの記録プロセスを停止します。
    3.  FASTセキュリティテストが完了するまで待機します。
    
2.  `state`: テストランの状態。
    
    新たに作成されたテストランは`running`状態です。
    `state`パラメータのすべての値の詳細な説明は[こちら][doc-state-description]に記載されています。
    
3.  `test_record_id`: 新たに作成されたテストレコードの識別子（例：`rec_0001`）。すべてのベースラインリクエストはこのテストレコードに配置されます。

## Webインターフェースを使用したテストランの作成
      
Wallarmアカウントのインターフェースを使用してテストランを作成するには、以下の手順に従ってください:

1. お使いのWallarmアカウントにログインし、EUクラウドの場合は[このリンク](https://my.wallarm.com/testing/testruns)へ、USクラウドの場合は[このリンク](https://us1.my.wallarm.com/testing/testruns)へ移動し、**Test runs**を選択します。

2. **Create test run**ボタンをクリックします。

3. テストランの名前を入力します。

4. ドロップダウンリストの**Test policy**からテストポリシーを選択します。新しいテストポリシーを作成する場合は[こちらの手順][link-create-policy]に従ってください。また、デフォルトのポリシーを使用することも可能です。

5. ドロップダウンリストの**Node**からFASTノードを選択します。FASTノードを作成する場合は[こちらの手順][link-create-node]に従ってください。

    ![テストランの作成][img-test-run-creation]

6. 必要に応じて**Advanced settings**を追加します。この設定ブロックには以下の項目が含まれます:

--8<-- "../include/fast/test-run-adv-settings.md"

    ![テストランの詳細設定][img-testrun-adv-settings]

7. **Create and run**ボタンをクリックします。

## テストレコードの再利用

リクエストがリクエストソースから対象アプリケーションへ送信され、[記録プロセスが停止した][link-stopping-recording-chapter]場合、他のテストランと[テストレコードを再利用する][doc-copying-testrun]ことが可能です。