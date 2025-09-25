Wallarmノードがミラーリングトラフィックを処理できるように、次の設定を行います：

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
#222.222.222.22をミラーリングサーバーのアドレスに変更します
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
#real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* [`real_ip_header`](../../using-proxy-or-balancer-en.md)ディレクティブは、Wallarm Consoleに攻撃者のIPアドレスを表示するために必要です。
* `wallarm_force_response_*`ディレクティブは、ミラーリングトラフィックから受信したコピー以外のすべてのリクエストの解析を無効化するために必要です。
* 悪意のあるリクエストはブロック[できません](overview.md#limitations-of-mirrored-traffic-filtration)ので、`wallarm_mode`ディレクティブまたはWallarm Cloudにより安全または通常のブロッキングモードが設定されている場合でも（offに設定されている場合を除き）、Wallarmノードは常にモニタリング[モード](../../configure-wallarm-mode.md)でリクエストを解析します。

ミラーリングトラフィックの処理はNGINXベースのノードでのみサポートされます。上記の設定は次のとおりに設定します：

* ノードをDEB/RPMパッケージからインストールする場合 - `/etc/nginx/conf.d/default.conf`のNGINX設定ファイルに設定します。
* ノードを[AWS](../../installation-ami-en.md)または[GCP](../../installation-gcp-en.md)のクラウドイメージからデプロイする場合 - `/etc/nginx/nginx.conf`のNGINX設定ファイルに設定します。
* [Dockerイメージ](../../installation-docker-en.md)からノードをデプロイする場合 - 上記の設定を含むファイルをコンテナにマウントします。
* ノードを[Ingressコントローラー](../../installation-kubernetes-en.md)として実行する場合 - 上記の設定を含むConfigMapをPodにマウントします。