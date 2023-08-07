Wallarm ノードがミラーリングされたトラフィックを処理するには、次の設定を行ってください：

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

* [`real_ip_header`](../../using-proxy-or-balancer-en.md) ディレクティブはWallarm Consoleに攻撃者のIPアドレスを表示させるために必要です。
* `wallarm_force_response_*` ディレクティブは、ミラーリングされたトラフィックから受信したコピー以外のすべての要求の解析を無効にするために必要です。
* 悪意のあるリクエストは[ブロックできません](overview.md#limitations-of-mirrored-traffic-filtration)ので、Wallarm ノードは `wallarm_mode` ディレクティブや Wallarm Cloudが安全か通常のブロックモードを設定する場合でも、常にモニタリング[モード](../../configure-wallarm-mode.md)でリクエストを分析します（オフに設定されたモードを除く）。

ミラーリングされたトラフィックの処理は、NGINXベースのノードのみでサポートされています。提供された設定は以下のように設定できます：

* DEB/RPM パッケージからノードをインストールしている場合 - `/etc/nginx/conf.d/default.conf` NGINX設定ファイル内
* [AWS](../../installation-ami-en.md) または [GCP](../../installation-gcp-en.md) クラウドイメージからノードを展開している場合 - `/etc/nginx/nginx.conf` NGINX設定ファイル内。
* [Dockerイメージ](../../installation-docker-en.md)からノードを展開している場合 - 提供された設定を含むファイルをコンテナにマウントします。
* [Ingressコントローラー](../../installation-kubernetes-en.md)としてノードを実行している場合 - 提供された設定を含むConfigMapをポッドにマウントします。