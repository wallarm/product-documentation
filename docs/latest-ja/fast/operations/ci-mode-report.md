[anchor-report-mode]:              #running-fast-node-in-report-mode

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#getting-the-report-about-the-test
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-deploy-the-fast-node-docker-container

# テスト結果レポートの取得

FASTノードは、テスト結果をTXTとJSONの形式で取得することができます。

* TXTファイルには、基本的な統計と検出した脆弱性のリストが含まれます。
* JSONファイルには、詳細なテスト結果が含まれます — セキュリティテストと基本リクエストの詳細、及び検出した脆弱性のリスト。JSONファイルの内容は、Wallarmアカウント > **Test runs**で提供されるデータに対応しています。

レポートを取得するためには、レポート生成方法を選択し、以下の指示に従ってください。

* [レポートモードでのFASTノードの実行][anchor-report-mode]
* [レポートのダウンロードオプション付きのテストモードでのFASTノードの実行][doc-ci-mode-testing-report] 

## レポートモードでのFASTノードの実行

レポートモードでFASTノードを実行するためには、[Dockerコンテナのデプロイ][deploy-docker-with-fast-node]時に以下の手順を実行します。

<ol start="1"><li>環境変数を設定します。</li></ol>

| 変数                   	| 説明 	| 必須 	|
|------------------------	|--------	|-------	|
| `WALLARM_API_TOKEN`     	| Wallarmクラウドからの[token][doc-get-token] | はい |
| `WALLARM_API_HOST`      	| Wallarm APIサーバーのアドレス。<br>許可されている値：<br>`us1.api.wallarm.com` （Wallarm USクラウド内のサーバー用）<br>`api.wallarm.com` （Wallarm EUクラウド内のサーバー用）。 | はい |
| `CI_MODE`               	| FASTノードの操作モード。<br>`report`である必要があります。 | はい |
| `TEST_RUN_ID`         	| レポートを取得するために必要なテスト実行ID。<br>IDはWallarmアカウント > **Test runs**とFASTノードのテストモードでの実行ログで表示されます。<br>デフォルトでは、最後のテスト実行のIDが使用されます。 | いいえ |

<ol start="2"><li>オプション<code>-v {DIRECTORY_FOR_REPORTS}:/opt/reports/</code>を使って、レポートのフォルダへのパスを渡します。</li></ol>

**レポートモードでFASTノードDockerコンテナを実行するコマンドの例：**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v documents/reports:/opt/reports/ wallarm/fast
```

## レポートの取得

コマンドが正常に実行された場合、ターミナルにテスト実行の簡単なデータが表示されます。

--8<-- "../include-ja/fast/console-include-ja/operations/node-in-ci-mode-report.md"

レポート生成が完了したら、`DIRECTORY_FOR_REPORTS`フォルダに以下のレポートファイルが作成されます：

* `<TEST RUN NAME>.<UNIX TIME>.txt`
* `<TEST RUN NAME>.<UNIX TIME>.json`