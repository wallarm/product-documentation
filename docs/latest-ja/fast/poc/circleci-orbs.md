[fast-jenkins-cimode]:          ./examples/jenkins-cimode.md
[fast-ci-mode-test]:            ../ci-mode-testing.md#environment-variables-in-recording-mode
[recording-mode]:               ci-mode-recording.md
[fast-node-token]:              ../operations/create-node.md
[circleci-set-env-var]:         https://circleci.com/docs/2.0/env-vars/#setting-an-environment-variable-in-a-project
[circleci-example-env-var]:     ../../images/fast/poc/common/examples/circleci-cimode/circleci-env-var-example.png
[circleci-fast-plugin]:         https://circleci.com/orbs/registry/orb/wallarm/fast
[circleci-using-orbs]:          https://circleci.com/docs/2.0/using-orbs/
[mail-to-us]:                   mailto:support@wallarm.com

# CircleCIとのWallarm FAST Orbsの統合

本手順では[Wallarm FAST Orbs (plugin)][circleci-fast-plugin]を使用してFASTをCircleCIワークフローに統合する方法について説明します。統合の設定は`~/.circleci/config.yml`構成ファイルに記述します。CircleCI Orbsの詳細は[公式CircleCIドキュメント][circleci-using-orbs]をご参照ください。

!!! warning "要件"

    * CircleCIバージョン2.1
    * 既に[記録済みのベースラインリクエストセット][recording-mode]が存在するCircleCIワークフローが設定されていること

    別のバージョンのCircleCIを使用している場合や、リクエスト記録の手順を追加する必要がある場合は、[FASTノードを使用したCircleCIとの統合例][fast-jenkins-cimode]をご確認ください。

## ステップ1：FASTノードトークンの渡し方

CircleCIプロジェクト設定内の`WALLARM_API_TOKEN`環境変数に[FASTノードトークン][fast-node-token]の値を設定します。環境変数の設定方法については[CircleCIドキュメント][circleci-set-env-var]をご確認ください。

![CircleCIの環境変数の設定][circleci-example-env-var]

## ステップ2：Wallarm FAST Orbsの接続

Wallarm FAST Orbsを接続するには、`~/.circleci/config.yml`ファイルに次の設定を記述します：

1. ファイル内にCircleCIバージョン2.1が指定されていることを確認します：

    ```
    version: 2.1
    ```
2. `orbs`セクション内でWallarm FASTプラグインを初期化します：

    ```
    orbs:
        fast: wallarm/fast@1.1.0
    ```

## ステップ3：セキュリティテストの手順を設定

セキュリティテストを設定するには、CircleCIワークフローに個別のステップ`fast/run_security_tests`を追加し、以下のパラメータを定義します：

| Parameter         | Description                                                                                                                                                   | Required |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| test_record_id    | テストレコードID。[TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode)に対応します。<br>デフォルト値は使用されたFASTノードで最後に作成されたテストレコードです。             | Yes      |
| app_host          | テストアプリケーションのアドレスです。値はIPアドレスまたはドメイン名が指定できます。<br>デフォルト値は内部IPです。                                                | No       |
| app_port          | テストアプリケーションのポートです。<br>デフォルト値は80です。                                                                                                   | No       |
| policy_id         | [テストポリシー](../operations/test-policy/overview.md)のIDです。<br>デフォルト値は`[null]`-`Default Test Policy`です。                                             | No       |
| stop_on_first_fail| エラー発生時にテストを停止する指標です。                                                                                                                          | No       |
| test_run_name     | テスト実行の名称です。<br>デフォルトでは、テスト実行作成時の日付から自動生成されます。                                                                              | No       |
| test_run_desc     | テスト実行の説明です。                                                                                                                                           | No       |
| test_run_rps      | ターゲットアプリケーションに送信されるテストリクエスト数（*RPS*、1秒あたりのリクエスト数）の制限です。<br>最小値：`1`。<br>最大値：`1000`。<br>デフォルト値：`null`（RPSに制限はありません）。 | No       |
| wallarm_api_host  | Wallarm APIサーバーのアドレスです。<br>許可される値：<br>Wallarm USクラウドのサーバーの場合は`us1.api.wallarm.com`、Wallarm EUクラウドのサーバーの場合は`api.wallarm.com`<br>デフォルト値は`us1.api.wallarm.com`です。  | No       |
| wallarm_fast_port | FASTノードのポートです。<br>デフォルト値は8080です。                                                                                                             | No       |
| wallarm_version   | 使用するWallarm FAST Orbsのバージョンです。<br>バージョン一覧は[リンク][circleci-fast-plugin]をクリックすることで確認できます。<br>デフォルト値はlatestです。                          | No       |

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
              name: アプリケーションを実行
          - fast/run_security_tests:
              app_port: '3000'
              test_record_id: '9058'
    orbs:
      fast: 'wallarm/fast@dev:1.1.0'
    ```

FASTをCircleCIワークフローに統合する他の例は、[GitHub](https://github.com/wallarm/fast-examples)および[CircleCI](https://circleci.com/gh/wallarm/fast-example-circleci-orb-rails-integration)でご確認いただけます。

!!! info "その他のご質問"
    FAST統合に関するご質問がございましたら、[お問い合わせ][mail-to-us]ください。