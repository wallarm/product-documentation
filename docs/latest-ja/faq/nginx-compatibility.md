# WallarmフィルタリングノードとNGINXバージョンの互換性

あなたの環境にインストールされているNGINXのバージョンが安定版、Plus版、またはDebian/CentOSリポジトリからインストールされたものと異なる場合は、この文書からWallarmのインストール方法を学びましょう。

## WallarmフィルタリングノードはNGINXマインラインと互換性がありますか？

いいえ、WallarmフィルタリングノードはNGINX `mainline` と互換性がありません。以下の方法でWallarmノードをインストールすることができます：

* 公式のオープンソースNGINX `stable`に接続します。これらの[指示](../installation/nginx/dynamic-module.md)に従ってください。
* Debian/CentOSリポジトリからインストールされたNGINXに接続します。これらの[指示](../installation/nginx/dynamic-module-from-distr.md)に従ってください。
* 公式の商用NGINX Plusに接続します。これらの[指示](../installation/nginx-plus.md)に従ってください。

## WallarmフィルタリングノードはNGINXのカスタムビルドと互換性がありますか？

はい、WallarmモジュールはWallarmパッケージを再ビルドした後で、NGINXのカスタムビルドに接続することができます。パッケージを再ビルドするには、[Wallarmテクニカルサポートチーム](mailto:support@wallarm.com)に連絡し、以下のデータを送信してください：

* Linuxカーネルバージョン: `uname -a`
* Linuxディストリビューション: `cat /etc/*release`
* NGINXバージョン：

    * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `/usr/sbin/nginx -V`
    * NGINXカスタムビルド: `<nginxへのパス>/nginx -V`

* 互換性シグネチャ：
  
      * [NGINX公式ビルド](https://nginx.org/en/linux_packages.html): `egrep -ao '.,.,.,[01]{33}' /usr/sbin/nginx`
      * NGINXカスタムビルド: `egrep -ao '.,.,.,[01]{33}' <nginxへのパス>/nginx`

* NGINXワーカープロセスを実行しているユーザー（およびそのユーザーグループ）: `grep -w 'user' <NGINX設定ファイルへのパス/nginx.conf>`