# CI/CD上のOpenAPIセキュリティテスト <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarmが提供するCI/CD上のOpenAPIセキュリティテストは、シャドウAPIやゾンビAPIを含む重要なAPIのビジネスシナリオに内在するセキュリティ脆弱性を特定し、対処するためのソリューションを提供します。本記事では、このソリューションの実行方法と使用方法を説明します。

このソリューションは、Cross-Origin Resource sharing、パストラバーサル、アクセス制御の不備などの脆弱性を見つけるために特別に設計されたテストリクエストを生成して動作します。その後、Dockerを使用してCI/CDパイプラインにシームレスに統合され、これらの脆弱性についてAPIを自動スキャンします。

テスト対象とするエンドポイントを柔軟に選択できます。

* **エンドポイントの自動検出**: [WallarmのAPI Discovery](../api-discovery/overview.md)モジュールを活用する場合、実トラフィックデータからAPIエンドポイントが自動的に検出されます。検出されたエンドポイントのうち、どれをテストするかを選択できます。これにより、シャドウAPIやゾンビAPIを含む実際に使用されているエンドポイントにセキュリティテストの対象が絞られ、APIの脆弱性を正確に評価できます。
* **仕様の手動アップロード**: 代替として、独自のOpenAPI仕様をアップロードし、その仕様に含まれるエンドポイントをこのソリューションでテストできます。最新の仕様があり、その中で特定のエンドポイントに対してテストを実行したい場合に有用です。

## OpenAPIセキュリティテストで解決できる課題

* このソリューションにより、APIのリグレッションテスト中にセキュリティテストを実施できます。APIの機能に変更を加えた場合、Wallarmのセキュリティテストによって、変更によりセキュリティ上の問題が導入されていないかを明らかにできます。
* 変更をステージング環境にデプロイし、この段階のCI/CDパイプラインでセキュリティテストを実行することで、潜在的な脆弱性が本番に到達して攻撃者に悪用されることを防止できます。
* [API Discovery](../api-discovery/overview.md)から得られたデータに基づくセキュリティテストを活用する場合、シャドウAPIやゾンビAPIもテストされます。これらのAPIは、チームやドキュメントが存在を認識していなくてもトラフィックを受けている可能性があるため、モジュールによって自動的に発見されます。ゾンビAPIをセキュリティテストプロセスに含めることで、見落とされがちな脆弱性にも対処でき、より包括的なセキュリティ評価を提供します。

## 要件

* 有効な**Advanced API Security**の[サブスクリプションプラン](../about-wallarm/subscription-plans.md#core-subscription-plans)。別のプランをご利用の場合は、必要なプランに移行するために[営業チーム](mailto:sales@wallarm.com)までご連絡ください。

## セキュリティテストの実行

OpenAPI Security Testing機能を制御・カスタマイズするには、テストポリシーを利用します。テストポリシーを作成すると、Dockerを使用してCI/CDパイプラインにセキュリティテストを統合・実行できるコマンドが提供されます。

OpenAPIセキュリティテストを実行するには、次の手順に従います。

1. [US Cloud](https://us1.my.wallarm.com/security-testing)または[EU Cloud](https://my.wallarm.com/security-testing)のリンクからWallarm Console → **OpenAPI Testing**に進み、**Create testing policy**をクリックします。

    ![!Policy create](../images/user-guides/openapi-testing/create-testing-policy.png)
1. [自動検出された](../api-discovery/overview.md)APIインベントリからテストしたいAPIエンドポイントを選択するか、JSON形式のOpenAPI 3.0仕様をアップロードします。

    なお、API Discoveryモジュールは新しいエンドポイントを自動的に特定しますが、既存の脆弱性テストポリシーへ自動で追加はしません。そのため、新しく検出された各エンドポイントには個別のポリシーが必要です。
1. APIエンドポイントでテストしたい脆弱性の種類を選択します。
1. 必要に応じて、認証ヘッダーやWallarmのテストリクエストを示すヘッダーなど、脆弱性テスト用のカスタムヘッダーを追加します。

    これらのヘッダーは、すべてのエンドポイントへの各リクエストに使用されます。
1. 提供されたDockerコマンドをコピーし、自動で設定されなかった環境変数の値を入力します。
1. 自動テストのために、そのコマンドをCI/CDパイプラインに統合します。

Dockerコマンドの例:

=== "US Cloud"
    ```
    docker run -e WALLARM_API_HOST=us1.api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```
=== "EU Cloud"
    ```
    docker run -e WALLARM_API_HOST=api.wallarm.com -e WALLARM_API_TOKEN=${WALLARM_API_TOKEN} -e WALLARM_TESTING_POLICY_ID=7 -e TARGET_URL=${WALLARM_SCANNER_TARGET_URL} -v ${WALLARM_REPORT_PATH}:/app/reports --pull=always wallarm/oas-fast-scanner:latest
    ```

[Dockerコンテナ](https://hub.docker.com/r/wallarm/oas-fast-scanner)が受け付ける環境変数の一覧は以下のとおりです。

Environment variable | Description| Required?
--- | ---- | ----
`WALLARM_API_HOST` | Wallarm APIサーバー:<ul><li>US Cloudの場合は`us1.api.wallarm.com`</li><li>EU Cloudの場合は`api.wallarm.com`</li></ul> | Yes
`WALLARM_API_TOKEN` | **OpenAPI testing**権限を持つ[Wallarm APIトークン](../user-guides/settings/api-tokens.md)。 | Yes
`WALLARM_TESTING_POLICY_ID` | WallarmのテストポリシーID。ポリシー作成時に自動生成されます。 | Yes
`TARGET_URL` | テストしたいAPIエンドポイントがホストされているURLです。テストリクエストはこのホスト（例: ステージング、ローカルビルド）に送信されます。 | Yes

変数をコンテナへ渡す方法をより安全にするには、自動で設定されなかったコンテナ環境変数の値を、マシン上のローカル環境変数として保存することを推奨します。ターミナルで次のコマンドを実行します。

```
export WALLARM_API_TOKEN=<VALUE>
export WALLARM_SCANNER_TARGET_URL=<VALUE>
```

セキュリティテストの結果をホストマシンに保存するには、Dockerコマンドの`-v`オプション内の`${WALLARM_REPORT_PATH}`変数に、希望するホストマシンのパスを指定します。

## セキュリティテスト結果の解釈

セキュリティテストの実行時、Wallarmはテストポリシーで選択した脆弱性を明らかにするために設計された典型的なテストリクエストを連続的に生成します。これらのテストリクエストは、ポリシーで定義されたエンドポイントへ順番に送信されます。

生成したリクエストに対するレスポンスを分析することで、WallarmはAPIエンドポイントに存在する未解決の脆弱性を特定します。その結果はDockerコンテナの標準出力(stdout)で`0`または`1`のコードとして返されます。

* `0`は、未解決の脆弱性が検出されなかったことを示します。
* `1`は、未解決の脆弱性が存在することを示します。

特定の脆弱性で`1`のコードを受け取った場合は、適切な対策を講じることが重要です。

## セキュリティテストレポートの生成

脆弱性を露呈させたリクエストの詳細情報を提供するセキュリティレポートを取得できます。レポートはCSV、YAML、JSONなど複数の形式で生成されます。

セキュリティテストの結果をホストマシンに保存するには、Dockerコマンドの`-v ${WALLARM_REPORT_PATH}:/app/reports`オプション内の`${WALLARM_REPORT_PATH}`パスに、希望するホストマシンのパスを指定します。

Dockerコンテナがレポートファイルを正しく保存できるよう、指定したホストマシンのパスに適切な書き込み権限があることを確認してください。

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

既定では、セキュリティレポートはDockerコンテナ内の`/app/reports`ディレクトリに保存されます。`-v`オプションを使用すると、`/app/reports`の内容を指定したホストマシンのディレクトリにマウントします。

## セキュリティポリシーの管理

Wallarm Consoleの**OpenAPI Testing**セクションでは、アカウントに紐づくセキュリティテストポリシーの一覧を管理できます。サービス、チーム、目的、ローカルテストやステージングなどのテスト段階ごとに、異なるポリシーを使い分けることができます。

要件に合わせて、既存のポリシーを編集・削除できます。

![!Policies list](../images/user-guides/openapi-testing/testing-policies-list.png)