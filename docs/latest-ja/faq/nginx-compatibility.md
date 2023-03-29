					# WallarmフィルタリングノードとNGINXバージョンの互換性

環境にインストールされているNGINXバージョンが安定版、PlusまたはDebian/CentOSリポジトリからインストールされたものと異なる場合は、このドキュメントからWallarmをインストールする方法を学んでください。

## WallarmフィルタリングノードはNGINXのメインラインと互換性がありますか？

いいえ、WallarmフィルタリングノードはNGINX `mainline` と互換性がありません。次の方法でWallarmノードをインストールできます。

* これらの[インストラクション](../installation/nginx/dynamic-module.md)に従って、公式のオープンソースNGINX `stable` に接続します。
* これらの[インストラクション](../installation/nginx/dynamic-module-from-distr.md)に従って、Debian/CentOSリポジトリからインストールしたNGINXに接続します。
* これらの[インストラクション](../installation/nginx-plus.md)に従って、公式の商用NGINX Plusに接続します。

## WallarmフィルタリングノードはNGINXのカスタムビルドと互換性がありますか？

はい、Wallarmモジュールは、Wallarmパッケージを再構築した後、NGINXのカスタムビルドに接続できます。パッケージを再構築するには、[Wallarmテクニカルサポートチーム](mailto:support@wallarm.com)に連絡して、以下のデータを送信してください。

* Linuxカーネルバージョン: `uname -a`
* Linuxディストリビューション: `cat /etc/*release`
* NGINXバージョン:

    * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINXカスタムビルド: `<path to nginx>/nginx -V`

* 互換性シグネチャ:
  
      * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINXカスタムビルド: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* NGINXワーカープロセスを実行しているユーザー（およびそのグループ）: `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`