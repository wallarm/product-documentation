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
    Wallarm FASTプラグインはJenkinsのFreestyleプロジェクトでのみ動作します。
    
    プロジェクトがPipelineタイプの場合は、[FASTノード経由でJenkinsと統合する例][fast-jenkins-cimode]をご確認ください。

## ステップ1: プラグインのインストール

Plugin Managerを使用して、Jenkinsプロジェクトに[Wallarm FASTプラグイン][jenkins-plugin-wallarm-fast]をインストールします。プラグイン管理の詳細は[Jenkinsの公式ドキュメント][jenkins-manage-plugin]に記載されています。

![Wallarm FASTプラグインのインストール][jenkins-plugin-install]

インストール中に問題が発生した場合は、プラグインを手動でビルドしてください。

??? info "Wallarm FASTプラグインの手動ビルド"
    Wallarm FASTプラグインを手動でビルドするには、次の手順に従ってください。

    1. [Maven](https://maven.apache.org/install.html)のCLIがインストールされていることを確認します。
    2. 次のコマンドを実行します。
        ```
        git clone https://github.com/jenkinsci/wallarm-fast-plugin.git
        cd wallarm-fast-plugin
        mvn package
        ```
        
        コマンドが正常に完了すると、`target`ディレクトリに`wallarm-fast.hpi`プラグインファイルが生成されます。

    3. [Jenkinsの手順](https://jenkins.io/doc/book/managing/plugins/#advanced-installation)に従って`wallarm-fast.hpi`プラグインをインストールします。

## ステップ2: 記録およびテストのステップの追加

!!! info "設定済みワークフロー"
    以降の手順では、設定済みのJenkinsワークフローが次のいずれかに該当している必要があります。

    * テストの自動化が実装されていること。この場合、[リクエスト記録](#adding-the-step-of-request-recording)および[セキュリティテスト](#adding-the-step-of-security-testing)のステップを追加します。
    * ベースラインリクエストのセットが記録されていること。この場合、[セキュリティテスト](#adding-the-step-of-security-testing)のステップを追加します。

### リクエスト記録のステップを追加する {#adding-the-step-of-request-recording}

リクエスト記録のステップを追加するには、**Build**タブで`Record baselines`モードを選択し、以下の変数を設定します。リクエスト記録のステップは、アプリケーションの自動テストのステップより前に追加する必要があります。

!!! warning "ネットワーク"
    リクエストを記録する前に、FASTプラグインと自動テストツールが同一ネットワーク上にあることを確認してください。

??? info "記録モードの変数"

    | 変数              | 値  | 必須   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | Wallarmクラウドのトークン。 | はい |
    | `Wallarm API host`      | Wallarm APIサーバーのアドレス。<br>許可される値:<br>Wallarm USクラウドのサーバーには`us1.api.wallarm.com`、<br>Wallarm EUクラウドのサーバーには`api.wallarm.com`。<br>デフォルト値は`us1.api.wallarm.com`。 | いいえ |
    | `Application host`      | テストアプリケーションのアドレス。IPアドレスまたはドメイン名を指定できます。 | はい |
    | `Application port`      | テストアプリケーションのポート。デフォルト値は8080。 | いいえ |
    | `Fast port`   | FASTノードのポート。 | はい |
    | `Inactivity timeout`    | この間にFASTノードにベースラインリクエストが到着しない場合、記録処理とFASTノードは停止します。<br>許可される範囲: 1秒から1週間。<br>値は秒単位で指定します。<br>デフォルト値: 600秒（10分）。 | いいえ |
    | `Fast name`             | FASTノードのDockerコンテナ名。 | いいえ |
    | `Wallarm version`       | 使用するFASTノードのバージョン。 | いいえ |
    | `Local docker network`  | FASTノードを実行するDockerネットワーク。 | いいえ |
    | `Local docker ip`       | 実行中のFASTノードに割り当てるIPアドレス。 | いいえ |
    | `Without sudo`          | FASTノードのコマンドを、FASTノードを実行するユーザー権限で実行するかどうか。デフォルトでは、スーパーユーザー権限（sudo経由）で実行されます。 | いいえ |

**リクエスト記録用に構成されたプラグインの例:**

![リクエスト記録のためのプラグイン設定例][jenkins-plugin-record-params]

次に、FASTノードをプロキシとして追加して自動テストのステップを更新します。

テストが完了すると、FASTプラグインは自動的にリクエスト記録を停止します。

### セキュリティテストのステップを追加する {#adding-the-step-of-security-testing}

セキュリティテストのステップを追加するには、**Build**タブで`Playback baselines`モードを選択し、以下の変数を設定します。 

セキュリティテストを実行する前に、アプリケーションが起動済みでテスト可能な状態である必要がある点にご注意ください。

!!! warning "ネットワーク"
    セキュリティテストの前に、FASTプラグインとアプリケーションが同一ネットワーク上にあることを確認してください。

??? info "テストモードの変数"

    | 変数              | 値  | 必須   |
    |--------------------   | --------  | -----------  |
    | `Wallarm API token`     | Wallarmクラウドのトークン。 | はい |
    | `Wallarm API host`    | Wallarm APIサーバーのアドレス。<br>許可される値: <br>Wallarm USクラウドのサーバーには`us1.api.wallarm.com`、<br>Wallarm EUクラウドのサーバーには`api.wallarm.com`<br>デフォルト値は`us1.api.wallarm.com`。 | いいえ |
    | `Application host`      | テストアプリケーションのアドレス。IPアドレスまたはドメイン名を指定できます。 | はい |
    | `Application port`      | テストアプリケーションのポート。デフォルト値は8080。 | いいえ |
    | `Policy id`   | [テストポリシー](../operations/test-policy/overview.md)のID。<br>デフォルト値は`0`-`Default Test Policy`。 | いいえ |
    | `TestRecord id`    | テストレコードID。[TEST_RECORD_ID](ci-mode-testing.md#environment-variables-in-testing-mode)に対応します。<br>デフォルト値は、使用しているFASTノードで最後に作成されたテストレコードです。| いいえ |
    | `TestRun RPS`   | 対象アプリケーションに送信するテストリクエスト数（RPS、Requests per Second）の上限。<br>最小値: `1`。<br>最大値: `500`。<br>デフォルト値: `null`（RPSは無制限）。| いいえ |
    | `TestRun name`   | テスト実行の名前。<br>デフォルトでは、テスト実行作成日時から自動生成されます。| いいえ |
    | `TestRun description`   | テスト実行の説明。| いいえ |
    | `Stop on first fail`   | エラーが発生した時点でテストを停止するかどうか。 | いいえ |
    | `Fail build`   | セキュリティテストで脆弱性が見つかった場合に、ビルドをエラーで終了するかどうか。 | いいえ |
    | `Exclude`   | セキュリティテストから除外するファイル拡張子の一覧。<br>拡張子の区切りには記号&#448;を使用します。<br>デフォルトでは除外はありません。| いいえ |
    | `Fast name`             | FASTノードのDockerコンテナ名。 | いいえ |
    | `Wallarm version`       | 使用するFASTノードのバージョン。 | いいえ |
    | `Local docker network`  | FASTノードを実行するDockerネットワーク。 | いいえ |
    | `Local docker ip`       | 実行中のFASTノードに割り当てるIPアドレス。 | いいえ |
    | `Without sudo`          | FASTノードのコマンドを、FASTノードを実行するユーザー権限で実行するかどうか。デフォルトでは、スーパーユーザー権限（sudo経由）で実行されます。 | いいえ |

    !!! warning "FASTノードの実行"
        リクエスト記録のステップとセキュリティテストのステップの両方をワークフローに追加する場合、FASTノードのDockerコンテナ名は互いに異なる必要がある点にご注意ください。

**セキュリティテスト用に構成されたプラグインの例:**

![セキュリティテストのためのプラグイン設定例][jenkins-plugin-playback-params]

## ステップ3: テスト結果の取得

セキュリティテストの結果はJenkinsのインターフェイスに表示されます。

![FASTプラグインの実行結果][fast-example-jenkins-plugin-result]

## その他の例

FASTをCircleCIのワークフローに統合する例は、[GitHub][fast-examples-github]で参照できます。

!!! info "不明点がある場合"
    FASTの統合に関するご質問がある場合は、[こちら][mail-to-us]までご連絡ください。