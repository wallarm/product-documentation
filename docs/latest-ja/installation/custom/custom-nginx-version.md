# カスタム NGINXパッケージ

もし[all-in-one installation](../../installation/nginx/all-in-one.md)でサポートされているバージョンとは異なるNGINXバージョン（例えば、安定版、mainline NGINX Plus、またはディストリビューション版）のためのWallarmが必要な場合は、以下の手順に従い、カスタムWallarmビルドをリクエストできます。

Wallarmモジュールは、NGINX `mainline`を含むカスタムNGINXビルドと統合可能です。Wallarmパッケージを再構築するには、[Wallarm technical support](mailto:support@wallarm.com)チームへご連絡いただき、以下の情報を提供してください。

* Linuxカーネルバージョン: `uname -a`
* Linuxディストリビューション: `cat /etc/*release`
* NGINXバージョン:
  
    * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINXカスタムビルド: `<path to nginx>/nginx -V`

* 互換性署名:
  
      * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINXカスタムビルド: `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* NGINXワーカープロセスを実行しているユーザー（およびそのユーザーグループ）: `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`