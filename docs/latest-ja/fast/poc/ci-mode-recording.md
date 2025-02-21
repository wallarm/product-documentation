```markdown
[doc-allowed-hosts]:                ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[anchor-recording-variables]:       #environment-variables-in-recording-mode

[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

# 記録モードでFASTノードを実行する

このモードでは、テスト対象アプリケーションのテスト前にFASTノードが実行されます。

リクエストの送信元はFASTノードをプロキシとして使用するように設定され、テスト対象アプリケーションへHTTPまたはHTTPSリクエストを送信します。

FASTノードはプロキシ経由のリクエストの中から基本リクエストを判別し、それらをテストレコードに配置します。

!!! info "章の前提条件"
    この章に記載の手順に従うには、[token][doc-get-token]を取得する必要があります。
    
    この章全体で例として使用する値は以下の通りです:

    * `token_Qwe12345` をトークンとして使用します。
    * `rec_0001` をテストレコードの識別子として使用します。

!!! info "「docker-compose」のインストール"
    この章では、FASTノードが記録モードで動作する様子を実演するために[`docker-compose`][link-docker-compose]ツールを使用します。
    
    このツールのインストール手順は[こちら][link-docker-compose-install]でご確認いただけます。

## 記録モードにおける環境変数

FASTノードの設定は環境変数で行います。以下の表は記録モードでFASTノードを構成するために使用可能なすべての環境変数を示しています。

| 環境変数                | 値  | 必須? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| ノード用のトークン。 | Yes |
| `WALLARM_API_HOST`   	| 利用するWallarm APIサーバのドメイン名。<br>許可される値: <br>`us1.api.wallarm.com`（USクラウド利用時）<br>`api.wallarm.com`（EUクラウド利用時）。| Yes |
| `CI_MODE`            	| FASTノードの動作モード。<br>必須値: `recording`。 | Yes |
| `TEST_RECORD_NAME`   	| 新たに作成するテストレコードの名称。<br>デフォルト値は「TestRecord Oct 08 12:18 UTC」のような形式です。 | No |
| `INACTIVITY_TIMEOUT` 	| `INACTIVITY_TIMEOUT`間隔内に基本リクエストがFASTノードに到着しない場合、記録プロセスが停止し、FASTノードも停止します。<br>許容値: 1～691200秒（1週間）<br>デフォルト値: 600秒（10分）。 | No |
| `ALLOWED_HOSTS`       | 環境変数に記載された任意のホストをターゲットとするリクエストのみFASTノードが記録します。<br>デフォルト値: 空文字列（すべての受信リクエストを記録）。詳細は[こちら][doc-allowed-hosts]をご参照ください。| No |
| `BUILD_ID`            | CI/CDワークフローの識別子。この識別子により、複数のFASTノードが同一のクラウドFASTノードを利用して並行実行できます。詳細は[こちら][doc-concurrent-pipelines]をご参照ください。| No |

!!! info "詳細はこちら"
    特定のFASTノード動作モードに限定されない環境変数の説明は[こちら][doc-env-variables]に記載されています。

## 記録モードでのFASTノードのデプロイ

下記のサンプル`docker-compose.yaml`構成ファイルは、FASTが記録モードでどのように動作するかを実演するためのものです（`CI_MODE`環境変数の値に注目してください）:

```
version: '3'
  services:
    fast:                                        
      image: wallarm/fast
      environment:
        WALLARM_API_TOKEN: token_Qwe12345        # ここにトークン値を指定します
        WALLARM_API_HOST: us1.api.wallarm.com    # ここではUSクラウドAPIサーバが使用されています。EUクラウドAPIサーバを利用する場合はapi.wallarm.comを使用してください。
        CI_MODE: recording
      ports:
        - '8080:8080'                              
      networks:
        main:
          aliases:
            - fast

networks:
  main:
```

`docker-compose.yaml`ファイルがあるディレクトリに移動し、`docker-compose up fast`コマンドを実行することでDockerコンテナ上でFASTノードを実行できます。

コマンドが正常に実行されると、以下のようなコンソール出力が表示されます:

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
 [info] Node connected to Wallarm Cloud
 [info] Loaded 0 custom extensions for fast scanner
 [info] Loaded 44 default extensions for fast scanner
 [info] TestRecord#rec_0001 TestRecord Oct 01 01:01 UTC starts to record

```

この出力は、FASTノードが正常にWallarm Cloudへ接続し、`rec_0001`識別子と`TestRecord Oct 01 01:01 UTC`という名前のテストレコードを作成したことを示しています。これにより、リクエストの受信と基本リクエストの記録を開始できる状態となっております。

!!! info "テストレコード名称についての注意"
    デフォルトのテストレコード名称を変更するには、FASTノードのDockerコンテナ起動時に`TEST_RECORD_NAME`環境変数を介して必要な値を渡す必要があります。

!!! warning "テスト実行"
    ここで、テスト対象アプリケーションへの既存のテストを実施する時期となります。FASTは基本リクエストを記録し、テストレコードに反映させます。

## 記録モードでのFASTノードを含むDockerコンテナの停止と削除

必要な基本リクエストがすべて記録されると、CI/CDツールによりFASTノードが停止され、終了コードが返されます。

FASTノードがエラーなく基本リクエストの記録プロセスを正常に完了した場合は、`0`の終了コードが返されます。

FASTノードがエラーを検知した場合や、基本リクエストの記録プロセスがタイムアウト（[`INACTIVITY_TIMEOUT`][anchor-recording-variables]環境変数の記述を参照）により停止された場合は、FASTノードが自動的に停止し、`1`の終了コードが返されます。

FASTノードの処理が完了したら、該当するDockerコンテナを停止し削除する必要があります。

FASTノードが`1`の終了コードで自動的に停止せず、必要な基本リクエストがすべて記録された場合は、`docker-compose stop <コンテナ名>`コマンドを実行してFASTノードのDockerコンテナを停止することができます:

```
docker-compose stop fast
```

FASTノードのコンテナを削除するには、`docker-compose rm <コンテナ名>`コマンドを実行します:

```
docker-compose rm fast
```

上記の例では、`fast`が停止または削除するDockerコンテナの名称として使用されています。

または、`docker-compose.yaml`ファイルに記述されたすべてのサービスのコンテナを停止・削除する`docker-compose down`コマンドを使用することも可能です。
```