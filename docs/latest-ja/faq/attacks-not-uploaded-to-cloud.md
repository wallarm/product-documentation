# 攻撃がWallarmクラウドにアップロードされません

トラフィックからの攻撃がWallarmクラウドにアップロードされず、結果として、WallarmコンソールUIに表示されない場合があると疑う場合は、この記事を使用して問題をデバッグします。

問題をデバッグするには、以下の手順を順に実行します:

1. さらなるデバッグのために悪意のあるトラフィックを生成します。
1. フィルタリングノードの動作モードを確認します。
1. Tarantoolがリクエストを処理するのに十分なリソースがあることを確認します。
1. ログをキャプチャし、Wallarmサポートチームと共有します。

## 1. 悪意のあるトラフィックを生成する

Wallarmモジュールのさらなるデバッグを行うには:

1. 次の悪意のあるトラフィックを送信します：

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    `<FILTERING_NODE_IP>`を確認したいフィルタリングノードのIPに置き換えます。必要に応じてコマンドに`Host:`ヘッダーを追加します。
1. 攻撃がWallarmコンソール → **イベント**に表示されるまで最大2分間待ちます。すべての100のリクエストが表示された場合、フィルタリングノードは正常に動作しています。
1. インストールされたフィルタリングノードのサーバーに接続し、[ノードメトリクス](../admin-en/monitoring/intro.md)を取得します：

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    これ以降、`wallarm-status`の出力を参照します。

## 2. フィルタリングノードの動作モードを確認する

フィルタリングノードの動作モードを以下のように確認します:

1. フィルタリングノードの[モード](../admin-en/configure-wallarm-mode.md)が`off`とは異なることを確認します。ノードは`off`モードでは受信トラフィックを処理しません。

    `off`モードは、`wallarm-status`メトリクスが増加しない一般的な理由です。
1. Wallarmノードの設定が適用されていることを確認するために、NGINXを再起動します（ノードがDEB/RPMパッケージからインストールされている場合）：

    --8<-- "../include-ja/waf/restart-nginx-3.6.md"
1. 攻撃が引き続きクラウドにアップロードされていないことを確認するために、再び[悪意のあるトラフィック](#1-悪意のあるトラフィックを生成する)を生成します。

## 3. Tarantoolがリクエストを処理するのに十分なリソースがあることを確認する

以下のTarantoolの基本メトリクスが攻撃のエクスポートに関連するTarantoolの問題を示しています:

* `wallarm.stat.export_delay`は、攻撃をWallarmクラウドにアップロードする遅延（秒）
* `wallarm.stat.timeframe_size`は、Tarantoolがリクエストを保存する時間間隔（秒）
* `wallarm.stat.dropped_before_export` は、Wallarm クラウドにアップロードする時間が十分でなかったヒットの数

メトリクスを表示するには:

1. インストールされた postanalytics モジュール（Tarantool）のサーバーに接続します。
1. 以下のコマンドを実行します:

    ```bash
    wtarantool
    require('console').connect('127.0.0.1:3313')
    wallarm.stat.export_delay()
    wallarm.stat.timeframe_size()
    wallarm.stat.dropped_before_export()
    ```

もし`wallarm.stat.dropped_before_export`の値が`0`と異なる場合:

* [増やす](../admin-en/configuration-guides/allocate-resources-for-node.md#tarantool) Tarantoolのために割り当てられたメモリ量（`wallarm.stat.timeframe_size`が10分未満の場合）。
    
    !!! info "推奨メモリ"
        ピーク負荷時に`wallarm.stat.timeframe_size`メトリックが`300`秒以下に下がらないように、Tarantoolに割り当てるメモリを調整することをお勧めします。

* `/etc/wallarm/node.yaml` → `export_attacks`ファイル内の`export_attacks`ハンドラーの数を増やします、例えば：

    ```yaml
    export_attacks:
      threads: 5
      api_chunk: 20
    ```

    `export_attacks`の設定はデフォルトでは以下の通りです：

    * `threads: 2`
    * `api_chunk: 10`

## 4. ログを取得し、それをWallarmサポートチームと共有する

上記の手順が問題の解決に役立たない場合、ノードのログを取得し、それらをWallarmサポートチームと共有してください：

1. インストールされたWallarmノードのサーバーに接続します。
1. `wallarm-status`の出力を以下のように取得します：

    ```bash
    curl http://127.0.0.8/wallarm-status; sleep 10; curl http://127.0.0.8/wallarm-status
    ```

    出力をコピーします。
1. Wallarm診断スクリプトを実行します：

    ```bash
    sudo /usr/share/wallarm-common/collect-info.sh
    ```

    生成されたログファイルを取得します。
1. すべての収集したデータをさらなる調査のために[Wallarmサポートチーム](mailto:support@wallarm.com)に送信します。