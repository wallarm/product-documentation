[img-stop-recording-item]:  ../../images/fast/operations/common/stop-recording/stop-recording-gui.png

[doc-about-tr-token]:       internals.md
[doc-testrun-copying-api]:  copy-testrun.md#copying-a-test-run-via-an-api
[doc-testrun-copying-gui]:  copy-testrun.md#copying-a-test-run-via-web-interface

[link-stop-explained]:      internals.md#test-run-execution-flow-baseline-requests-recording-takes-place


#   録画プロセスの停止

!!! info "必要なデータ"
    API経由で録画を停止するには、以下のデータが必要です：
    
    * プトークン
    * テスト実行の識別子

    ウェブインタフェース経由で録画を停止するには、Wallarmアカウントが必要です。
    
    テスト実行とトークンについての詳細な情報は[ここ][doc-about-tr-token]で入手できます。
    
    この文書では以下の値が例として使用されています：
        
    * `token_Qwe12345` をトークンとして。
    * `tr_1234` をテスト実行の識別子として。

基本リクエストの録画を停止する必要性は[リンク][link-stop-explained]で説明されています。 

## APIを介した録画プロセスの停止

録画プロセスを停止するには、POSTリクエストをURL `https://us1.api.wallarm.com/v1/test_run/test_run_id/action/stop`に送信します：

--8<-- "../include-ja/fast/operations/api-stop-recording.md"

APIサーバーへのリクエストが成功した場合、サーバーのレスポンスが表示されます。レスポンスには、以下を含む有用な情報が提供されます：
* 録画プロセスの状態（`recording`パラメータの値）。
* 対応するテストレコードの識別子（`test_record_id`パラメータ）。

パラメータの値が`false`の場合、停止は成功しています。

停止が成功した場合、`test_record_id`識別子を持つテストレコードを使って[テストランをコピーする][doc-testrun-copying-api]ことが可能です。

## Webインタフェースを介した録画プロセスの停止

Webインタフェースを介した録画プロセスの停止には、以下の手順に従ってください：

1. Wallarmアカウントにアクセスし、[このリンク](https://my.wallarm.com/testing/testruns)よりEUクラウド、または[このリンク](https://us1.my.wallarm.com/testing/testruns)よりUSクラウドで**Test runs**にアクセスします。

2. 録音を停止するテストランを選択し、アクションメニューを開きます。

3. ** Stop recording**を選択します。

    ![ウェブインタフェースでの録音停止][img-stop-recording-item]

録画が停止したときに、**Baseline req.**の列の左側にあるREQインジケーターがオフになります。

テストレコードのIDは**Test record name/Test record ID**列で表示されます。

必要に応じて、ウェブインタフェースを使用して[このテストランをコピーする][doc-testrun-copying-gui]ことができ、新しいテストは上記のテストレコードを再利用します。