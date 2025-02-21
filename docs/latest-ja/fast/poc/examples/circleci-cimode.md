```markdown
[circleci-config-yaml]:         https://circleci.com/docs/2.0/writing-yaml/#section=configuration
[fast-node-token]:              ../../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[fast-example-result]:          ../../../images/fast/poc/common/examples/circleci-cimode/circleci-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 
[fast-example-circleci]:        https://circleci.com/gh/wallarm/fast-example-circleci-dvwa-integration

# CircleCIとのFAST統合

CI MODEにおけるFASTの統合をCircleCIワークフローに設定するには、`~/.circleci/config.yml`ファイルを使用します。CircleCIワークフローの設定の詳細については、[CircleCI公式ドキュメント][circleci-config-yaml]をご参照ください。

## FASTノードトークンの渡し方

[FAST node token][fast-node-token]を安全に使用するため、プロジェクト設定の[環境変数][circleci-set-env-var]にその値を渡してください。

![CircleCI環境変数の設定][circleci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## リクエスト記録のステップ追加

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "録画モードでFASTノードを実行する自動テストステップの例"
    ```
    - run:
          name: Start tests & FAST record
          command: |
            docker network create my-network \
            && docker run --rm  --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network wallarm/fast \
            && docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest \
            && docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application bundle exec rspec spec/features/posts_spec.rb \
            && docker stop selenium fast 
    ```

    以下のステップが含まれています:

    1. Dockerネットワーク`my-network`を作成します。
    2. ネットワーク`my-network`上で録画モードのFASTノードを実行します。
    3. ネットワーク`my-network`上でFASTノードをプロキシとして使用する自動テストツールSeleniumを実行します。
    4. ネットワーク`my-network`上でテストアプリケーションと自動テストを実行します。
    5. 自動テストツールSeleniumおよび録画モードのFASTノードを停止します。

## セキュリティテストのステップ追加

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "セキュリティテストステップの例"
    ```
    - run:
        name: Start FAST tests
        command: |
          docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 test-application \
          && docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast \
          && docker stop app-test
    ```

    以下のステップが含まれています:

    1. ネットワーク`my-network`上でテストアプリケーションを実行します。
    2. ネットワーク`my-network`上でテストモードのFASTノードを実行します。`TEST_RECORD_ID`変数は省略されます。なぜなら、ベースラインリクエストのセットは現在のパイプラインで作成され、最後に記録されたためです。テストが終了すると自動的にFASTノードは停止します。
    3. テストアプリケーションを停止します。

## テスト結果の取得

セキュリティテストの結果はCircleCIインターフェイスに表示されます。

![テストモードでFASTノードを実行した結果][fast-example-result]

## その他の例

FASTをCircleCIワークフローに統合する例は、[GitHub][fast-examples-github]および[CircleCI][fast-example-circleci]でご確認いただけます。

!!! info "その他の質問"
    FAST統合に関するご質問がございましたら、[お問い合わせください][mail-to-us].
```