[img-stop-recording-item]:  ../../images/fast/operations/common/stop-recording/stop-recording-gui.png

[doc-about-tr-token]:       internals.md
[doc-testrun-copying-api]:  copy-testrun.md#copying-a-test-run-via-an-api
[doc-testrun-copying-gui]:  copy-testrun.md#copying-a-test-run-via-web-interface

[link-stop-explained]:      internals.md#test-run-execution-flow-baseline-requests-recording-takes-place


#   記録プロセスの停止

!!! info "必要なデータ"
    API経由で記録を停止するには、次のデータが必要です:
    
    * トークン
    * テスト実行の識別子

    Webインターフェイス経由で記録を停止するには、Wallarmアカウントが必要です。
    
    テスト実行とトークンの詳細情報は[こちら][doc-about-tr-token]で確認できます。
    
    本ドキュメントでは、以下の値を例として使用します:
        
    * `token_Qwe12345`（トークンの例）
    * `tr_1234`（テスト実行の識別子の例）

ベースラインリクエストの記録を停止する必要性については[リンク][link-stop-explained]で説明しています。

## API経由での記録プロセスの停止

記録プロセスを停止するには、URL `https://us1.api.wallarm.com/v1/test_run/test_run_id/action/stop` にPOSTリクエストを送信します:

--8<-- "../include/fast/operations/api-stop-recording.md"

APIサーバーへのリクエストが成功すると、サーバーからレスポンスが返されます。レスポンスには次の有用な情報が含まれます:
* 記録プロセスの状態（`recording`パラメータの値）。
* 対応するテストレコードの識別子（`test_record_id`パラメータ）。

パラメータの値が`false`であれば、停止は成功です。

停止が成功した場合は、`test_record_id`の識別子を持つテストレコードを使用して[テスト実行をコピー][doc-testrun-copying-api]できます。

## Webインターフェイス経由での記録プロセスの停止

Webインターフェイスで記録プロセスを停止するには、次の手順に従います:

1. EUクラウドの場合は[このリンク](https://my.wallarm.com/testing/testruns)、USクラウドの場合は[このリンク](https://us1.my.wallarm.com/testing/testruns)から、Wallarmアカウント > **Test runs**に移動します。

2. 記録を停止する対象のテスト実行を選択し、アクションメニューを開きます。

3. **Stop recording**を選択します。

    ![Webインターフェイスでの記録停止][img-stop-recording-item]

記録が停止されると、**Baseline req.**列の左側にあるREQインジケーターがオフになります。

テストレコードのIDは**Test record name/Test record ID**列に表示されます。

必要に応じて、Webインターフェイスを使用して[このテスト実行をコピー][doc-testrun-copying-gui]でき、新しいテストは前述のテストレコードを再利用します。