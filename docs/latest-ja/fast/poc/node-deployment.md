[anchor-node]:                      #deployment-of-the-docker-container-with-the-fast-node
[anchor-testrun]:                   #obtaining-a-test-run
[anchor-testrun-creation]:          #creating-a-test-run
[anchor-testrun-copying]:           #copying-a-test-run

[doc-limit-requests]:               ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-testpolicy]:                   ../operations/internals.md#fast-test-policy
[doc-inactivity-timeout]:           ../operations/internals.md#test-run
[doc-allowed-hosts-example]:        ../qsg/deployment.md#3-prepare-a-file-containing-the-necessary-environment-variables
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-docker-run-fast]:              ../qsg/deployment.md#4-deploy-the-fast-node-docker-container
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


# Wallarm API経由でFASTノードを実行する

!!! info "本章の前提条件"
    本章の手順に従うには、[トークン][doc-get-token]を取得する必要があります。
    
    本章全体で以下の値を例として使用します。
    
    * トークンは`token_Qwe12345`です。
    * テストランの識別子は`tr_1234`です。
    * テストレコードの識別子は`rec_0001`です。

FASTノードの実行と構成は次の手順で行います:
1.  [FASTノードを含むDockerコンテナのデプロイ][anchor-node]
2.  [テストランの取得][anchor-testrun]

## FASTノードを含むDockerコンテナのデプロイ

!!! warning "Wallarm APIサーバへのアクセスを許可してください"
    FASTノードが正しく動作するためには、HTTPSプロトコル（`TCP/443`）で`us1.api.wallarm.com`または`api.wallarm.com`のWallarm APIサーバへアクセスできることが重要です。
    
    ファイアウォールがDockerホストからWallarm APIサーバへのアクセスを制限していないことを確認してください。

FASTノード入りのDockerコンテナを実行する前に、いくつか設定が必要です。ノードを構成するには、`WALLARM_API_TOKEN`環境変数を使用してトークンをコンテナに渡します。さらに、記録対象のリクエスト数を[制限する必要がある][doc-limit-requests]場合は、`ALLOWED_HOSTS`変数も使用できます。

環境変数をコンテナへ渡すには、変数をテキストファイルに記述し、[`docker run`][link-docker-run]コマンドの[`--env-file`][link-docker-envfile]パラメータでそのファイルパスを指定します（「Quick Start」ガイドの[手順][doc-docker-run-fast]を参照してください）。

次のコマンドを実行してFASTノードのコンテナを起動します:

```
docker run \ 
--rm \
--name <name> \
--env-file=<environment variables file> \
-p <target port>:8080 \
wallarm/fast 
```

このガイドでは、コンテナは該当のCI/CDジョブで一度だけ実行され、ジョブ終了時に削除されることを前提としています。そのため、上記のコマンドには[`--rm`][link-docker-rm]パラメータを追加しています。

コマンドの各パラメータの[詳細な説明][doc-docker-run-fast]は「Quick Start」ガイドをご参照ください。

??? info "例"
    この例では、FASTノードが`token_Qwe12345`というトークンを使用し、`Host`ヘッダーの値に`example.local`を含むすべての受信ベースラインリクエストを記録するように設定されていることを想定します。  

    環境変数を記述したファイルの内容は次のとおりです。

    | fast.cfg |
    | -------- |
    | `WALLARM_API_TOKEN=token_Qwe12345`<br>`ALLOWED_HOSTS=example.local` |

    以下のコマンドは`fast-poc-demo`という名前のDockerコンテナを次の動作で起動します。
    
    * 処理完了後にコンテナが削除されます。
    * 環境変数は`fast.cfg`ファイルを使用してコンテナに渡されます。 
    * コンテナの`8080`ポートがDockerホストの`9090`ポートに公開されます。

    ```
    docker run --rm --name fast-poc-demo --env-file=fast.cfg -p 9090:8080  wallarm/fast
    ```

FASTノードのデプロイが成功すると、コンテナのコンソールおよびログファイルに次の情報メッセージが出力されます:

```
[info] Node connected to Wallarm Cloud
[info] Waiting for TestRun to check…
```

これでFASTノードはDockerホストのIPアドレスおよび`docker run`コマンドの`-p`パラメータで指定したポートで待ち受けています。

## テストランの取得

テストランを[作成][anchor-testrun-creation]するか、[コピー][anchor-testrun-copying]する必要があります。選択は、利用する[テストラン作成シナリオ][doc-testing-scenarios]によって決まります。

### テストポリシー識別子の取得

独自の[テストポリシー][doc-testpolicy]を使用する予定の場合は、[作成][link-wl-portal-new-policy]してポリシーの識別子を取得してください。後でテストランを作成またはコピーするAPI呼び出しで、その識別子を`policy_id`パラメータに渡します。 

デフォルトのテストポリシーを使用する場合は、API呼び出しで`policy_id`パラメータを省略してください。

!!! info "テストポリシーの例"
    「Quick Start」ガイドには、サンプルのテストポリシーを作成するための[手順][doc-testpolicy-creation-example]が含まれています。

### テストランの作成

テストランを作成すると、新しい[テストレコード][doc-testrecord]も作成されます。

ベースラインリクエストの記録と併行して対象アプリケーションをテストする必要がある場合にこの方法を使用します。

!!! info "テストランの作成方法"
    手順の詳細は[こちら][doc-create-testrun]に記載しています。

テストラン作成後、リクエストを記録できるようになるまでFASTノードには一定の時間が必要です。

テストツールで対象アプリケーションにリクエストを送信する前に、FASTノードが記録可能な状態であることを確認してください。

そのために、URL`https://us1.api.wallarm.com/v1/test_run/test_run_id`へGETリクエストを送信してテストランのステータスを定期的に確認します。

--8<-- "../include/fast/poc/api-check-testrun-status-recording.md"

APIサーバへのリクエストが成功すると、サーバからレスポンスが返されます。このレスポンスには、記録プロセスの状態（`ready_for_recording`パラメータの値）などの有用な情報が含まれます。

パラメータの値が`true`であれば、FASTノードは記録の準備ができているため、テストツールを起動して対象アプリケーションへリクエスト送信を開始できます。

それ以外の場合は、ノードが準備完了になるまで同じAPI呼び出しを繰り返してください。

### テストランのコピー

テストランをコピーする際は、既存の[テストレコード][doc-testrecord]が再利用されます。

既に記録済みのベースラインリクエストを使用して対象アプリケーションをテストする必要がある場合にこの方法を用います。

!!! info "テストランのコピー方法"
    手順の詳細は[こちら][doc-copy-testrun]に記載しています。

テストランが正常に作成されると、FASTノードは直ちにテストを開始します。追加の操作は不要です。

## 次のステップ

テストは完了までに時間がかかる場合があります。FASTによるセキュリティテストが終了したかどうかは[このドキュメント][doc-waiting-for-tests]の情報を利用して判断してください。

必要に応じて[「API経由のデプロイ」][doc-integration-overview-api]や[「FASTによるCI/CDワークフロー」][doc-integration-overview]のドキュメントを参照してください。