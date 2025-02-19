```markdown
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

# Wallarm API経由でFAST Nodeを実行する

!!! info "前提条件"
    この章で説明する手順に従うには、[token][doc-get-token]を取得する必要があります。
    
    この章では以下の値を例として使用します：
    
    * `token_Qwe12345` を token として使用します。
    * `tr_1234` をテストランの識別子として使用します。
    * `rec_0001` をテストレコードの識別子として使用します。

FAST Nodeの実行および設定は、以下の手順で構成されます：
1.  [FAST Nodeを搭載したDockerコンテナのデプロイ][anchor-node]
2.  [テストランの取得][anchor-testrun]

## FAST Nodeを搭載したDockerコンテナのデプロイ

!!! warning "Wallarm APIサーバへのアクセスを許可する"
    FAST Nodeが適切に動作するためには、HTTPSプロトコル（TCP/443）を介して `us1.api.wallarm.com` または `api.wallarm.com` のWallarm APIサーバへアクセスできることが重要です。
    
    ファイアウォールでDockerホストがWallarm APIサーバへアクセスできないよう制限されていないことを確認してください。

Dockerコンテナ上でFAST Nodeを実行する前に、いくつかの設定が必要です。ノードを設定するため、`WALLARM_API_TOKEN`環境変数にtokenを設定します。さらに、[記録するリクエスト数を制限する][doc-limit-requests]必要がある場合は、`ALLOWED_HOSTS`変数も使用できます。

環境変数をコンテナに渡すには、テキストファイルに変数を記述し、[`--env-file`][link-docker-envfile]パラメータを使用して[`docker run`][link-docker-run]コマンドにファイルパスを指定します（「Quick Start」ガイドの[手順][doc-docker-run-fast]を参照してください）。

以下のコマンドを実行して、FAST Nodeを搭載したコンテナを起動します：

```
docker run \ 
--rm \
--name <name> \
--env-file=<environment variables file> \
-p <target port>:8080 \
wallarm/fast 
```

このガイドでは、コンテナが特定のCI/CDジョブに対して1度だけ実行され、ジョブ終了時に削除されることを前提としています。そのため、上記のコマンドには[`--rm`][link-docker-rm]パラメータが追加されています。

コマンドのパラメータの詳細については、「Quick Start」ガイドの[説明][doc-docker-run-fast]を参照してください。

??? info "例"
    この例では、FAST Nodeが`token_Qwe12345`のtokenを使用し、`Host`ヘッダーの値に`example.local`を含むすべてのベースラインリクエストを記録するように設定されています。  

    環境変数を記述したファイルの内容は、以下の例の通りです：

    | fast.cfg |
    | -------- |
    | `WALLARM_API_TOKEN=token_Qwe12345`<br>`ALLOWED_HOSTS=example.local` |

    以下のコマンドは、`fast-poc-demo`という名前のDockerコンテナを実行し、次の動作を行います：
    
    * コンテナは処理完了後に削除されます。
    * `fast.cfg`ファイルを使用して環境変数がコンテナに渡されます。 
    * コンテナの`8080`ポートがDockerホストの`9090`ポートに公開されます。

    ```
    docker run --rm --name fast-poc-demo --env-file=fast.cfg -p 9090:8080  wallarm/fast
    ```

FAST Nodeのデプロイに成功すると、コンテナのコンソールとログファイルに以下の情報メッセージが表示されます：

```
[info] Node connected to Wallarm Cloud
[info] Waiting for TestRun to check…
```

これでFAST Nodeは、DockerホストのIPアドレス上と、`docker run`コマンドの`-p`パラメータで指定したポートで待機しています。

## テストランの取得

テストランを[作成][anchor-testrun-creation]するか、[コピー][anchor-testrun-copying]するかのいずれかが必要です。選択は、利用する[テストラン作成シナリオ][doc-testing-scenarios]に依存します。

### テストポリシー識別子の取得

独自の[テストポリシー][doc-testpolicy]を使用する場合は、[作成][link-wl-portal-new-policy]してポリシーの識別子を取得します。その後、APIでテストランを作成またはコピーする際に`policy_id`パラメータに識別子を渡してください。 

それ以外の場合、デフォルトのテストポリシーを使用する場合は、APIコール時に`policy_id`パラメータを省略してください。

!!! info "テストポリシーの例"
    「Quick Start」ガイドには、サンプルのテストポリシーの作成に関する[ステップバイステップの手順][doc-testpolicy-creation-example]が記載されています。

### テストランの作成

テストランを作成すると同時に、新しい[test record][doc-testrecord]も作成されます。

ベースラインリクエストの記録とともにターゲットアプリケーションのテストが必要な場合は、このテストラン作成方法を使用してください。

!!! info "テストランの作成方法"
    この手順の詳細は[こちら][doc-create-testrun]に記載されています。

テストラン作成後、FAST Nodeがリクエストを記録するまでに一定の時間が必要です。

FAST Nodeがリクエストを記録する準備が整っていることを確認してから、テストツールでターゲットアプリケーションに向けてリクエストを送信してください。

そのため、定期的にGETリクエストを送信して、URL `https://us1.api.wallarm.com/v1/test_run/test_run_id` に対してテストランの状態を確認してください。

--8<-- "../include/fast/poc/api-check-testrun-status-recording.md"

APIサーバへのリクエストが成功すると、サーバの応答が返されます。この応答には、記録プロセスの状態（`ready_for_recording`パラメータの値）などの有用な情報が含まれています。

`ready_for_recording`の値が`true`の場合、FAST Nodeは記録準備が整っているため、テストツールを起動してターゲットアプリケーションにリクエストを送信できます。

それ以外の場合、ノードが準備完了になるまで同じAPIコールを繰り返してください。

### テストランのコピー

テストランをコピーする場合、既存の[test record][doc-testrecord]が再利用されます。

既に記録されたベースラインリクエストを使用してターゲットアプリケーションのテストを行う必要がある場合は、このテストラン作成方法を使用してください。

!!! info "テストランのコピー方法"
    この手順の詳細は[こちら][doc-copy-testrun]に記載されています。

テストランが正常に作成されると、FAST Nodeは直ちにテストを開始します。追加の操作は必要ありません。

## 次のステップ

テストプロセスの完了には多くの時間がかかる場合があります。セキュリティテストがFASTで終了したかどうかは、[このドキュメント][doc-waiting-for-tests]の情報を利用して確認してください。

必要に応じて、[“Deployment via API”][doc-integration-overview-api]または[“CI/CD Workflow with FAST”][doc-integration-overview]のドキュメントを再度参照してください。
```