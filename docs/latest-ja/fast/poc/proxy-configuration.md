[doc-node-deployment-api]:          node-deployment.md
[doc-fast-recording-mode]:          ci-mode-recording.md#running-a-fast-node-in-recording-mode

[doc-integration-overview]:         integration-overview.md


#   プロキシルールの設定

!!! warning "注意"
    FASTノードを[API][doc-node-deployment-api]または[CIモード(記録モード)][doc-fast-recording-mode]でデプロイする場合にのみ、本章の手順を実施してください。

対象アプリケーションに送信されるすべてのリクエストについて、リクエストの送信元がFASTノードをHTTPプロキシとして使用するように設定します。

CI/CDインフラストラクチャがFASTノードのDockerコンテナとどのように連携しているかに応じて、次のいずれかの方法でノードを指定できます:
* IPアドレス。
* ドメイン名。

!!! info "例"
    テストツールがLinuxのDockerコンテナとして実行されている場合、次の環境変数をコンテナに渡すことで、そのコンテナからのすべてのHTTPリクエストをFASTノード経由でプロキシできます:
    
    ```
    HTTP_PROXY=http://<FAST node name or IP address>:<port>
    ```