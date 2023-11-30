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

# FASTのGitLab CI/CDとの統合

FASTのCIモードのGitLab CI/CDワークフローへの統合は、`〜/.gitlab-ci.yml`ファイルを使って設定されます。GitLab CI/CDワークフロー設定についての詳細は[GitLab公式ドキュメンテーション][gitlabcicd-config-yaml]で利用可能です。

## FASTノードトークンのパス

[FASTノードトークン][fast-node-token]を安全に使うには、その値を[プロジェクト設定の環境変数][gitlabci-set-env-var]で渡してください。

![GitLab CI/CD環境変数のパス][gitlabci-example-env-var]

--8<-- "../include-ja/fast/fast-cimode-integration-examples/configured-workflow.md"

## リクエスト記録のステップの追加

--8<-- "../include-ja/fast/fast-cimode-integration-examples/request-recording-setup.md"

??? info "記録モードでのFASTノードを実行する自動テストステップの例"
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

    サンプルには以下のステップが含まれています：

    1. Dockerネットワーク `my-network` を作成します。
    2. ネットワーク `my-network` 上で記録モードのFASTノードを起動します。
    3. ネットワーク `my-network` 上でFASTノードをプロキシとして使用して自動テストツールSeleniumを動かします。
    4. ネットワーク `my-network` 上でテストアプリケーションと自動テストを実行します。
    5. SeleniumとFASTノードを停止します。

## セキュリティテストのステップの追加

--8<-- "../include-ja/fast/fast-cimode-integration-examples/security-testing-setup.md"

??? info "セキュリティテストステップの例"
    1. `stages`のリストに`security_test`を追加します。

        ```
          stages:
            - build
            - test
            - security_test
            - cleanup
        ```
    2. 新たなステージ`security_test`の本文を定義します。

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

    サンプルには以下のステップが含まれています：

    1. Dockerネットワーク `my-network` を作成します。
    2. ネットワーク `my-network` 上でテストアプリケーションを動かします。
    3. ネットワーク `my-network` 上でテストモードのFASTノードを動かします。`TEST_RECORD_ID`変数は省略されますが、これは基準となるリクエストセットが現在のパイプラインで作成され、最後に記録されたからです。テストが終了するとFASTノードは自動的に停止します。
    4. テストアプリケーションを停止します。

## テスト結果の取得

セキュリティテストの結果はGitLab CI/CDインターフェースに表示されます。

![テストモードでFASTノードを実行する結果][fast-example-gitlab-result]

## その他の例

FASTのGitLab CI/CDワークフローへの統合の例は私たちの[GitHub][fast-examples-github]と[GitLab][fast-example-gitlab-cicd]で見つけることができます。

!!! info "その他の質問"
    FAST統合に関する質問がある場合は、[こちらからお問い合わせください][mail-to-us]。

## デモビデオ

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/NRQT_7ZMeko" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
</div>