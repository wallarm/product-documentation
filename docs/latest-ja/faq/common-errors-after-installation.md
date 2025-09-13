# エンドユーザーの問題のトラブルシューティング

NGINX用Wallarmノードのインストール後にエラーが発生した場合は、本トラブルシューティングガイドを確認してください。ここに該当する詳細が見つからない場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にお問い合わせください。

## ユーザーがファイルをダウンロードできない

フィルタノードのインストール後にファイルのダウンロードが失敗する場合は、Wallarmの設定ファイル内の`client_max_body_size`ディレクティブで設定された上限をリクエストサイズが超過していることが原因です。

ファイルのアップロードを受け付けるアドレスの`location`ディレクティブ内にある`client_max_body_size`の値を変更してください。`location`内の値のみを変更することで、メインページに大きなリクエストが送られるのを防げます。

`client_max_body_size`の値を変更します:

1. 編集のために`/etc/nginx/sites-enabled/default`（Dockerコンテナで実行している場合は`/etc/nginx/http.d/default.conf`）ファイルを開きます。
2. 新しい値を設定します:

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	`/file/upload`はファイルのアップロードを受け付けるアドレスです。

ディレクティブの詳細な説明は[公式NGINXドキュメント](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)にあります。