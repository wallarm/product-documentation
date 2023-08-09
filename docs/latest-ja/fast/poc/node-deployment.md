[anchor-node]:                      #docker-container-no-fast-node-no-deployment
[anchor-testrun]:                   #test-run-no-shutoku
[anchor-testrun-creation]:          #test-run-no-sakusei
[anchor-testrun-copying]:           #test-run-no-copy

[doc-limit-requests]:               ../operations/env-variables.md#request-no-record-no-kazu-no-seigen
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-testpolicy]:                   ../operations/internals.md#fast-test-policy
[doc-inactivity-timeout]:           ../operations/internals.md#test-run
[doc-allowed-hosts-example]:        ../qsg/deployment.md#3-necessity-no-environment-variable-no-file-no-junbi
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-xss-no-zeijaku-ten-no-test-policy-no-sakusei
[doc-docker-run-fast]:              ../qsg/deployment.md#4-fast-node-docker-container-no-deployment
[doc-state-description]:            ../operations/check-testrun-status.md
[doc-testing-scenarios]:            ../operations/internals.md#test-run
[doc-testrecord]:                   ../operations/internals.md#test-record
[doc-create-testrun]:               ../operations/create-testrun.md
[doc-copy-testrun]:                 ../operations/copy-testrun.md
[doc-waiting-for-tests]:            waiting-for-tests.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#general

[link-docker-envfile]:              https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file
[link-docker-run]:                  https://docs.docker.com/engine/reference/commandline/run/
[link-docker-rm]:                   https://docs.docker.com/engine/reference/run/#clean-up---rm

[doc-integration-overview]:         integration-overview.md
[doc-integration-overview-api]:     integration-overview-api.md


#   Wallarm APIを経由したFAST Nodeの実行

!!! info "章の前提条件"
    この章で説明されている手順に従うには、[token][doc-get-token]が必要です。
    
    以下の値は本章全体で例として使用されています：
    
    * `token_Qwe12345` はトークンとして。
    * `tr_1234` はテストランの識別子として。
    * `rec_0001` はテストレコードの識別子として。

FASTノードの実行と設定は次の手順で行います：
1.  [Docker ContainerとFAST Nodeの周署][anchor-node]
2.  [Test Runの取得][anchor-testrun]

##  Docker ContainerとFAST Nodeの周署

!!! warning "Wallarm APIサーバへのアクセス権を付与する"
    適切な操作のために、FAST Nodeは `us1.api.wallarm.com`または `api.wallarm.com`Wallarm APIサーバがHTTPSプロトコル（ `TCP/443`）を通じてアクセスすることが重要です。
    
    DockerホストがWallarm APIへのアクセスを制限しないように、ファイアウォールが確認されていることを確認してください。

FASTノードとともにDocker Containerの実行前に一部の設定が必要です。そのノードを設定するには、`WALLARM_API_TOKEN`環境変数を使用してコンテナにトークンを配置します。さらに、必要に応じて [`--env-file`][link-docker-envfile] [`docker run`][link-docker-run] コマンドのパラメータを使い、ファイルに変数を配置し、そのパスを指定します（「クイックスタート」ガイドの[指示][doc-docker-run-fast]を参照してください.。

次に示すコマンドを実行して、FAST ノードを持つコンテナを実行します：

```
docker run \ 
--rm \
--name <name> \
--env-file=<environment variables file> \
-p <target port>:8080 \
wallarm/fast 
```

このガイドでは、コンテナが指定したCI/CDジョブ用に一度だけ実行され、ジョブが終了したときに削除されることを前提としています。したがって、上記のコマンドには [`--rm`][link-docker-rm] パラメータが追加されています。

コマンドのパラメータについての詳細な説明は「クイックスタート」ガイドを参照してください。

??? info "例"
    この例では、FASTノードが `token_Qwe12345` トークンを使用し、`Host` ヘッダーの値の部分文字列として `example.local` を含むすべての着信ベースライン要求を記録するように設定されています。  

    環境変数のファイルの内容は次の例のようになります：

    | fast.cfg |
    | -------- |
    | `WALLARM_API_TOKEN=token_Qwe12345`<br>`ALLOWED_HOSTS=example.local` |

    以下のコマンドは、次の動作を持つ Dockerコンテナー `fast-poc-demo` を実行します：
    
    * ジョブが完了した後、コンテナは削除されます。
    * 環境変数は `fast.cfg` ファイルを使用してコンテナに渡されます。 
    * コンテナの `8080` ポートはDockerホストの `9090` ポートに公開されます。

    ```
    docker run --rm --name fast-poc-demo --env-file=fast.cfg -p 9090:8080  wallarm/fast
    ```

FASTノードのデプロイが成功すれば、コンテナのコンソールとログファイルには以下のような情報メッセージが表示されます：

```
[info] ノードはWallarm Cloudに接続されました
[info] TestRunのチェック待ち…
```

現在、FASTノードはDockerホストのIPアドレスでリッスンしており、`docker run`コマンドの `-p`パラメータで以前に指定したポートを使用しています。

##  Test Runの取得

Test Runを作成したり、[copy][anchor-testrun-copying] したりする必要があります。選択は、適切な [test run作成シナリオ][doc-testing-scenarios]によって異なります。

### Test Policy識別子の取得

自身の[test policy][doc-testpolicy]を使用する予定であれば、[作成][link-wl-portal-new-policy]し、そのポリシーの識別子を取得します。プライマリ識別子を後でAPI呼び出し時の `policy_id`パラメータに渡します。

したがって、デフォルトのテストポリシーを使用する予定であれば、API呼び出しから `policy_id` パラメーターを省略するべきです。

!!! info "Test Policyの例"
    「クイックスタート」ガイドには、サンプルテストポリシーを作成する[手順][doc-testpolicy-creation-example]が含まれています。

### Test Runの作成

テストランが作成されると、新しい[test record][doc-testrecord]も作成されます。

このテストラン作成方法は、ベースラインリクエストの記録と併せてターゲットアプリをテストする場合に使用すべきです。

!!! info "Test Runの作成方法"
    このプロセスは[こちら][doc-create-testrun]で詳しく説明されています。

テストランを作成した後、リクエストを記録するためにFASTノードが一定時間必要とします。

テストツールを使用してターゲットアプリケーションにリクエストを送信する前に、FASTノードがリクエストの記録準備ができているかを確認してください。

そのためには、URL `https://us1.api.wallarm.com/v1/test_run/test_run_id` へ GETリクエストを送ることにより、テストランのステータスを定期的に確認します：

--8<-- "../include-ja/fast/poc/api-check-testrun-status-recording.md"

APIサーバへのリクエストが成功すれば、サーバの応答が表示されます。この応答には、記録プロセスの状態（ `ready_for_recording` パラメータの値）など、役立つ情報が含まれています。

パラメータの値が `true`であれば、FASTノードは記録を準備し、テストツールを起動してターゲットアプリケーションにリクエストを送信することができます。

それ以外の場合は、ノードが準備完了するまで、同じAPIを繰り返し呼出しします。

### テストランのコピー

テストランがコピーされるとき、既存の[test record][doc-testrecord]が再利用されます。

このテストラン作成方法は、既に記録されたベースラインリクエストを使用してターゲットアプリケーションをテストする場合に使用します。

!!! info "Test Runのコピー方法"
    このプロセスは[こちら][doc-copy-testrun]で詳しく説明されています。

テストランが成功裕に作成されると、FASTノードはすぐにテストを開始します。その他に追加のアクションを取る必要はありません。

## 次のステップ

テストプロセスは完了までに多くの時間を要する場合があります。テスト完了を確認するための情報は、[このドキュメント][doc-waiting-for-tests]から入手できます。

必要に応じて、「API経由の周署」[doc-integration-overview-api]または「CI/CDワークフローとFAST」[doc-integration-overview]ドキュメントに参照してください。