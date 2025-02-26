# SELinux トラブルシューティング

[SELinux][link-selinux]は、RedHat系Linuxディストリビューション（例：CentOSまたはAmazon Linux 2.0.2021x以前）にデフォルトでインストールされ、有効化されています。SELinuxは、DebianやUbuntuなどの他のLinuxディストリビューションにもインストール可能です。

以下のコマンドを実行して、SELinuxの存在と状態を確認してください。

``` bash
sestatus
```

## 自動構成

フィルタノードが存在するホストでSELinux機構が有効になっている場合、ノードのインストールまたはアップグレード時に[all-in-one installer](../installation/inline/compute-instances/linux/all-in-one.md)が自動構成を実行し、干渉が発生しないようにします。

このため、ほとんどの場合、SELinuxによる問題は発生しません。

## トラブルシューティング

もし[自動構成](#automatic-configuration)の後もSELinuxが原因と思われる問題が発生する場合、以下のような現象が確認される可能性があります：

* フィルタノードのRPS（リクエスト毎秒）およびAPS（攻撃毎秒）の値がWallarm Cloudにエクスポートされません。
* その他の問題。

以下の手順を実行してください：

1. `setenforce 0` コマンドを実行して、一時的にSELinuxを無効化します。

    SELinuxは、次回の再起動まで無効化されます。

2. 問題が解消されたか確認してください。

3. [Wallarmの技術サポート](mailto:support@wallarm.com)に連絡して、サポートを受けてください。

    !!! warning "SELinuxの恒久的な無効化は推奨されません"
        セキュリティ上の理由から、SELinuxを恒久的に無効化することは推奨されません。