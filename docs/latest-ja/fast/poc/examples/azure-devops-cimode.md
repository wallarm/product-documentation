# Azure DevOpsへのFASTの統合

CI MODEでのFASTのAzure DevOpsパイプラインへの統合は、`azure-pipelines.yml`ファイルで設定します。`azure-pipelines.yml`ファイルの詳細なスキーマは[Azure DevOpsの公式ドキュメント](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema)に記載されています。

!!! info "設定済みのワークフロー"
    以降の手順は、次のいずれかに該当する設定済みのワークフローがあることを前提とします。

    * テスト自動化が実装されています。この場合、FASTノードトークンを[渡し](#passing-fast-node-token)、[リクエスト記録](#adding-the-step-of-request-recording)と[セキュリティテスト](#adding-the-step-of-security-testing)の手順を追加します。
    * ベースラインリクエストのセットが既に記録されています。この場合、FASTノードトークンを[渡し](#passing-fast-node-token)、[セキュリティテスト](#adding-the-step-of-security-testing)の手順を追加します。

## FASTノードトークンの指定

[FASTノードトークン](../../operations/create-node.md)を安全に使用するには、現在のパイプラインの設定を開き、トークン値を[Azure DevOps環境変数](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#environment-variables)に渡します。

![Azure DevOps環境変数の渡し](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-env-var-example.png)

## リクエスト記録手順の追加

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "記録モードでFASTノードを実行する自動テスト手順の例"
    ```
    - job: tests
      steps:
      - script: docker network create my-network
        displayName: 'Create my-network'
      - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
        displayName: 'Run test application on my-network'
      - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
        displayName: 'Run FAST node in recording mode on my-network'
      - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
        displayName: 'Run Selenium with FAST node as a proxy on my-network'
      - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
        displayName: 'Run automated tests on my-network'
      - script: docker stop selenium fast
        displayName: 'Stop Selenium and FAST node in recording mode'
    ```

## セキュリティテスト手順の追加

セキュリティテストの設定方法は、テストアプリケーションで使用する認証方式によって異なります。

* 認証が必要な場合、セキュリティテストの手順をリクエスト記録の手順と同じジョブに追加します。
* 認証が不要な場合、セキュリティテストの手順をパイプラインの別ジョブとして追加します。

セキュリティテストを実施するには、次の手順に従います。

1. テストアプリケーションが起動していることを確認します。必要に応じて、アプリケーションを起動するコマンドを追加します。
2. アプリケーションを実行するコマンドの__後__に、`CI_MODE=testing`モードでFASTのDockerコンテナを実行するコマンドと、その他の必要な[変数](../ci-mode-testing.md#environment-variables-in-testing-mode)を追加します。

    !!! info "記録済みのベースラインリクエストセットの使用"
        ベースラインリクエストのセットが別のパイプラインで記録された場合は、[TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode)変数にレコードIDを指定します。そうでない場合は、最後に記録されたセットが使用されます。

    コマンドの例:
    
    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Dockerネットワーク"
    セキュリティテストの前に、FASTノードとテストアプリケーションが同じネットワーク上で動作していることを確認します。

??? info "テストモードでFASTノードを実行する自動テスト手順の例"
    以下の例では、認証が必要なアプリケーションDVWAをテストするため、セキュリティテストの手順はリクエスト記録の手順と同じジョブに追加しています。
    
    ```
    stages:
    - stage: testing
      jobs:
      - job: tests
        steps:
        - script: docker network create my-network
          displayName: 'Create my-network'
        - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
          displayName: 'Run test application on my-network'
        - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
          displayName: 'Run FAST node in recording mode on my-network'
        - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
          displayName: 'Run Selenium with FAST node as a proxy on my-network'
        - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
          displayName: 'Run automated tests on my-network'
        - script: docker stop selenium fast
          displayName: 'Stop Selenium and FAST node in recording mode'
        - script: docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
          displayName: 'Run FAST node in testing mode on my-network'
        - script: docker stop dvwa
          displayName: 'Stop test application'
        - script: docker network rm my-network
          displayName: 'Delete my-network'
    ```

## テスト結果の取得

セキュリティテストの結果はAzure DevOpsのインターフェースに表示されます。

![テストモードでFASTノードを実行した結果](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-ci-example.png)

## その他の例

Azure DevOpsワークフローへのFASTの統合例は、当社の[GitHub](https://github.com/wallarm/fast-examples)で確認できます。

!!! info "追加のご質問"
    FASTの統合に関するご質問がある場合は、[お問い合わせください](mailto:support@wallarm.com)。