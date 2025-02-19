# JenkinsとのFAST統合

CIモードでのFASTのJenkinsワークフローへの統合は、`Jenkinsfile`ファイルを通じて設定されます。Jenkinsのワークフロー設定の詳細については、[Jenkins公式ドキュメント][jenkins-config-pipeline]をご参照ください。

## FASTノードトークンの引き渡し

安全に[FASTノードトークン][fast-node-token]を使用するため、プロジェクト設定内の[環境変数][jenkins-parameterized-build]でその値を渡してください。

![Jenkins環境変数の渡し方][jenkins-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## リクエスト記録ステップの追加

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "記録モードでFASTノードを実行する自動テストステップの例"
    ```
    stage('Run autotests with recording FAST node') {
          steps {
             sh label: 'create network', script: 'docker network create my-network'
             sh label: 'run fast with recording', script: 'docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8088:8080 --network my-network wallarm/fast'
             sh label: 'run selenium', script: 'docker run --rm -d --name selenium -p 4444:4444 --network my-network -e http_proxy=\'http://fast:8080\' -e https_proxy=\'https://fast:8080\' selenium/standalone-firefox:latest'
             sh label: 'run application', script: 'docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb'
             sh label: 'stop selenium', script: 'docker stop selenium'
             sh label: 'stop fast', script: 'docker stop fast'
             sh label: 'remove network', script: 'docker network rm my-network'
          }
       }
    ```

例として、以下のステップが含まれます:

1. Dockerネットワーク「my-network」を作成します.
2. `my-network`ネットワーク上で記録モードのFASTノードを実行します.
3. プロキシとしてFASTノードを利用する自動テスト用ツールSeleniumを`my-network`ネットワーク上で実行します.
4. テストアプリケーションと自動テストを実行します.
5. SeleniumとFASTノードを停止します.
6. `my-network`ネットワークを削除します.

## セキュリティテストステップの追加

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "セキュリティテストステップの例"

    ```
    stage('Run security tests') {
          steps {
             sh label: 'create network', script: 'docker network create my-network'
             sh label: 'start application', script: ' docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test'
             sh label: 'run fast in testing mode', script: 'docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE="testing" -e WALLARM_API_HOST="us1.api.wallarm.com"  --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast'
             sh label: 'stop application', script: ' docker stop app-test '
            sh label: 'remove network', script: ' docker network rm my-network '
          }
       }
    ```

例として、以下のステップが含まれます:

1. Dockerネットワーク「my-network」を作成します.
2. `my-network`ネットワーク上でテストアプリケーションを実行します.
3. `my-network`ネットワーク上でテストモードのFASTノードを実行します。既知のリクエストセットは現在のパイプラインで作成された最新の記録であるため、`TEST_RECORD_ID`変数は省略されています。テストが完了すると、FASTノードは自動的に停止されます.
4. テストアプリケーションを停止します.
5. `my-network`ネットワークを削除します.

## テスト結果の確認

セキュリティテストの結果はJenkinsインターフェースに表示されます.

![テストモードで実行したFASTノードの結果][fast-example-jenkins-result]

## その他の例

我々の[GitHub][fast-examples-github]でJenkinsワークフローへのFAST統合の例を見つけることができます.

!!! info "さらなる質問"
    FAST統合に関してご質問がございましたら、ぜひ[お問い合わせください][mail-to-us].