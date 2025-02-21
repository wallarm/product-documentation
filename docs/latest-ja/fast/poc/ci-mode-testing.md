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

# テストモードでのFASTノードの実行

テストモードでは、FASTノードは記録モードでベースラインリクエストから作成されたテストレコードに基づいてテスト実行を生成し、ターゲットアプリケーションに対してセキュリティテストセットを実行します。

!!! info "章の前提条件"
    この章に記載されている手順に従うには、[トークン][doc-get-token]を取得する必要があります。
    
    以下の値は、この章全体で例として使用されます：
        
    * `tr_1234` はテスト実行の識別子です
    * `rec_0001` はテストレコードの識別子です
    * `bl_7777` はベースラインリクエストの識別子です

!!! info "`docker-compose`のインストール"
    この章では、テストモードでFASTノードがどのように動作するかを示すために、[`docker-compose`][link-docker-compose]ツールを使用します。
    
    このツールのインストール手順は[こちら][link-docker-compose-install]に記載されています。

## テストモードにおける環境変数

FASTノードの設定は環境変数を通じて行われます。以下の表は、テストモードでFASTノードを構成するために使用できるすべての環境変数を示します。

| 環境変数                           | 値  | 必須？ |
|------------------------------------| ----- | ----------- |
| `WALLARM_API_TOKEN`                | ノード用のトークン。 | Yes |
| `WALLARM_API_HOST`                 | 使用するWallarm APIサーバーのドメイン名。 <br>使用可能な値： <br>`us1.api.wallarm.com` はUSクラウドで使用；<br>`api.wallarm.com` はEUクラウドで使用。 | Yes |
| `CI_MODE`                          | FASTノードの運用モード。 <br>必須値：`testing`。 | Yes |
| `WORKERS`                          | 複数のベースラインリクエストを並行して処理する同時スレッド数。<br>デフォルト値：`10`。 | No |
| `TEST_RECORD_ID`                   | テストレコードの識別子。<br>デフォルトは空の値。 | No |
| `TEST_RUN_NAME`                    | テスト実行の名称。<br>デフォルト値は次の形式に類似しています：“TestRun Sep 24 12:31 UTC”。 | No |
| `TEST_RUN_DESC`                    | テスト実行の説明。<br>デフォルト値：空文字。 | No |
| `TEST_RUN_POLICY_ID`               | テストポリシーの識別子。<br>このパラメータが指定されない場合は、デフォルトポリシーが適用されます。 | No |
| `TEST_RUN_RPS`                     | テスト実行中にターゲットアプリケーションに送信されるテストリクエスト数（RPS、requests per second）の制限を指定します。<br>許容される値の範囲：1から1000（秒あたりのリクエスト数）<br>デフォルト値：無制限。 | No |
| `TEST_RUN_STOP_ON_FIRST_FAIL`      | 脆弱性が検出された場合のFASTの動作を指定します：<br>`true`: 最初の脆弱性が検出された時点でテスト実行を停止します。<br>`false`: 脆弱性の有無にかかわらず、すべてのベースラインリクエストを処理します。<br>デフォルト値：`false`。 | No |
| `TEST_RUN_URI`                     | ターゲットアプリケーションのURI。<br>CI/CDプロセス中にターゲットアプリケーションのIPアドレスが変動する場合があるため、アプリケーションURIを使用できます。<br>例えば、`docker-compose`でデプロイされたアプリケーションのURIは`http://app-test:3000`のようになる可能性があります。 | No |
| `BUILD_ID`                         | CI/CDワークフローの識別子。この識別子により、複数のFASTノードが同一クラウドFASTノードを使用して同時に作業できます。詳細は[こちら][doc-concurrent-pipelines]のドキュメントをご参照ください。 | No |
| `FILE_EXTENSIONS_TO_EXCLUDE`       | テスト中の評価プロセスから除外すべき静的ファイル拡張子のリスト。<br>これらの拡張子は<code>&#124;</code>文字で区切って列挙できます： <br><code>FILE_EXTENSIONS_TO_EXCLUDE='jpg&#124;ico&#124;png'</code> | No |
| `PROCESSES`                        | FASTノードで使用できるプロセス数。各プロセスは`WORKERS`変数で指定されたスレッド数を使用します。<br>プロセスのデフォルト数：`1`。<br>特別な値：`auto` は[nproc](https://www.gnu.org/software/coreutils/manual/html_node/nproc-invocation.html#nproc-invocation)コマンドで計算されたCPU数の半分に相当します。 | No |

!!! info "併せて参照"
    FASTノードの特定の運用モードに固有でない環境変数の説明は[こちら][doc-env-variables]でご参照いただけます。

## テストポリシー識別子の取得

独自の[テストポリシー][doc-testpolicy]を利用する予定の場合は、Wallarm Cloudで[テストポリシーを作成してください][link-wl-portal-new-policy]。その後、テストモードでFASTノードを実行する際に、`TEST_RUN_POLICY_ID`環境変数を通じて識別子をFASTノードのDockerコンテナに渡します。

そうでない場合、デフォルトのテストポリシーを使用するため、コンテナに対して`TEST_RUN_POLICY_ID`環境変数を設定しません。

!!! info "テストポリシーの作成方法"
    「Quick Start」ガイドには、サンプルテストポリシーを作成するための[ステップバイステップの手順][doc-testpolicy-creation-example]が記されています。

## テストレコード識別子の取得

テストモードで特定のテストレコードを使用する場合は、[`TEST_RECORD_ID`][anchor-testing-variables]パラメータを通じてテストレコードの識別子をFASTノードに渡すことが可能です。これにより、記録モードでFASTノードを実行する必要がなく、あらかじめ作成されたテストレコードを用いて、複数のノードやテスト実行で同一のセキュリティテストを何度も実施できます。
 
テストレコードの識別子は、WallarmポータルのインターフェイスまたはテストモードでのFASTノードのログから確認できます。`TEST_RECORD_ID`パラメータを使用しない場合、FASTノードはノードの最新のテストレコードを使用します。

## テストモードでのFASTノードのデプロイ

先に作成された`docker-compose.yaml`ファイルは、テストモードでFASTノードを実行するのに適しています。
そのため、`CI_MODE`環境変数の値を`testing`に変更する必要があります。

この値は、`docker-compose.yaml`ファイル内で変更するか、または`docker-compose run`コマンドの`-e`オプションを使用してDockerコンテナに必要な環境変数として渡すことで変更できます：

```
docker-compose run --rm -e CI_MODE=testing fast
```

!!! info "テスト結果レポートの取得"
    テスト結果レポートを取得するには、FASTノードのDockerコンテナをデプロイする際に、`-v {DIRECTORY_FOR_REPORTS}:/opt/reports/`オプションでレポートダウンロード用ディレクトリをマウントしてください。

    セキュリティテストが完了すると、`{DIRECTORY_FOR_REPORTS}`ディレクトリに、簡易な`<TEST RUN NAME>.<UNIX TIME>.txt`レポートと詳細な`<TEST RUN NAME>.<UNIX TIME>.json`レポートが生成されます。

!!! info "`docker-compose`コマンドのオプション"
    前述の環境変数はすべて、`-e`オプションを通じてFASTノードのDockerコンテナに渡すことが可能です。

    また、例に示すように`--rm`オプションを使用しており、これによりノードが停止された際にFASTノードのコンテナが自動的に削除されます。

コマンドが正常に実行された場合、以下に示すようなコンソール出力が生成されます：

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

この出力は、識別子`rec_0001`のテストレコードを使用して識別子`tr_1234`のテスト実行が作成され、この操作が正常に完了したことを示しています。

次に、FASTノードはテストポリシーに準拠する各ベースラインリクエストに対してセキュリティテストを作成および実行します。コンソール出力には、次のようなメッセージが表示されます：

```
INFO [1]: Running a test set for the baseline #bl_7777
INFO [1]: Test set for the baseline #bl_7777 is running
INFO [1]: Retrieving the baseline request Hit#["hits_production_202_20xx10_v_1", "AW2xxxxxW26"]
INFO [1]: Use TestPolicy with name 'Default Policy'
```

この出力は、識別子`bl_7777`のベースラインリクエストに対してテストセットが実行中であること、また、`TEST_RUN_POLICY_ID`環境変数が指定されなかったためにデフォルトのテストポリシーが使用されていることを示しています。

## テストモードでのFASTノードを実行しているDockerコンテナの停止および削除

テスト結果に応じて、FASTノードはさまざまな方法で終了します。

もしターゲットアプリケーションで脆弱性が検出された場合、FASTノードは以下のようなメッセージを表示します：

```
INFO [1]: Found 4 vulnerabilities, marking the test set for baseline #bl_7777 as failed
ERROR [1]: TestRun#tr_1234 failed
```

この場合、4件の脆弱性が検出され、識別子`bl_7777`のベースラインリクエストに対するテストセットが失敗と判断され、対応する識別子`tr_1234`のテスト実行も失敗とマークされます。

ターゲットアプリケーションで脆弱性が検出されなかった場合、FASTノードは以下のようなメッセージを表示します：

```
INFO [1]: No issues found. Test set for baseline #bl_7777 passed.
INFO [1]: TestRun#tr_1234 passed
```

この場合、識別子`tr_1234`のテスト実行が成功と判断されます。

!!! warning "セキュリティテストセットについて"
    上記の例は、テストセットが1つだけ実行されたことを意味するものではありません。テストセットは、FASTテストポリシーに準拠する各ベースラインリクエストごとに形成されます。
    
    ここではデモンストレーションのために、単一のテストセットに関するメッセージが表示されています。

FASTノードがテストプロセスを完了すると、CI/CDジョブの一部として実行されるプロセスに対して終了コードが返されます。 
* セキュリティテストのステータスが「passed」であり、テストプロセス中にエラーが発生しなかった場合は、`0`の終了コードが返されます。 
* それ以外の場合、つまりセキュリティテストが失敗するか、テストプロセス中にエラーが発生した場合、`1`の終了コードが返されます。

テストモードで実行されるFASTノードのコンテナは、セキュリティテストが完了すると自動的に停止します。しかし、CI/CDツールは、前述の[方法][anchor-stopping-fast-node]により、ノードおよびそのコンテナのライフサイクルを管理することが可能です。

上記の[例][anchor-testing-mode]では、FASTノードのコンテナは`--rm`オプション付きで実行されました。これは、ノードが停止された際に、その停止したコンテナが自動的に削除されることを意味します。