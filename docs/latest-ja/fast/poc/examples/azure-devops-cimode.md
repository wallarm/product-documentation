# Azure DevOpsとのFAST統合

CI MODEでのFASTのAzure DevOpsパイプライン統合は、`azure-pipelines.yml`ファイルを通じて構成します。`azure-pipelines.yml`ファイルの詳細なスキーマは[Azure DevOps公式ドキュメント](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema%2Cparameter-schema)に記載されています。

!!! info "設定済みのワークフロー"
    以下の指示を実行するには、次のいずれかに該当する設定済みのワークフローが必要です:

    * テスト自動化が実装済みの場合は、FAST node tokenを[渡し](#passing-fast-node-token)、[リクエスト記録](#adding-the-step-of-request-recording)および[セキュリティテスト](#adding-the-step-of-security-testing)の手順を追加してください。
    * ベースラインリクエストのセットが既に記録されている場合は、FAST node tokenを[渡し](#passing-fast-node-token)、[セキュリティテスト](#adding-the-step-of-security-testing)の手順を追加してください。

## FAST node tokenの渡し方

安全に[FAST node token](../../operations/create-node.md)を使用するため、現在のパイプライン設定を開いて、[Azure DevOps環境変数](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#environment-variables)にトークンの値を渡してください。

![Azure DevOps環境変数の渡し方](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-env-var-example.png)

## リクエスト記録の手順を追加

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "記録モードでFAST nodeを実行する自動テスト手順の例"
    ```
    - job: tests
      steps:
      - script: docker network create my-network
        displayName: 'my-networkを作成'
      - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
        displayName: 'my-network上でテストアプリケーションを実行'
      - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
        displayName: 'my-network上で記録モードでFAST nodeを実行'
      - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
        displayName: 'my-network上でFAST nodeをプロキシとしてSeleniumを実行'
      - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
        displayName: 'my-network上で自動テストを実行'
      - script: docker stop selenium fast
        displayName: '記録モードでSeleniumとFAST nodeを停止'
    ```

## セキュリティテスト手順の追加

セキュリティテストの設定方法は、テストアプリケーションで使用されている認証方式に依存します:

* 認証が必要な場合、セキュリティテストの手順をリクエスト記録の手順と同じジョブに追加してください。
* 認証が不要な場合、セキュリティテストの手順をパイプラインに別のジョブとして追加してください。

セキュリティテストを実行するため、以下の手順に従ってください:

1. テストアプリケーションが実行されていることを確認してください。必要に応じて、アプリケーションを実行するためのコマンドを追加してください。
2. アプリケーションを実行するコマンドの__後__に、その他の必要な[変数](../ci-mode-testing.md#environment-variables-in-testing-mode)と共にCI_MODE=testingモードでFAST Dockerコンテナを実行するコマンドを追加してください。

    !!! info "記録されたベースラインリクエストセットを使用"
        もしベースラインリクエストのセットが別のパイプラインで記録されている場合は、[TEST_RECORD_ID](../ci-mode-testing.md#environment-variables-in-testing-mode)変数にレコードIDを指定してください。そうでない場合、最後に記録されたセットが使用されます。

    コマンドの例:

    ```
    docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://app-test:3000 --network my-network --rm wallarm/fast
    ```

!!! warning "Dockerネットワーク"
    セキュリティテストを行う前に、FAST nodeとテストアプリケーションが同じネットワーク上で実行されていることを確認してください。

??? info "テストモードでFAST nodeを実行する自動テスト手順の例"
    以下の例では認証が必要なDVWAアプリケーションをテストするため、セキュリティテストの手順をリクエスト記録の手順と同じジョブに追加しています。

    ```
    stages:
    - stage: testing
      jobs:
      - job: tests
        steps:
        - script: docker network create my-network
          displayName: 'my-networkを作成'
        - script: docker run --rm --name dvwa -d --network my-network wallarm/fast-example-dvwa-base
          displayName: 'my-network上でテストアプリケーションを実行'
        - script: docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -e ALLOWED_HOSTS=dvwa -p 8080:8080 --network my-network --rm wallarm/fast
          displayName: 'my-network上で記録モードでFAST nodeを実行'
        - script: docker run --rm -d --name selenium -e http_proxy='http://fast:8080' --network my-network selenium/standalone-firefox:latest
          displayName: 'my-network上でFAST nodeをプロキシとしてSeleniumを実行'
        - script: docker run --rm --name tests --network my-network wallarm/fast-example-dvwa-tests
          displayName: 'my-network上で自動テストを実行'
        - script: docker stop selenium fast
          displayName: '記録モードでSeleniumとFAST nodeを停止'
        - script: docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 -e TEST_RUN_URI=http://dvwa:80 --network my-network --rm wallarm/fast 
          displayName: 'my-network上でテストモードでFAST nodeを実行'
        - script: docker stop dvwa
          displayName: 'テストアプリケーションを停止'
        - script: docker network rm my-network
          displayName: 'my-networkを削除'
    ```

## テストの結果取得

セキュリティテストの結果はAzure DevOpsインターフェイスに表示されます。

![テストモードで実行されたFAST nodeの結果](../../../images/fast/poc/common/examples/azure-devops-cimode/azure-ci-example.png)

## さらに例

Wallarmの[GitHub](https://github.com/wallarm/fast-examples)で、FASTをAzure DevOpsワークフローに統合する例を見つけることができます。

!!! info "その他のご質問"
    FAST統合に関するご質問は、[こちら](mailto:support@wallarm.com)までお問い合わせください。