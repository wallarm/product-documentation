```markdown
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run
[doc-get-testrun-status]:       ../operations/check-testrun-status.md

[doc-get-testrun-status]:   ../operations/check-testrun-status.md

[doc-integration-overview]:         integration-overview.md

# テスト完了を待つ

!!! info "章の前提条件"
    この章で記述されている手順に従うためには、以下を取得する必要があります：
    
    * [token][doc-get-token]
    * テスト実行の[識別子][doc-get-testrun-id]
    
    この章全体で、以下の値が例として使用されています：
        
    * tokenとして`token_Qwe12345`
    * テスト実行の識別子として`tr_1234`

ベースラインリクエストが最初に記録された時点で、テストリクエストの作成と実行のプロセスが開始され、ベースラインリクエストの記録が停止された後もかなりの時間がかかる場合があります。定期的にテスト実行の状態を確認し、実行中のプロセスの状況を把握してください。

APIコール[the API call][doc-get-testrun-status]を実行すると、APIサーバーからテスト実行の状態に関する情報を含む応答が返されます。

`state`および`vulns`パラメータの値に基づいて、アプリケーションに脆弱性が存在するか否かを判断することが可能です。

??? info "例"
    定期的にAPIコールを行いテスト実行の状態を問い合わせるプロセスは、APIサーバーの応答に`state:passed`パラメータが存在した場合は終了コード`0`で終了し、`state:failed`パラメータが存在した場合は終了コード`1`で終了する可能性があります。

    CI/CDツールは、この終了コードを用いて全体のCI/CDジョブの状態を評価できます。 

    FASTノードが[CIモード](integration-overview-ci-mode.md)で展開されている場合、FASTノードの終了コードだけで全体のCI/CDジョブの状態を判断するのに十分な場合があります。 

    APIサーバーの応答に含まれるその他の情報を活用して、FAST対応CI/CDジョブがCI/CDツールとどのように連携すべきかの、より複雑なロジックを構築することも可能です。

必要に応じて[「FASTを使用したCI/CDワークフロー」][doc-integration-overview]のドキュメントを参照してください。
```