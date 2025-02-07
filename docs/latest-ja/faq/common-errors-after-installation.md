# NGINX Wallarmノードのインストール後のエラー

NGINX Wallarmノードのインストール後にエラーが発生する場合は、本トラブルシューティングガイドを参照して解決してください。該当する内容が見つからない場合は[Wallarm technical support](mailto:support@wallarm.com)へお問い合わせください。

## ファイルのダウンロードシナリオが失敗する場合

フィルタノードインストール後にファイルのダウンロードシナリオが失敗する場合、Wallarm構成ファイル内の`client_max_body_size`ディレクティブで設定された制限をリクエストサイズが超えていることが原因です。

ファイルアップロードを受け入れるアドレスの`location`ディレクティブ内で`client_max_body_size`の値を変更してください。`location`の値のみを変更すると、メインページが大きなリクエストを受けるのを防止できます。

次のように`client_max_body_size`の値を変更してください：

1. `/etc/nginx/sites-enabled/default`ファイルを編集用に開いてください。
2. 以下の新しい値を入力してください：

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

`/file/upload`はファイルアップロードを受け入れるアドレスです。

詳細なディレクティブの説明は[NGINX公式ドキュメント](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)でご確認ください。

## blockingモード(`wallarm_mode block`)で稼動している際にフィルタノードが攻撃をブロックしないのはなぜですか？

`wallarm_mode`ディレクティブを使用するのは、複数あるトラフィックフィルトレーションモードの設定方法のひとつに過ぎません。これらの設定方法の中には`wallarm_mode`ディレクティブの値より優先度の高いものもあります。

もし`wallarm_mode block`を用いてブロッキングモードを設定しているのにWallarmフィルタノードが攻撃をブロックしない場合は、他の設定方法でフィルトレーションモードが上書きされていないことを確認してください：

* [ルール **フィルトレーションモードの設定**](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console)
* [Wallarm Consoleの**General**セクション](../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console)

[フィルトレーションモード設定方法の詳細→](../admin-en/configure-parameters-en.md)