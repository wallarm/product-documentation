[doc-node-deployment-api]:          node-deployment.md
[doc-fast-recording-mode]:          ci-mode-recording.md#running-a-fast-node-in-recording-mode

[doc-integration-overview]:         integration-overview.md


#   プロキシルールの設定

!!! warning "注意"
    この章で説明されている手順は、FASTノードが[API][doc-node-deployment-api]または[CIモード（記録モード）][doc-fast-recording-mode]経由でデプロイされている場合にのみ実行します。

リクエストの発生源を設定し、すべてのリクエストが目的のアプリケーションに向けてFASTノードをHTTPプロキシとして利用します。

CI/CDインフラストラクチャがFASTノードのDockerコンテナとどのようにやり取りするかにより、ノードに次のいずれかの手段で対応することができます:
* IPアドレス。
* ドメイン名。

!!! info "例"
    テストツールがLinux Dockerコンテナとして動作している場合、コンテナに以下の環境変数を渡すことで、そのコンテナからのすべてのHTTPリクエストをFASTノード経由でプロキシすることができます：
    
    ```
    HTTP_PROXY=http://<FASTノード名またはIPアドレス>:<ポート>
    ```