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

# テストモードでFASTノードを実行する

テストモードでは、FASTノードは記録モードでのベースラインリクエストから作成されたテストレコードに基づいてテストランを作成し、対象アプリケーション向けのセキュリティテストセットを実行します。

!!! info "本章の前提条件"
    本章の手順に従うには、[トークン][doc-get-token]を取得する必要があります。
    
    本章を通して以下の値を例として使用します：
        
    * `tr_1234`をテストランの識別子として使用します
    * `rec_0001`をテストレコードの識別子として使用します
    * `bl_7777`をベースラインリクエストの識別子として使用します

!!! info "「docker-compose」のインストール"
    本章では、テストモードにおけるFASTノードの動作を示すために[`docker-compose`][link-docker-compose]ツールを使用します。
    
    このツールのインストール手順は[こちら][link-docker-compose-install]にあります。

## テストモードにおける環境変数

FASTノードの設定は環境変数で行います。以下の表は、テストモードでFASTノードを設定する際に使用できるすべての環境変数を示します。

| 環境変数   | 値  | 必須？ |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| ノード用のトークンです。 | はい |
| `WALLARM_API_HOST`   	| 使用するWallarm APIサーバのドメイン名です。<br>許容値：<br>`us1.api.wallarm.com`（USクラウド用）;<br>`api.wallarm.com`（EUクラウド用）。| はい |
| `CI_MODE`            	| FASTノードの動作モードです。<br>必須値：`testing`。 | はい |
| `WORKERS` | 複数のベースラインリクエストを並列に処理する同時スレッド数です。<br>デフォルト値：`10`。| いいえ |
| `TEST_RECORD_ID` | テストレコードの識別子です。<br>デフォルト：空。 | いいえ |
| `TEST_RUN_NAME` | テストランの名前です。<br>デフォルト値は次のような形式です：“TestRun Sep 24 12:31 UTC”。 | いいえ |
| `TEST_RUN_DESC` | テストランの説明です。<br>デフォルト値：空文字列。 | いいえ |
| `TEST_RUN_POLICY_ID` | テストポリシーの識別子です。<br>パラメータが指定されていない場合は、デフォルトポリシーが適用されます。 | いいえ |
| `TEST_RUN_RPS` | テスト実行中に対象アプリケーションへ送信するテストリクエスト数の上限（RPS、requests per second）を指定します。<br>許容値の範囲：1〜1000（requests per second）<br>デフォルト値：無制限。 | いいえ |
| `TEST_RUN_STOP_ON_FIRST_FAIL` | 脆弱性が検出されたときのFASTの挙動を指定します：<br>`true`：最初の脆弱性検出時にテストランの実行を停止します。<br>`false`：脆弱性の有無にかかわらず、すべてのベースラインリクエストを処理します。<br>デフォルト値：`false`。 | いいえ |
| `TEST_RUN_URI` | 対象アプリケーションのURIです。<br>CI/CDの過程で対象アプリケーションのIPアドレスが変わる可能性があるため、アプリケーションURIを使用できます。<br>たとえば、`docker-compose`でデプロイされたアプリケーションのURIは`http://app-test:3000`のようになります。  | いいえ |
| `BUILD_ID` | CI/CDワークフローの識別子です。この識別子により、同じクラウドFASTノードを使用して複数のFASTノードを同時に動作させることができます。詳細は[こちら][doc-concurrent-pipelines]をご参照ください。| いいえ |
| `FILE_EXTENSIONS_TO_EXCLUDE` | テスト中の評価から除外すべき静的ファイル拡張子のリストです。<br>これらの拡張子は<code>&#124;</code>文字で列挙できます：<br><code>FILE_EXTENSIONS_TO_EXCLUDE='jpg&#124;ico&#124;png'</code> | いいえ |
| `PROCESSES`            | FASTノードが使用できるプロセス数です。各プロセスは`WORKERS`変数で指定されたスレッド数を使用します。<br>デフォルトのプロセス数：`1`。<br>特別な値：`auto`（[`nproc`](https://www.gnu.org/software/coreutils/manual/html_node/nproc-invocation.html#nproc-invocation)コマンドで計算されたCPU数の半分に相当）。 | いいえ |

!!! info "参考"
    特定のFASTノード動作モードに依存しない環境変数の説明は[こちら][doc-env-variables]にあります。

## テストポリシーIDの取得

独自の[テストポリシー][doc-testpolicy]を使用する予定がある場合は、Wallarm cloudで[作成][link-wl-portal-new-policy]してください。後で、テストモードでFASTノードを実行する際に、`TEST_RUN_POLICY_ID`環境変数を通じてその識別子をFASTノードのDockerコンテナに渡します。 

デフォルトのテストポリシーを使用する場合は、コンテナに`TEST_RUN_POLICY_ID`環境変数を設定しないでください。

!!! info "テストポリシーの作成方法"
    「Quick Start」ガイドには、サンプルのテストポリシーを作成するための[段階的な手順][doc-testpolicy-creation-example]が記載されています。

## テストレコードIDの取得
 
テストモードで特定のテストレコードを使用するには、[`TEST_RECORD_ID`][anchor-testing-variables]パラメータでそのテストレコードの識別子をFASTノードに渡すことができます。これにより、最初に記録モードでFASTノードを実行する必要がなくなります。代わりに、あらかじめ作成したテストレコードを使用して、異なるノードやテストランで同じセキュリティテストを複数回実行できます。
 
テストレコードの識別子は、Wallarmポータルのインターフェイス、またはテストモードでのFASTノードのログから取得できます。`TEST_RECORD_ID`パラメータを使用しない場合、FASTノードはそのノードの最後のテストレコードを使用します。

## テストモードでのFASTノードのデプロイ

以前に作成した`docker-compose.yaml`ファイルは、テストモードでFASTノードを実行するのに適しています。
そのためには、環境変数`CI_MODE`の値を`testing`に変更する必要があります。

値の変更は、`docker-compose.yaml`ファイル内の当該変数を修正するか、`docker-compose run`コマンドの`-e`オプションで必要な値の環境変数をDockerコンテナに渡す方法のいずれでも可能です：

```
docker-compose run --rm -e CI_MODE=testing fast
```

!!! info "テストレポートの取得"
    テスト結果のレポートを取得するには、FASTノードのDockerコンテナをデプロイする際に、`-v {DIRECTORY_FOR_REPORTS}:/opt/reports/`オプションでレポートのダウンロード先ディレクトリをマウントします。

    セキュリティテストが完了すると、{DIRECTORY_FOR_REPORTS}ディレクトリに、簡易レポート`<TEST RUN NAME>.<UNIX TIME>.txt`と詳細レポート`<TEST RUN NAME>.<UNIX TIME>.json`が作成されます。

!!! info "`docker-compose`コマンドのオプション"
    上記のいずれの環境変数も、`-e`オプション経由でFASTノードのDockerコンテナに渡すことができます。

    また、上の例では`--rm`オプションも使用しており、ノードの停止時にFASTノードのコンテナが自動的に破棄されます。

コマンドが正常に実行されると、次のようなコンソール出力が表示されます：

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

この出力は、識別子`rec_0001`のテストレコードを使用して、識別子`tr_1234`のテストランが作成され、処理が正常に完了したことを示しています。

続いて、テストポリシーを満たすテストレコード内の各ベースラインリクエストに対して、FASTノードがセキュリティテストを生成し実行します。コンソール出力には次のようなメッセージが含まれます：

```
INFO [1]: Running a test set for the baseline #bl_7777
INFO [1]: Test set for the baseline #bl_7777 is running
INFO [1]: Retrieving the baseline request Hit#["hits_production_202_20xx10_v_1", "AW2xxxxxW26"]
INFO [1]: Use TestPolicy with name 'Default Policy'
```

この出力は、識別子`bl_7777`のベースラインリクエストに対してテストセットが実行されていることを示しています。また、`TEST_RUN_POLICY_ID`環境変数が指定されていないため、デフォルトのテストポリシーが使用されていることも示しています。

## テストモードのFASTノードのDockerコンテナの停止と削除

取得したテスト結果に応じて、FASTノードの終了の仕方は異なります。

対象アプリケーションで脆弱性が検出された場合、FASTノードは次のようなメッセージを表示します：

```
INFO [1]: Found 4 vulnerabilities, marking the test set for baseline #bl_7777 as failed
ERROR [1]: TestRun#tr_1234 failed
```

この場合、4件の脆弱性が見つかりました。識別子`bl_7777`のベースラインに対するテストセットは失敗と見なされ、対応する識別子`tr_1234`のテストランも失敗としてマークされます。

対象アプリケーションで脆弱性が検出されなかった場合、FASTノードは次のようなメッセージを表示します：

```
INFO [1]: No issues found. Test set for baseline #bl_7777 passed.
INFO [1]: TestRun#tr_1234 passed
```

この場合、識別子`tr_1234`のテストランは合格と見なされます。

!!! warning "セキュリティテストセットについて"
    上記の例は、1つのテストセットのみが実行されたことを意味するものではありません。FASTのテストポリシーに適合する各ベースラインリクエストごとにテストセットが作成されます。
    
    ここでは説明のため、テストセットに関するメッセージを1件のみ示しています。

FASTノードはテスト処理が完了すると終了し、CI/CDジョブの一部として実行しているプロセスに終了コードを返します。 
* セキュリティテストのステータスが“passed”で、かつテスト処理中にFASTノードでエラーが発生しなかった場合は、終了コード`0`を返します。 
* それ以外（セキュリティテストが失敗した、またはテスト処理中にFASTノードでエラーが発生した）場合は、終了コード`1`を返します。

テストモードのFASTノードのコンテナは、セキュリティテスト完了後に自動的に停止します。それでも、CI/CDツールは[前述の方法][anchor-stopping-fast-node]によってノードおよびコンテナのライフサイクルを制御できます。

[上の例][anchor-testing-mode]では、FASTノードのコンテナは`--rm`オプションを付けて実行されています。これは、停止したコンテナが自動的に削除されることを意味します。