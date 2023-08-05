[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-test-run
[doc-get-testrun-status]:       ../operations/check-testrun-status.md

[doc-get-testrun-status]:   ../operations/check-testrun-status.md

[doc-integration-overview]:         integration-overview.md

#   テストの終了を待つ

!!! info "章の前提条件"
    この章で説明されている手順を行うためには、以下のものを取得する必要があります。
    
    * [トークン][doc-get-token]。
    * テストの実行[識別子][doc-get-testrun-id]。
    
    以下の値は、章全体を通じて例として使用されます。
    
    * トークンとしての`token_Qwe12345`
    * テスト実行の識別子としての`tr_1234`

最初の基準リクエストが記録された時点でテストリクエストの作成と実行のプロセスが始まり、基準リクエストの記録プロセクスが停止された後も相当な時間を要する可能性があります。テスト実行の状態を定期的に確認することで、実行中のプロセスについての洞察を得ることができます。

[APIコール][doc-get-testrun-status]を実行した後、APIサーバからテスト実行の状態に関する情報がレスポンスとして返されます。

`state`と`vulns`パラメータの値に基づいて、アプリケーションに脆弱性が存在するかどうかの結論を導き出すことが可能です。

??? info "例"
    テスト実行の状態を問い合わせるためにAPIコールを定期的に発行するプロセスは、APIサーバのレスポンスで`state:passed`パラメータが見つかった場合には終了コード `0`で終了し、`state:failed`パラメータが見つかった場合には終了コード `1`で終了する場合があります。

    終了コードの値は、CI/CDツールが全体のCI/CDジョブのステータスを算出するために利用可能です。

    FASTノードが[CIモード](integration-overview-ci-mode.md)でデプロイされている場合は、FASTノードの終了コードだけで全体のCI/CDジョブの状態を判断するのに十分かもしれません。

    FASTを有効化したCI/CDジョブがCI/CDツールとどのようにやりとりを行うべきかのより複雑なロジックを構築することも可能です。その方法として、APIサーバのレスポンスで見つけることができる他のデータを用いることができます。

 必要に応じて、[「FASTによるCI/CDワークフロー」][doc-integration-overview]文書を参照してください。