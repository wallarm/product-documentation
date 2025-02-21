[img-stop-recording-item]:  ../../images/fast/operations/common/stop-recording/stop-recording-gui.png

[doc-about-tr-token]:       internals.md
[doc-testrun-copying-api]:  copy-testrun.md#copying-a-test-run-via-an-api
[doc-testrun-copying-gui]:  copy-testrun.md#copying-a-test-run-via-web-interface

[link-stop-explained]:      internals.md#test-run-execution-flow-baseline-requests-recording-takes-place


# 記録プロセスの停止

!!! info "必要なデータ"
    APIを利用して記録を停止するには、次のデータが必要です:
    
    * token
    * テストラン識別子

    Webインタフェースを利用して記録を停止する場合は、Wallarmアカウントが必要です.
    
    テストランとtokenの詳細情報は[こちら][doc-about-tr-token]からご確認ください.
    
    本ドキュメントでは、以下の値を例として使用します:
        
    * tokenとして`token_Qwe12345`
    * テストラン識別子として`tr_1234`

ベースラインリクエストの記録停止の必要性については[こちら][link-stop-explained]に記載されています.

## APIを利用した記録プロセスの停止

記録プロセスを停止するには、URL `https://us1.api.wallarm.com/v1/test_run/test_run_id/action/stop` へPOSTリクエストを送信してください:

--8<-- "../include/fast/operations/api-stop-recording.md"

APIサーバーへのリクエストが成功すると、サーバーからの応答が返され、有用な情報が含まれています。主な内容は以下の通りです:
* 記録プロセスの状態（`recording`パラメータの値）
* 対応するテストレコードの識別子（`test_record_id`パラメータ）

パラメータの値が`false`の場合、記録停止が成功したことを示します.

記録停止が成功した場合、`test_record_id`識別子を持つテストレコードを利用して[テストランをコピー][doc-testrun-copying-api]可能です.

## Webインタフェースを利用した記録プロセスの停止

Webインタフェースを利用して記録プロセスを停止するには、以下の手順に従ってください:

1. EUクラウドの場合は[こちら](https://my.wallarm.com/testing/testruns)またはUSクラウドの場合は[こちら](https://us1.my.wallarm.com/testing/testruns)から、Wallarmアカウントの**Test runs**にアクセスしてください.

2. 記録停止するテストランを選択し、アクションメニューを開いてください.

3. **Stop recording** を選択してください.

    ![Webインタフェースによる記録停止][img-stop-recording-item]

記録停止時には、**Baseline req.** 列の左側にあるREQインジケータがオフになります.

テストレコードのIDは、**Test record name/Test record ID** 列に表示されます.

必要に応じて、Webインタフェースを利用してこのテストランを[コピー][doc-testrun-copying-gui]することができ、新しいテストでは記載されたテストレコードが再利用されます.