# カスタムNGINXパッケージ

[オールインワンインストール](../../installation/nginx/all-in-one.md)でサポートされているバージョンと異なるNGINXのバージョン（stable版、mainline、NGINX Plus、またはディストリビューション版など）でWallarmが必要な場合は、以下の手順に従ってカスタムのWallarmビルドを依頼できます。

Wallarmモジュールは、Wallarmパッケージを再ビルドすることで、NGINX`mainline`を含むカスタムビルドのNGINXに統合できます。パッケージを再ビルドするには、[Wallarmテクニカルサポート](mailto:support@wallarm.com)チームにご連絡のうえ、次の情報をご提供ください:

* Linuxカーネルのバージョン: `uname -a`
* Linuxディストリビューション: `cat /etc/*release`
* NGINXのバージョン:

    * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINXカスタムビルド: `<path to nginx>/nginx -V`

* 互換性シグネチャ:
  
      * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINXカスタムビルド: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* NGINXワーカープロセスを実行しているユーザー（およびそのユーザーのグループ）: `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`