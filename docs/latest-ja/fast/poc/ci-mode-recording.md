[doc-allowed-hosts]: ../operations/env-variables.md#limiting-the-number-of-requests-to-be-recorded
[doc-get-token]: prerequisites.md#anchor-token
[doc-concurrent-pipelines]: ci-mode-concurrent-pipelines.md
[doc-env-variables]: ../operations/env-variables.md

[anchor-recording-variables]: #environment-variables-in-recording-mode

[link-docker-compose]: https://docs.docker.com/compose/
[link-docker-compose-install]: https://docs.docker.com/compose/install/

# レコーディング モードでのFASTノードの実行

このモードでは、FASTノードはターゲットアプリケーションをテストする前に実行されます。

リクエストのソースはFASTノードをプロキシとして使用し、HTTPまたはHTTPSリクエストをターゲットアプリケーションに送信します。

FASTノードはプロキシ化されたリクエストの中からベースラインリクエストを決定し、テストレコードに格納します。

!!! info "Chapter Prerequisites"
    この章で説明されている手順を進めるためには、[トークン][doc-get-token]が必要です。

    この章全体で以下の値が例として使用されます。

    * `token_Qwe12345` トークンとして。
    * `rec_0001` テストレコードの識別子として。

!!! info "Install `docker-compose`"
    [`docker-compose`][link-docker-compose] ツールは、この章全体でFASTノードがレコーディングモードでどのように動作するかを示すために使用されます。

    このツールのインストール手順は [ここ][link-docker-compose-install] で利用可能です。

## レコーディング モードでの環境変数

FASTノードの設定は環境変数を介して行われます。以下のテーブルには、レコーディングモードのFASTノードを設定するために使用できるすべての環境変数が掲載されています。

| 環境変数 | 値 | 必須? |
|-------------------- | -------- | ----------- |
| `WALLARM_API_TOKEN`   | ノードのためのトークン. | はい |
| `WALLARM_API_HOST`    | 使用するWallarm API サーバのドメイン名。 <br>許可される値： <br>`us1.api.wallarm.com` USクラウド用;<br>`api.wallarm.com` EUクラウド用.| はい |
| `CI_MODE`           | FASTノードの運用モード。 <br>必要な値： `recording`。 | はい |
| `TEST_RECORD_NAME`    | 新規テストレコードを作成するための名前。 <br>デフォルト値は以下の形式で表示されます： "TestRecord Oct 08 12:18 UTC". | いいえ |
| `INACTIVITY_TIMEOUT` | ベースラインリクエストが`INACTIVITY_TIMEOUT`内にFASTノードに到着しない場合、レコーディングプロセスとFASTノードが停止します。<br>許可される値の範囲： 1から691200秒（1週間）<br>デフォルト値： 600秒（10分）。 | いいえ |
| `ALLOWED_HOSTS`       | FASTノードは環境変数にリストされたホストを対象にしたリクエストを記録します。 <br>デフォルト値： 空の文字列（すべての着信リクエストが記録されます）。詳細については [この][doc-allowed-hosts] 文書を参照してください。| いいえ |
| `BUILD_ID` | CI/CDワークフローの識別子。この識別子を使用すると、複数のFASTノードが同じクラウドFASTノードを使用して同時に作業することができます。詳細については [この][doc-concurrent-pipelines] 文書を参照してください。| いいえ |

!!! info "See also"
    特定のFASTノードの運用モードに特有でない環境変数の説明は [ここ][doc-env-variables] で利用可能です。

## レコードモードでのFASTノードの展開

サンプルの `docker-compose.yaml` 設定ファイルは、FASTがレコーディングモードでどのように動作するかを示すために使用されます (`CI_MODE` 環境変数の値に注目してください)：

```
version: '3'
  services:
    fast:                                        
      image: wallarm/fast
      environment:
        WALLARM_API_TOKEN: token_Qwe12345        # ここにトークン値を指定します
        WALLARM_API_HOST: us1.api.wallarm.com    # ここではUSクラウドAPIサーバを使用します。EUクラウドAPIサーバにはapi.wallarm.comを使用します。
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

`docker-compose.yaml` ファイルが含まれるディレクトリに移動して、`docker-compose up fast` コマンドを実行すると、FASTノードとともにDockerコンテナが起動します。

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
 [info] Node connected to Wallarm Cloud
 [info] Loaded 0 custom extensions for fast scanner
 [info] Loaded 44 default extensions for fast scanner
 [info] TestRecord#rec_0001 TestRecord Oct 01 01:01 UTC starts to record

```

この出力により、FASTノードが正常にWallarmクラウドに接続し、`rec_0001` 識別子と `TestRecord Oct 01 01:01 UTC` の名前を持つテストレコードを作成したことが分かります。そして、リクエストの受信とベースラインリクエストの記録ができる状態になります。

!!! info "A Note on Test Record Names"
    デフォルトのテストレコード名を変更するには、FASTノードDockerコンテナを起動するときに `TEST_RECORD_NAME` 環境変数を経由して必要な値を渡す必要があります。

!!! warning "Test Execution"
    いまこそターゲットアプリケーションに対して既存のテストを実行する時です。FASTはベースラインリクエストを記録し、それらでテストレコードを増やします。

## レコーディング モードのFASTノードを含むDockerコンテナの停止と削除

すべての必要なベースラインリクエストが記録されると、FASTノードはCI/CDツールによってシャットダウンされ、終了コードが返されます。

FASTノードにエラーがなく、ベースラインの記録プロセスが正常に終了した場合、`0` の終了コードが返されます。

FASTノードにエラーが発生した場合、またはベースラインの記録プロセスがタイムアウトにより停止した場合（[`INACTIVITY_TIMEOUT`][anchor-recording-variables] 環境変数の説明を参照してください）には、FASTノードは自動的に停止し、`1` の終了コードが返されます。

FASTノードが作業を終えると、対応するDockerコンテナを停止し、削除する必要があります。

FASTノードが`1`の終了コードで自動停止しなくても、すべての必要なベースラインリクエストが記録された場合、`docker-compose stop <container's name>` コマンドを実行して、FASTノードのDockerコンテナを停止することができます：

```
docker-compose stop fast
```

FASTノードコンテナを削除するには、 `docker-compose rm <container's name>` コマンドを実行します:

```
docker-compose rm fast
```

上記の例では、`fast` が停止または削除するDockerコンテナの名前として使用されています。

あるいは、`docker-compose down` コマンドを使用して、 `docker-compose.yaml` ファイルで記述されたすべてのサービスのコンテナを停止および削除することもできます。