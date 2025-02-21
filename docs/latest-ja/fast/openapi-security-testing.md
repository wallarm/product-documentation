# CI/CD上のOpenAPIセキュリティテスト <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmが提供するCI/CD上のOpenAPIセキュリティテストは、シャドウAPIやゾンビAPIを含む重要なAPIビジネスシナリオにおけるセキュリティ脆弱性を特定し、対処するためのソリューションを提供します。本記事では、このソリューションの実行方法と使用方法について説明します。

このソリューションは、クロスオリジンリソース共有、パストラバーサル、アクセス制御の欠陥などの脆弱性を明らかにするために特別に設計されたテストリクエストを生成して動作します。その後、Dockerを使用してCI/CDパイプラインにシームレスに統合し、これらの脆弱性に対してAPIを自動的にスキャンします。

テスト対象のエンドポイントを選択する柔軟性が用意されています:

* **自動エンドポイント検出**: [WallarmのAPI Discovery](../api-discovery/overview.md)モジュールを利用する場合、実際のトラフィックデータからAPIエンドポイントが自動的に検出されます。その後、テストするエンドポイントを選択できます。これにより、シャドウAPIやゾンビAPIを含む、実際に使用されているエンドポイントに対してセキュリティテストを実施し、APIの脆弱性を正確に評価することが可能です。
* **手動での仕様書アップロード**: または、お手持ちのOpenAPI仕様書をアップロードし、仕様書に基づいたエンドポイントのテストを行うこともできます。こちらは最新の仕様書を所有していて、特定のエンドポイントに対してテストを実施したい場合に有用です。

## OpenAPIセキュリティテストで対処される課題

* 本ソリューションは、APIの回帰テスト中にセキュリティテストを実施することを可能にします。APIの機能に変更を加えた場合、Wallarmのセキュリティテストにより、変更がセキュリティ上の問題を引き起こしていないか確認できます。
* 変更をステージング環境に展開し、この段階でCI/CDパイプライン上でセキュリティテストを実施することで、潜在的なセキュリティ脆弱性が本番環境に到達し、攻撃者に悪用されるのを防ぐことができます。
* また、[API Discovery](../api-discovery/overview.md)から取得したデータに基づくセキュリティテストを利用する場合、シャドウAPIおよびゾンビAPIもテスト対象となります。これらのAPIは、チームやドキュメントで存在が把握されていなくても、トラフィックを受信するため、モジュールによって自動的に検出されます。ゾンビAPIをセキュリティテストプロセスに含めることで、見過ごされがちな脆弱性にも対処し、より包括的なセキュリティ評価を提供します。

## 要件

* 有効な**Advanced API Security**[サブスクリプションプラン](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security)が必要です。別のプランをご利用の場合、必要なプランへの移行について[営業チーム](mailto:sales@wallarm.com)にお問い合わせください。

## セキュリティテストの実行

OpenAPIセキュリティテスト機能を制御およびカスタマイズするために、テストポリシーを利用できます。テストポリシーが作成されると、Dockerを使用してCI/CDパイプラインに統合し、セキュリティテストを実行するためのコマンドが提供されます。

OpenAPIセキュリティテストを実行するには、次の手順に従ってください:

1. [US Cloud](https://us1.my.wallarm.com/security-testing)または[EU Cloud](https://my.wallarm.com/security-testing)のリンクからWallarm Consoleの**OpenAPI Testing**セクションに移動し、**Create testing policy**をクリックしてください。

    ![!ポリシー作成](../images/user-guides/openapi-testing/create-testing-policy.png)
1. [自動検出された](../api-discovery/overview.md)APIインベントリからテスト対象のAPIエンドポイントを選択するか、JSON形式のOpenAPI 3.0仕様書をアップロードしてください。

    API Discoveryモジュールは新しいエンドポイントを自動的に識別しますが、既存の脆弱性テストポリシーに自動的に追加されることはありません。そのため、各新たに検出されたエンドポイントには個別のポリシーが必要となります。
1. APIエンドポイントでテストする脆弱性の種類を選択してください。
1. 必要に応じて、認証ヘッダーやWallarmテストリクエスト用のインジケーターなど、脆弱性テストのためのカスタムヘッダーを追加してください。

    これらのヘッダーは各エンドポイントへの各リクエストで使用されます。
1. 提供されたDockerコマンドをコピーし、自動的に設定されなかった環境変数の値を入力してください。
1. このコマンドをCI/CDパイプラインに統合し、自動テストを実行してください。

The Docker command example:

=== "US Cloud"
    ```
    docker run -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```
=== "EU Cloud"
    ```
    docker run -e WALLARM_API_HOST=api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```

以下に、[Docker container](https://hub.docker.com/r/wallarm/oas-fast-scanner)が受け入れる環境変数の一覧を示します:

Environment variable | Description | Required?
--- | --- | ---
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul> | Yes
`WALLARM_API_TOKEN` | [Wallarm API token](../user-guides/settings/api-tokens.md)は、**OpenAPI testing**の権限が必要です。 | Yes
`WALLARM_TESTING_POLICY_ID` | WallarmテストポリシーID。ポリシー作成時に自動生成されます。 | Yes
`TARGET_URL` | テスト対象のAPIエンドポイントがホストされているURL。テストリクエストはこのホストに送信されます（例：ステージングまたはローカル環境）。 | Yes

コンテナに変数を渡す際、より安全な方法として、自動設定されなかったコンテナ環境変数の値をローカル環境変数として保存することを推奨します。以下のコマンドをターミナルで実行してください:

```
export WALLARM_API_TOKEN=<VALUE>
export WALLARM_SCANNER_TARGET_URL=<VALUE>
```

セキュリティテストの結果をホストマシンに保存するには、Dockerコマンドの`-v`オプション内に、`${WALLARM_REPORT_PATH}`変数に保存先のホストマシンのパスを指定してください。

## セキュリティテスト結果の解釈

セキュリティテストの実行時に、Wallarmはテストポリシーで選択した脆弱性を明らかにするために特別に設計された一連のテストリクエストを生成します。これらのテストリクエストは、ポリシーで定義された各エンドポイントに順次送信されます。

生成されたリクエストへのレスポンスを解析することで、WallarmはAPIエンドポイントに存在する脆弱性を特定します。その後、Dockerコンテナの標準出力（stdout）を通じて`0`または`1`のコードを返します:

* `0`コードは、脆弱性が検出されなかったことを示します。
* `1`コードは、脆弱性が存在することを示します。

特定の脆弱性について`1`コードが返された場合、適切な対応策を講じることが重要です。

## セキュリティテストレポートの生成

脆弱性が明らかになったリクエストに関する詳細情報を提供するセキュリティレポートを取得できます。レポートはCSV、YAML、JSONなどの複数の形式で生成されます。

セキュリティテスト結果をホストマシンに保存するには、Dockerコマンドの`-v ${WALLARM_REPORT_PATH}:/app/reports`オプション内の`${WALLARM_REPORT_PATH}`変数に目的のホストマシンパスを指定してください。

指定されたホストマシンパスに、Dockerコンテナがレポートファイルを正常に保存できるよう、適切な書き込み権限があることを確認してください。

JSONレポートの例:

```json
[
    {
        "type":"ptrav",
        "threat":80,
        "payload":"/../../../../../../../../../etc/passwd",
        "exploit_example":"curl -v -X GET -H 'x-test-id: 123' http://app:8000/files?path=/../../../../../../../../../etc/passwd\n\n{\"file_contents\":\"root:x:0:0:root:/root:/bin/bash\\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\\n",
        "name":"LFI-linux-replace",
        "path":"/files",
        "method":"get",
        "url":"http://app:8000"
    },
    {
        "type":"xss",
        "threat":60,
        "payload":"'wwra92w><wwra92w><",
        "exploit_example":"curl -v -X GET -H 'x-test-id: 123' http://app:8000/html_page?query='wwra92w><wwra92w><\n\n<html><body>'wwra92w><wwra92w><</body></html>",
        "name":"xss-html-injections",
        "path":"/html_page",
        "method":"get",
        "url":"http://app:8000"
    }
]
```

デフォルトでは、セキュリティレポートはDockerコンテナ内の`/app/reports`ディレクトリに保存されます。`-v`オプションを使用することで、`/app/reports`の内容が指定したホストマシンのディレクトリにマウントされます。

## セキュリティポリシーの管理

Wallarm Consoleの**OpenAPI Testing**セクションでは、アカウントに関連付けられたセキュリティテストポリシーの一覧を管理することができます。各ポリシーは、サービス、チーム、目的、ローカルテストやステージングなどのテスト段階ごとに使用可能です。

要件に応じて、既存のポリシーを編集および削除できます。

![!ポリシー一覧](../images/user-guides/openapi-testing/testing-policies-list.png)