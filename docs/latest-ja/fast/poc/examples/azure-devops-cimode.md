# FASTとAzure DevOpsの統合

FASTがCIモードでAzure DevOpsパイプラインに統合される設定は`azure-pipelines.yml`ファイルを通じて行います。`azure-pipelines.yml`ファイルの詳細なスキーマは[Azure DevOps公式ドキュメンテーション](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema)に説明されています。

!!! info "設定済みのワークフロー"
    以下の指示は、次のいずれかの要件を満たすすでに設定されたワークフローが必要です:

    * テスト自動化が実装されています。この場合、FASTノードトークンを[渡す](#passing-fast-node-token)必要があり、[リクエスト記録](#adding-the-step-of-request-recording)と[セキュリティテスト](#adding-the-step-of-security-testing)のステップを追加する必要があります。
    * ベースラインのリクエストのセットがすでに記録されています。この場合、FASTノードトークンを[渡す](#passing-fast-node-token)必要があり、[セキュリティテスト](#adding-the-step-of-security-testing)のステップを追加する必要があります。

## FASTノードトークンの渡し方

[FASTノードトークン](../../operations/create-node.md)を安全に使用するために、現在のパイプライン設定を開き、トークンの値を[Azure DevOps環境変数](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#environment-variables)に渡します。

![Passing Azure DevOps environment variable](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-env-var-example.png)

## リクエスト記録のステップの追加

--8<-- "../include-ja/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "レコードモードでFASTノードを起動する自動テストステップの例"
    ```
    - job: tests
      steps:
      - script: docker network create my-network
        displayName: 'my-networkの作成'
      - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
        displayName: 'my-network上でのテストアプリケーションの実行'
      - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
        displayName: 'my-network上での記録モードでのFASTノードの実行'
      - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
        displayName: 'my-network上でFASTノードをプロキシとしてSeleniumを実行'
      - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
        displayName: 'my-network上での自動テストの実行'
      - script: docker stop selenium fast
        displayName: 'Seleniumと記録モードでのFASTノードの停止'
    ```

## セキュリティテストのステップの追加

セキュリティテストの設定方法は、テストアプリケーションで使用される認証方法に依存します:

* 認証が必要な場合は、リクエスト記録のステップと同じジョブにセキュリティテストのステップを追加します。
* 認証が不要な場合は、パイプラインに別のジョブとしてセキュリティテストのステップを追加します。

セキュリティテストを実装するために以下の手順に従ってください:

1. テストアプリケーションが実行中であることを確認します。必要に応じて、アプリケーションを実行するコマンドを追加します。
2. アプリケーションを実行するコマンドの__後に__、他の必要な[変数](../ci-mode-testing.md#environment-variables-in-testing-mode)とともに`CI_MODE=testing`モードでFAST Dockerコンテナを実行するコマンドを追加します。

    !!! info "記録されたベースラインリクエストのセットを使用する"
        ベースラインリクエストのセットが別のパイプラインで記録されていた場合は、その記録IDを[TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode)変数で指定します。それ以外の場合は、最後に記録されたセットが使用されます。

    コマンドの例:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Dockerのネットワーク"
    セキュリティテスト前に、FASTノードとテストアプリケーションが同じネットワーク上で動作していることを確認してください。

??? info "テストモードでFASTノードを起動する自動テストステップの例"
    下の例では、認証が必要なDVWAアプリケーションのテストを行っているため、セキュリティテストのステップはリクエスト記録のステップと同じジョブに追加されています。

    ```
    stages:
    - stage: testing
      jobs:
      - job: tests
        steps:
        - script: docker network create my-network
          displayName: 'my-networkの作成'
        - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
          displayName: 'my-network上でのテストアプリケーションの実行'
        - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
          displayName: 'my-network上での記録モードでのFASTノードの実行'
        - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
          displayName: 'my-network上でFASTノードをプロキシとしてSeleniumを実行'
        - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
          displayName: 'my-network上での自動テストの実行'
        - script: docker stop selenium fast
          displayName: 'Seleniumと記録モードでのFASTノードの停止'
        - script: docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
          displayName: 'my-network上でのテストモードでのFASTノードの実行'
        - script: docker stop dvwa
          displayName: 'テストアプリケーションの停止'
        - script: docker network rm my-network
          displayName: 'my-networkの削除'
    ```

## テスト結果の取得

セキュリティテストの結果はAzure DevOpsのインターフェースに表示されます。

![The result of running FAST node in testing mode](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-ci-example.png)

## その他の例

FASTをAzure DevOpsワークフローに統合する例は、私たちの[GitHub](https://github.com/wallarm/fast-examples)で見つけることができます。

!!! info "その他の質問"
   FASTの統合に関する質問がある場合は、お気軽に[ご連絡ください](mailto:support@wallarm.com)。