[fast-node-token]:              ../operations/create-node.md
[fast-ci-mode-record]:          ci-mode-recording.md#environment-variables-in-recording-mode

[mail-to-us]:                   mailto:support@wallarm.com
[fast-examples-github]:         https://github.com/wallarm/fast-examples 

[jenkins-plugin-wallarm-fast]:   https://plugins.jenkins.io/wallarm-fast/

[jenkins-plugin-install]:       ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-install.png
[jenkins-plugin-record-params]: ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-record-params.png
[jenkins-plugin-playback-params]: ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-playback-params.png
[jenkins-manage-plugin]:        https://jenkins.io/doc/book/managing/plugins/
[fast-example-jenkins-plugin-result]:  ../../images/fast/poc/common/examples/jenkins-plugin/jenkins-plugin-result.png
[fast-jenkins-cimode]:          examples/jenkins-cimode.md

# JenkinsとのWallarm FASTプラグインの統合

!!! warning "互換性"
    Wallarm FASTプラグインはFreestyle Jenkinsプロジェクトでのみ動作する点にご注意ください。

    プロジェクトがPipelineタイプの場合は、[FAST nodeを利用したJenkinsとの統合例][fast-jenkins-cimode]をご覧ください。

## ステップ1: プラグインのインストール

JenkinsプロジェクトにPlugin Managerを使用して[Wallarm FAST plugin][jenkins-plugin-wallarm-fast]をインストールしてください。プラグインの管理方法の詳しい情報は[Jenkins公式ドキュメント][jenkins-manage-plugin]に記載されています。

![Wallarm FASTプラグインのインストール][jenkins-plugin-install]

インストール中に問題が発生した場合は、プラグインを手動でビルドしてください。

??? info "Wallarm FASTプラグインの手動ビルド"
    Wallarm FASTプラグインを手動でビルドするには、以下の手順に従ってください：

    1. [Maven](https://maven.apache.org/install.html) CLIがインストールされていることを確認してください。
    2. 次のコマンドを実行してください：
        ```
        git clone https://github.com/jenkinsci/wallarm-fast-plugin.git
        cd wallarm-fast-plugin
        mvn package
        ```
        
        コマンドの実行に成功すると、`target`ディレクトリに`wallarm-fast.hpi`プラグインファイルが生成されます。

    3. `wallarm-fast.hpi`プラグインを[Jenkinsの手順](https://jenkins.io/doc/book/managing/plugins/#advanced-installation)に従ってインストールしてください。

## ステップ2: リクエスト記録とテストのステップの追加

!!! info "設定済みワークフロー"
    以降の手順では、設定済みのJenkinsワークフローが以下のいずれかに該当している必要があります：

    * テスト自動化が実施されている場合は、[リクエスト記録](#adding-the-step-of-request-recording)ステップおよび[セキュリティテスト](#adding-the-step-of-security-testing)ステップが追加されます。
    * ベースラインリクエストが記録されている場合は、[セキュリティテスト](#adding-the-step-of-security-testing)ステップが追加されます。

### リクエスト記録ステップの追加

リクエスト記録ステップを追加するには、**Build**タブで`Record baselines`モードを選択し、以下に記載されている変数を設定してください。リクエスト記録ステップは、**自動化アプリケーションテストのステップの前に**追加する必要があります。

!!! warning "ネットワーク"
    リクエストを記録する前に、FASTプラグインと自動化テストツールが同じネットワーク上にあることを確認してください。

??? info "記録モードの変数"

    | 変数                      | 値                                                                                              | 必須   |
    |---------------------------|-------------------------------------------------------------------------------------------------|--------|
    | `Wallarm API token`       | Wallarm Cloudからのトークンです。                                                               | はい   |
    | `Wallarm API host`        | Wallarm APIサーバーのアドレスです。 <br>許可される値: <br>Wallarm US Cloudのサーバー用は`us1.api.wallarm.com`、<br>Wallarm EU Cloudのサーバー用は`api.wallarm.com`。<br>デフォルト値は`us1.api.wallarm.com`です。 | いいえ |
    | `Application host`        | テストアプリケーションのアドレスです。値はIPアドレスまたはドメイン名になります。                   | はい   |
    | `Application port`        | テストアプリケーションのポートです。デフォルト値は8080です。                                      | いいえ |
    | `Fast port`               | FAST nodeのポートです。                                                                          | はい   |
    | `Inactivity timeout`      | この間にFAST nodeにベースラインリクエストが到着しない場合、記録プロセスはFAST nodeと共に停止します。<br>許容される値の範囲: 1秒から1週間。<br>値は秒単位で指定する必要があります。<br>デフォルト値: 600秒（10分）です。 | いいえ |
    | `Fast name`               | FAST node Dockerコンテナの名前です。                                                             | いいえ |
    | `Wallarm version`         | 使用されるFAST nodeのバージョンです。                                                           | いいえ |
    | `Local docker network`    | FAST nodeが実行されるDockerネットワークです。                                                    | いいえ |
    | `Local docker ip`         | 実行中のFAST nodeに割り当てられるIPアドレスです。                                               | いいえ |
    | `Without sudo`            | FAST nodeコマンドをFAST nodeを実行するユーザーの権限で実行するかどうかです。デフォルトでは、コマンドはスーパーユーザー権限（sudo経由）で実行されます。 | いいえ |

**テスト記録用に設定されたプラグインの例:**

![リクエスト記録用プラグイン設定の例][jenkins-plugin-record-params]

次に、FAST nodeをプロキシとして追加することで、自動化テストのステップを更新してください。

テストが終了すると、FASTプラグインは自動的にリクエスト記録を停止します。

### セキュリティテストステップの追加

セキュリティテストステップを追加するには、**Build**タブで`Playback baselines`モードを選択し、以下に記載されている変数を設定してください。

セキュリティテストを実行する前に、アプリケーションが既に起動しており、テスト可能であることをご確認ください。

!!! warning "ネットワーク"
    セキュリティテストを実行する前に、FASTプラグインとアプリケーションが同じネットワーク上にあることを確認してください。

??? info "テストモードの変数"

    | 変数                      | 値                                                                                              | 必須   |
    |---------------------------|-------------------------------------------------------------------------------------------------|--------|
    | `Wallarm API token`       | Wallarm Cloudからのトークンです。                                                               | はい   |
    | `Wallarm API host`        | Wallarm APIサーバーのアドレスです。 <br>許可される値: <br>Wallarm US Cloudのサーバー用は`us1.api.wallarm.com`、<br>Wallarm EU Cloudのサーバー用は`api.wallarm.com`。<br>デフォルト値は`us1.api.wallarm.com`です。 | いいえ |
    | `Application host`        | テストアプリケーションのアドレスです。値はIPアドレスまたはドメイン名になります。                   | はい   |
    | `Application port`        | テストアプリケーションのポートです。デフォルト値は8080です。                                      | いいえ |
    | `Policy id`               | テストポリシーIDです。<br>デフォルト値は`0`-`Default Test Policy`です。                           | いいえ |
    | `TestRecord id`           | テストレコードIDです。[TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode)に対応します。<br>デフォルト値は使用されたFAST nodeによって最後に作成されたテストレコードになります。 | いいえ |
    | `TestRun RPS`             | 対象アプリケーションに送信されるテストリクエストの数の制限（RPS：秒あたりのリクエスト数）です。<br>最小値: `1`。<br>最大値: `500`。<br>デフォルト値: `null`（RPSに制限はありません）。 | いいえ |
    | `TestRun name`            | テスト実行の名前です。<br>デフォルトでは、テスト実行作成の日付から自動生成されます。              | いいえ |
    | `TestRun description`     | テスト実行の説明です。                                                                           | いいえ |
    | `Stop on first fail`      | エラー発生時にテストを停止するかどうかです。                                                     | いいえ |
    | `Fail build`              | セキュリティテスト中に脆弱性が発見された場合、ビルドをエラーで終了するかどうかです。              | いいえ |
    | `Exclude`                 | セキュリティテストから除外するファイル拡張子のリストです。<br>拡張子を区切るために&#448;記号が使用されます。<br>デフォルトでは、例外はありません。 | いいえ |
    | `Fast name`               | FAST node Dockerコンテナの名前です。                                                             | いいえ |
    | `Wallarm version`         | 使用されるFAST nodeのバージョンです。                                                           | いいえ |
    | `Local docker network`    | FAST nodeが実行されるDockerネットワークです。                                                    | いいえ |
    | `Local docker ip`         | 実行中のFAST nodeに割り当てられるIPアドレスです。                                               | いいえ |
    | `Without sudo`            | FAST nodeコマンドをFAST nodeを実行するユーザーの権限で実行するかどうかです。デフォルトでは、コマンドはスーパーユーザー権限（sudo経由）で実行されます。 | いいえ |

    !!! warning "FAST nodeの実行"
        リクエスト記録ステップとセキュリティテストステップの両方をワークフローに追加する場合、FAST node Dockerコンテナの名前は異なる必要があることにご注意ください。

**セキュリティテスト用に設定されたプラグインの例:**

![セキュリティテスト用プラグイン設定の例][jenkins-plugin-playback-params]

## ステップ3: テスト結果の取得

セキュリティテストの結果がJenkinsインターフェースに表示されます。

![FASTプラグイン実行結果][fast-example-jenkins-plugin-result]

## その他の例

FASTをCircleCIワークフローに統合する例は、当社の[GitHub][fast-examples-github]で確認できます。

!!! info "さらに質問がある場合"
    FAST統合に関するご質問がある場合は、ぜひ[お問い合わせ][mail-to-us]ください。