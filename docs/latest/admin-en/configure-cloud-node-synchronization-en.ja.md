# フィルタリングノードとWallarmクラウドの同期設定

フィルタリングノードは定期的にWallarmクラウドと同期して以下を実現します。

* [トラフィック処理ルール（LOM）](../about-wallarm/protecting-against-attacks.ja.md#custom-rules-for-request-analysis)の更新を取得
* [proton.db](../about-wallarm/protecting-against-attacks.ja.md#library-libproton)の更新を取得
* 検出された攻撃と脆弱性のデータを送信
* 処理されたトラフィックのメトリクスを送信

この指示では、フィルタリングノードとWallarmクラウドの同期設定に使用されるパラメータと方法について説明しています。

パラメータのセットとその設定方法は、展開されたWallarmノードタイプに依存します。

* `addcloudnode`スクリプトによって作成された**クラウドフィルタリングノード**
* `addnode`スクリプトによって作成された**通常のフィルタリングノード**

## クラウドノードとWallarmクラウドの同期

`/etc/wallarm/syncnode`ファイルには、クラウドフィルタリングノードがWallarmクラウドと同期する方法を定義する環境変数が含まれています。`WALLARM_API_TOKEN`という変数を含む`/etc/wallarm/syncnode`ファイルが`addcloudnode`スクリプト実行後に作成されます。

`wallarm-synccloud`サービスは、`/etc/wallarm/syncnode`ファイルに対する変更を同期プロセスに適用し、新たな設定で同期を実行します。

### 使用可能な環境変数

以下に、クラウドノードとWallarmクラウド同期設定用の使用可能な環境変数のリストを提供します。使用可能な環境変数のリストを取得するには、以下のコマンドを実行します。

```
/usr/share/wallarm-common/synccloud  --help
```

| 変数                             | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `WALLARM_API_HOST`               | Wallarm APIエンドポイント。以下のようになります:<ul><li>`us1.api.wallarm.com`（USクラウド用）</li><li>`api.wallarm.com`（EUクラウド用）</li></ul>デフォルト値は`api.wallarm.com`です。<br>この変数は、ファイル`/etc/wallarm/syncnode`内で**必ず設定**する必要があります。                                                                                                                                                                                                                               |
| `WALLARM_API_PORT`               | Wallarm APIポート。デフォルト値は`443`です。                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `WALLARM_API_TOKEN`              | Wallarm APIにアクセスするためのクラウドノードトークン。                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `WALLARM_API_CA_VERIFY`          | Wallarm APIサーバー証明書の検証を有効/無効にするかどうか。以下のようになります:<ul><li>`true`、`yes`、および`1`は検証を有効にする</li><li>その他の値は検証を無効にする</li></ul>デフォルト値は`yes`です。                                                                                                                                                                                                                                                                                          |
| `WALLARM_API_CA_PATH`            | Wallarm API認証局ファイルへのパス。                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `WALLARM_SYNCNODE`               | Wallarmノード固有データの同期を有効/無効にするかどうか。同期が有効になっている場合、クラウドノードの動作に必要なファイル（たとえば、[LOMファイル](../glossary-en.ja.md#custom-ruleset-the-former-term-is-lom)）は定期的にクラウドからダウンロードされます。同期が無効になっている場合、クラウドノードの動作に必要なファイルはダウンロードされません。以下のようになります:<ul><li>`true`、`yes`、および`1`は同期を有効にする</li><li>その他の値は同期を無効にする</li></ul>デフォルト値は`yes`です。 |
| `WALLARM_SYNCNODE_INTERVAL`      | フィルタリングノードとWallarmクラウドの同期間隔（秒）。値はデフォルト値より小さくすることはできません。デフォルト値は`120`です。                                                                                                                                                                                                                                                                                                                                                                   |
| `WALLARM_SYNCNODE_RAND_DELAY`    | 同期遅延ジッタ（秒）。デフォルト値は`120`です。                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `WALLARM_SYNCNODE_TIMEOUT`       | 同期持続時間の制限。この制限により、クラウドノード操作のためのファイルのダウンロードプロセス中に問題が発生した場合に同期を中断できます。たとえば、ネットワーク障害によってこのような問題が発生することがあります。デフォルト値は`900`です。                                                                                                                                                                                                                                                                           |
| `WALLARM_SYNCNODE_OWNER`<br>`WALLARM_SYNCNODE_GROUP`<br>`WALLARM_SYNCNODE_MODE` | [ノード操作に必要なファイルへのアクセス権](#access-rights-to-files-needed-for-node-operation)を参照してください。  |### 同期パラメーターの設定

同期パラメータを変更するには、以下の手順を実行します。

1. `/etc/wallarm/syncnode`ファイルを変更して、必要な[環境変数](#available-environment-variables)を追加し、それらに望ましい値を割り当てます。

    有効な`/etc/wallarm/syncnode`の内容：

    ```bash
    WALLARM_API_TOKEN=K85iHWi0SXRxJTb+xxxxxxxxxxxxxxxxxxxxfiwo9twr9I5/+sjZ9v2UlRRgwwMD
    WALLARM_SYNCNODE_INTERVAL=800
    WALLARM_SYNCNODE_TIMEOUT=600
    ```
2. 同期プロセスに更新された設定を適用するために、`wallarm-synccloud`サービスを再起動します。

    ```bash
    sudo /bin/systemctl restart wallarm-synccloud
    ```

    このサービスは、`/etc/wallarm/syncnode`ファイル内の環境変数に割り当てられた値を、クラウドノードとWallarm Cloud同期の新しいパラメータとして適用します。コマンドの実行後、フィルタリングノードは新しいパラメータに従って同期処理を実行します。

## 通常のノードとWallarm Cloudの同期

通常のフィルタリングノードとWallarm Cloudの同期設定は次の方法で設定されます。

* [Wallarm Cloudへのアクセスのための認証情報](#credentials-to-access-the-wallarm-cloud)は、`node.yaml`ファイルに設定されます。通常のフィルタリングノード名とUUID、およびWallarm APIへのアクセスのための秘密鍵が含まれる`node.yaml`ファイルは、`addnode`スクリプトの実行後に作成されます。

    ファイルへのデフォルトのパスは`/etc/wallarm/node.yaml`です。このパスは、[`wallarm_api_conf`](configure-parameters-en.ja.md#wallarm_api_conf)ディレクティブを介して変更することができます。
* [フィルタリングノードとWallarm Cloud同期間隔](#interval-between-filtering-node-and-wallarm-cloud-synchronizations)は、システム環境変数`WALLARM_SYNCNODE_INTERVAL`を介して設定されます。変数値は`/etc/environment`ファイルで設定する必要があります。デフォルトの変数値は`120`秒です。

### Wallarm Cloudへのアクセスのための認証情報

`node.yaml`ファイルには、通常のフィルタリングノードへのアクセスのためのWallarm Cloudへのアクセスを許可する以下のパラメータが含まれることがあります。:

| パラメータ          | 説明                                                                                                                                                                                                                                                                 |
|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `hostname`       | 通常のノード名。この変数は、ファイル`node.yaml`に**必須**設定です。                                                                                                                                                                                                       |
| `uuid`           | 通常のノードUUID。この変数は、ファイル`node.yaml`に**必須**設定です。                                                                                                                                                                        |
| `secret`         | Wallarm APIにアクセスするための秘密鍵。この変数は、ファイル`node.yaml`に**必須**設定です。                                                                                                                                                     |
| `api.host`       | Wallarm APIエンドポイント。以下の値が使用可能です。<ul><li>`us1.api.wallarm.com`（米国クラウド用）</li><li>`api.wallarm.com`（EUクラウド用）</li></ul>デフォルト値は`api.wallarm.com`です。          |
| `api.port`       | Wallarm APIポート。デフォルト値は`443`です。                                                                                                                                                                                                                   |
| `api.ca_verify`  | Wallarm APIサーバー証明書の検証を有効/無効にするかどうか。以下の値が使用可能です：<ul><li>`true`：検証を有効にする</li><li>`false`：検証を無効にする</li></ul>デフォルト値は`true`です。          |
| `api.local_host` | Wallarm APIへのリクエストを送信するネットワークインターフェイスのローカルIPアドレス。デフォルトで使用されるネットワークインターフェースがWallarm APIへのアクセスを制限している場合（例：インターネットへのアクセスが閉じられている場合）、このパラメータが必要です。|
| `api.local_port` | Wallarm APIへのリクエストを送信するネットワークインターフェイスのポート。デフォルトで使用されるネットワークインターフェースがWallarm APIへのアクセスを制限している場合（例：インターネットへのアクセスが閉じられている場合）、このパラメータが必要です。|
| `syncnode.owner`<br>`syncnode.group`<br>`syncnode.mode` | ノード操作に必要なファイルへのアクセス権については、[Access rights to files needed for node operation](#access-rights-to-files-needed-for-node-operation)を参照してください。 |

同期パラメータを変更するには、以下の手順を実行します。

1. `node.yaml`ファイルを変更して、必要な[パラメータ](#credentials-to-access-the-wallarm-cloud)を追加し、それらに望ましい値を割り当てます。

    有効な`node.yaml`の内容：

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    secret: b827axxxxxxxxxxxcbe45c855c71389a2a5564920xxxxxxxxxxxxxxxxxxc4613260

    api:
      host: api.wallarm.com
      port: 443
      ca_verify: true

    syncnode:
      owner: root
      group: wallarm
      mode: 0640
    ```
2. 同期プロセスに更新された設定を適用するために、NGINXを再起動します。

    --8<-- "../include/waf/restart-nginx-3.6.ja.md"

### フィルタリングノードとWallarm Cloudの同期間隔

デフォルトでは、フィルタリングノードはWallarm Cloudと120-240秒ごと（2-4分ごと）に同期します。同期間隔は、システム環境変数`WALLARM_SYNCNODE_INTERVAL`で変更できます。

通常のフィルタリングノードとWallarm Cloudの同期間隔を変更する方法：

1. `/etc/environment`ファイルを開きます。
2. `WALLARM_SYNCNODE_INTERVAL`変数をファイルに追加し、変数に秒単位で希望する値を設定します。値はデフォルト値（`120`秒）より小さくすることはできません。例：

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. 変更されたファイル`/etc/environment`を保存します。新しい間隔の値は自動的に同期プロセスに適用されます。ファイルへのアクセス権については、以下のとおりです。

| パラメータ    | 説明 | `/etc/wallarm/syncnode`ファイルの環境変数（クラウドノード） | `node.yaml`ファイルのパラメータ（通常のノード）|
|--------------|-------------| -------------| -------------|
| `owner`      | フィルタリングノードの動作に必要なファイルの所有者 | `WALLARM_SYNCNODE_OWNER` | `syncnode.owner` |
| `group`      | フィルタリングノードの動作に必要なファイルのグループ | `WALLARM_SYNCNODE_GROUP` | `syncnode.group` |
| `mode`       | フィルタリングノードの動作に必要なファイルへのアクセス権 | `WALLARM_SYNCNODE_MODE` | `syncnode.mode`  |

アルゴリズムは、以下の手順を実行してファイルへの権限を検索します（結果が得られない場合に次の手順に移動します）。

1. 明示的に設定された変数/パラメータ：

    === "クラウドノードの場合"

        1. `/etc/wallarm/syncnode`ファイル内の`WALLARM_SYNCNODE_(OWNER,GROUP,MODE)`環境変数。

    === "通常のノードの場合"

        1. `node.yaml`ファイル内の`syncnode.(TYPE).(user,group,mode)`パラメータ。

            `（TYPE）`で、パラメータが設定される特定のファイルを指定できます。可能な値は`proton.db`または`lom`です。

            !!! warning "`lom` value meaning"
                `lom`の値が、`/etc/wallarm/custom_ruleset`ファイルの[カスタムルールセット](../user-guides/rules/compiling.ja.md)を指していることに注意してください。
        1. `node.yaml`ファイル内の`syncnode.(user,group,mode)`パラメータ。
1. NGINXベースのインストールの場合、`/usr/share/wallarm-common/engine/*`ファイル内の`nginx_group`の値。

    すべてのインストール済みエンジンパッケージは、`nginx_group=<VALUE>`が含まれるファイル`/usr/share/wallarm-common/engine/*`を提供します。

    モジュールがある各パッケージは、それが意図したNGINXに応じた`group`パラメータの値を設定します：

    * nginx.orgからのNGINX用のモジュールは、`group`を`nginx`に設定します。
    * NGINXディストリビューション用のモジュールは、`group`を`www-data`に設定します。
    * カスタムモジュールは、クライアントが提供する値を使用します。
1. デフォルト値：
    * `owner`： `root`
    * `group`： `wallarm`
    * `mode`： `0640`

アルゴリズムが自動的に達成した結果が要件を満たしていない場合にのみ、アクセス権を明示的に設定する必要があります。アクセス権を設定した後、 `wallarm-worker`および`nginx`サービスが、フィルタリングノードの動作に必要なファイルの内容を読むことができることを確認してください。