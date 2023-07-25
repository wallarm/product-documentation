[link-selinux]:     https://www.redhat.com/en/topics/linux/what-is-selinux
[doc-monitoring]:   monitoring/intro.ja.md

# SELinuxの設定

[SELinux][link-selinux] がフィルターノードのあるホストで有効になっている場合、フィルターノードの動作に影響を与える可能性があります。
* フィルターノードの RPS（リクエスト/秒）と APS（攻撃/秒）の値は Wallarm クラウドにエクスポートされません。
* TCP プロトコルを介してフィルターノードのメトリックを監視システムにエクスポートすることができません（[「フィルターノードの監視」][doc-monitoring]）。

SELinuxは、RedHatベースのLinuxディストリビューション（例：CentOSやAmazon Linux 2.0.2021x およびそれ以下）ではデフォルトでインストールおよび有効化されています。SELinuxは、DebianやUbuntuなどの他のLinuxディストリビューションにもインストールすることができます。

SELinuxを無効化するか、フィルターノードの動作を邪魔しないようにSELinuxを設定することが求められます。

## SELinuxのステータスを確認

以下のコマンドを実行します。

``` bash
sestatus
```

出力を確認します。
* `SELinux status: enabled`
* `SELinux status: disabled`

## SELinuxの設定

SELinuxを有効にしてフィルターノードが動作するように、`collectd`ユーティリティがTCPソケットを使用できるように許可します。これを行うには、以下のコマンドを実行します。

``` bash
setsebool -P collectd_tcp_network_connect 1
```

上記のコマンドが正常に実行されたかどうかを確認するには、以下のコマンドを実行します。

``` bash
semanage export | grep collectd_tcp_network_connect
```

出力に次の文字列が含まれている必要があります。

```
boolean -m -1 collectd_tcp_network_connect
```

## SELinuxを無効化

SELinuxを無効な状態に設定するには、
* `setenforce 0` コマンドを実行する（次回の再起動までSELinuxは無効になります）か、
* `/etc/selinux/config` ファイル内の `SELINUX` 変数の値を `disabled` に設定してから再起動する（SELinuxは恒久的に無効になります）。