[doc-testpolicy]:                   ../operations/internals.md#fast-test-policy
[doc-testpolicy-creation-example]:  ../qsg/test-preparation.md#2-create-a-test-policy-targeted-at-xss-vulnerabilities
[doc-waiting-for-tests]:            waiting-for-tests.md
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[link-wl-portal-new-policy]:        https://us1.my.wallarm.com/testing/policies/new#general
[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

[anchor-testing-mode]:              #deployment-of-a-fast-node-in-the-testing-mode
[anchor-testing-variables]:         #environment-variables-in-testing-mode
[anchor-stopping-fast-node]:        ci-mode-recording.md#stopping-and-removing-the-docker-container-with-the-fast-node-in-recording-mode
[anchor-testing-mode]:              #deployment-of-a-fast-node-in-the-testing-mode

#  テストモードでのFASTノードの実行

テストモードでは、FASTノードは録音モードでベースラインリクエストから取得したテストレコードに基づいてテストランを作成し、ターゲットアプリケーションのセキュリティテストセットを実行します。

!!! info "章の前提条件"
    この章で説明されている手順に従うためには、[トークン][doc-get-token]を取得する必要があります。
    
    この章全体で次の値を例として使用します：
        
    * テストランの識別子として `tr_1234`
    * テストレコードの識別子として `rec_0001`
    * ベースラインリクエストの識別子として `bl_7777`

!!! info "`docker-compose` のインストール"
    [`docker-compose`][link-docker-compose] ツールはこの章全体で、FASTノードがテストモードでどのように動作するかを示すために使用されます。
    
    このツールのインストール手順は[こちら][link-docker-compose-install]で利用できます。

## テストモードでの環境変数

FASTノードの設定は環境変数を介して行われます。以下の表は、テストモードでFASTノードを設定するために使用できるすべての環境変数を示しています。

| 環境変数   | 値  | 必須? |
|-------------------- | -------- | ----------- |
| `WALLARM_API_TOKEN`  | ノードのトークン。 | はい |
| `WALLARM_API_HOST`   | 使用するWallarm APIサーバーのドメイン名。<br>許可される値: <br>`us1.api.wallarm.com` は米国のクラウドでの使用用；<br>`api.wallarm.com` はEUのクラウドでの使用用。| はい |
| `CI_MODE`            | FASTノードの操作モード。<br>要求される値: `testing`。 | はい |
| `WORKERS` | 平行して複数のベースラインリクエストを処理するスレッドの数。<br>デフォルト値: `10`。| いいえ |
| `TEST_RECORD_ID` | テストレコードの識別子。<br>デフォルト: 空の値。 | いいえ |
| `TEST_RUN_NAME` | テストランの名前。<br>デフォルト値は次のような形式です: “TestRun Sep 24 12:31 UTC”。 | いいえ |
| `TEST_RUN_DESC` | テストランの説明。<br>デフォルト値: 空文字列。 | いいえ |
| `TEST_RUN_POLICY_ID` | テストポリシーの識別子。<br>このパラメータが欠けている場合、デフォルトのポリシーが動作します。 | いいえ |
| `TEST_RUN_RPS` | このパラメータは、テストラン実行中にターゲットアプリケーションに送信されるテストリクエストの数（*RPS*、*リクエスト/秒*）への制限を指定します。<br>許可される値の範囲: 1から1000（リクエスト/秒）まで<br>デフォルト値: 制限なし。 | いいえ |
| `TEST_RUN_STOP_ON_FIRST_FAIL` | このパラメータは、脆弱性が検出された場合のFASTの動作を指定します:<br>`true`: 最初に検出された脆弱性でテストランの実行を停止します。<br>`false`: 脆弱性が検出されたかどうかにかかわらず、すべてのベースラインリクエストを処理します。<br>デフォルト値: `false`。 | いいえ |
| `TEST_RUN_URI` | 対象アプリケーションのURI。<br>CI/CDプロセス中にターゲットアプリケーションのIPアドレスが変更される可能性がありますので、アプリケーションのURIを使用することが可能です。<br>例えば、`docker-compose` を介してデプロイされたアプリケーションのURIは `http://app-test:3000` のようになるかもしれません。 | いいえ |
| `BUILD_ID` | CI/CDワークフローの識別子。この識別子により、複数のFASTノードが同一のクラウドFASTノードを使用して並行して動作することが可能になります。詳細は[この][doc-concurrent-pipelines]ドキュメントを参照してください。| いいえ |
| `FILE_EXTENSIONS_TO_EXCLUDE` | テスト中に評価プロセスから除外するべき静的ファイル拡張子のリスト。<br>これらの拡張子を <code>&#124;</code> 文字を使って列挙することができます：<br><code>FILE_EXTENSIONS_TO_EXCLUDE='jpg&#124;ico&#124;png'</code> | いいえ |
| `PROCESSES`            | FASTノードが使用できるプロセスの数。各プロセスは、`WORKERS`変数で指定された数のスレッドを使用します。<br>プロセスのデフォルト数: `1`。<br>特殊な値: `auto`。これはCPUの数の半数に等しく、[nproc](https://www.gnu.org/software/coreutils/manual/html_node/nproc-invocation.html#nproc-invocation) コマンドを使用して計算されます。 | いいえ |

!!! info "参照も参照"
    特定のFASTノード動作モードに特化したものでない環境変数の説明は[こちら][doc-env-variables]で利用可能です。

## テストポリシー識別子の取得

自分自身のテストポリシー[テストポリシー][doc-testpolicy]を使用する予定であれば、Wallarmクラウド内で[作成][link-wl-portal-new-policy]し、後でその識別子を`TEST_RUN_POLICY_ID`環境変数を介してFASTノードのDockerコンテナに渡し、テストモードでFASTノードを実行します。

そうでなければ、デフォルトのテストポリシーを使用することを選択した場合、コンテナの `TEST_RUN_POLICY_ID` 環境変数を設定しないでください。

!!! info "テストポリシーの作成方法"
    “クイックスタート”ガイドには、サンプルテストポリシーを作成する方法の[ステップバイステップの手順][doc-testpolicy-creation-example]が含まれています。

## テストレコード識別子の取得

テストモードで特定のテストレコードを使用するためには、[`TEST_RECORD_ID`][anchor-testing-variables] パラメータを使用してテストレコードの識別子をFASTノードに渡します。そのため、最初にFASTノードを録画モードで実行する必要はありません。代わりに、事前に形成されたテストレコードを使用して、異なるノードとテストランで何度も同じセキュリティテストを実行できます。

テストレコードの識別子は、WallarmポータルインタフェースまたはテストモードでのFASTノードログから取得できます。`TEST_RECORD_ID` パラメータを使用しない場合、FASTノードはノードの最後のテストレコードを使用します。

## テストモードでのFASTノードのデプロイ

以前に作成した `docker-compose.yaml` ファイルは、テストモードでFASTノードを実行するのに適しています。
これを行うためには、`CI_MODE`環境変数の値を `testing` に変える必要があります。

変数の値を変えるには、`docker-compose.yaml` ファイルの中でそれを修正するか、`docker-compose run` コマンドの `-e` オプションを使って必要な値を持つ環境変数をDockerコンテナに渡すことができます：

```
docker-compose run --rm -e CI_MODE=testing fast
```

!!! info "テストについてのレポートの取得"
    テスト結果のレポートを取得するためには、レポートをダウンロードするためのディレクトリを `-v {DIRECTORY_FOR_REPORTS}:/opt/reports/` オプションを使用してマウントすることが必要です。

    セキュリティテストが完了すると、`{DIRECTORY_FOR_REPORTS}` ディレクトリに簡単な `<TEST RUN NAME>.<UNIX TIME>.txt` レポートと詳細な `<TEST RUN NAME>.<UNIX TIME>.json` レポートが見つかります。

!!! info "`docker-compose` コマンドのオプション"
    上記の例で使用されている `-e` オプションを介して、上記で説明された任意の環境変数をFASTノードのDockerコンテナに渡すことができます。

    上記の例ではまた、`--rm` オプションも使用されていて、これによりノードが停止した時にFASTノードのコンテナが自動的に削除されます。

コマンドが正常に実行されると、以下に示すようなコンソール出力が生成されます：

```
 __      __    _ _
 \ \    / /_ _| | |__ _ _ _ _ __
  \ \/\/ / _` | | / _` | '_| '  \
   \_/\_/\__,_|_|_\__,_|_| |_|_|_|
            ___ _   ___ _____
           | __/_\ / __|_   _|
           | _/ _ \\__ \ | |
           |_/_/ \_\___/ |_|

Loading...
INFO synccloud[13]: Registered new instance 16dd487f-3d40-4834-xxxx-8ff17842d60b
INFO [1]: Loaded 0 custom extensions for fast scanner
INFO [1]: Loaded 44 default extensions for fast scanner
INFO [1]: Use TestRecord#rec_0001 for creating TestRun
INFO [1]: TestRun#tr_1234 created
```

この出力は、`rec_0001` 識別子のテストレコードが使用され、`tr_1234` 識別子のテストランが正常に作成されたことを示しています。

次に、テストレコード中のテストポリシーを満たす各ベースラインリクエストについて、FASTノードによりセキュリティテストが作成および実行されます。コンソール出力には以下のメッセージが含まれます：

```
INFO [1]: Running a test set for the baseline #bl_7777
INFO [1]: Test set for the baseline #bl_7777 is running
INFO [1]: Retrieving the baseline request Hit#["hits_production_202_20xx10_v_1", "AW2xxxxxW26"]
INFO [1]: Use TestPolicy with name 'Default Policy'
```

この出力は、`bl_7777` 識別子のベースラインリクエストのテストセットが実行中であることを通知しています。また、`TEST_RUN_POLICY_ID` 環境変数がないため、デフォルトのテストポリシーが使用されていることを表示しています。

## テストモードのFASTノードのDockerコンテナの停止と削除

得られたテスト結果によって、FASTノードはさまざまな方法で終了することができます。

ターゲットアプリケーションに何らかの脆弱性が検出されると、FASTノードは次のようなメッセージを表示します：

```
INFO [1]: Found 4 vulnerabilities, marking the test set for baseline #bl_7777 as failed
ERROR [1]: TestRun#tr_1234 failed
```

この場合、4つの脆弱性が見つかりました。`bl_7777` 識別子のベースライン用のテストセットは失敗と見なされ、対応する `tr_1234` 識別子のテストランも失敗とマークされます。

ターゲットアプリケーションで脆弱性が検出されない場合、FASTノードは次のようなメッセージを表示します：

```
INFO [1]: No issues found. Test set for baseline #bl_7777 passed.
INFO [1]: TestRun#tr_1234 passed
```

この場合、 `tr_1234` 識別子のテストランは通過と見なされます。

!!! warning "セキュリティテストセットについて"
    上記の例は、1つのテストセットのみが実行されたことを示しているわけではないことに注意してください。テストセットは、FASTテストポリシーに準拠する各ベースラインリクエストに対して形成されます。
    
    ここではデモンストレーション用に1つのテストセットに関連するメッセージが表示されています。

FASTノードがテストプロセスを終了した後、CI/CDジョブの一部として動作するプロセスに終了コードを返します。 
* セキュリティテストのステータスが “通過” であり、FASTノードがテストプロセス中にエラーに遭遇しない場合、終了コード `0` が返されます。 
* それ以外の場合、セキュリティテストが失敗するか、またはFASTノードがテストプロセス中に何らかのエラーに遭遇すると、終了コード `1` が返されます。

テストが完了すると、テストモードのFASTノードコンテナは自動的に停止します。それでも、CI/CDツールは[以前に説明した][anchor-stopping-fast-node]手段を用いてノードとそのコンテナのライフサイクルを制御することができます。

[上記の例][anchor-testing-mode]では、FASTノードコンテナは `--rm` オプションで動作しています。これは、停止したコンテナが自動的に削除されることを意味します。