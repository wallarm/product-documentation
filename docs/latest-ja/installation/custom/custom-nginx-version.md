# カスタムNGINXパッケージ

安定版と異なるバージョンのNGINX、NGINX Plus、またはディストリビューションバージョン用のWallarm DEB/RPMパッケージが必要な場合は、以下の指示にしたがってカスタムWallarmビルドをリクエストできます。

デフォルトでは、Wallarm DEB/RPMパッケージは以下のNGINXバージョンで利用可能です:

* 公式オープンソースのNGINX `stable` - [インストール手順](../nginx/dynamic-module.md)を参照してください 
* ディストリビューション提供のNGINX - [インストール手順](../nginx/dynamic-module-from-distr.md)を参照してください
* 公式商用NGINX Plus - [インストール手順](../nginx-plus.md)を参照してください

Wallarmモジュールは、NGINX `mainline`を含むカスタムビルドのNGINXと統合できます。Wallarmパッケージを再構築するためには、[Wallarm テクニカルサポート](mailto:support@wallarm.com) チームに連絡し、以下の情報を提供してください:

* Linuxカーネルバージョン: `uname -a`
* Linuxディストリビューション: `cat /etc/*release`
* NGINXバージョン:

    * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINXカスタムビルド: `<nginxへのパス>/nginx -V`

* 互換性シグネチャ:
  
      * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINXカスタムビルド: `egrep -ao '.,.,.,[01]{33}' <nginxへのパス>/nginx`

* NGINXワーカープロセスを実行しているユーザー(およびそのユーザーグループ): `grep -w 'user' <nginx設定ファイルへのパス/nginx.conf>`