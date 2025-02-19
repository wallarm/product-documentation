# プロキシルールの設定

!!! warning "注意"
    この章に記述された手順は、[API][doc-node-deployment-api]または[CI Mode (recording mode)][doc-fast-recording-mode]を介してFAST nodeをデプロイする場合にのみ実施してください。

リクエスト送信元を構成して、対象アプリケーションへのすべてのリクエストのHTTPプロキシとしてFAST nodeを利用するように設定してください。

CI/CDインフラがFAST nodeのDockerコンテナとどのように相互作用するかに応じて、以下のいずれかの方法でノードにアクセスできます：
* IPアドレス。
* ドメイン名。

!!! info "例"
    テストツールがLinux Dockerコンテナ上で実行されている場合、以下の環境変数をコンテナに渡すことで、そのコンテナからのすべてのHTTPリクエストをFAST node経由でプロキシすることが可能です:
    
    ```
    HTTP_PROXY=http://<FAST node name or IP address>:<port>
    ```