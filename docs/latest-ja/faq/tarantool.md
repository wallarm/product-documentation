# Tarantoolのトラブルシューティング

下記のセクションでは、Tarantoolの動作における頻出エラーとそのトラブルシューティングに関する情報を記載しています。

## 「readahead limit reached」問題はどう解決できますか？

[ノードのインストール方法に応じて](../admin-en/configure-logging.md)、`/var/log/wallarm/tarantool.log`または`/opt/wallarm/var/log/wallarm/tarantool-out.log`ファイルに以下のようなエラーが出力される場合があります:

```
readahead limit reached, stopping input on connection fd 16, 
aka 127.0.0.1:3313, peer of 127.0.0.1:53218
```

この問題は重大ではありませんが、このようなエラーが多数発生するとサービスのパフォーマンスが低下する可能性があります。

問題を解決するには:

1. `/usr/share/wallarm-tarantool/init.lua`フォルダ内の`box.cfg`ファイルにアクセスします。
1. 以下のいずれかを設定します:
    * `readahead = 1*1024*1024`
    * `readahead = 8*1024*1024`

`readahead`パラメータは、クライアント接続に関連づけられたリードアヘッドバッファのサイズを定義します。バッファが大きいほど、アクティブな接続はより多くのメモリを消費し、オペレーティングシステムバッファから一度のシステムコールでより多くのリクエストを読み取ることができます。詳細はTarantoolの[ドキュメント](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-readahead)を参照してください。

## 「net_msg_max limit is reached」問題はどう解決できますか？

[ノードのインストール方法に応じて](../admin-en/configure-logging.md)、`/var/log/wallarm/tarantool.log`または`/opt/wallarm/var/log/wallarm/tarantool-out.log`ファイルに以下のようなエラーが出力される場合があります:

```
2020-02-18 12:22:17.420 [26620] iproto iproto.cc:562 W> stopping input on connection fd 21, 
aka 127.0.0.1:3313, peer of 127.0.0.1:44306, net_msg_max limit is reached
```

問題を解決するには、`net_msg_max`の値（デフォルト値は`768`）を増加させます:

1. `/usr/share/wallarm-tarantool/init.lua`フォルダ内の`box.cfg`ファイルにアクセスします。
1. 例えば、以下のように`net_msg_max`の値を増加させます:

    ```
    box.cfg {
        net_msg_max = 6000
    }
    ```

fiberのオーバーヘッドがシステム全体に影響を及ぼさないように、`net_msg_max`パラメータはfiberが処理するメッセージ数に制限を設けています。詳細はTarantoolの[ドキュメント](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-net-msg-max)を参照してください。