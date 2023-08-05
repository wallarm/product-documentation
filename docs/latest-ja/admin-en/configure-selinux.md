[link-selinux]:     https://www.redhat.com/en/topics/linux/what-is-selinux
[doc-monitoring]:   monitoring/intro.md

# SELinuxの設定

フィルターノードがホストに存在し、そのホスト上で[SELinux][link-selinux]のメカニズムが有効になっている場合、それがフィルターノードの操作を妨げ、操作不能にする可能性があります:
* フィルターノードのRPS（リクエスト毎秒）および APS（攻撃毎秒）の値はWallarmクラウドにエクスポートされません。
* TCPプロトコルを介してフィルターノードのメトリックを監視システムにエクスポートすることはできません（[「フィルターノードの監視」][doc-monitoring]を参照してください）。 

SELinuxは、RedHatベースのLinuxディストリビューション（例えば、CentOSやAmazon Linux 2.0.2021x以下）ではデフォルトでインストールおよび有効化されています。 SELinuxはDebianやUbuntuなどの他のLinuxディストリビューションにもインストールできます。

SELinuxを無効にするか、フィルターノードの操作を妨げないように設定することが必須です。

## SELinuxステータスの確認

以下のコマンドを実行します:

``` bash
sestatus
```

出力を確認します:
* `SELinux status: enabled`
* `SELinux status: disabled`

## SELinuxの設定

SELinuxが有効な状態でフィルターノードを操作可能にするために、`collectd`ユーティリティがTCPソケットを使用することを許可します。これを行うには、以下のコマンドを実行します:

``` bash
setsebool -P collectd_tcp_network_connect 1
```

上記のコマンドが正常に実行されたかどうかを確認するには、次のコマンドを実行します:

``` bash
semanage export | grep collectd_tcp_network_connect
```

出力には次の文字列が含まれているべきです:
```
boolean -m -1 collectd_tcp_network_connect
```

## SELinuxの無効化

SELinuxを無効化するには
*   `setenforce 0`コマンドを実行する（次の再起動までSELinuxが無効になる）か、または
*   `/etc/selinux/config`ファイル内の`SELINUX`変数の値を`disabled`に設定し、その後再起動する（SELinuxが永久に無効になる）。