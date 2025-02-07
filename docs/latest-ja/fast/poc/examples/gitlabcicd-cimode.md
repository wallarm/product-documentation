[gitlabcicd-config-yaml]:       https://docs.gitlab.com/ee/ci
[fast-node-token]:              ../../operations/create-node.md
[gitlabci-set-env-var]:         https://docs.gitlab.com/ee/ci/variables/
[gitlabci-example-env-var]:     ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-env-var-example.png
[fast-example-gitlab-result]:   ../../../images/fast/poc/common/examples/gitlabci-cimode/gitlab-ci-example.png
[fast-ci-mode-record]:          ../ci-mode-recording.md#environment-variables-in-recording-mode
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-testing-mode
[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 
[fast-example-gitlab-cicd]:     https://gitlab.com/wallarm/fast-example-gitlab-dvwa-integration

# GitLab CI/CDとのFAST統合

CI MODEにおけるFASTの統合は、`~/.gitlab-ci.yml`ファイルを通じてGitLab CI/CDワークフローに設定します。GitLab CI/CDワークフローの設定の詳細については、[GitLab公式ドキュメント][gitlabcicd-config-yaml]をご参照ください。

## FASTノードトークンの渡し方

[FASTノードトークン][fast-node-token]を安全に利用するには、プロジェクト設定の[環境変数][gitlabci-set-env-var]にその値を渡してください。

![GitLab CI/CD環境変数の渡し方][gitlabci-example-env-var]

--8<-- "../include/fast/fast-cimode-integration-examples/configured-workflow.md"

## リクエスト記録ステップの追加

--8<-- "../include/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "記録モードでFASTノードを起動した自動テストステップの例"
    ```
    test:
      stage: test
      script:
        - docker network create my-network 
        - docker run --name fast -d -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=recording -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network --rm wallarm/fast 
        - docker run --rm -d --name selenium -p 4444:4444 -e http_proxy='http://fast:8080' -e https_proxy='https://fast:8080' --network my-network selenium/standalone-firefox:latest 
        - docker run --rm --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test bundle exec rspec spec/features/posts_spec.rb 
        - docker stop selenium fast
        - docker network rm my-network
    ```

    この例では以下のステップを含みます:

    1. Dockerネットワーク`my-network`を作成します。
    2. ネットワーク`my-network`上で記録モードのFASTノードを起動します。
    3. ネットワーク`my-network`上で、FASTノードをプロキシとして設定した自動テスト用ツールSeleniumを起動します。
    4. ネットワーク`my-network`上で、テストアプリケーションと自動テストを実行します。
    5. SeleniumとFASTノードを停止します。

## セキュリティテストステップの追加

--8<-- "../include/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "セキュリティテストステップの例"
    1. `stages`リストに`security_test`を追加します。

        ```
          stages:
            - build
            - test
            - security_test
            - cleanup
        ```
    2. 新たなステージ`security_test`の内容を定義します。

        ```
          security_test:
            stage: security_test
            script:
              - docker network create my-network 
              - docker run --rm -d --name app-test --network my-network -e CAPYBARA_SERVER_HOST=app-test -p 3000:3000 app-test
              - sleep 5 
              - docker run --name fast -e WALLARM_API_TOKEN=$WALLARM_API_TOKEN -e CI_MODE=testing -e WALLARM_API_HOST=us1.api.wallarm.com -p 8080:8080 --network my-network -e TEST_RUN_URI="http://app-test:3000" --rm wallarm/fast 
              - docker stop app-test
        ```

    この例では以下のステップを含みます:

    1. Dockerネットワーク`my-network`を作成します。
    2. ネットワーク`my-network`上でテストアプリケーションを起動します。
    3. ネットワーク`my-network`上でテストモードのFASTノードを起動します。ここでは、現在のパイプラインで作成された最新のベースラインリクエストが存在するため、`TEST_RECORD_ID`変数は省略されます。テスト完了後、FASTノードは自動的に停止されます。
    4. テストアプリケーションを停止します。

## テスト結果の取得

セキュリティテストの結果はGitLab CI/CDのインターフェース上に表示されます。

![テストモードでFASTノードを起動した結果][fast-example-gitlab-result]

## その他の例

FASTをGitLab CI/CDワークフローに統合する例は、当社の[GitHub][fast-examples-github]および[GitLab][fast-example-gitlab-cicd]でご確認いただけます。

!!! info "その他のご質問"
    FASTの統合に関するご質問がある場合は、[お問い合わせください][mail-to-us].

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/NRQT_7ZMeko" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->