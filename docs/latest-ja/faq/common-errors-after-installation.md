# Wallarmノードのインストール後のエラー

Wallarmノードのインストール後にエラーが発生した場合、これらを対処するためのこのトラブルシューティングガイドをチェックしてください。ここに関連する詳細が見つからない場合は、[Wallarmテクニカルサポート](mailto:support@wallarm.com)にご連絡ください。

## ファイルダウンロードシナリオの失敗

フィルターノードのインストール後にファイルダウンロードシナリオが失敗する場合、問題は、リクエストサイズがWallarmの設定ファイルの`client_max_body_size`ディレクティブで設定された上限を超えていることにあります。

ファイルのアップロードを受け入れるアドレスの`location`ディレクティブの`client_max_body_size`の値を変更します。`location`の値だけを変更することで、メインページが大きなリクエストを受け取るのを防ぎます。

`client_max_body_size`の値を変更します:

1. `/etc/nginx-wallarm`ディレクトリの設定ファイルを編集用に開きます。
2. 新しい値を入力します：
	
	```
	location /file/upload {
	  client_max_body_size 16m;
	}
	```
	
	* `/file/upload`は、ファイルのアップロードを受け入れるアドレスです。

詳細なディレクティブの説明は、[公式のNGINXドキュメンテーション](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)でご覧いただけます。

##"wallarm-nodeの署名を確認できません"、"yumでは続行するためのキャッシュデータが十分ではありません"、"署名を確認できません"というエラーをどのように修正するか？

Wallarm RPMまたはDEBパッケージのGPGキーが期限切れの場合、次のようなエラーメッセージが表示される場合があります：

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

問題を解決するために、**DebianまたはUbuntu**では次の手順を実行してください:

1. Wallarmのパッケージの新しいGPGキーをインポートします：

	```bash
	curl -fsSL https://repo.wallarm.com/wallarm.gpg | sudo apt-key add -
	```
2. Wallarmのパッケージを更新します：

	```bash
	sudo apt update
	```

問題を解決するために、**CentOS**では次の手順を実行してください:

1. 既に追加されているリポジトリを削除します：

	```bash
	sudo yum remove wallarm-node-repo
	```
2. キャッシュをクリアします：

	```bash
	sudo yum clean all
	```
3. 適切なCentOSおよびWallarmノードのバージョンに対応するコマンドを使用して新しいリポジトリを追加します：

	=== "CentOS 7.xまたはAmazon Linux 2.0.2021x以下"
		```bash
		# 4.2バージョンのフィルタリングノードとpostanalyticsモジュール
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.2/x86_64/wallarm-node-repo-4.2-0.el7.noarch.rpm

		# 4.4バージョンのフィルタリングノードとpostanalyticsモジュール
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.4/x86_64/wallarm-node-repo-4.4-0.el7.noarch.rpm

		# 4.6バージョンのフィルタリングノードとpostanalyticsモジュール
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/7/4.6/x86_64/wallarm-node-repo-4.6-0.el7.noarch.rpm
		```
	=== "AlmaLinux、Rocky Linux、またはOracle Linux 8.x"
		```bash
		# 4.2バージョンのフィルタリングノードとpostanalyticsモジュール
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.2/x86_64/wallarm-node-repo-4.2-0.el8.noarch.rpm

		# 4.4バージョンのフィルタリングノードとpostanalyticsモジュール
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.4/x86_64/wallarm-node-repo-4.4-0.el8.noarch.rpm

		# 4.6バージョンのフィルタリングノードとpostanalyticsモジュール
		
		sudo rpm -i https://repo.wallarm.com/centos/wallarm-node/8/4.6/x86_64/wallarm-node-repo-4.6-0.el8.noarch.rpm
		```		
4. 必要に応じて、アクションを確認します。

## フィルタリングノードがブロッキングモード(`wallarm_mode block`)で動作する際に攻撃をブロックしないのはなぜですか？

`wallarm_mode`ディレクティブの使用は、トラフィックフィルタリングモード設定のいくつかの方法のうちの1つだけです。これらの設定方法の一部は、`wallarm_mode`ディレクティブの値よりも優先度が高いです。

`wallarm_mode block`を経由してブロッキングモードを設定したにもかかわらず、Wallarmのフィルタリングノードが攻撃をブロックしない場合は、フィルタリングモードが他の設定方法を使用して上書きされていないことを確認してください：

* [ルール**フィルタリングモードの設定**](../admin-en/configure-wallarm-mode.md)を使用して
* [Wallarm Consoleの**一般**セクション](../admin-en/configure-wallarm-mode.md)で

[フィルタリングモードの設定方法の詳細→](../admin-en/configure-parameters-en.md)
