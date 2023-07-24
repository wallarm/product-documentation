# Wallarm Cloudに攻撃がアップロードされない

トラフィックからの攻撃がWallarm Cloudにアップロードされず、結果としてWallarmコンソールUIに表示されないと疑われる場合は、この記事を使用して問題をデバッグしてください。

問題をデバッグするには、以下の手順を順番に実行します。

1. さらなるデバッグのために悪意のあるトラフィックを生成する
1. フィルタリングノードの動作モードを確認する
1. Tarantoolがリクエストを処理するための十分なリソースがあるか確認する
1. ログをキャプチャして、Wallarmサポートチームと共有する

## 1. 悪意のあるトラフィックを生成する

Wallarmモジュールのさらなるデバッグを行うには：

1. 以下の悪意のあるトラフィックを送信します：

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    `<FILTERING_NODE_IP>`を確認したいフィルタリングノードのIPに置き換えます。必要に応じて、`Host:`ヘッダーをコマンドに追加します。
1. 攻撃がWallarm Console → **Events**に表示されるまで最大2分間待ちます。100リクエストすべてが表示された場合、フィルタリングノードは正常に動作しています。
1. インストールされたフィルタリングノードを持つサーバーに接続し、[ノードメトリクス](../admin-en/monitoring/intro.md)を取得します:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    これ以降、`wallarm-status`の出力を参照します。

## 2. フィルタリングノードの動作モードを確認する

以下の手順でフィルタリングノードの動作モードを確認します。

1. フィルタリングノードの[mode](../admin-en/configure-wallarm-mode.md)が`off`と異なることを確認します。ノードは`off`モードで受信トラフィックを処理しません。

    `off`モードは、`wallarm-status`メトリクスが増加しない一般的な理由です。
1. Wallarmノード設定が適用されていることを確認するために、NGINXを再起動します（ノードが[DEB/RPMパッケージからインストールされた場合](../admin-en/installation-nginx-overview.md)）：

    --8<-- "../include/waf/restart-nginx-3.6.ja.md"
1. クラウドにアップロードされない攻撃がないことを確認するために、もう一度[悪意のあるトラフィックを生成する](#1-generate-some-malicious-traffic)。

## 3. Tarantoolがリクエストを処理するための十分なリソースがあるか確認する

以下のTarantoolの基本メトリクスは、攻撃のエクスポートに関連するTarantoolの問題を示しています:

* `wallarm.stat.export_delay`は、Wallarm Cloudへの攻撃のアップロード遅延（秒単位）
* `wallarm.stat.timeframe_size`は、Tarantoolがリクエストを保持する時間間隔（秒単位）
* `wallarm.stat.dropped_before_export`は、Wallarm Cloudにアップロードするのに十分な時間がなかったヒットの数です。

メトリクスを表示するには：

1. インストールされたpostanalyticsモジュール（Tarantool）を持つサーバーに接続します。
1. 以下のコマンドを実行します：

    ```bash
    wtarantool
    require('console').connect('127.0.0.1:3313')
    wallarm.stat.export_delay()
    wallarm.stat.timeframe_size()
    wallarm.stat.dropped_before_export()
    ```

`wallarm.stat.dropped_before_export`値が `0` と異なる場合：

* [`wallarm.stat.timeframe_size`が10分未満の場合、Tarantool（](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) ）に割り当てられるメモリ量を増やします。

    !!! info "推奨されるメモリ"
        ピーク負荷時に`wallarm.stat.timeframe_size`メトリクスが`300`秒を下回らないように、Tarantoolに割り当てられるメモリを調整することをお勧めします。

* `/etc/wallarm/node.yaml` → `export_attacks`にある`export_attacks`ハンドラーの数を増やします。例えば：

    ```yaml
    export_attacks:
      threads: 5
      api_chunk: 20
    ```

    `export_attacks`のデフォルト設定は以下の通りです：

    * `threads: 2`
    * `api_chunk: 10`

## 4. ログをキャプチャして、Wallarmサポートチームと共有する

上記の手順が問題の解決に役立たない場合は、ノードのログをキャプチャし、以下のようにWallarmサポートチームと共有してください。

1. インストールされたWallarmノードを持つサーバーに接続します。
1. 以下のようにして`wallarm-status`の出力を取得します：

    ```bash
    curl http://127.0.0.8/wallarm-status; sleep 10; curl http://127.0.0.8/wallarm-status
    ```

    出力をコピーします。
1. Wallarm診断スクリプトを実行します：

    ```bash
    sudo /usr/share/wallarm-common/collect-info.sh
    ```

    生成されたログファイルを取得します。
1. すべての収集データを[Wallarmサポートチーム](mailto:support@wallarm.com)に送信して、さらなる調査を行ってください。