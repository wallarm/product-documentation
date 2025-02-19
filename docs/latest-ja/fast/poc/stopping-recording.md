[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run

[doc-about-recording]:              ../operations/internals.md#test-run
[doc-stop-recording]:               ../operations/stop-recording.md#stopping-the-recording-process-via-api
[doc-waiting-for-tests]:            waiting-for-tests.md

[doc-integration-overview]:         integration-overview.md

# 記録プロセスの停止

!!! info "章の前提条件"
    この章に記載された手順に従うためには、以下を取得する必要があります：
        
    * [Token][doc-get-token]
    * テスト実行の[Identifier][doc-get-testrun-id]
    
    以下の値は、本章全体で例として使用される値です：

    * トークンとして `token_Qwe12345`
    * テスト実行の識別子として `tr_1234`

APIを使用して、ベースラインリクエストの記録プロセスを[こちら][doc-stop-recording]の手順に従って停止します。

記録プロセスが停止された後、脆弱性に対するターゲットアプリケーションのテストが長時間続く場合があります。[このドキュメント][doc-waiting-for-tests]の情報を使用して、FASTセキュリティテストが完了しているか確認してください。

必要に応じて、[「FASTを使用したCI/CDワークフロー」][doc-integration-overview]ドキュメントを参照してください。