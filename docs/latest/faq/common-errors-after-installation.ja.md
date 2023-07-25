# Wallarmノードインストール後のエラー

Wallarmノードのインストール後にエラーが発生した場合、以下のトラブルシューティングガイドを参照して解決してください。 ここで関連情報が見つからない場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)までお問い合わせください。

## ファイルダウンロードシナリオが失敗する

フィルタリングノードのインストール後に、ファイルのダウンロードシナリオが失敗する場合、`client_max_body_size`に設定された上限を超えているためにリクエストのサイズが原因です。 Wallarmの設定ファイルにある`client_max_body_size`のリクエストサイズ制限。

ファイルのアップロードを受け入れるアドレスの`location`ディレクティブ内の`client_max_body_size`の値を変更します。 `location`値のみを変更すると、メインページが大きなリクエストを受け取らなくなります。

`client_max_body_size`の値を変更する：

1. `/etc/nginx-wallarm`ディレクトリ内の設定ファイルを編集する。
2. 新しい値を入力します：

	```
	location /file/upload {
	 client_max_body_size 16m;
	}
	```

	* `/file/upload`は、ファイルのアップロードを受け入れるアドレスです。

詳細なディレクティブ説明は、[公式NGINXドキュメント](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)で入手できます。

## "wallarm-nodeの署名が検証できません"、"yumには続行するためのキャッシュデータが十分にありません"、"署名が検証できません"というエラーを修正する方法は？

Wallarm RPMまたはDEBパッケージのGPGキーが期限切れの場合、次のエラーメッセージが表示されることがあります。

```
https://repo.wallarm.com/centos/wallarm-node/7/3.6/x86_64/repodata/repomd.xml:
[Errno -1] repomd.xml signature could not be verified for wallarm-node_3.6

One of the configured repositories failed (Wallarm Node for CentOS 7 - 3.6),
and yum doesn't have enough cached data to continue.

W: GPG error: https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release: The following signatures
couldn't be verified because the public key is not available: NO_PUBKEY 1111FQQW999
E: The repository 'https://repo.wallarm.com/ubuntu/wallarm-node focal/3.6/ Release' is not signed.
N: Updating from such a repository can't be done securely, and is therefore disabled by default.
N: See apt-secure(8) manpage for repository creation and user configuration details.
```

**DebianまたはUbuntu**で問題を解決するには、次の手順に従ってください。

1. Wallarmパッケージの新しいGPGキーをインポートします：

	```bash
	curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
	```
2. Wallarmパッケージを更新します：

	```bash
	sudo apt update
	```

**CentOS**で問題を解決するには、次の手順に従ってください。

1. 以前に追加されたリポジトリを削除します：

	```bash
	sudo yum remove wallarm-node-repo
	```
2. キャッシュをクリアします：

	```bash
	sudo yum clean all
	```
3. 適切なCentOSとWallarmノードバージョン用のコマンドを使用して新しいリポジトリを追加します。

	=== "CentOS 7.xまたはAmazon Linux 2.0.2021x以下"
		```bash
		# 4.0バージョンのフィルタリングノードとpostanalyticsモジュール
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.0/x86_64/wallarm-node-repo-4-0.el7.noarch.rpm

		# 4.2バージョンのフィルタリングノードとpostanalyticsモジュール
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.2/x86_64/wallarm-node-repo-4.2-0.el7.noarch.rpm

		# 4.4バージョンのフィルタリングノードとpostanalyticsモジュール
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm
		```
	=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
		```bash
		# 4.0バージョンのフィルタリングノードとpostanalyticsモジュール
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.0/x86_64/wallarm-node-repo-4-0.el8.noarch.rpm

		# 4.2バージョンのフィルタリングノードとpostanalyticsモジュール
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.2/x86_64/wallarm-node-repo-4.2-0.el8.noarch.rpm

		# 4.4バージョンのフィルタリングノードとpostanalyticsモジュール
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm
		```		
4. 必要に応じて、アクションを確認します。

## ブロッキングモード（`wallarm_mode block`）で動作しているフィルタリングノードが攻撃をブロックしないのはなぜですか？

`wallarm_mode` ディレクティブの使用は、トラフィックフィルタリングモードの設定方法のうちの1つにすぎません。 これらの設定方法の中には、`wallarm_mode`ディレクティブの値よりも優先度の高いものがあります。

`wallarm_mode block`でブロックモードを設定しているが、Wallarmフィルタリングノードが攻撃をブロックしない場合は、他の設定方法を使用してフィルタリングモードが上書きされていないことを確認してください。

* [ルール **フィルタリングモードの設定**](../user-guides/rules/wallarm-mode-rule.ja.md)を使用して
* [Wallarmコンソールの**一般**セクション](../user-guides/settings/general.ja.md)で

[フィルタリングモード設定方法の詳細 →](../admin-en/configure-parameters-en.ja.md)