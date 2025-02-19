# NGINXバージョンとのWallarmフィルタリングノードの互換性

お使いの環境にインストールされているNGINXのバージョンがstable、Plus、またはDebian/CentOSリポジトリからインストールされたものと異なる場合は、本ドキュメントからWallarmのインストール方法をご参照ください。

## WallarmフィルタリングノードはNGINX `mainline`と互換性がありますか？

いいえ、WallarmフィルタリングノードはNGINX `mainline`と互換性がありません。以下の方法でWallarmノードをインストールできます:

* 公式のオープンソースNGINX `stable`に接続するには、次の[手順](../installation/nginx/dynamic-module.md)に従ってください。
* Debian/CentOSリポジトリからインストールされたNGINXに接続するには、次の[手順](../installation/nginx/dynamic-module-from-distr.md)に従ってください。
* 公式の商用NGINX Plusに接続するには、次の[手順](../installation/nginx-plus.md)に従ってください。

## WallarmフィルタリングノードはカスタムビルドのNGINXと互換性がありますか？

はい、Wallarmパッケージを再ビルドした後、WallarmモジュールはカスタムビルドのNGINXに接続できます。パッケージを再ビルドするには、[Wallarm technical support team](mailto:support@wallarm.com)にご連絡いただき、以下のデータを送信してください:

* Linuxカーネルバージョン：`uname -a`
* Linuxディストリビューション：`cat /etc/*release`
* NGINXバージョン:
  
    * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html)：`/usr/sbin/nginx -V`
    * NGINXカスタムビルド：`<path to nginx>/nginx -V`

* 互換性シグネチャ:
  
    * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html)：`egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
    * NGINXカスタムビルド：`egrep -ao '.,.,.,[01]{33}' <path to nginx>/nginx`

* NGINXワーカープロセスを実行しているユーザー（およびそのユーザーグループ）：`grep -w 'user' <path-to-the-NGINX-configuration-files/nginx.conf>`