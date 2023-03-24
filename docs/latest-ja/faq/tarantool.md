# Tarantool トラブルシューティング

以下のセクションでは、Tarantool の操作でよくあるエラーとその対処方法について説明しています。

## "readahead limit reached"問題を解決する方法は？

`/var/log/wallarm/tarantool.log`ファイルでは、次のようなエラーが表示されることがあります。

```
readahead limit reached, stopping input on connection fd 16, 
aka 127.0.0.1:3313, peer of 127.0.0.1:53218
```

この問題は重要ではありませんが、多くのそのようなエラーがサービスのパフォーマンスを低下させる可能性があります。

問題を解決するには：

1. `/usr/share/wallarm-tarantool/init.lua`フォルダにアクセスし、`box.cfg`ファイルを開きます。
1. 以下のどちらかを設定します:
    * `readahead = 1*1024*1024`
    * `readahead = 8*1024*1024`

`readahead`パラメータは、クライアント接続に関連付けられた読み取りバッファのサイズを定義します。バッファが大きいほど、アクティブな接続が消費するメモリが多くなり、オペレーティングシステムのバッファからシングルシステムコールで読み取ることができるリクエストが多くなります。詳細は Tarantool の[ドキュメント](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-readahead)を参照してください。

## "net_msg_max limit is reached"問題を解決する方法は？

`/var/log/wallarm/tarantool.log`ファイルでは、次のようなエラーが表示されることがあります。

```
2020-02-18 12:22:17.420 [26620] iproto iproto.cc:562 W> stopping input on connection fd 21, 
aka 127.0.0.1:3313, peer of 127.0.0.1:44306, net_msg_max limit is reached
```

問題を解決するには、`net_msg_max`の値を増やします（デフォルト値は`768`）：

1. `/usr/share/wallarm-tarantool/init.lua`フォルダにアクセスし、`box.cfg`ファイルを開きます。
1. `net_msg_max` の値を増加させます。例：

    ```
    box.cfg {
        net_msg_max = 6000
    }
    ```

ファイバーのオーバーヘッドがシステム全体に影響を与えないようにするために、`net_msg_max`パラメータはファイバーが処理するメッセージの数を制限します。`net_msg_max`の使用方法の詳細は、Tarantool の[ドキュメント](https://www.tarantool.io/en/doc/latest/reference/configuration/#cfg-networking-net-msg-max)で参照してください。