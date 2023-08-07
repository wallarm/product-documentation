# Tarantool トラブルシューティング

以下のセクションでは、Tarantoolの操作で頻繁に発生するエラーとそのトラブルシューティングについて説明しています。

## "readahead limit reached"の問題をどう解決すれば良いですか？

`/var/log/wallarm/tarantool.log` ファイルで、以下のようなエラーが出る場合があります：

```
readahead limit reached, stopping input on connection fd 16, 
aka 127.0.0.1:3313, peer of 127.0.0.1:53218
```

この問題は重大ではありませんが、このようなエラーが多すぎると、サービスのパフォーマンスが低下する可能性があります。

問題を解決するには：

1. `/usr/share/wallarm-tarantool/init.lua`フォルダー → `box.cfg` ファイルにアクセスします。
1. 次のいずれかを設定します：
    * `readahead = 1*1024*1024`
    * `readahead = 8*1024*1024`

`readahead` パラメータは、クライアントコネクションに関連する先読みバッファのサイズを定義します。バッファが大きいほど、アクティブな接続が消費するメモリが多くなり、一回のシステム呼び出しでオペレーティングシステムのバッファから読み出すことができるリクエストの数も増えます。Tarantoolの[ドキュメンテーション](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-readahead)で詳細をご覧いただけます。

## "net_msg_max limit is reached"の問題をどう解決すれば良いですか？

`/var/log/wallarm/tarantool.log` ファイルで、以下のようなエラーが出る場合があります：

```
2020-02-18 12:22:17.420 [26620] iproto iproto.cc:562 W> stopping input on connection fd 21, 
aka 127.0.0.1:3313, peer of 127.0.0.1:44306, net_msg_max limit is reached
```

問題を解決するには、`net_msg_max`の値を増やします（デフォルト値は`768`）：

1. `/usr/share/wallarm-tarantool/init.lua`フォルダー → `box.cfg` ファイルにアクセスします。
1. `net_msg_max` の値を増加させます。例えば：

    ```
    box.cfg {
        net_msg_max = 6000
    }
    ```

全体的なシステムにおけるファイバのオーバーヘッドの影響を防ぐために、`net_msg_max` パラメータはファイバが処理するメッセージの数を制限します。`net_msg_max` の使用に関する詳細は、Tarantoolの[ドキュメンテーション](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-net-msg-max)をご覧ください。