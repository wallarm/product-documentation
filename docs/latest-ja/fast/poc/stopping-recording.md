[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run

[doc-about-recording]:              ../operations/internals.md#test-run
[doc-stop-recording]:               ../operations/stop-recording.md#stopping-the-recording-process-via-api
[doc-waiting-for-tests]:            waiting-for-tests.md

[doc-integration-overview]:         integration-overview.md

#   記録プロセスの停止

!!! info "章の前提条件"
    この章の手順に従うには、以下を取得する必要があります。
        
    * [トークン][doc-get-token]
    * テスト実行の[識別子][doc-get-testrun-id]
    
    本章を通して以下の値を例として使用します。

    * `token_Qwe12345` はトークンです
    * `tr_1234` はテスト実行の識別子です

[こちら][doc-stop-recording]に記載の手順に従ってAPI経由でベースラインリクエストの記録プロセスを停止してください。

記録プロセスを停止した後も、対象アプリケーションに対する脆弱性検査の実行には長時間かかる場合があります。FASTセキュリティテストが完了したかどうかを判断するには、[このドキュメント][doc-waiting-for-tests]の情報を使用してください。

 必要に応じて、[「FASTを使用したCI/CDワークフロー」][doc-integration-overview]ドキュメントを参照できます。