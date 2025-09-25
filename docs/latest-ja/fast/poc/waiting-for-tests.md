[doc-get-token]:                    prerequisites.md#anchor-token
[doc-get-testrun-id]:               node-deployment.md#obtaining-a-test-run
[doc-get-testrun-status]:       ../operations/check-testrun-status.md

[doc-get-testrun-status]:   ../operations/check-testrun-status.md

[doc-integration-overview]:         integration-overview.md

#   テスト完了の待機

!!! info "本章の前提条件"
    本章の手順に従うには、次を取得する必要があります:
    
    * [トークン][doc-get-token]。
    * テスト実行の[識別子][doc-get-testrun-id]。
    
    以下の値を例として使用します:
        
    * `token_Qwe12345`をトークンとして使用します。
    * `tr_1234`をテスト実行の識別子として使用します。

最初のベースラインリクエストが記録された時点で、テストリクエストの作成および実行の処理が開始されます。ベースラインリクエストの記録を停止した後も、これらの処理が完了するまでに相当な時間を要する場合があります。進行中の処理の状況を把握するために、テスト実行の状態を定期的に確認できます。

[APIコール][doc-get-testrun-status]を実行すると、テスト実行の状態に関する情報を含むAPIサーバーからのレスポンスを受け取ります。

`state`および`vulns`パラメータの値に基づいて、アプリケーションに脆弱性が存在するかどうかを判断できます。

??? info "例"
    テスト実行の状態を定期的にAPIコールで問い合わせるプロセスは、APIサーバーのレスポンスに`state:passed`が含まれていた場合は終了コード`0`で、`state:failed`が含まれていた場合は終了コード`1`で終了するようにできます。

    この終了コードの値は、CI/CDツールで使用してCI/CDジョブの全体的なステータスを決定できます。 

    FASTノードが[CIモード](integration-overview-ci-mode.md)でデプロイされている場合、CI/CDジョブの全体的なステータスを判断するにはFASTノードの終了コードだけで十分な場合があります。 

    FAST対応のCI/CDジョブがCI/CDツールとどのように連携するかについて、さらに複雑なロジックを構築することも可能です。そのためには、APIサーバーのレスポンスに含まれるその他のデータも使用します。

 必要に応じて、「FASTを用いたCI/CDワークフロー」[doc-integration-overview]ドキュメントを参照できます。