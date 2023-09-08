[fast-jenkins-cimode]:          ./examples/jenkins-cimode.md
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-recording-mode
[recording-mode]:               ci-mode-recording.md
[fast-node-token]:              ../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[circleci-fast-plugin]:         https://circleci.com/orbs/registry/orb/wallarm/fast
[circleci-using-orbs]:          https://circleci.com/docs/2.0/using-orbs/
[mail-to-us]:                   mailto:support@wallarm.com

# CircleCI と Wallarm FAST Orbs の統合

この指示は、[Wallarm FAST Orbs (プラグイン)][circleci-fast-plugin] を経由して FAST を CircleCI のワークフローに統合する方法を説明しています。 統合設定は `~/.circleci/config.yml` 設定ファイルで実行されます。 CircleCI Orbs の詳細については、[公式の CircleCI 文書][circleci-using-orbs]を参照してください。

!!! warning "要件"

    * CircleCI バージョン2.1
    * すでに[録音されたベースラインリクエストのセット][recording-mode]を持つ設定された CircleCI のワークフロー

    他のバージョンの CircleCI を使用している場合やリクエストを録音するステップを追加する必要がある場合は、[FAST ノードを経由した CircleCI との統合の例][fast-jenkins-cimode]をご覧ください。

## ステップ 1： FASTノード トークンの渡し

CircleCI プロジェクト設定の `WALLARM_API_TOKEN` 環境変数で [FAST ノードトークン][fast-node-token] の値を渡します。 環境変数の設定方法は、[CircleCI のドキュメンテーション][circleci-set-env-var]で説明されています。

![CircleCI 環境変数の渡し][circleci-example-env-var]

## ステップ 2： Wallarm FAST Orbs の接続

Wallarm FAST Orbs を接続するには、 `~/.circleci/config.yml` ファイルで次の設定を行います：

1. ファイルに CircleCI バージョン 2.1 が指定されていることを確認します：

    ```
    version: 2.1
    ```
2. `orbs` セクションで Wallarm FAST プラグインを初期化します：

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## ステップ 3：セキュリティテストのステップを設定する

セキュリティのテストを設定するために、CircleCI のワークフローに `fast / run_security_tests` の別々のステップを追加し、以下にリストされたパラメーターを定義します：

| パラメータ | 説明 | 必須 |
| ---------| ---------| --------------- |
| test_record_id| テスト記録ID。[TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode)に対応します。<br>デフォルトの値は使用された FAST ノードによって作成された最後のテストレコードです。| はい|
| app_host | テストアプリケーションのアドレス。値は IP アドレスまたはドメイン名にすることができます。<br>デフォルト値は内部 IP です。| いいえ|
| app_port | テストアプリケーションのポート。<br>デフォルト値は 80 です。| いいえ|
| policy_id | [テストポリシー](../operations/test-policy/overview.md) ID。<br>デフォルト値は `[null]`-`Default Test Policy` です。| いいえ|
| stop_on_first_fail | エラーが発生したときにテストを停止するインジケータ。| いいえ|
| test_run_name | テスト実行の名前。<br>デフォルトでは、テスト実行の作成日から自動的に値が生成されます。| いいえ|
| test_run_desc | テスト実行の説明。 | いいえ|
| test_run_rps | ターゲットアプリケーションに送信されるテストリクエストの数（*RPS*、*requests per second*）の制限。<br>最小値： `1`。<br>最大値： `1000`。<br>デフォルト値： `null` (RPSは無制限です). | いいえ|
| wallarm_api_host | Wallarm API サーバーのアドレス。<br>許可される値：<br>`us1.api.wallarm.com` Wallarm USクラウドのサーバー用。<br>`api.wallarm.com` Wallarm EUクラウドのサーバー用<br>デフォルト値は `us1.api.wallarm.com` です。 | いいえ|
| wallarm_fast_port | FAST ノードのポート。<br>デフォルト値は 8080 です。 | いいえ|
| wallarm_version | 使用された Wallarm FAST Orbs のバージョン。<br>バージョンのリストは [リンク][circleci-fast-plugin]をクリックすることで有用です。<br>デフォルト値は最新です。| いいえ|

??? info "~/.circleci/config.yml の例"
    ```
    version: 2.1
    jobs:
      build:
        machine:
          image: 'ubuntu-1604:201903-01'
        steps:
          - checkout
          - run:
              command: >
                docker run -d --name app-test -p 3000:3000
                wallarm/fast-example-rails
              name: Run application
          - fast/run_security_tests:
              app_port: '3000'
              test_record_id: '9058'
    orbs:
      fast: 'wallarm/fast@dev:1.1.0'
    ```

    私たちの [GitHub](https://github.com/wallarm/fast-examples) と [CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration) で FAST の CircleCI ワークフローへの統合の他の例を見つけることができます。

!!! info "他の質問"
    FAST に関連する質問があれば、お気軽に[お問い合わせください][mail-to-us]。