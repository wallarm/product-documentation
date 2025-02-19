[anchor-report-mode]:              #running-fast-node-in-report-mode

[doc-ci-mode-testing-report]:      ../poc/ci-mode-testing.md#deployment-of-a-fast-node-in-the-testing-mode
[doc-ci-mode-testing]:             ../poc/ci-mode-testing.md
[doc-get-token]:                   create-node.md
[deploy-docker-with-fast-node]:    ../qsg/deployment.md#4-deploy-the-fast-node-docker-container

# テスト結果付きレポートの取得

FASTノードでは、TXT形式およびJSON形式のテスト結果を取得できます:

* TXTファイルには、簡潔なテスト結果―ベースライン統計と検出された脆弱性の一覧―が含まれます。
* JSONファイルには、詳細なテスト結果―セキュリティテストの詳細と基本リクエスト、ならびに検出された脆弱性の一覧―が含まれます。JSONファイルの内容は、Wallarmアカウント > **Test runs** に表示されるデータに対応します。

レポートを取得するには、レポート生成方法を選択し、以下の手順に従ってください:

* [reportモードでのFASTノードの実行][anchor-report-mode]
* [テストモードでのFASTノード実行（レポートダウンロードオプション付き）][doc-ci-mode-testing-report]

## reportモードでのFASTノードの実行

FASTノードをreportモードで実行するには、[Dockerコンテナのデプロイ][deploy-docker-with-fast-node]時に、以下の手順を行ってください。

<ol start="1"><li>環境変数を設定します:</li></ol>

| Variable           	| Description 	| Required 	|
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| Wallarmクラウドからの[トークン][doc-get-token]です。 | Yes |
| `WALLARM_API_HOST`   	| Wallarm APIサーバーのアドレスです。 <br>許可される値: <br>`us1.api.wallarm.com` はWallarm USクラウドのサーバー用、<br>`api.wallarm.com` はWallarm EUクラウドのサーバー用です。| Yes |
| `CI_MODE`            	| FASTノードの動作モードです。<br>`report`に設定してください。 | Yes |
| `TEST_RUN_ID`      	| レポート取得に必要なテスト実行IDです。<br>IDはWallarmアカウント > **Test runs** およびテストモードで実行中のFASTノードのログに表示されます。<br>デフォルトでは、最後に実行されたテストのIDが使用されます。 | No |

<ol start="2"><li><code>-v {DIRECTORY_FOR_REPORTS}:/opt/reports/</code> オプションを使用して、レポート用フォルダーへのパスを渡します。</li></ol>

**reportモードでFASTノードDockerコンテナを実行するコマンドの例:**

```
docker run  --rm -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=qwe53UTb2 -e CI_MODE=report -e TEST_RUN_ID=9012 -v documents/reports:/opt/reports/ wallarm/fast
```

## レポートの取得

コマンドが正常に実行された場合、ターミナルにテスト実行の概要データが表示されます:

--8<-- "../include/fast/console-include/operations/node-in-ci-mode-report.md"

レポート生成が完了すると、`DIRECTORY_FOR_REPORTS`フォルダーに以下のレポートファイルが作成されます:

* `<TEST RUN NAME>.<UNIX TIME>.txt`
* `<TEST RUN NAME>.<UNIX TIME>.json`