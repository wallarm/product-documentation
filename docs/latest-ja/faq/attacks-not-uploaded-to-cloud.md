# Wallarm Cloudに攻撃情報がアップロードされません

トラフィックからの攻撃がWallarm Cloudにアップロードされず、その結果、Wallarm Console UIに表示されないと疑われる場合は、本記事を用いて問題のデバッグを行ってください。

問題をデバッグするために、次の手順を順に実行してください:

1. 悪意のあるトラフィックを生成する
1. フィルタリングノードの動作モードを確認する
1. ログをキャプチャしてWallarmサポートチームに送信する

## 1. 悪意のあるトラフィックを生成する

Wallarmモジュールの追加のデバッグを行うために:

1. 以下の悪意のあるトラフィックを送信してください:

    ```bash
    for i in `seq 100`; do curl "http://<FILTERING_NODE_IP>/?wallarm_test_xxxx=union+select+$i"; sleep 1; done
    ```

    `<FILTERING_NODE_IP>`を確認したいフィルタリングノードのIPに置き換えてください。必要に応じて、コマンドに`Host:`ヘッダを追加してください。
1. Wallarm Console→**Attacks**に攻撃情報が表示されるまで2分以内にお待ちください。全ての100件のリクエストが表示されれば、フィルタリングノードは正常に動作しています。
1. フィルタリングノードがインストールされているサーバに接続し、[ノードメトリクス](../admin-en/monitoring/intro.md)を取得してください:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    以降、この`wallarm-status`の出力結果を参照します。

## 2. フィルタリングノードの動作モードを確認する

次の方法でフィルタリングノードの動作モードを確認してください:

1. フィルタリングノードの[モード](../admin-en/configure-wallarm-mode.md)が`off`ではないことを確認してください。`off`モードでは、ノードは受信トラフィックの処理を行いません。

    `off`モードは、`wallarm-status`のメトリクスが増加しない一般的な原因です。
1. ノードがNGINXベースの場合、設定が適用されることを確認するためにNGINXを再起動してください:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. 攻撃がCloudにアップロードされないことを再確認するために、再度[悪意のあるトラフィックを生成](#1-generate-some-malicious-traffic)してください。

## 3. ログをキャプチャしてWallarmサポートチームに送信する

上記の手順で問題が解決しない場合は、次の手順に従いノードログをキャプチャしてWallarmサポートチームに送信してください:

1. Wallarmノードがインストールされたサーバに接続してください。
1. 次のコマンドで`wallarm-status`の出力を取得してください:

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    出力結果をコピーしてください。
1. Wallarm診断スクリプトを実行してください:

    ```bash
    /opt/wallarm/collect-info.sh
    ```

    生成されたログファイルを取得してください。
1. 追加調査のために、収集したすべてのデータを[Wallarmサポートチーム](mailto:support@wallarm.com)に送信してください。