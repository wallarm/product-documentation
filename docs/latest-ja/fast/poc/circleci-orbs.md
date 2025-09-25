[fast-jenkins-cimode]:          ./examples/jenkins-cimode.md
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-recording-mode
[recording-mode]:               ci-mode-recording.md
[fast-node-token]:              ../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[circleci-fast-plugin]:         https://circleci.com/orbs/registry/orb/wallarm/fast
[circleci-using-orbs]:          https://circleci.com/docs/2.0/using-orbs/
[mail-to-us]:                   mailto:support@wallarm.com

# Wallarm FAST OrbsとCircleCIの統合

この手順では、[Wallarm FAST Orbs（プラグイン）][circleci-fast-plugin]を介してFASTをCircleCIのワークフローに統合する方法を説明します。統合の設定は`~/.circleci/config.yml`の設定ファイルで行います。CircleCI Orbsの詳細は[公式CircleCIドキュメント][circleci-using-orbs]をご覧ください。

!!! warning "要件"

    * CircleCIバージョン2.1
    * 既に[ベースラインリクエストのセットを記録][recording-mode]済みのCircleCIワークフローが構成されていること
    
    別のバージョンのCircleCIを使用している場合や、リクエスト記録のステップを追加する必要がある場合は、[FASTノード経由でのCircleCIとの統合例][fast-jenkins-cimode]を参照してください。

## ステップ1: FASTノードトークンの指定

CircleCIのプロジェクト設定で、`WALLARM_API_TOKEN`環境変数に[FASTノードトークン][fast-node-token]の値を設定します。環境変数の設定方法は[CircleCIドキュメント][circleci-set-env-var]に記載されています。

![CircleCI環境変数の設定][circleci-example-env-var]

## ステップ2: Wallarm FAST Orbsの接続

Wallarm FAST Orbsを接続するには、`~/.circleci/config.yml`ファイルで次を設定します:

1. ファイルでCircleCIバージョン2.1が指定されていることを確認します:

    ```
    version: 2.1
    ```
2. `orbs`セクションでWallarm FASTプラグインを初期化します:

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## ステップ3: セキュリティテストのステップの構成

セキュリティテストを構成するには、CircleCIのワークフローに独立したステップ`fast/run_security_tests`を追加し、以下のパラメータを定義します:

| パラメータ | 説明 | 必須 |
| ---------| ---------|--------------- |
| test_record_id| テストレコードID。[TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode)に対応します。<br>デフォルト値は、使用中のFASTノードで最後に作成されたテストレコードです。 | Yes|
| app_host | テストアプリケーションのアドレス。値はIPアドレスまたはドメイン名です。<br>デフォルト値は内部IPです。 | No |
| app_port | テストアプリケーションのポート。<br>デフォルト値は80です。 | No |
| policy_id | [テストポリシー](../operations/test-policy/overview.md)のID。<br>デフォルト値は`[null]`-`Default Test Policy`です。 | No |
| stop_on_first_fail | エラー発生時にテストを停止するかどうかを示すフラグです。 | No |
| test_run_name | テスト実行の名前。<br>デフォルトでは、値はテスト実行の作成日時から自動生成されます。 | No |
| test_run_desc | テスト実行の説明。 | No |
| test_run_rps | 対象アプリケーションに送信するテストリクエスト数（RPS、requests per second）の上限。<br>最小値: `1`。<br>最大値: `1000`。<br>デフォルト値: `null`（RPSは無制限です）。 | No |
| wallarm_api_host | Wallarm APIサーバーのアドレス。<br>指定可能な値:<br>Wallarm USクラウドのサーバーには`us1.api.wallarm.com`、<br>Wallarm EUクラウドのサーバーには`api.wallarm.com`。<br>デフォルト値は`us1.api.wallarm.com`です。 | No|
| wallarm_fast_port | FASTノードのポート。<br>デフォルト値は8080です。 | No |
| wallarm_version | 使用するWallarm FAST Orbsのバージョン。<br>バージョンの一覧は[リンク][circleci-fast-plugin]から確認できます。<br>デフォルト値は最新です。| No|

??? info "~/.circleci/config.ymlの例"
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

    FASTをCircleCIワークフローに統合するさらなる例は、[GitHub](https://github.com/wallarm/fast-examples)および[CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration)で確認できます。

!!! info "追加のご質問"
    FASTの統合に関してご質問がある場合は、[こちら][mail-to-us]からご連絡ください。