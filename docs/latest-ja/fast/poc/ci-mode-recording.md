[doc-allowed-hosts]:                ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]:                    prerequisites.md#anchor-token
[doc-concurrent-pipelines]:         ci-mode-concurrent-pipelines.md
[doc-env-variables]:                ../operations/env-variables.md

[anchor-recording-variables]:       #environment-variables-in-recording-mode

[link-docker-compose]:              https://docs.docker.com/compose/
[link-docker-compose-install]:      https://docs.docker.com/compose/install/

# 記録モードでFAST nodeを実行する

このモードでは、FAST nodeは対象アプリケーションのテストの前に起動します。

リクエストの送信元はFAST nodeをプロキシとして使用するように設定し、対象アプリケーションへHTTPまたはHTTPSリクエストを送信します。

FAST nodeはプロキシされたリクエストの中からベースラインリクエストを判定し、テストレコードに格納します。 

!!! info "本章の前提条件"
    本章の手順に従うには、[トークン][doc-get-token]を取得する必要があります。
    
    本章では以下の値を例として使用します。

    * `token_Qwe12345`をトークンとして使用します。
    * `rec_0001`をテストレコードの識別子として使用します。

!!! info "`docker-compose`のインストール"
    本章を通して[`docker-compose`][link-docker-compose]ツールを使用して、記録モードにおけるFAST nodeの動作を示します。
    
    このツールのインストール手順は[こちら][link-docker-compose-install]にあります。

## 記録モードの環境変数 {#environment-variables-in-recording-mode}

FAST nodeの設定は環境変数で行います。以下の表に、記録モードのFAST nodeの設定に使用できるすべての環境変数を示します。

| 環境変数   | 値  | 必須? |
|--------------------	| --------	| -----------	|
| `WALLARM_API_TOKEN`  	| ノード用のトークンです。 | はい |
| `WALLARM_API_HOST`   	| 使用するWallarm APIサーバーのドメイン名です。<br>許可される値:<br>`us1.api.wallarm.com`はUS cloudで使用します。<br>`api.wallarm.com`はEU cloudで使用します。| はい |
| `CI_MODE`            	| FAST nodeの動作モードです。<br>必要な値: `recording`。 | はい |
| `TEST_RECORD_NAME`   	| 作成する新しいテストレコードの名前です。<br>デフォルト値は次のような形式です: “TestRecord Oct 08 12:18 UTC”。 | いいえ |
| `INACTIVITY_TIMEOUT` 	| `INACTIVITY_TIMEOUT`間隔内にFAST nodeへベースラインリクエストが届かない場合、記録プロセスはFAST nodeとともに停止します。<br>許容値の範囲: 1〜691200秒（1週間）<br>デフォルト値: 600秒（10分）。 | いいえ |
| `ALLOWED_HOSTS`       | この環境変数に列挙されたいずれかのホストを宛先とするリクエストをFAST nodeが記録します。<br>デフォルト値: 空文字列（すべての受信リクエストを記録します）。詳細は[こちら][doc-allowed-hosts]をご覧ください。| いいえ |
| `BUILD_ID` | CI/CDワークフローの識別子です。この識別子により、同じクラウド上のFAST nodeを使用して複数のFAST nodeを同時に動作させることができます。詳細は[こちら][doc-concurrent-pipelines]をご覧ください。| いいえ |

!!! info "関連情報"
    特定のFAST nodeの動作モードに依存しない環境変数の説明は[こちら][doc-env-variables]にあります。

## 記録モードでのFAST nodeのデプロイ

以下では、記録モードでのFAST nodeの動作を示すための`docker-compose.yaml`サンプル構成ファイルを使用します（`CI_MODE`環境変数の値に注意してください）。

```
version: '3'
  services:
    fast:                                        
      image: wallarm/fast
      environment:
        WALLARM_API_TOKEN: token_Qwe12345        # ここにトークン値を指定します
        WALLARM_API_HOST: us1.api.wallarm.com    # ここではUS cloudのAPIサーバーを使用します。EU cloudのAPIサーバーを使用する場合はapi.wallarm.comを指定します。
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

FAST nodeのDockerコンテナを実行するには、`docker-compose.yaml`ファイルがあるディレクトリに移動し、`docker-compose up fast`コマンドを実行します。

コマンドが正常に実行されると、次のようなコンソール出力が表示されます。

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

この出力から、FAST nodeがWallarm cloudに正常に接続し、識別子`rec_0001`、名前`TestRecord Oct 01 01:01 UTC.`のテストレコードを作成したことが分かります。これでリクエストの受信とベースラインリクエストの記録を行う準備ができています。

!!! info "テストレコード名に関する注意"
    デフォルトのテストレコード名を変更するには、FAST nodeのDockerコンテナを起動する際に、`TEST_RECORD_NAME`環境変数で必要な値を渡します。

!!! warning "テストの実行"
    ここで、対象アプリケーションに対して既存のテストを実施します。FASTはベースラインリクエストを記録し、それらをテストレコードに追加します。

## 記録モードのFAST nodeのDockerコンテナの停止と削除

必要なベースラインリクエストがすべて記録されると、CI/CDツールによってFAST nodeがシャットダウンされ、終了コードを返します。

エラーが発生せず、ベースラインの記録処理が正常に完了した場合は、終了コード`0`を返します。

エラーが発生した場合、またはタイムアウトによりベースラインの記録処理が停止した場合（[`INACTIVITY_TIMEOUT`][anchor-recording-variables]環境変数の説明を参照）、FAST nodeは自動的に停止し、終了コード`1`を返します。

FAST nodeの処理が終了したら、対応するDockerコンテナを停止して削除する必要があります。

終了コード`1`で自動停止しないものの、必要なベースラインリクエストがすべて記録されている場合は、`docker-compose stop <container's name>`コマンドを実行してFAST nodeのDockerコンテナを停止できます:

```
docker-compose stop fast
```

FAST nodeのコンテナを削除するには、`docker-compose rm <container's name>`コマンドを実行します:

```
docker-compose rm fast
```

上記の例では、停止または削除するDockerコンテナ名として`fast`を使用しています。

代わりに、`docker-compose.yaml`ファイルで定義されているすべてのサービスのコンテナを停止して削除する`docker-compose down`コマンドを使用できます。