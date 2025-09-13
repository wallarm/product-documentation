# NGINXバージョンとのWallarmフィルタリングノードの互換性

お使いの環境にインストールされているNGINXのバージョンが、stable、Plus、またはDebian/CentOSリポジトリからインストールされるものと異なる場合は、本ドキュメントでWallarmのインストール方法をご確認ください。

## WallarmフィルタリングノードはNGINX mainlineと互換性がありますか？

いいえ、WallarmフィルタリングノードはNGINXの`mainline`と互換性がありません。Wallarmノードは次の方法でインストールできます。

* 公式のオープンソース版NGINXの`stable`に、次の[手順](../installation/nginx/dynamic-module.md)に従って接続します
* Debian/CentOSリポジトリからインストールされたNGINXに、次の[手順](../installation/nginx/dynamic-module-from-distr.md)に従って接続します
* 公式の商用版NGINX Plusに、次の[手順](../installation/nginx-plus.md)に従って接続します

## WallarmフィルタリングノードはカスタムビルドのNGINXと互換性がありますか？

はい、Wallarmパッケージを再ビルドすれば、WallarmモジュールをカスタムビルドのNGINXに接続できます。パッケージを再ビルドするには、[Wallarmテクニカルサポートチーム](mailto:support@wallarm.com)にご連絡のうえ、以下の情報をお送りください。

* Linuxカーネルのバージョン： `uname -a`
* Linuxディストリビューション： `cat /etc/*release`
* NGINXのバージョン：

    * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html)： `/usr/sbin/nginx -V`
    * NGINXカスタムビルド： `<path to nginx>/nginx -V`

* 互換性シグネチャ：
  
      * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html)： `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINXカスタムビルド： `egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* NGINXのworkerプロセスを実行しているユーザー（およびそのユーザーのグループ）： `grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`