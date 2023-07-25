Wallarmノードがミラーリングされたトラフィックを処理するためには、以下の設定を行ってください：

```
wallarm_force server_addr $http_x_server_addr;
wallarm_force server_port $http_x_server_port;
＃ミラーリングサーバーのアドレスへ222.222.222.22を変更 
set_real_ip_from  222.222.222.22;
real_ip_header    X-Forwarded-For;
＃real_ip_recursive on;
wallarm_force response_status 0;
wallarm_force response_time 0;
wallarm_force response_size 0;
```

* [`real_ip_header`](../../using-proxy-or-balancer-en.ja.md) ディレクティブは、Wallarm Consoleが攻撃者のIPアドレスを表示するために必要です。
* `wallarm_force_response_*` ディレクティブは、ミラーリングされたトラフィックから受け取ったコピー以外のすべてのリクエストの解析を無効にするために必要です。
* 悪意のあるリクエストは[ブロックできない](overview.ja.md#limitations-of-mirrored-traffic-filtration)ため、Wallarmノードは常に`wallarm_mode`ディレクティブまたはWallarm Cloudが安全なブロックモードまたは通常のブロックモード（オフに設定されているモードを除く）を設定した場合でも、監視[モード](../../configure-wallarm-mode.ja.md)でリクエストを解析します。

ミラーリングされたトラフィックの処理は、NGINXベースのノードでのみサポートされています。以下のように提供された設定を設定できます：

* DEB/RPMパッケージからノードをインストールする場合 -  `/etc/nginx/conf.d/default.conf` NGINX設定ファイルで設定します。
* [AWS](../../installation-ami-en.ja.md) や [GCP](../../installation-gcp-en.ja.md) のクラウドイメージからノードをデプロイする場合 - `/etc/nginx/nginx.conf` NGINX設定ファイルで設定します。
* [Dockerイメージ](../../installation-docker-en.ja.md)からノードをデプロイする場合 - 提供された設定が含まれているファイルをコンテナにマウントします。
* ノードを[Ingressコントローラー](../../installation-kubernetes-en.ja.md)として実行する場合 - 提供された設定が含まれているConfigMapをポッドにマウントします。