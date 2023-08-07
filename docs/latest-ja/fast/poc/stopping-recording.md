[doc-get-token]: prerequisites.md#anchor-token
[doc-get-testrun-id]: node-deployment.md#録音プロセスの停止-テスト-実行の特定
[doc-about-recording]: ../operations/internals.md#テスト-実行
[doc-stop-recording]: ../operations/stop-recording.md#api経由での録音プロセスの停止
[doc-waiting-for-tests]: waiting-for-tests.md
[doc-integration-overview]: integration-overview.md

# 録音プロセスの停止

!!! info "章の前提条件"
    この章で説明されている手順に従うためには、次のものを取得する必要があります:
        
    * [トークン][doc-get-token]
    * [識別子][doc-get-testrun-id]のテスト実行
    
    以下の値は、章全体の例として使用されます：

    * トークンとしての `token_Qwe12345`
    * テストランの識別子としての `tr_1234`

APIを使用してベースラインリクエストの録音プロセスを停止します。手順については[こちら][doc-stop-recording]を参照してください。

録音プロセスが停止した後も、ターゲットアプリケーションの脆弱性に対するテストプロセスは長時間続く場合があります。FASTセキュリティテストが完了したかどうかを判断するためには、[このドキュメント][doc-waiting-for-tests]の情報を利用してください。

必要に応じて、[「CI/CDワークフローとFAST」][doc-integration-overview]ドキュメントを参照することができます。