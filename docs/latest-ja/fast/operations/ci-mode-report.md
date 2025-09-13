[anchor-report-mode]:              #running-fast-node-in-report-mode

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-deploy-the-fast-node-docker-container

# テスト結果のレポートを取得する

FAST nodeでは、TXTおよびJSON形式でテスト結果を取得できます:

* TXTファイルには、簡潔なテスト結果—ベースラインの統計情報と検出された脆弱性の一覧—が含まれます。
* JSONファイルには、詳細なテスト結果—セキュリティテストおよびベースリクエストの詳細、ならびに検出された脆弱性の一覧—が含まれます。JSONファイルの内容は、お使いのWallarmアカウント > **Test runs**で提供されるデータに対応します。

レポートを取得するには、レポート生成方法を選択し、以下の手順に従ってください:

* [レポートモードでFAST nodeを実行する][anchor-report-mode]
* [レポートをダウンロードできるオプション付きでテストモードでFAST nodeを実行する][doc-ci-mode-testing-report]

## レポートモードでFAST nodeを実行する

レポートモードでFAST nodeを実行するには、[Dockerコンテナをデプロイする][deploy-docker-with-fast-node]際に次の手順を実行してください:

<ol start="1"><li>環境変数を設定します:</li></ol>

| 変数           	| 説明 	| 必須 	|
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Wallarm Cloudの[トークン][doc-get-token]。 | はい |
| `WALLARM_API_HOST`   	| Wallarm APIサーバーのアドレス。 <br>許可される値: <br>Wallarm US Cloudのサーバーには`us1.api.wallarm.com`、<br>Wallarm EU Cloudのサーバーには`api.wallarm.com`。| はい |
| `CI_MODE`            	| FAST nodeの動作モード。<br>`report`を指定します。 | はい |
| `TEST_RUN_ID`      	| レポート取得に必要なテスト実行のID。<br>IDは、お使いのWallarmアカウント > **Test runs**およびテストモードでFAST nodeを実行した際のログに表示されます。<br>既定では、直近のテスト実行のIDが使用されます。 | いいえ |

<ol start="2"><li>  <code>-v {DIRECTORY_FOR_REPORTS}:/opt/reports/</code>オプションでレポート用フォルダーのパスを渡します。</li></ol>

**レポートモードでFAST nodeのDockerコンテナを実行するコマンド例:**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v documents/reports:/opt/reports/ wallarm/fast
```

## レポートの取得

コマンドが正常に実行されると、テスト実行の概要がターミナルに表示されます:

--8<-- "../include/fast/console-include/operations/node-in-ci-mode-report.md"

レポートの生成が完了すると、`DIRECTORY_FOR_REPORTS`フォルダーに次のレポートファイルが作成されています:

* `<テスト実行名>.<UNIX TIME>.txt`
* `<テスト実行名>.<UNIX TIME>.json`