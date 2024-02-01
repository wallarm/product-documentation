# アタックは Wallarm クラウドにアップロードされません

トラフィックからの攻撃が Wallarm クラウドにアップロードされず、その結果、Wallarm コンソール UI に表示されない場合、この記事を使って問題をデバッグします。

問題をデバッグするには、以下の手順を順番に実行します：

1. さらなるデバッグを行うために、悪意のあるトラフィックを生成します。
1. フィルタリングノードの動作モードを確認します。
1. Tarantool に十分なリソースがあるかどうかを確認します。
1. ログをキャプチャして、それらを Wallarm のサポートチームと共有します。

## 1. 悪意のあるトラフィックを生成する

Wallarmモジュールのさらなるデバッグを行うには：

1. 次の悪意のあるトラフィックを送信します：

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    `<FILTERING_NODE_IP>` を確認したいフィルタリングノードのIPに置き換えます。必要に応じて、コマンドに`Host:` ヘッダーを追加します。
1. アタックが Wallarm コンソール → **イベント**に表示されるまで最大2分待ちます。全ての 100 のリクエストが表示されれば、フィルタリングノードは正常に動作しています。
1. インストールしたフィルタリングノードと同じサーバーに接続し、[node metrics](../admin-en/monitoring/intro.md)を取得します：

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    以降、`wallarm-status` の出力を参照します。

## 2. フィルタリングノードの動作モードを確認する

フィルタリングノードの動作モードを以下のように確認します：

1. フィルタリングノードの[mode](../admin-en/configure-wallarm-mode.md)が `off` と異なることを確認します。 ノードは `off` モードでは受信トラフィックを処理しません。

    `off` モードは、 `wallarm-status` メトリクスが増加しない一般的な理由です。
1. Wallarm ノードの設定が適用されていることを確認するために、NGINXを再起動します (ノードが DEB/RPM パッケージからインストールされている場合)：

    --8<-- "../include-ja/waf/restart-nginx-3.6.md"
1. 攻撃がまだクラウドにアップロードされていないことを確認するために、再度[Generate](#1-generate-some-malicious-traffic)悪意のあるトラフィックを生成します。

## 3. Tarantoolに十分なリソースがあることを確認する

以下の基本的な Tarantool メトリクスは、攻撃のエクスポートに関連した Tarantool の問題を示しています：

- `wallarm.stat.export_delay` は、Wallarm クラウドへの攻撃のアップロード遅延（秒単位）です。
- `wallarm.stat.timeframe_size` は、Tarantoolがリクエストを保持する時間間隔（秒単位）です。
- `wallarm.stat.dropped_before_export` は、Wallarm クラウドへのアップロードに十分な時間がなかったヒットの数です。

メトリクスを表示するには：

1. インストールした postanalytics モジュール（Tarantool）と同じサーバーに接続します。
1. 以下のコマンドを実行します：

    ```bash
    wtarantool
    require('console').connect('127.0.0.1:3313')
    wallarm.stat.export_delay()
    wallarm.stat.timeframe_size()
    wallarm.stat.dropped_before_export()
    ```

`wallarm.stat.dropped_before_export` の値が `0` と異なる場合：

- [Increase](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) Tarantoolのために割り当てたメモリの量を増やします（`wallarm.stat.timeframe_size`が 10 分以下の場合）。

    !!! info "推奨メモリ"
         ピーク負荷時に `wallarm.stat.timeframe_size` メトリックが `300` 秒以下にならないように、Tarantool用に割り当てるメモリを調整することを推奨します。

- `/etc/wallarm/node.yaml` → `export_attacks` に `export_attacks` ハンドラの数を増やします。例えば：

    ```yaml
    export_attacks:
      threads: 5
      api_chunk: 20
    ```

    `export_attacks` の設定はデフォルトで以下の通りです：

    * `threads: 2`
    * `api_chunk: 10`

## 4. ログをキャプチャし、それらを Wallarm のサポートチームと共有する

上記の手順で問題が解決しない場合は、ノードのログをキャプチャし、それらを次のように Wallarm のサポートチームと共有してください：

1. インストールされた Wallarm ノードと同じサーバーに接続します。
1. `wallarm-status` の出力を次のように取得します：

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    出力をコピーします。
1. Wallarm の診断スクリプトを実行します：

    ```bash
    sudo /usr/share/wallarm-common/collect-info.sh
    ```

    生成されたログファイルを取得します。
1. すべての収集データを、さらなる調査のために、[Wallarm のサポートチーム](mailto:support@wallarm.com)に送信します。